import { Request, Response } from 'express';
import { validate } from '@/middleware/validate';
import {
  createLineSchema,
  editLineSchema,
  getLinesSchema,
} from './lines.schema';
import sql from '@/utils/db';
import { deleteSchema } from '@/utils/schemas';

export async function getLines(req: Request, res: Response) {
  const body = validate(getLinesSchema, req.query, res);
  if (!body) return;

  const lines = await sql`SELECT id, code, count(*) OVER() as count FROM lines
  order by id desc limit 10 offset ${10 * (body.page - 1)}`;
  res.send({ rows: lines, count: lines[0]?.count });
}

export async function createModel(req: Request, res: Response) {
  const body = validate(createLineSchema, req.body, res);
  if (!body) return;

  await sql`insert into lines ${sql(body)}`;
  res.send();
}

export async function editModel(req: Request, res: Response) {
  const body = validate(editLineSchema, req.body, res);
  if (!body) return;

  await sql`update lines set ${sql(body)} where id = ${body.id}`;
  res.send();
}

export async function deleteModel(req: Request, res: Response) {
  const body = validate(deleteSchema, req.query, res);
  if (!body) return;

  await sql`delete from lines where id = ${body.id}`;
  res.send();
}
