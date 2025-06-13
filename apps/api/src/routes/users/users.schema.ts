import { z } from 'zod/v4';
import { idSchema } from '../../utils/schemas';

export const getUsersSchema = z.object({
  page: z.coerce.number().int(),
});

export const createUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  p_users: z.string(),
  p_models: z.string(),
  p_planning: z.string(),
});

export const editUserSchema = createUserSchema.extend({
  id: idSchema,
  password: z.string().optional(),
});
