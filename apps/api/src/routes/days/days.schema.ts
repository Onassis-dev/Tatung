import { z } from 'zod/v4';
import { idSchema } from '../../utils/schemas';

export const getDaysSchema = z.object({
  date: z.coerce.date(),
});

export const createDaySchema = z.object({
  date: z.coerce.date(),
  model_id: idSchema,
  line_id: idSchema,
  employees: z.coerce.number(),
});

export const editDaySchema = z.object({
  id: idSchema,
  model: z.string(),
  employees: z.coerce.number(),
  time: z.coerce.number(),
  produced: z.coerce.number(),
});
