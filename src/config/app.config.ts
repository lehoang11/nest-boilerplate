import { registerAs } from '@nestjs/config';
import { AppConfig } from './types';

/**
 * App-level configuration
 * Contains general application settings
 */
export default registerAs(
  'app',
  (): AppConfig => ({
    nodeEnv: (process.env.NODE_ENV as AppConfig['nodeEnv']) || 'development',
    name: process.env.APP_NAME || 'NestJS Admin',
    port: parseInt(process.env.PORT || '3000', 10),
    apiPrefix: process.env.API_PREFIX || 'api',
    debug: process.env.DEBUG === 'true',
  }),
);
