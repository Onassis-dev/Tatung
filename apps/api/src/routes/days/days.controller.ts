import { Request, Response } from 'express';
import { validate } from '@/middleware/validate';
import { createDaySchema, editDaySchema, getDaysSchema } from './days.schema';
import sql from '@/utils/db';
import { deleteSchema } from '@/utils/schemas';

export async function getDays(req: Request, res: Response) {
  const body = validate(getDaysSchema, req.query, res);
  if (!body) return;

  const days =
    await sql`SELECT id, date, model, time, employees, produced, line_id FROM days
    where date = ${body.date}`;

  res.send(days);
}

export async function getLines(req: Request, res: Response) {
  const lines = await sql`SELECT id, code from lines`;
  res.send(lines);
}

export async function createDay(req: Request, res: Response) {
  const body = validate(createDaySchema, req.body, res);
  if (!body) return;

  await sql`insert into days ${sql(body)}`;
  res.send();
}

export async function editDay(req: Request, res: Response) {
  const body = validate(editDaySchema, req.body, res);
  if (!body) return;

  await sql`update days set ${sql(body)} where id = ${body.id}`;
  res.send();
}

export async function deleteDay(req: Request, res: Response) {
  const body = validate(deleteSchema, req.query, res);
  if (!body) return;

  await sql`delete from days where id = ${body.id}`;
  res.send();
}
