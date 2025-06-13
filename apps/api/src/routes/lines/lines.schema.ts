import { z } from 'zod/v4';
import { idSchema } from '../../utils/schemas';

export const getLinesSchema = z.object({
  page: z.coerce.number().int(),
});

export const createLineSchema = z.object({
  code: z.string(),
});

export const editLineSchema = createLineSchema.extend({
  id: idSchema,
});
