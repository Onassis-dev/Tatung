import sql from '@/utils/db';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export function authenticate(perm: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).send('Unauthorized');

      const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as {
        id: string;
      };

      const [user] = await sql`SELECT * FROM users WHERE id = ${decoded.id}`;
      if (!user) return res.status(401).send('Unauthorized');

      // if (!user.permissions?.includes(perm)) {
      //   return res.status(403).send('Forbidden');
      // }

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError)
        return res.status(401).send('Invalid token');

      return res.status(500).send('Internal server error');
    }
  };
}
