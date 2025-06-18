import { z } from 'zod/v4';

export const scanModelSchema = z.object({
  parts: z.array(z.string()),
  model: z.string(),
});
