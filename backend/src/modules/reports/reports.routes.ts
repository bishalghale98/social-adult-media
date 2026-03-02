import { Router } from 'express';
import { ReportsController } from './reports.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, ReportsController.create);

export default router;
