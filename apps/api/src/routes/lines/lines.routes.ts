import { Router } from 'express';
import {
  createModel,
  deleteModel,
  editModel,
  getLines,
} from './lines.controller';

export const linesRouter = Router();

linesRouter.get('/', getLines);

linesRouter.post('/', createModel);

linesRouter.put('/', editModel);

linesRouter.delete('/', deleteModel);
