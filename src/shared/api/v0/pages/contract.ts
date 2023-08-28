import { initContract } from '@ts-rest/core';
import { PageZ } from 'src/shared/entities/page';
import { z } from 'zod';

const basePath = '/api/v0/pages';

export const pagesContract = initContract().router({
  create: {
    method: 'POST',
    path: basePath,
    body: PageZ.pick({
      title: true,
      content: true,
    }),
    responses: {
      201: PageZ,
    },
  },

  get: {
    method: 'GET',
    path: `${basePath}/:id`,
    responses: {
      200: PageZ,
    },
  },

  update: {
    method: 'PUT',
    path: `${basePath}/:id`,
    body: PageZ.pick({
      title: true,
      content: true,
    }).partial(),
    responses: {
      200: PageZ,
    },
  },

  delete: {
    method: 'DELETE',
    body: z.undefined(),
    path: `${basePath}/:id`,
    responses: {
      200: z.undefined(),
    },
  },
});
