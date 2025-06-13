import { z } from 'zod/v4';
import { idSchema } from '../../utils/schemas';

export const getModelsSchema = z.object({
  page: z.coerce.number().int(),
});

export const createModelSchema = z.object({
  code: z.string(),
  time: z.coerce.number(),
  parts: z.array(z.coerce.number().int()),
});

export const editModelSchema = createModelSchema.extend({
  id: idSchema,
});
