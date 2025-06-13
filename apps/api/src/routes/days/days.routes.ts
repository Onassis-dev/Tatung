import { Router } from 'express';
import {
  createDay,
  deleteDay,
  editDay,
  getDays,
  getLines,
} from './days.controller';

export const daysRouter = Router();

daysRouter.get('/', getDays);
daysRouter.get('/lines', getLines);

daysRouter.post('/', createDay);

daysRouter.put('/', editDay);

daysRouter.delete('/', deleteDay);
