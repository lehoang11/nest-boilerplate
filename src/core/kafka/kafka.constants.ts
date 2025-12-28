export const KAFKA_CLIENT = 'KAFKA_CLIENT';
export const KAFKA_PRODUCER = 'KAFKA_PRODUCER';
export const KAFKA_CONSUMER = 'KAFKA_CONSUMER';

/**
 * Common Kafka topics - customize as needed
 */
export const KAFKA_TOPICS = {
  // User events
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',

  // Auth events
  AUTH_LOGIN: 'auth.login',
  AUTH_LOGOUT: 'auth.logout',
  AUTH_PASSWORD_RESET: 'auth.password_reset',

  // Notification events
  NOTIFICATION_EMAIL: 'notification.email',
  NOTIFICATION_SMS: 'notification.sms',
  NOTIFICATION_PUSH: 'notification.push',

  // Audit events
  AUDIT_LOG: 'audit.log',
} as const;

export type KafkaTopic = (typeof KAFKA_TOPICS)[keyof typeof KAFKA_TOPICS];
