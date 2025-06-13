import { Router } from 'express';
import { createIp, deleteIp, editIp, getIps, getLines } from './ips.controller';

export const ipsRouter = Router();

ipsRouter.get('/', getIps);
ipsRouter.get('/lines', getLines);

ipsRouter.post('/', createIp);

ipsRouter.put('/', editIp);

ipsRouter.delete('/', deleteIp);
