import { Router } from 'express';
import { checkSupervisor, getCapture, getDisplays, scanModel } from './displays.controller';

export const displaysRouter = Router();

displaysRouter.get('/', getDisplays);
displaysRouter.get('/scan', getCapture);

displaysRouter.post('/scan', scanModel as any);
displaysRouter.post('/supervisor', checkSupervisor as any);
