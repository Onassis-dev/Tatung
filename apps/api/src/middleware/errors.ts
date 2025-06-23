import { NextFunction, Request, Response } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code && typeof err.code === 'string') {
    if (err.code === '23505') {
      res.status(400).send({ error: 'El codigo ya fue registrado' });
      return;
    }
  }

  res.status(500).send({ error: 'Error interno' });
  console.log(err);
  next();
};

export default errorHandler;
