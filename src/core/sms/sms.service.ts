import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmsConfig } from '../../config';
import { SmsOptions, SmsBatchOptions, SmsResult } from './sms.interfaces';

// Note: Install your preferred SMS provider:
// Twilio: npm install twilio
// Nexmo/Vonage: npm install @vonage/server-sdk
// AWS SNS: npm install @aws-sdk/client-sns

/**
 * SMS Service
 * Provides SMS functionality via Twilio, Nexmo, or AWS SNS
 *
 * Setup:
 * 1. Install your provider SDK
 * 2. Enable in .env: SMS_ENABLED=true
 * 3. Configure provider credentials in .env
 */
@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly enabled: boolean;
  private readonly provider: string;
  private readonly from: string;

  // Uncomment when provider SDK is installed:
  // private twilioClient: any;
  // private vonageClient: any;
  // private snsClient: any;

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get<SmsConfig>('sms')!;
    this.enabled = config.enabled;
    this.provider = config.provider;
    this.from = config.from;

    if (this.enabled) {
      this.initializeProvider(config);
    } else {
      this.logger.log('SMS service is disabled');
    }
  }

  private initializeProvider(config: SmsConfig): void {
    switch (config.provider) {
      case 'twilio':
        this.initializeTwilio(config);
        break;
      case 'nexmo':
        this.initializeNexmo(config);
        break;
      case 'aws-sns':
        this.initializeAwsSns(config);
        break;
      default:
        this.logger.warn(`Unknown SMS provider: ${config.provider}`);
    }
  }

  private initializeTwilio(config: SmsConfig): void {
    // Uncomment when twilio is installed:
    /*
    const twilio = require('twilio');
    this.twilioClient = twilio(config.accountSid, config.authToken);
    */
    this.logger.log('Twilio SMS provider initialized (stub mode)');
  }

  private initializeNexmo(config: SmsConfig): void {
    // Uncomment when @vonage/server-sdk is installed:
    /*
    const { Vonage } = require('@vonage/server-sdk');
    this.vonageClient = new Vonage({
      apiKey: config.accountSid,
      apiSecret: config.authToken,
    });
    */
    this.logger.log('Nexmo/Vonage SMS provider initialized (stub mode)');
  }

  private initializeAwsSns(config: SmsConfig): void {
    // Uncomment when @aws-sdk/client-sns is installed:
    /*
    const { SNSClient } = require('@aws-sdk/client-sns');
    this.snsClient = new SNSClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });
    */
    this.logger.log('AWS SNS provider initialized (stub mode)');
  }

  /**
   * Send an SMS message
   */
  async send(options: SmsOptions): Promise<SmsResult> {
    if (!this.enabled) {
      this.logger.debug(`[STUB] Would send SMS to ${options.to}: ${options.message}`);
      return { success: true, messageId: 'stub-message-id' };
    }

    const from = options.from || this.from;

    try {
      switch (this.provider) {
        case 'twilio':
          return this.sendViaTwilio(options.to, options.message, from);
        case 'nexmo':
          return this.sendViaNexmo(options.to, options.message, from);
        case 'aws-sns':
          return this.sendViaAwsSns(options.to, options.message);
        default:
          return { success: false, error: `Unknown provider: ${this.provider}` };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send SMS: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }

  private async sendViaTwilio(
    to: string,
    message: string,
    from: string,
  ): Promise<SmsResult> {
    // Uncomment when twilio is installed:
    /*
    const result = await this.twilioClient.messages.create({
      body: message,
      from,
      to,
    });
    return { success: true, messageId: result.sid };
    */
    this.logger.debug(`[TWILIO STUB] ${from} -> ${to}: ${message}`);
    return { success: true, messageId: 'twilio-stub-id' };
  }

  private async sendViaNexmo(
    to: string,
    message: string,
    from: string,
  ): Promise<SmsResult> {
    // Uncomment when @vonage/server-sdk is installed:
    /*
    return new Promise((resolve, reject) => {
      this.vonageClient.message.sendSms(from, to, message, {}, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            success: response.messages[0].status === '0',
            messageId: response.messages[0]['message-id'],
          });
        }
      });
    });
    */
    this.logger.debug(`[NEXMO STUB] ${from} -> ${to}: ${message}`);
    return { success: true, messageId: 'nexmo-stub-id' };
  }

  private async sendViaAwsSns(to: string, message: string): Promise<SmsResult> {
    // Uncomment when @aws-sdk/client-sns is installed:
    /*
    const { PublishCommand } = require('@aws-sdk/client-sns');
    const result = await this.snsClient.send(
      new PublishCommand({
        PhoneNumber: to,
        Message: message,
      }),
    );
    return { success: true, messageId: result.MessageId };
    */
    this.logger.debug(`[AWS SNS STUB] -> ${to}: ${message}`);
    return { success: true, messageId: 'sns-stub-id' };
  }

  /**
   * Send SMS to multiple recipients
   */
  async sendBatch(options: SmsBatchOptions): Promise<SmsResult[]> {
    const results: SmsResult[] = [];

    for (const to of options.recipients) {
      const result = await this.send({
        to,
        message: options.message,
        from: options.from,
      });
      results.push(result);
    }

    return results;
  }

  /**
   * Send OTP code via SMS
   */
  async sendOtp(to: string, otp: string, expiresIn = '5 minutes'): Promise<SmsResult> {
    const message = `Your verification code is: ${otp}. This code expires in ${expiresIn}.`;
    return this.send({ to, message });
  }

  /**
   * Send verification code
   */
  async sendVerification(to: string, code: string): Promise<SmsResult> {
    const message = `Your verification code is: ${code}`;
    return this.send({ to, message });
  }

  /**
   * Send password reset code
   */
  async sendPasswordReset(to: string, code: string): Promise<SmsResult> {
    const message = `Your password reset code is: ${code}. If you didn't request this, please ignore.`;
    return this.send({ to, message });
  }

  /**
   * Send login alert
   */
  async sendLoginAlert(to: string, ip: string, device: string): Promise<SmsResult> {
    const message = `New login detected from ${device} (IP: ${ip}). If this wasn't you, secure your account immediately.`;
    return this.send({ to, message });
  }
}
