import { Request, Response } from 'express';
import { scanModelSchema } from './displays.schema';
import sql from '@/utils/db';
import { validateIp } from '@/middleware/validateIp';
import { validate } from '@/middleware/validate';
import { calculateGoal } from '@/utils/calculateGoal';
import { getTijuanaDate } from '@/utils/getTijuanaDate';

export async function getDisplays(req: Request, res: Response) {
  const lineId = await validateIp(req, res);
  if (!lineId) return;

  const [day] =
    await sql`select (select code from lines where id = line_id) as line, model, time, produced, employees from days where line_id = ${lineId} and date = ${getTijuanaDate()}`;

  res.send({ ...day, goal: calculateGoal(day as any) });
}

export async function getCapture(req: Request, res: Response) {
  const lineId = await validateIp(req, res);
  if (!lineId) return;

  const [day] =
    await sql`select (select code from lines where id = line_id) as line, model, model_id from days where line_id = ${lineId} and date = ${getTijuanaDate()}`;

  if (!day) {
    res.send();
    return;
  }

  const parts =
    await sql`select (select code from parts where id = part_id) as code from models_parts where model_id = ${day.model_id}`;

  res.send({ ...day, parts: parts.map((part: any) => part.code) });
}

export async function scanModel(req: Request, res: Response) {
  const lineId = await validateIp(req, res);
  if (!lineId) return;

  const body = validate(scanModelSchema, req.body, res);
  if (!body) return;

  const [day] =
    await sql`select id, model_id from days where line_id = ${lineId} and date = ${new Date().toISOString().split('T')[0]}`;
  const parts =
    await sql`select (select code from parts where id = part_id) as code from models_parts where model_id = ${day.model_id}`;

  if (
    parts
      .map((part: any) => part.code)
      .sort()
      .join(',') === body.parts.sort().join(',')
  ) {
    await sql`update days set produced = produced + 1 where id = ${day.id}`;
    res.send();
  } else {
    res.status(400).send();
  }
}
