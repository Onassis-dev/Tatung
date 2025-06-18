import { Request, Response } from 'express';
import { validate } from '@/middleware/validate';
import { createDaySchema, editDaySchema, getDaysSchema } from './days.schema';
import sql from '@/utils/db';
import { deleteSchema } from '@/utils/schemas';

export async function getDays(req: Request, res: Response) {
  const body = validate(getDaysSchema, req.query, res);
  if (!body) return;

  const days = await sql`
  SELECT 
    d.id, d.date, d.model, d.prod, d.goal, d.line_id,
    json_agg(h ORDER BY 
      CASE 
        WHEN h.hour >= d."start" THEN h.hour 
        ELSE h.hour + 24 
      END
    ) AS hours
  FROM days d
  JOIN hours h ON h.day_id = d.id
  WHERE d.date = ${body.date} AND d.turn_id = ${body.turn_id}
  GROUP BY d.id, d."start"`;

  res.send(days);
}

export async function getLines(req: Request, res: Response) {
  const lines = await sql`SELECT id, code from lines`;
  res.send(lines);
}

export async function getTurns(req: Request, res: Response) {
  const turns = await sql`SELECT id as value, name as label from turns`;
  res.send(turns);
}

export async function getModels(req: Request, res: Response) {
  const models = await sql`SELECT id as value, code as label from models`;
  res.send(models);
}

export async function createDay(req: Request, res: Response) {
  const body = validate(createDaySchema, req.body, res);
  if (!body) return;

  const [model] = await sql`SELECT code from models where id = ${body.model_id}`;
  if (!model) {
    res.status(400).send('Modelo no encontrado');
    return;
  }

  await sql.begin(async (sql) => {
    const [turn] = await sql`SELECT "start", "end" from turns where id = ${body.turn_id}`;

    const [day] = await sql`insert into days ${sql({
      model: model.code,
      date: body.date,
      line_id: body.line_id,
      model_id: body.model_id,
      turn_id: body.turn_id,
      start: turn.start,
      goal: 0,
    })} returning id`;

    const hours = [];
    for (let i = turn.start; i !== turn.end; i++) {
      if (i === 24) i = 0;
      hours.push(i);
    }

    await sql`insert into hours ${sql(
      hours.map((hour) => ({
        day_id: day.id,
        goal: body.goal,
        hour: hour,
      })),
    )}`;

    await sql`update days set goal = (select sum(goal) from hours where day_id = ${day.id}) where id = ${day.id}`;
  });

  res.send();
}

export async function editDay(req: Request, res: Response) {
  const body = validate(editDaySchema, req.body, res);
  if (!body) return;

  await sql.begin(async (sql) => {
    for (const hour of body.hours) {
      await sql`update hours set ${sql({
        goal: hour.goal,
        prod: hour.prod,
      })} where day_id = ${body.id} and hour = ${hour.hour}`;
    }

    await sql`update days set
    goal = (select sum(goal) from hours where day_id = ${body.id}),
    prod = (select sum(prod) from hours where day_id = ${body.id}),
    model = (select model from days where id = ${body.id})
    where id = ${body.id}`;
  });

  res.send();
}

export async function deleteDay(req: Request, res: Response) {
  const body = validate(deleteSchema, req.query, res);
  if (!body) return;

  await sql`delete from days where id = ${body.id}`;
  res.send();
}
