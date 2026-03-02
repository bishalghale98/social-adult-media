import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate';
import { registerSchema, loginSchema, refreshSchema } from './auth.schemas';
import { authenticate } from '../../middleware/auth';
import { authLimiter } from '../../middleware/rateLimit';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), AuthController.register);
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.post('/refresh', validate(refreshSchema), AuthController.refresh);
router.post('/logout', authenticate, AuthController.logout);
router.post('/consent/accept', authenticate, AuthController.acceptConsent);

export default router;
