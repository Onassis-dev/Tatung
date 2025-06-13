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

  const models = await sql`
  SELECT 
    id, code, time, count(*) OVER() AS count,
    COALESCE((
      SELECT json_agg(mp.part_id)
      FROM models_parts as mp
      WHERE mp.model_id = models.id
    ), '[]'::json) AS parts
  FROM models ORDER BY id DESC LIMIT 10 OFFSET ${10 * (body.page - 1)}`;

  res.send({ rows: models, count: models[0].count });
}

export async function getParts(req: Request, res: Response) {
  const parts = await sql`SELECT id, code FROM parts`;
  res.send(parts.map((part) => ({ label: part.code, value: part.id })));
}

export async function createModel(req: Request, res: Response) {
  const body = validate(createModelSchema, req.body, res);
  if (!body) return;

  await sql.begin(async (sql) => {
    const [row] = await sql`insert into models ${sql({
      code: body.code,
      time: body.time,
    })} returning id`;

    await sql`insert into models_parts ${sql(
      body.parts.map((part: number) => ({
        model_id: row.id,
        part_id: part,
      })),
    )}`;
  });

  res.send();
}

export async function editModel(req: Request, res: Response) {
  const body = validate(editModelSchema, req.body, res);
  if (!body) return;

  await sql.begin(async (sql) => {
    await sql`delete from models_parts where model_id = ${body.id}`;

    await sql`update models set ${sql({
      code: body.code,
      time: body.time,
    })} where id = ${body.id}`;

    await sql`insert into models_parts ${sql(
      body.parts.map((part: number) => ({
        model_id: body.id,
        part_id: part,
      })),
    )}`;
  });

  res.send();
}

export async function deleteModel(req: Request, res: Response) {
  const body = validate(deleteSchema, req.query, res);
  if (!body) return;

  await sql`delete from models where id = ${body.id}`;
  res.send();
}
