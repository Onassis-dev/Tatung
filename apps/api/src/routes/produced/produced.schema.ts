import { idSchema } from '@/utils/schemas';
import { z } from 'zod/v4';

export const getProducedSchema = z.object({
  page: z.coerce.number().int(),
  search: z.string().optional(),
});

export const getPartsSchema = z.object({
  id: idSchema,
});
