import { Request, Response } from 'express';
import { scanModelSchema } from './displays.schema';
import { validateIp } from '@/middleware/validateIp';
import { validate } from '@/middleware/validate';
import { calculateGoal } from '@/utils/calculateGoal';
import { getTijuanaDate } from '@/utils/getTijuanaDate';
import sql from '@/utils/db';

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
    await sql`select (select code from parts where id = part_id) as code, amount from models_parts where model_id = ${day.model_id}`;

  res.send({ ...day, parts });
}

export async function scanModel(req: Request, res: Response) {
  const lineId = await validateIp(req, res);
  if (!lineId) return;

  const body = validate(scanModelSchema, req.body, res);
  if (!body) return;

  const [day] =
    await sql`select id, model_id, model from days where line_id = ${lineId} and date = ${getTijuanaDate()}`;
  const parts =
    await sql`select (select code from parts where id = part_id) as code, amount from models_parts where model_id = ${day.model_id}`;

  if (day.model !== body.model.slice(4, 14) || body.model.length !== 35)
    return res.status(400).send('Modelo de chasis incorrecto.');

  const partsAreCorrectLength = body.parts.every((p) => p.length === 22);
  if (!partsAreCorrectLength)
    return res.status(400).send('LedBars incorrectas. (Error 1)');

  if (body.parts.length !== parts.reduce((acc, part) => acc + part.amount, 0))
    return res.status(400).send('LedBars incorrectas. (Error 2)');

  for (const part of body.parts) {
    const code = part.slice(-5);
    const partIndex = parts.findIndex((p) => p.code === code);
    if (partIndex === -1)
      return res.status(400).send('LedBars incorrectas. (Error 3)');

    if (parts[partIndex].amount === 0)
      return res.status(400).send('LedBars incorrectas. (Error 4)');
    parts[partIndex].amount--;
  }

  if (parts.some((part: any) => part.amount !== 0))
    return res.status(400).send('LedBars incorrectas. (Error 5)');

  //At this point we know that the parts are correct, now we need to check if they are not repeated in our records

  try {
    await sql.begin(async (sql) => {
      await sql`update days set produced = produced + 1 where id = ${day.id}`;
      const [row] =
        await sql`insert into models_scanned (code) values (${body.model?.toUpperCase()}) returning id`;
      for (const part of body.parts) {
        await sql`insert into parts_scanned (code, model_id) values (${part?.toUpperCase()}, ${row.id})`;
      }
    });
  } catch (error: any) {
    if (error.code === '23505') {
      if (error.table_name === 'models_scanned')
        return res.status(400).send('El chasis ya fue registrado.');
      if (error.table_name === 'parts_scanned')
        return res.status(400).send('Una LedBar ya fue registrada.');
    }
    return res.status(400).send('Error del sistema.');
  }

  res.send();
}
