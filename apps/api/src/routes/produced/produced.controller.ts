import { Request, Response } from 'express';
import { validate } from '@/middleware/validate';
import { getProducedSchema, getPartsSchema } from './produced.schema';
import sql from '@/utils/db';

export async function getProduced(req: Request, res: Response) {
  const body = validate(getProducedSchema, req.query, res);
  if (!body) return;

  const produced = await sql`
  SELECT id, code, created_at, count(*) OVER() AS count, sup_code
  FROM models_scanned
  ${body.search ? sql`WHERE code = ${body.search}` : sql``}
  ${body.search ? sql`OR id = (select model_id from parts_scanned where code = ${body.search})` : sql``}
  ORDER BY id DESC
  LIMIT 10 OFFSET ${10 * (body.page - 1)}`;

  res.send({ rows: produced, count: produced[0]?.count });
}

export async function getParts(req: Request, res: Response) {
  const body = validate(getPartsSchema, req.query, res);
  if (!body) return;

  const parts = await sql`SELECT code FROM parts_scanned WHERE model_id = ${body.id} ORDER BY id DESC`;

  res.send(parts);
}
