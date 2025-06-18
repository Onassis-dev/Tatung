import { z } from 'zod/v4';

export const getProducedSchema = z.object({
  page: z.coerce.number().int(),
});
