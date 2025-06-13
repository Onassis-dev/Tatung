import { Router } from 'express';
import {
  createModel,
  deleteModel,
  editModel,
  getModels,
} from './models.controller';

export const modelsRouter = Router();

modelsRouter.get('/', getModels);

modelsRouter.post('/', createModel);

modelsRouter.put('/', editModel);

modelsRouter.delete('/', deleteModel);
