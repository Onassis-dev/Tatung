import { Router } from 'express';
import { getParts, getProduced } from './produced.controller';

export const producedRouter = Router();

producedRouter.get('/', getProduced);
producedRouter.get('/parts', getParts);
