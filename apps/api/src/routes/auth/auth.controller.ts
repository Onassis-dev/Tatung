import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginSchema } from './auth.schema';
import { validate } from '@/middleware/validate';
import sql from '@/utils/db';

export async function login(req: Request, res: Response) {
  const body = validate(loginSchema, req.body, res);
  if (!body) return;

  const [user] =
    await sql`SELECT * FROM users WHERE username = ${body.username}`;
  if (!user) return res.status(400).send('Invalid credentials');

  const isPasswordValid = await bcrypt.compare(
    body.password,
    user?.password || '',
  );
  if (!isPasswordValid) return res.status(400).send('Invalid credentials');

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || '', {
    expiresIn: '1w',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  delete user.password;
  return res.send({ user });
}
