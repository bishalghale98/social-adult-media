import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/requireRole';

const router = Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/reports', AdminController.getReports);
router.post('/reports/:id/review', AdminController.reviewReport);
router.post('/users/:id/suspend', AdminController.suspendUser);
router.post('/users/:id/ban', AdminController.banUser);
router.post('/messages/:id/delete', AdminController.deleteMessage);
router.get('/audit-logs', AdminController.getAuditLogs);

export default router;
