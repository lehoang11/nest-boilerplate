import { registerAs } from '@nestjs/config';
import { KafkaConfig } from './types';

/**
 * Kafka configuration
 * Used for event-driven messaging and streaming
 */
export default registerAs(
  'kafka',
  (): KafkaConfig => ({
    enabled: process.env.KAFKA_ENABLED === 'true',
    clientId: process.env.KAFKA_CLIENT_ID || 'nest-admin',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    groupId: process.env.KAFKA_GROUP_ID || 'nest-admin-group',
    ssl: process.env.KAFKA_SSL === 'true',
    sasl: process.env.KAFKA_SASL_MECHANISM
      ? {
          mechanism: process.env.KAFKA_SASL_MECHANISM as
            | 'plain'
            | 'scram-sha-256'
            | 'scram-sha-512',
          username: process.env.KAFKA_SASL_USERNAME || '',
          password: process.env.KAFKA_SASL_PASSWORD || '',
        }
      : undefined,
  }),
);
