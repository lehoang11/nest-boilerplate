import { Module } from '@nestjs/common';
import { DatabaseModule } from './database';
import { RedisModule } from './redis';
import { KafkaModule } from './kafka';
import { MailModule } from './mail';
import { SmsModule } from './sms';

/**
 * Core Module
 * Aggregates all infrastructure modules
 *
 * Import this single module in AppModule to get:
 * - DatabaseModule (PostgreSQL/TypeORM)
 * - RedisModule (Caching/Pub-Sub)
 * - KafkaModule (Event streaming)
 * - MailModule (Email service)
 * - SmsModule (SMS service)
 *
 * All modules are Global, so their services are available
 * everywhere without additional imports.
 */
@Module({
  imports: [
    DatabaseModule,
    RedisModule,
    KafkaModule,
    MailModule,
    SmsModule,
  ],
  exports: [
    DatabaseModule,
    RedisModule,
    KafkaModule,
    MailModule,
    SmsModule,
  ],
})
export class CoreModule {}
