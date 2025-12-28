import { registerAs } from '@nestjs/config';
import { SecurityConfig } from './types';

/**
 * Security configuration
 * JWT, hashing, rate-limiting, and TOTP settings
 */
export default registerAs(
  'security',
  (): SecurityConfig => ({
    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET || '',
      accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
      refreshSecret: process.env.JWT_REFRESH_SECRET || '',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    hashing: {
      saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
    },
    rateLimit: {
      ttl: parseInt(process.env.RATE_LIMIT_TTL || '60000', 10),
      limit: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    },
    totpIssuer: process.env.TOTP_ISSUER || 'NestJS Admin',
  }),
);
