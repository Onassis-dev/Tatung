import { Router } from 'express';
import { getCapture, getDisplays, scanModel } from './displays.controller';

export const displaysRouter = Router();

displaysRouter.get('/', getDisplays);
displaysRouter.get('/scan', getCapture);

displaysRouter.post('/scan', scanModel);
