import { Request, Response } from 'express';
import { scanModelSchema } from './displays.schema';
import { validateIp } from '@/middleware/validateIp';
import { validate } from '@/middleware/validate';
import { getTijuanaDate, getTijuanaHour } from '@/utils/getTijuanaDate';
import sql from '@/utils/db';

export async function getDisplays(req: Request, res: Response) {
  const lineId = await validateIp(req, res);
  if (!lineId) return;

  const [day] = await sql`
  SELECT 
    (SELECT code FROM lines WHERE id = line_id) AS line, 
    model, 
    id, 
    "start" 
  FROM days 
  WHERE id = (select day_id from hours where day_id in (select id from days where line_id = ${lineId} AND date = ${getTijuanaDate()}) and hour = ${getTijuanaHour()})
`;

  const hours = await sql`
  SELECT hour, goal, prod 
  FROM hours 
  WHERE day_id = ${day.id}
  ORDER BY 
    CASE 
      WHEN hour >= ${day.start} THEN hour 
      ELSE hour + 24 
    END
`;

  res.send({ model: day.model, line: day.line, hours });
}

export async function getCapture(req: Request, res: Response) {
  const lineId = await validateIp(req, res);
  if (!lineId) return;

  const [day] = await sql`
  SELECT 
    (SELECT code FROM lines WHERE id = line_id) AS line, 
    (select name from turns where id = turn_id) as turn,
    model,
    model_id
  FROM days 
  WHERE id = (select day_id from hours where day_id in (select id from days where line_id = ${lineId} AND date = ${getTijuanaDate()}) and hour = ${getTijuanaHour()})
`;
  if (!day) {
    res.send();
    return;
  }

  const parts = await sql`select (select code from parts where id = part_id) as code, amount from models_parts where model_id = ${day.model_id}`;

  res.send({ ...day, parts });
}

export async function scanModel(req: Request, res: Response) {
  const lineId = await validateIp(req, res);
  if (!lineId) return;

  const body = validate(scanModelSchema, req.body, res);
  if (!body) return;

  const hour = getTijuanaHour();
  const [day] = await sql`
      SELECT id, model_id, model FROM days 
      WHERE id = (select day_id from hours where day_id in (select id from days where line_id = ${lineId} AND date = ${getTijuanaDate()}) and hour = ${hour})`;

  const parts = await sql`select (select code from parts where id = part_id) as code, amount from models_parts where model_id = ${day.model_id}`;

  if (day.model !== body.model.slice(4, 14) || body.model.length !== 35) return res.status(400).send('Modelo de chasis incorrecto.');

  const partsAreCorrectLength = body.parts.every((p) => p.length === 22);
  if (!partsAreCorrectLength) return res.status(400).send('LedBars incorrectas. (Error 1)');

  const partsHaveTheSameProvider = body.parts.every((p) => p[15] === body.model[17]);
  if (!partsHaveTheSameProvider) return res.status(400).send('Los proveedores de las LedBars no coinciden.');

  if (body.parts.length !== parts.reduce((acc, part) => acc + part.amount, 0)) return res.status(400).send('LedBars incorrectas. (Error 2)');

  for (const part of body.parts) {
    const code = part.slice(-5);
    const partIndex = parts.findIndex((p) => p.code === code);
    if (partIndex === -1) return res.status(400).send('LedBars incorrectas. (Error 3)');

    if (parts[partIndex].amount === 0) return res.status(400).send('LedBars incorrectas. (Error 4)');
    parts[partIndex].amount--;
  }

  if (parts.some((part: any) => part.amount !== 0)) return res.status(400).send('LedBars incorrectas. (Error 5)');

  //At this point we know that the parts are correct, now we need to check if they are not repeated in our records

  try {
    await sql.begin(async (sql) => {
      //Insert the model-parts into the database
      const [row] = await sql`insert into models_scanned (code) values (${body.model?.toUpperCase()}) returning id`;
      for (const part of body.parts) {
        await sql`insert into parts_scanned (code, model_id) values (${part?.toUpperCase()}, ${row.id})`;
      }

      //Update the day with the new produced
      await sql`update hours set prod = prod + 1 where day_id = ${day.id} and hour = ${hour}`;
      await sql`update days set prod = prod + 1 where id = ${day.id}`;
    });
  } catch (error: any) {
    if (error.code === '23505') {
      if (error.table_name === 'models_scanned') return res.status(400).send('El chasis ya fue registrado.');
      if (error.table_name === 'parts_scanned') return res.status(400).send('Una LedBar ya fue registrada.');
    }
    console.log(error);
    return res.status(400).send('Error del sistema.');
  }

  res.send();
}
