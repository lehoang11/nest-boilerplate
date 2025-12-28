import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailConfig } from '../../config';
import { MailOptions, MailResult } from './mail.interfaces';

/**
 * Mail Service
 * Provides email functionality via Nodemailer
 *
 * Supports:
 * - SMTP (default)
 * - SendGrid (configure with SMTP relay)
 * - AWS SES (configure with SMTP relay)
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly enabled: boolean;
  private readonly from: string;
  private readonly fromName: string;

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get<MailConfig>('mail')!;
    this.enabled = config.enabled;
    this.from = config.from;
    this.fromName = config.fromName;

    if (this.enabled) {
      this.initializeTransporter(config);
    } else {
      this.logger.log('Mail service is disabled');
    }
  }

  private initializeTransporter(config: MailConfig): void {
    try {
      this.transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth:
          config.user && config.password
            ? {
                user: config.user,
                pass: config.password,
              }
            : undefined,
      });

      this.logger.log(`Mail transporter initialized (${config.transport})`);
    } catch (error) {
      this.logger.error('Failed to initialize mail transporter:', error);
    }
  }

  /**
   * Send an email
   */
  async send(options: MailOptions): Promise<MailResult> {
    if (!this.enabled || !this.transporter) {
      this.logger.debug('[STUB] Would send email:', options.subject);
      return { success: true, messageId: 'stub-message-id' };
    }

    try {
      const result = await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.from}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        cc: options.cc,
        bcc: options.bcc,
        replyTo: options.replyTo,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      });

      this.logger.log(`Email sent: ${result.messageId}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send email: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Send a simple text email
   */
  async sendText(
    to: string | string[],
    subject: string,
    text: string,
  ): Promise<MailResult> {
    return this.send({ to, subject, text });
  }

  /**
   * Send an HTML email
   */
  async sendHtml(
    to: string | string[],
    subject: string,
    html: string,
  ): Promise<MailResult> {
    return this.send({ to, subject, html });
  }

  /**
   * Send a welcome email
   */
  async sendWelcome(to: string, name: string): Promise<MailResult> {
    return this.send({
      to,
      subject: `Welcome to ${this.fromName}!`,
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for joining ${this.fromName}.</p>
        <p>If you have any questions, feel free to reach out.</p>
      `,
    });
  }

  /**
   * Send a password reset email
   */
  async sendPasswordReset(
    to: string,
    resetToken: string,
    resetUrl: string,
  ): Promise<MailResult> {
    return this.send({
      to,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetUrl}?token=${resetToken}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }

  /**
   * Send a verification email
   */
  async sendVerification(
    to: string,
    verificationToken: string,
    verificationUrl: string,
  ): Promise<MailResult> {
    return this.send({
      to,
      subject: 'Verify Your Email',
      html: `
        <h1>Email Verification</h1>
        <p>Please verify your email by clicking the link below:</p>
        <p><a href="${verificationUrl}?token=${verificationToken}">Verify Email</a></p>
        <p>If you didn't create an account, please ignore this email.</p>
      `,
    });
  }

  /**
   * Send OTP code
   */
  async sendOtp(to: string, otp: string, expiresIn = '5 minutes'): Promise<MailResult> {
    return this.send({
      to,
      subject: 'Your Verification Code',
      html: `
        <h1>Verification Code</h1>
        <p>Your verification code is:</p>
        <h2 style="font-size: 32px; letter-spacing: 4px;">${otp}</h2>
        <p>This code will expire in ${expiresIn}.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `,
    });
  }

  /**
   * Verify transporter connection
   */
  async verify(): Promise<boolean> {
    if (!this.enabled || !this.transporter) {
      return true;
    }

    try {
      await this.transporter.verify();
      return true;
    } catch {
      return false;
    }
  }
}
