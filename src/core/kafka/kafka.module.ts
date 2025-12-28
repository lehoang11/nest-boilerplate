import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaService } from './kafka.service';

/**
 * Kafka Module
 * Provides Kafka producer/consumer for event-driven messaging
 * Global module - available everywhere without import
 *
 * Setup:
 * 1. Install kafkajs: npm install kafkajs
 * 2. Enable in .env: KAFKA_ENABLED=true
 * 3. Configure brokers: KAFKA_BROKERS=localhost:9092
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
