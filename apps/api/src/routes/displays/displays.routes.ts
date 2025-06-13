import { Router } from 'express';
import { getDisplays, scanModel } from './displays.controller';

export const displaysRouter = Router();

displaysRouter.get('/', getDisplays);

displaysRouter.post('/scan', scanModel);
