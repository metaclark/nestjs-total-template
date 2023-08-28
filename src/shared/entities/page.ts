import { z } from 'zod';

export const PageZ = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string().optional(),
});
