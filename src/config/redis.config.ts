import { registerAs } from '@nestjs/config';
import { RedisConfig } from './types';

/**
 * Redis configuration
 * Used for caching, session storage, and pub/sub
 */
export default registerAs(
  'redis',
  (): RedisConfig => ({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'app:',
    ttl: parseInt(process.env.REDIS_TTL || '3600', 10),
  }),
);
