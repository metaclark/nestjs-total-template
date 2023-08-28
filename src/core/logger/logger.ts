import pino from 'pino';
import { appConfig } from 'src/config/config';

export const logger = pino({
  level: appConfig.NODE_ENV === 'development' ? 'debug' : 'info',
});
