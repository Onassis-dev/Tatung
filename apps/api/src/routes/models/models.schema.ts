import { z } from 'zod/v4';
import { idSchema } from '../../utils/schemas';

export const getModelsSchema = z.object({
  page: z.coerce.number().int(),
});

export const createModelSchema = z.object({
  code: z.string(),
  parts: z.array(
    z.object({
      id: idSchema,
      amount: z.coerce.number().int().min(1),
    }),
  ),
});

export const editModelSchema = createModelSchema.extend({
  id: idSchema,
});
