import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Liveness probe - checks if the app is running
   * Used by K8s/Docker to know if the container should be restarted
   */
  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  healthCheck() {
    return this.appService.getHealthStatus();
  }

  /**
   * Readiness probe - checks if the app is ready to accept traffic
   * Used by K8s/load balancers to know if traffic can be routed
   */
  @Get('health/ready')
  @ApiOperation({ summary: 'Readiness check' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  readinessCheck() {
    return this.appService.getReadinessStatus();
  }

  /**
   * Liveness probe (alias)
   */
  @Get('health/live')
  @ApiOperation({ summary: 'Liveness check' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  livenessCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
