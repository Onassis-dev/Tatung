import { Router } from 'express';
import {
  createDay,
  deleteDay,
  editDay,
  getDays,
  getLines,
  getModels,
} from './days.controller';

export const daysRouter = Router();

daysRouter.get('/', getDays);
daysRouter.get('/lines', getLines);
daysRouter.get('/models', getModels);

daysRouter.post('/', createDay);

daysRouter.put('/', editDay);

daysRouter.delete('/', deleteDay);
