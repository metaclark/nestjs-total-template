import * as process from 'process';
import { parseEnv } from 'znv';
import { z } from 'zod';

const envZ = {
  NODE_ENV: z.enum(['test', 'development', 'production']).default('production'),
  PORT: z.number().default(3000),
  DEBUG: z.boolean().default(false),
};

export const appConfig = parseEnv(process.env, envZ);
