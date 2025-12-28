import { Module, Global, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisConfig } from '../../config';
import { REDIS_CLIENT, REDIS_PUBLISHER, REDIS_SUBSCRIBER } from './redis.constants';
import { RedisService } from './redis.service';

const logger = new Logger('RedisModule');

/**
 * Create Redis client factory
 */
const createRedisClient = (config: RedisConfig, name: string): Redis => {
  const client = new Redis({
    host: config.host,
    port: config.port,
    password: config.password || undefined,
    db: config.db,
    keyPrefix: config.keyPrefix,
    retryStrategy: (times) => {
      if (times > 10) {
        logger.error(`${name}: Max retries reached`);
        return null;
      }
      return Math.min(times * 100, 3000);
    },
    maxRetriesPerRequest: 3,
  });

  client.on('connect', () => logger.log(`${name}: Connected`));
  client.on('error', (err) => logger.error(`${name}: ${err.message}`));
  client.on('close', () => logger.warn(`${name}: Connection closed`));

  return client;
};

/**
 * Redis Module
 * Provides Redis client for caching and pub/sub
 * Global module - available everywhere without import
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    // Main client for general operations
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService) => {
        const config = configService.get<RedisConfig>('redis')!;
        return createRedisClient(config, 'RedisClient');
      },
      inject: [ConfigService],
    },
    // Publisher client for pub/sub
    {
      provide: REDIS_PUBLISHER,
      useFactory: (configService: ConfigService) => {
        const config = configService.get<RedisConfig>('redis')!;
        return createRedisClient(config, 'RedisPublisher');
      },
      inject: [ConfigService],
    },
    // Subscriber client for pub/sub
    {
      provide: REDIS_SUBSCRIBER,
      useFactory: (configService: ConfigService) => {
        const config = configService.get<RedisConfig>('redis')!;
        return createRedisClient(config, 'RedisSubscriber');
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [REDIS_CLIENT, RedisService],
})
export class RedisModule {}
