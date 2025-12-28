import { registerAs } from '@nestjs/config';
import { SmsConfig } from './types';

/**
 * SMS configuration
 * Supports Twilio, Nexmo (Vonage), and AWS SNS
 */
export default registerAs(
  'sms',
  (): SmsConfig => ({
    enabled: process.env.SMS_ENABLED === 'true',
    provider: (process.env.SMS_PROVIDER as SmsConfig['provider']) || 'twilio',
    accountSid: process.env.SMS_ACCOUNT_SID || '',
    authToken: process.env.SMS_AUTH_TOKEN || '',
    from: process.env.SMS_FROM || '',
  }),
);
