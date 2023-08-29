import { initContract } from '@ts-rest/core';

import { pagesContract } from './v0/pages/contract';

export const apiContract = initContract().router({
  pages: pagesContract,
});
