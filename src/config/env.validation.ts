import { z } from 'zod';

/**
 * Environment validation schema using Zod
 * Validates all environment variables at application boot
 * Fails fast if required variables are missing or invalid
 */

// Helper for boolean env vars with string default
const booleanString = (defaultValue: boolean = false) =>
  z
    .string()
    .default(defaultValue ? 'true' : 'false')
    .transform((val) => val === 'true');

const envSchema = z.object({
  // ============================================
  // App
  // ============================================
  NODE_ENV: z
    .enum(['development', 'staging', 'production', 'test'])
    .default('development'),
  APP_NAME: z.string().default('NestJS Admin'),
  PORT: z.coerce.number().int().positive().default(3000),
  API_PREFIX: z.string().default('api'),
  DEBUG: booleanString(false),

  // ============================================
  // Database (PostgreSQL)
  // ============================================
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_USERNAME: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_DATABASE: z.string().min(1),
  DB_SYNCHRONIZE: booleanString(false),
  DB_LOGGING: booleanString(false),
  DB_SSL: booleanString(false),
  DB_MAX_CONNECTIONS: z.coerce.number().int().positive().default(100),
  DB_CONNECTION_TIMEOUT: z.coerce.number().int().positive().default(30000),

  // ============================================
  // Redis
  // ============================================
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().int().min(0).default(0),
  REDIS_KEY_PREFIX: z.string().default('app:'),
  REDIS_TTL: z.coerce.number().int().positive().default(3600),

  // ============================================
  // Kafka
  // ============================================
  KAFKA_ENABLED: booleanString(false),
  KAFKA_CLIENT_ID: z.string().default('nest-admin'),
  KAFKA_BROKERS: z.string().default('localhost:9092'),
  KAFKA_GROUP_ID: z.string().default('nest-admin-group'),
  KAFKA_SSL: booleanString(false),
  KAFKA_SASL_MECHANISM: z
    .enum(['plain', 'scram-sha-256', 'scram-sha-512'])
    .optional(),
  KAFKA_SASL_USERNAME: z.string().optional(),
  KAFKA_SASL_PASSWORD: z.string().optional(),

  // ============================================
  // Mail
  // ============================================
  MAIL_ENABLED: booleanString(false),
  MAIL_TRANSPORT: z.enum(['smtp', 'sendgrid', 'ses']).default('smtp'),
  MAIL_HOST: z.string().default('localhost'),
  MAIL_PORT: z.coerce.number().int().positive().default(587),
  MAIL_SECURE: booleanString(false),
  MAIL_USER: z.string().default(''),
  MAIL_PASSWORD: z.string().default(''),
  MAIL_FROM: z.string().email().default('noreply@example.com'),
  MAIL_FROM_NAME: z.string().default('NestJS Admin'),

  // ============================================
  // SMS
  // ============================================
  SMS_ENABLED: booleanString(false),
  SMS_PROVIDER: z.enum(['twilio', 'nexmo', 'aws-sns']).default('twilio'),
  SMS_ACCOUNT_SID: z.string().default(''),
  SMS_AUTH_TOKEN: z.string().default(''),
  SMS_FROM: z.string().default(''),

  // ============================================
  // Security - JWT
  // ============================================
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // ============================================
  // Security - Hashing
  // ============================================
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),

  // ============================================
  // Security - Rate Limiting
  // ============================================
  RATE_LIMIT_TTL: z.coerce.number().int().positive().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),

  // ============================================
  // Security - TOTP
  // ============================================
  TOTP_ISSUER: z.string().default('NestJS Admin'),

  // ============================================
  // CORS
  // ============================================
  CORS_ENABLED: booleanString(true),
  CORS_ORIGIN: z.string().default('*'),
  CORS_METHODS: z.string().default('GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'),
  CORS_ALLOWED_HEADERS: z
    .string()
    .default('Content-Type,Accept,Authorization,X-Requested-With'),
  CORS_EXPOSED_HEADERS: z.string().default(''),
  CORS_CREDENTIALS: booleanString(true),
  CORS_MAX_AGE: z.coerce.number().int().positive().default(3600),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * Call this function in main.ts before bootstrapping the app
 */
export function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`❌ Environment validation failed:\n${errors}`);
  }

  return result.data;
}

/**
 * Factory function for NestJS ConfigModule
 * Usage: ConfigModule.forRoot({ validate: validateEnvFactory })
 */
export function validateEnvFactory(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`❌ Environment validation failed:\n${errors}`);
  }

  return result.data;
}
