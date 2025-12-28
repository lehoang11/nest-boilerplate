import { registerAs } from '@nestjs/config';
import { CorsConfig } from './types';

/**
 * CORS configuration
 * Cross-Origin Resource Sharing settings
 */
export default registerAs(
  'cors',
  (): CorsConfig => {
    const origin = process.env.CORS_ORIGIN || '*';

    // Parse origin: can be '*', 'true', 'false', or comma-separated URLs
    const parseOrigin = (
      originValue: string,
    ): string | string[] | boolean => {
      if (originValue === 'true') return true;
      if (originValue === 'false') return false;
      if (originValue === '*') return '*';
      if (originValue.includes(',')) {
        return originValue.split(',').map((o) => o.trim());
      }
      return originValue;
    };

    return {
      enabled: process.env.CORS_ENABLED !== 'false',
      origin: parseOrigin(origin),
      methods: (
        process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
      ).split(','),
      allowedHeaders: (
        process.env.CORS_ALLOWED_HEADERS ||
        'Content-Type,Accept,Authorization,X-Requested-With'
      ).split(','),
      exposedHeaders: process.env.CORS_EXPOSED_HEADERS
        ? process.env.CORS_EXPOSED_HEADERS.split(',')
        : [],
      credentials: process.env.CORS_CREDENTIALS !== 'false',
      maxAge: parseInt(process.env.CORS_MAX_AGE || '3600', 10),
    };
  },
);
