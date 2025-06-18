import { Router } from 'express';
import { getProduced } from './produced.controller';

export const producedRouter = Router();

producedRouter.get('/', getProduced);
