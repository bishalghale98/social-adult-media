import { Router } from 'express';
import { DiscoveryController } from './discovery.controller';
import { authenticate } from '../../middleware/auth';
import { generalLimiter } from '../../middleware/rateLimit';

const router = Router();

router.get('/users', authenticate, generalLimiter, DiscoveryController.search);

export default router;
