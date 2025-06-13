import { z } from 'zod/v4';
z.config(z.locales.es());

export const idSchema = z.coerce.number().int();

export type IdSchema = z.infer<typeof idSchema>;

export const deleteSchema = z.object({
  id: idSchema,
});

export type DeleteSchema = z.infer<typeof deleteSchema>;
