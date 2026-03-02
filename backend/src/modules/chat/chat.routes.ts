import { Router } from 'express';
import { ChatController } from './chat.controller';
import { authenticate } from '../../middleware/auth';
import { messageLimiter } from '../../middleware/rateLimit';

const router = Router();

router.get('/', authenticate, ChatController.getConversations);
router.get('/:id/messages', authenticate, ChatController.getMessages);
router.post('/:id/messages', authenticate, messageLimiter, ChatController.sendMessage);

export default router;
