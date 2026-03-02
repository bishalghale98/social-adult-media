import { Router } from 'express';
import { ProfileController } from './profile.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { updateProfileSchema } from './profile.schemas';

const router = Router();

router.get('/me', authenticate, ProfileController.getMe);
router.patch('/me/profile', authenticate, validate(updateProfileSchema), ProfileController.updateMe);

export default router;
