import { Request, Response } from 'express';
import { validate } from '@/middleware/validate';
import { createIpSchema, editIpSchema, getIpsSchema } from './ips.schema';
import sql from '@/utils/db';
import { deleteSchema } from '@/utils/schemas';

export async function getIps(req: Request, res: Response) {
  const body = validate(getIpsSchema, req.query, res);
  if (!body) return;

  const ips =
    await sql`SELECT id, ip, line_id::text, (select code from lines where id = line_id) as line, count(*) OVER() as count FROM ips
  order by id desc limit 10 offset ${10 * (body.page - 1)}`;
  res.send({ rows: ips, count: ips[0]?.count });
}
export async function getLines(req: Request, res: Response) {
  const lines = await sql`SELECT id::text, code FROM lines`;
  res.send(lines.map((line: any) => ({ label: line.code, value: line.id })));
}

export async function createIp(req: Request, res: Response) {
  const body = validate(createIpSchema, req.body, res);
  if (!body) return;

  await sql`insert into ips ${sql(body)}`;
  res.send();
}

export async function editIp(req: Request, res: Response) {
  const body = validate(editIpSchema, req.body, res);
  if (!body) return;

  await sql`update ips set ${sql(body)} where id = ${body.id}`;
  res.send();
}

export async function deleteIp(req: Request, res: Response) {
  const body = validate(deleteSchema, req.query, res);
  if (!body) return;

  await sql`delete from ips where id = ${body.id}`;
  res.send();
}
