import { z } from 'zod/v4';
import { idSchema } from '../../utils/schemas';

export const getDaysSchema = z.object({
  date: z.coerce.date(),
  turn_id: idSchema,
});

export const createDaySchema = z.object({
  date: z.coerce.date(),
  turn_id: idSchema,
  model_id: idSchema,
  line_id: idSchema,
  goal: z.coerce.number().int().min(0),
});

export const editDaySchema = z.object({
  id: idSchema,
  model: z.string(),
  hours: z.array(
    z.object({
      hour: z.coerce.number().int().min(0),
      goal: z.coerce.number().int().min(0),
      prod: z.coerce.number().int().min(0),
    }),
  ),
});
