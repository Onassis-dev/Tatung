import sql from '@/utils/db';
import { Request, Response } from 'express';

export async function validateIp(req: Request, res: Response) {
  const ip = req.ip;
  const [row] = await sql`select line_id from ips where ip = ${ip || ''}`;

  if (!row) {
    res.status(403).send({ ip });
    return;
  }

  return row.line_id;
}
