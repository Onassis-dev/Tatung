import { Router } from 'express';
import { createPart, deletePart, editPart, getParts } from './parts.controller';

export const partsRouter = Router();

partsRouter.get('/', getParts);

partsRouter.post('/', createPart);

partsRouter.put('/', editPart);

partsRouter.delete('/', deletePart);
