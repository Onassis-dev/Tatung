import { Request, Response } from 'express';
import { scanModelSchema } from './displays.schema';
import sql from '@/utils/db';
import { validateIp } from '@/middleware/validateIp';
import { validate } from '@/middleware/validate';

export async function getDisplays(req: Request, res: Response) {
  const lineId = await validateIp(req, res);

  if (!lineId) return;

  const [day] =
    await sql`select * from days where line_id = ${lineId} and date = ${new Date().toISOString().split('T')[0]}`;

  res.send(day);
}

export async function scanModel(req: Request, res: Response) {
  const lineId = await validateIp(req, res);
  if (!lineId) return;

  const body = validate(scanModelSchema, req.body, res);
  if (!body) return;

  await sql`insert into displays ${sql(body)}`;
  res.send();
}
