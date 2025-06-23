import { z } from 'zod/v4';
import { idSchema } from '../../utils/schemas';

export const getPartsSchema = z.object({
  page: z.coerce.number().int(),
});

export const createPartSchema = z.object({
  code: z.string().length(5),
});

export const editPartSchema = createPartSchema.extend({
  id: idSchema,
});
