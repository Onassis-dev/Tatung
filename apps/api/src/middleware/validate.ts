import traduce from '@/utils/traduction';
import { Response } from 'express';
import { ZodError } from 'zod';
import * as z4 from 'zod/v4/core';

export function validate<T extends z4.$ZodObject>(schema: T, body: Record<any, any>, res: Response): z4.infer<T> | null {
  try {
    const result = (schema as any).parse(removeEmptyStrings(body));
    return result;
  } catch (err) {
    const error = (err as ZodError).issues[0];

    if (error.code === 'invalid_type') error.message = `${traduce(String(error.path[0]))} requerido`;

    res.status(400).send({ error: error.message });
    return null;
  }
}

function removeEmptyStrings(obj: Record<any, any>) {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== ''));
}
