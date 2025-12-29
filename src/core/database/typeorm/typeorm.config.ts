import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConfig, AppConfig } from '../../../config';

/**
 * TypeORM Configuration Factory
 * Reads all settings from ConfigService (no direct process.env access)
 */
export const createTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const dbConfig = configService.get<DatabaseConfig>('database')!;
  const appConfig = configService.get<AppConfig>('app')!;
  const isProduction = appConfig.nodeEnv === 'production';

  return {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,

    // Entity loading
    autoLoadEntities: true,
    entities: [],

    // Schema sync (NEVER true in production)
    synchronize: false,

    // Logging
    logging: dbConfig.logging,
    logger: dbConfig.logging ? 'advanced-console' : undefined,

    // SSL for production
    ssl: isProduction && dbConfig.ssl
      ? { rejectUnauthorized: false }
      : false,

    // Connection pool
    extra: {
      max: dbConfig.maxConnections,
      connectionTimeoutMillis: dbConfig.connectionTimeout,
      idleTimeoutMillis: 30000,
    },

    // Migrations
    migrations: ['dist/database/migrations/*.js'],
    migrationsRun: false,
    migrationsTableName: 'typeorm_migrations',

    // Cache (optional - can be enabled with Redis)
    cache: false,
  };
};

/**
 * TypeORM DataSource config for CLI migrations
 * Used by typeorm CLI: npx typeorm migration:run -d dist/typeorm.config.js
 */
export const getDataSourceConfig = (configService: ConfigService) => {
  const config = createTypeOrmConfig(configService);
  return {
    ...config,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/database/migrations/*.js'],
  };
};
