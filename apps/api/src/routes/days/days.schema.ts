import { z } from 'zod/v4';
import { idSchema } from '../../utils/schemas';

export const getDaysSchema = z.object({
  date: z.date(),
});

export const createDaySchema = z.object({
  code: z.string(),
  date: z.date(),
  model_id: idSchema,
  line_id: idSchema,
  employees: idSchema,
});

export const editDaySchema = z.object({
  id: idSchema,
  code: z.string(),
  model: z.string(),
  employees: z.coerce.number(),
  time: z.coerce.number(),
  produced: z.coerce.number(),
});
