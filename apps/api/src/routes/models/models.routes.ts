import { Router } from 'express';
import {
  createModel,
  deleteModel,
  editModel,
  getModels,
  getParts,
} from './models.controller';

export const modelsRouter = Router();

modelsRouter.get('/', getModels);
modelsRouter.get('/parts', getParts);

modelsRouter.post('/', createModel);

modelsRouter.put('/', editModel);

modelsRouter.delete('/', deleteModel);
