import { Module } from '@nestjs/common';
import { DatabaseModule } from './database';
import { RedisModule } from './redis';
import { KafkaModule } from './kafka';
import { MailModule } from './mail';
import { SmsModule } from './sms';
import { TeleModule } from './tele';

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
 * - TeleModule (Telegram service)
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
    TeleModule,
  ],
  exports: [
    DatabaseModule,
    RedisModule,
    KafkaModule,
    MailModule,
    SmsModule,
    TeleModule,
  ],
})
export class CoreModule {}
