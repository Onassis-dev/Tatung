import { Request, Response } from 'express';
import { validate } from '@/middleware/validate';
import { createTurnSchema, editTurnSchema, getTurnsSchema } from './turns.schema';
import sql from '@/utils/db';
import { deleteSchema } from '@/utils/schemas';

export async function getTurns(req: Request, res: Response) {
  const body = validate(getTurnsSchema, req.query, res);
  if (!body) return;

  const turns = await sql`SELECT id, name, "start", "end", count(*) OVER() as count FROM turns
  order by id desc limit 10 offset ${10 * (body.page - 1)}`;
  res.send({ rows: turns, count: turns[0]?.count });
}

export async function createTurn(req: Request, res: Response) {
  const body = validate(createTurnSchema, req.body, res);
  if (!body) return;

  await sql`insert into turns ${sql(body)}`;
  res.send();
}

export async function editTurn(req: Request, res: Response) {
  const body = validate(editTurnSchema, req.body, res);
  if (!body) return;

  await sql`update turns set ${sql(body)} where id = ${body.id}`;
  res.send();
}

export async function deleteTurn(req: Request, res: Response) {
  const body = validate(deleteSchema, req.query, res);
  if (!body) return;

  await sql`delete from turns where id = ${body.id}`;
  res.send();
}
