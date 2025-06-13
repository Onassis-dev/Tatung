import { Request, Response } from 'express';
import { validate } from '@/middleware/validate';
import {
  createPartSchema,
  editPartSchema,
  getPartsSchema,
} from './parts.schema';
import sql from '@/utils/db';
import { deleteSchema } from '@/utils/schemas';

export async function getParts(req: Request, res: Response) {
  const body = validate(getPartsSchema, req.query, res);
  if (!body) return;

  const parts = await sql`SELECT id, code, count(*) OVER() as count FROM parts
  order by id desc limit 10 offset ${10 * (body.page - 1)}`;
  res.send({ rows: parts, count: parts[0].count });
}

export async function createPart(req: Request, res: Response) {
  const body = validate(createPartSchema, req.body, res);
  if (!body) return;

  await sql`insert into parts ${sql(body)}`;
  res.send();
}

export async function editPart(req: Request, res: Response) {
  const body = validate(editPartSchema, req.body, res);
  if (!body) return;

  await sql`update parts set ${sql(body)} where id = ${body.id}`;
  res.send();
}

export async function deletePart(req: Request, res: Response) {
  const body = validate(deleteSchema, req.query, res);
  if (!body) return;

  await sql`delete from parts where id = ${body.id}`;
  res.send();
}
