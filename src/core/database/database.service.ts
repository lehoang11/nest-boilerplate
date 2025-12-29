import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';

/**
 * Database Service
 * Provides transaction helpers and raw query execution
 * Does not contain domain-specific repositories
 */
@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly dataSource: DataSource) {}

  // ============================================
  // Transaction Management
  // ============================================

  /**
   * Execute callback within a transaction
   * Automatically commits on success, rolls back on error
   *
   * @example
   * ```typescript
   * const result = await this.databaseService.transaction(async (manager) => {
   *   const user = await manager.save(User, userData);
   *   const profile = await manager.save(Profile, { userId: user.id });
   *   return { user, profile };
   * });
   * ```
   */
  async transaction<T>(
    fn: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await fn(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Transaction rolled back:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Execute callback within a transaction with isolation level
   */
  async transactionWithIsolation<T>(
    isolationLevel:
      | 'READ UNCOMMITTED'
      | 'READ COMMITTED'
      | 'REPEATABLE READ'
      | 'SERIALIZABLE',
    fn: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction(isolationLevel);

    try {
      const result = await fn(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Transaction rolled back:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ============================================
  // Raw Query Execution
  // ============================================

  /**
   * Execute raw SQL query
   * Use with caution - prefer TypeORM methods when possible
   */
  async query<T = unknown>(
    sql: string,
    parameters?: unknown[],
  ): Promise<T> {
    return this.dataSource.query(sql, parameters);
  }

  /**
   * Execute raw SQL query with named parameters
   */
  async queryWithParams<T = unknown>(
    sql: string,
    parameters?: Record<string, unknown>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      return await queryRunner.query(sql, Object.values(parameters || {}));
    } finally {
      await queryRunner.release();
    }
  }

  // ============================================
  // Connection Management
  // ============================================

  /**
   * Get the underlying DataSource
   */
  getDataSource(): DataSource {
    return this.dataSource;
  }

  /**
   * Get EntityManager
   */
  getManager(): EntityManager {
    return this.dataSource.manager;
  }

  /**
   * Create a new QueryRunner for manual transaction control
   */
  createQueryRunner(): QueryRunner {
    return this.dataSource.createQueryRunner();
  }

  /**
   * Check if database connection is established
   */
  isConnected(): boolean {
    return this.dataSource.isInitialized;
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Get table names in the database
   */
  async getTableNames(): Promise<string[]> {
    const tables = await this.dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    return tables.map((t: { table_name: string }) => t.table_name);
  }

  /**
   * Truncate table (use with caution)
   * Only works in non-production environments
   */
  async truncateTable(tableName: string, cascade = false): Promise<void> {
    const cascadeSql = cascade ? ' CASCADE' : '';
    await this.dataSource.query(
      `TRUNCATE TABLE "${tableName}"${cascadeSql} RESTART IDENTITY`,
    );
    this.logger.warn(`Table ${tableName} truncated`);
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<{
    activeConnections: number;
    databaseSize: string;
    tableCount: number;
  }> {
    const [connections] = await this.dataSource.query(`
      SELECT count(*) as count 
      FROM pg_stat_activity 
      WHERE datname = current_database()
    `);

    const [size] = await this.dataSource.query(`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
    `);

    const [tables] = await this.dataSource.query(`
      SELECT count(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    return {
      activeConnections: parseInt(connections.count, 10),
      databaseSize: size.size,
      tableCount: parseInt(tables.count, 10),
    };
  }
}
