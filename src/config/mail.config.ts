import { registerAs } from '@nestjs/config';
import { MailConfig } from './types';

/**
 * Mail configuration
 * Supports SMTP, SendGrid, and AWS SES
 */
export default registerAs(
  'mail',
  (): MailConfig => ({
    enabled: process.env.MAIL_ENABLED === 'true',
    transport: (process.env.MAIL_TRANSPORT as MailConfig['transport']) || 'smtp',
    host: process.env.MAIL_HOST || 'localhost',
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    secure: process.env.MAIL_SECURE === 'true',
    user: process.env.MAIL_USER || '',
    password: process.env.MAIL_PASSWORD || '',
    from: process.env.MAIL_FROM || 'noreply@example.com',
    fromName: process.env.MAIL_FROM_NAME || 'NestJS Admin',
  }),
);
