import { Router } from 'express';
import { createUser, deleteUser, editUser, getUsers } from './users.controller';

export const usersRouter = Router();

usersRouter.get('/', getUsers);

usersRouter.post('/', createUser);

usersRouter.put('/', editUser);

usersRouter.delete('/', deleteUser);
