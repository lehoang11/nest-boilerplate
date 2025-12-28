/**
 * Strong typing for all configuration namespaces
 * This ensures type safety when accessing config values
 */

// ============================================
// App Configuration
// ============================================
export interface AppConfig {
  nodeEnv: 'development' | 'staging' | 'production' | 'test';
  name: string;
  port: number;
  apiPrefix: string;
  debug: boolean;
}

// ============================================
// Database Configuration
// ============================================
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  ssl: boolean;
  maxConnections: number;
  connectionTimeout: number;
}

// ============================================
// Redis Configuration
// ============================================
export interface RedisConfig {
  host: string;
  port: number;
  password: string | undefined;
  db: number;
  keyPrefix: string;
  ttl: number;
}

// ============================================
// Kafka Configuration
// ============================================
export interface KafkaBroker {
  host: string;
  port: number;
}

export interface KafkaConfig {
  enabled: boolean;
  clientId: string;
  brokers: string[];
  groupId: string;
  ssl: boolean;
  sasl:
    | {
        mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512';
        username: string;
        password: string;
      }
    | undefined;
}

// ============================================
// Mail Configuration
// ============================================
export interface MailConfig {
  enabled: boolean;
  transport: 'smtp' | 'sendgrid' | 'ses';
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
  fromName: string;
}

// ============================================
// SMS Configuration
// ============================================
export interface SmsConfig {
  enabled: boolean;
  provider: 'twilio' | 'nexmo' | 'aws-sns';
  accountSid: string;
  authToken: string;
  from: string;
}

// ============================================
// Security Configuration
// ============================================
export interface JwtConfig {
  accessSecret: string;
  accessExpiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export interface HashingConfig {
  saltRounds: number;
}

export interface RateLimitConfig {
  ttl: number;
  limit: number;
}

export interface SecurityConfig {
  jwt: JwtConfig;
  hashing: HashingConfig;
  rateLimit: RateLimitConfig;
  totpIssuer: string;
}

// ============================================
// CORS Configuration
// ============================================
export interface CorsConfig {
  enabled: boolean;
  origin: string | string[] | boolean;
  methods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  credentials: boolean;
  maxAge: number;
}

// ============================================
// Complete Configuration Interface
// ============================================
export interface AllConfig {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  kafka: KafkaConfig;
  mail: MailConfig;
  sms: SmsConfig;
  security: SecurityConfig;
  cors: CorsConfig;
}

// ============================================
// Config Keys (for type-safe access)
// ============================================
export const CONFIG_KEYS = {
  APP: 'app',
  DATABASE: 'database',
  REDIS: 'redis',
  KAFKA: 'kafka',
  MAIL: 'mail',
  SMS: 'sms',
  SECURITY: 'security',
  CORS: 'cors',
} as const;

export type ConfigKey = (typeof CONFIG_KEYS)[keyof typeof CONFIG_KEYS];
