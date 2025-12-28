import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config';

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  service: string;
  version: string;
  environment: string;
  uptime: number;
}

export interface ReadinessStatus extends HealthStatus {
  checks: {
    database: boolean;
    redis: boolean;
  };
}

@Injectable()
export class AppService {
  private readonly startTime = Date.now();

  constructor(private readonly configService: ConfigService) {}

  /**
   * Basic health status for liveness probe
   */
  getHealthStatus(): HealthStatus {
    const appConfig = this.configService.get<AppConfig>('app')!;

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: appConfig.name,
      version: '1.0.0',
      environment: appConfig.nodeEnv,
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }

  /**
   * Detailed readiness status including dependency checks
   */
  getReadinessStatus(): ReadinessStatus {
    const health = this.getHealthStatus();

    // TODO: Add actual database/redis connection checks
    const checks = {
      database: true,
      redis: true,
    };

    const allHealthy = Object.values(checks).every(Boolean);

    return {
      ...health,
      status: allHealthy ? 'ok' : 'degraded',
      checks,
    };
  }
}
