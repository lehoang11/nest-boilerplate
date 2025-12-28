export interface MailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  context?: Record<string, unknown>;
  attachments?: MailAttachment[];
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

export interface MailAttachment {
  filename: string;
  content?: string | Buffer;
  path?: string;
  contentType?: string;
}

export interface MailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface MailTemplate {
  name: string;
  subject: string;
  html: string;
  text?: string;
}
