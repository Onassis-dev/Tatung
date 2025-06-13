import { Request, Response } from 'express';
import { validate } from '@/middleware/validate';
import {
  createUserSchema,
  editUserSchema,
  getUsersSchema,
} from './users.schema';
import bcrypt from 'bcrypt';
import sql from '@/utils/db';
import { deleteSchema } from '@/utils/schemas';

export async function getUsers(req: Request, res: Response) {
  const body = validate(getUsersSchema, req.query, res);
  if (!body) return;

  const users =
    await sql`SELECT id, username, p_planning::text, p_models::text, p_users::text, count(*) OVER() as count FROM users
  order by id desc limit 10 offset ${10 * (body.page - 1)}`;
  res.send({ rows: users, count: users[0]?.count });
}

export async function createUser(req: Request, res: Response) {
  const body = validate(createUserSchema, req.body, res);
  if (!body) return;

  const hash = await bcrypt.hash(body.password, 12);
  await sql`insert into users ${sql({ ...body, password: hash })}`;
  res.send();
}

export async function editUser(req: Request, res: Response) {
  const body = validate(editUserSchema, req.body, res);
  if (!body) return;

  if (body.password) body.password = await bcrypt.hash(body.password, 12);
  delete body.password;

  await sql`update users set ${sql(body)} where id = ${body.id}`;
  res.send();
}

export async function deleteUser(req: Request, res: Response) {
  const body = validate(deleteSchema, req.query, res);
  if (!body) return;

  await sql`delete from users where id = ${body.id}`;
  res.send();
}
