import { Router } from 'express';
import { createSupervisor, deleteSupervisor, editSupervisor, getSupervisors } from './supervisors.controller';

export const supervisorsRouter = Router();

supervisorsRouter.get('/', getSupervisors);

supervisorsRouter.post('/', createSupervisor);

supervisorsRouter.put('/', editSupervisor);

supervisorsRouter.delete('/', deleteSupervisor);
