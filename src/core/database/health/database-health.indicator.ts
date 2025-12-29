import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * Database Health Status
 */
export interface DatabaseHealthStatus {
  status: 'up' | 'down';
  responseTime: number;
  details?: {
    database: string;
    host: string;
    port: number;
    isConnected: boolean;
    error?: string;
  };
}

/**
 * Database Health Indicator
 * Executes simple query to verify database connectivity
 * Used for health checks and monitoring
 */
@Injectable()
export class DatabaseHealthIndicator {
  private readonly logger = new Logger(DatabaseHealthIndicator.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Check database health by executing SELECT 1
   */
  async check(): Promise<DatabaseHealthStatus> {
    const startTime = Date.now();

    try {
      // Simple query to verify connection
      await this.dataSource.query('SELECT 1');

      const responseTime = Date.now() - startTime;
      const options = this.dataSource.options as {
        database?: string;
        host?: string;
        port?: number;
      };

      return {
        status: 'up',
        responseTime,
        details: {
          database: options.database || 'unknown',
          host: options.host || 'unknown',
          port: options.port || 5432,
          isConnected: this.dataSource.isInitialized,
        },
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      this.logger.error(`Database health check failed: ${errorMessage}`);

      return {
        status: 'down',
        responseTime,
        details: {
          database: 'unknown',
          host: 'unknown',
          port: 5432,
          isConnected: false,
          error: errorMessage,
        },
      };
    }
  }

  /**
   * Check if database is ready (alias for check)
   */
  async isHealthy(): Promise<boolean> {
    const health = await this.check();
    return health.status === 'up';
  }

  /**
   * Extended health check with connection pool info
   */
  async checkExtended(): Promise<
    DatabaseHealthStatus & {
      pool?: {
        activeConnections: number;
        idleConnections: number;
        waitingRequests: number;
      };
    }
  > {
    const basicHealth = await this.check();

    if (basicHealth.status === 'down') {
      return basicHealth;
    }

    try {
      // Get connection pool stats (PostgreSQL specific)
      const [poolStats] = await this.dataSource.query(`
        SELECT 
          count(*) FILTER (WHERE state = 'active') as active,
          count(*) FILTER (WHERE state = 'idle') as idle,
          count(*) FILTER (WHERE wait_event IS NOT NULL) as waiting
        FROM pg_stat_activity 
        WHERE datname = current_database()
      `);

      return {
        ...basicHealth,
        pool: {
          activeConnections: parseInt(poolStats.active || '0', 10),
          idleConnections: parseInt(poolStats.idle || '0', 10),
          waitingRequests: parseInt(poolStats.waiting || '0', 10),
        },
      };
    } catch {
      // Return basic health if pool stats fail
      return basicHealth;
    }
  }

  /**
   * Ping database (minimal check)
   */
  async ping(): Promise<{ ok: boolean; latency: number }> {
    const startTime = Date.now();

    try {
      await this.dataSource.query('SELECT 1');
      return { ok: true, latency: Date.now() - startTime };
    } catch {
      return { ok: false, latency: Date.now() - startTime };
    }
  }
}
