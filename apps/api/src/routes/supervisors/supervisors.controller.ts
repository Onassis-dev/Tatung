import { Request, Response } from 'express';
import { validate } from '@/middleware/validate';
import { createSupervisorSchema, editSupervisorSchema, getSupervisorsSchema } from './supervisors.schema';
import sql from '@/utils/db';
import { deleteSchema } from '@/utils/schemas';

export async function getSupervisors(req: Request, res: Response) {
  const body = validate(getSupervisorsSchema, req.query, res);
  if (!body) return;

  const supervisors = await sql`SELECT id, code, name, count(*) OVER() as count FROM supervisors
  order by id desc limit 10 offset ${10 * (body.page - 1)}`;
  res.send({ rows: supervisors, count: supervisors[0]?.count });
}

export async function createSupervisor(req: Request, res: Response) {
  const body = validate(createSupervisorSchema, req.body, res);
  if (!body) return;

  await sql`insert into supervisors ${sql(body)}`;
  res.send();
}

export async function editSupervisor(req: Request, res: Response) {
  const body = validate(editSupervisorSchema, req.body, res);
  if (!body) return;

  await sql`update supervisors set ${sql(body)} where id = ${body.id}`;
  res.send();
}

export async function deleteSupervisor(req: Request, res: Response) {
  const body = validate(deleteSchema, req.query, res);
  if (!body) return;

  await sql`delete from supervisors where id = ${body.id}`;
  res.send();
}
