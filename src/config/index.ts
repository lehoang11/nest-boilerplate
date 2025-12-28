/**
 * Configuration Module - Single Entry Point
 *
 * Usage in AppModule:
 *
 * import { configurations, validateEnvFactory } from './config';
 *
 * @Module({
 *   imports: [
 *     ConfigModule.forRoot({
 *       isGlobal: true,
 *       load: configurations,
 *       validate: validateEnvFactory,
 *     }),
 *   ],
 * })
 */

// ============================================
// Configuration loaders (registerAs)
// ============================================
import appConfig from './app.config';
import databaseConfig, { getTypeOrmConfig } from './database.config';
import redisConfig from './redis.config';
import kafkaConfig from './kafka.config';
import mailConfig from './mail.config';
import smsConfig from './sms.config';
import securityConfig from './security.config';
import corsConfig from './cors.config';

/**
 * All configuration loaders to be used with ConfigModule.forRoot({ load: configurations })
 */
export const configurations = [
  appConfig,
  databaseConfig,
  redisConfig,
  kafkaConfig,
  mailConfig,
  smsConfig,
  securityConfig,
  corsConfig,
];

// ============================================
// Re-export individual configs for direct import
// ============================================
export { default as appConfig } from './app.config';
export { default as databaseConfig, getTypeOrmConfig } from './database.config';
export { default as redisConfig } from './redis.config';
export { default as kafkaConfig } from './kafka.config';
export { default as mailConfig } from './mail.config';
export { default as smsConfig } from './sms.config';
export { default as securityConfig } from './security.config';
export { default as corsConfig } from './cors.config';

// ============================================
// Environment validation
// ============================================
export { validateEnv, validateEnvFactory } from './env.validation';
export type { EnvConfig } from './env.validation';

// ============================================
// Types
// ============================================
export * from './types';
