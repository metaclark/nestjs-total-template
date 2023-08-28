import { defineConfig } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

import { appConfig } from './config';

export const mikroConfig = defineConfig({
  debug: appConfig.DEBUG,
  baseDir: __dirname,
  highlighter: new SqlHighlighter(),
  type: 'sqlite',
  dbName: 'file::memory:?cache=shared',
  pool: {
    min: 0,
    max: 20,
  },
  persistOnCreate: true,
  implicitTransactions: false,
  discovery: { warnWhenNoEntities: false },
});

export default mikroConfig;
