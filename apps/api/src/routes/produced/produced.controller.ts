import { Request, Response } from 'express';
import { validate } from '@/middleware/validate';
import { getProducedSchema } from './produced.schema';
import sql from '@/utils/db';

export async function getProduced(req: Request, res: Response) {
  const body = validate(getProducedSchema, req.query, res);
  if (!body) return;

  const produced = await sql`
  SELECT id, code, created_at,
    (
      SELECT json_agg(code)
      FROM parts_scanned
      WHERE parts_scanned.model_id = models_scanned.id
    ) AS parts,
    count(*) OVER() AS count
  FROM models_scanned
  ORDER BY id DESC
  LIMIT 10 OFFSET ${10 * (body.page - 1)}
`;

  res.send({ rows: produced, count: produced[0]?.count });
}
