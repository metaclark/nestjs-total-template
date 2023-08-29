import { initContract } from '@ts-rest/core';
import { PageZ } from 'api-share/entities/page';
import { EmptyBodyZ } from 'api-share/types/zod';
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
    body: EmptyBodyZ,
    path: `${basePath}/:id`,
    responses: {
      200: z.undefined(),
    },
  },
});
