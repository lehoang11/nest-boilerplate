import { registerAs } from '@nestjs/config';
import { DatabaseConfig as DatabaseConfigType } from './types';

/**
 * Database (PostgreSQL) configuration
 * Uses TypeORM for ORM layer
 */
export default registerAs(
  'database',
  (): DatabaseConfigType => ({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'admin_service',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    ssl: process.env.DB_SSL === 'true',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '100', 10),
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000', 10),
  }),
);

/**
 * TypeORM options factory for use with TypeOrmModule.forRootAsync
 * Example usage:
 *
 * TypeOrmModule.forRootAsync({
 *   imports: [ConfigModule],
 *   useFactory: getTypeOrmConfig,
 *   inject: [ConfigService],
 * })
 */
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const dbConfig = configService.get<DatabaseConfigType>('database');
  const nodeEnv = configService.get<string>('app.nodeEnv', 'development');

  return {
    type: 'postgres',
    host: dbConfig?.host,
    port: dbConfig?.port,
    username: dbConfig?.username,
    password: dbConfig?.password,
    database: dbConfig?.database,
    synchronize: dbConfig?.synchronize ?? false,
    logging: dbConfig?.logging ?? false,
    ssl: nodeEnv === 'production' && dbConfig?.ssl
      ? { rejectUnauthorized: false }
      : false,
    autoLoadEntities: true,
    migrations: ['dist/database/migrations/*.js'],
    migrationsRun: true,
    extra: {
      max: dbConfig?.maxConnections,
      connectionTimeoutMillis: dbConfig?.connectionTimeout,
    },
  };
};
