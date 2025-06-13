import { Request, Response } from 'express';
import { validate } from '@/middleware/validate';
import {
  createModelSchema,
  editModelSchema,
  getModelsSchema,
} from './models.schema';
import sql from '@/utils/db';
import { deleteSchema } from '@/utils/schemas';

export async function getModels(req: Request, res: Response) {
  const body = validate(getModelsSchema, req.query, res);
  if (!body) return;

  const models =
    await sql`SELECT id, code, time, count(*) OVER() as count FROM models
  order by id desc limit 10 offset ${10 * (body.page - 1)}`;
  res.send({ rows: models, count: models[0].count });
}

export async function createModel(req: Request, res: Response) {
  const body = validate(createModelSchema, req.body, res);
  if (!body) return;

  await sql`insert into models ${sql(body)}`;
  res.send();
}

export async function editModel(req: Request, res: Response) {
  const body = validate(editModelSchema, req.body, res);
  if (!body) return;

  await sql`update models set ${sql(body)} where id = ${body.id}`;
  res.send();
}

export async function deleteModel(req: Request, res: Response) {
  const body = validate(deleteSchema, req.query, res);
  if (!body) return;

  await sql`delete from models where id = ${body.id}`;
  res.send();
}
