import { z } from 'zod/v4';

export const scanModelSchema = z.object({
  model_id: z.string(),
});
