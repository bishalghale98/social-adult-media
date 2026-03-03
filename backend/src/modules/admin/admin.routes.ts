import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/requireRole';

const router = Router();

router.use(authenticate, requireRole('ADMIN'));

// Reports
router.get('/reports', AdminController.getReports);
router.get('/reports/:id', AdminController.getReportDetail);
router.post('/reports/:id/review', AdminController.reviewReport);
router.post('/reports/:id/close', AdminController.closeReport);

// User actions
router.post('/users/:id/warn', AdminController.warnUser);
router.post('/users/:id/suspend', AdminController.suspendUser);
router.post('/users/:id/ban', AdminController.banUser);

// Message actions
router.post('/messages/:id/delete', AdminController.deleteMessage);

// Audit log
router.get('/audit-logs', AdminController.getAuditLogs);

export default router;
