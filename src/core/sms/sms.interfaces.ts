export interface SmsOptions {
  to: string;
  message: string;
  from?: string;
}

export interface SmsBatchOptions {
  recipients: string[];
  message: string;
  from?: string;
}

export interface SmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface SmsProvider {
  send(options: SmsOptions): Promise<SmsResult>;
  sendBatch(options: SmsBatchOptions): Promise<SmsResult[]>;
  getBalance?(): Promise<number>;
}
