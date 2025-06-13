import { Response } from 'express';
import * as z4 from 'zod/v4/core';

export function validate<T extends z4.$ZodObject>(
  schema: T,
  body: Record<any, any>,
  res: Response,
): z4.infer<T> | null {
  try {
    return schema.parse(body);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: 'Invalid data', details: error });
    return null;
  }
}
