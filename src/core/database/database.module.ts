import { Module, Global } from '@nestjs/common';
import { TypeOrmConfigModule } from './typeorm';
import { DatabaseService } from './database.service';
import { DatabaseHealthIndicator } from './health';

/**
 * Database Module
 * Global infrastructure module for PostgreSQL/TypeORM
 *
 * Provides:
 * - TypeORM connection (auto-configured from ConfigService)
 * - DatabaseService (transactions, raw queries)
 * - DatabaseHealthIndicator (health checks)
 *
 * Usage:
 * ```typescript
 * @Module({
 *   imports: [DatabaseModule],
 * })
 * export class AppModule {}
 * ```
 *
 * Inject services:
 * ```typescript
 * constructor(
 *   private readonly databaseService: DatabaseService,
 *   private readonly dbHealth: DatabaseHealthIndicator,
 * ) {}
 * ```
 */
@Global()
@Module({
  imports: [TypeOrmConfigModule],
  providers: [DatabaseService, DatabaseHealthIndicator],
  exports: [TypeOrmConfigModule, DatabaseService, DatabaseHealthIndicator],
})
export class DatabaseModule {}
