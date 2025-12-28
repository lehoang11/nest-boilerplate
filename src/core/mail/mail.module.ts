import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';

/**
 * Mail Module
 * Provides email functionality via Nodemailer
 * Global module - available everywhere without import
 *
 * Setup:
 * 1. Install nodemailer: npm install nodemailer @types/nodemailer
 * 2. Enable in .env: MAIL_ENABLED=true
 * 3. Configure SMTP settings in .env
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
