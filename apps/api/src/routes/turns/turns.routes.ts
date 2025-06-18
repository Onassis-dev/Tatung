import { Router } from 'express';
import { createTurn, deleteTurn, editTurn, getTurns } from './turns.controller';

export const turnsRouter = Router();

turnsRouter.get('/', getTurns);

turnsRouter.post('/', createTurn);

turnsRouter.put('/', editTurn);

turnsRouter.delete('/', deleteTurn);
