import { z } from 'zod/v4';
import { idSchema } from '../../utils/schemas';

export const getSupervisorsSchema = z.object({
  page: z.coerce.number().int(),
});

export const createSupervisorSchema = z.object({
  code: z.string().length(4),
  name: z.string(),
});

export const editSupervisorSchema = createSupervisorSchema.extend({
  id: idSchema,
});
