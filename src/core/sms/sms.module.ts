import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SmsService } from './sms.service';

/**
 * SMS Module
 * Provides SMS functionality via Twilio, Nexmo, or AWS SNS
 * Global module - available everywhere without import
 *
 * Setup:
 * 1. Install provider SDK:
 *    - Twilio: npm install twilio
 *    - Nexmo: npm install @vonage/server-sdk
 *    - AWS SNS: npm install @aws-sdk/client-sns
 * 2. Enable in .env: SMS_ENABLED=true
 * 3. Configure provider in .env: SMS_PROVIDER=twilio
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
