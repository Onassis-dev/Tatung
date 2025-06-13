import { z } from 'zod/v4';
import { idSchema } from '../../utils/schemas';

export const getIpsSchema = z.object({
  page: z.coerce.number().int(),
});

export const createIpSchema = z.object({
  ip: z.string(),
  line_id: z.string(),
});

export const editIpSchema = createIpSchema.extend({
  id: idSchema,
});
