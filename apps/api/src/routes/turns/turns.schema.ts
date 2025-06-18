import { z } from 'zod/v4';
import { idSchema } from '../../utils/schemas';

export const getTurnsSchema = z.object({
  page: z.coerce.number().int(),
});

export const createTurnSchema = z.object({
  name: z.string(),
  start: z.coerce.number().int().min(0).max(23),
  end: z.coerce.number().int().min(0).max(23),
});

export const editTurnSchema = createTurnSchema.extend({
  id: idSchema,
});
