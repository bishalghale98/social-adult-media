import { Router } from 'express';
import { FriendsController } from './friends.controller';
import { authenticate } from '../../middleware/auth';
import { friendRequestLimiter } from '../../middleware/rateLimit';

const router = Router();

router.post('/requests', authenticate, friendRequestLimiter, FriendsController.sendRequest);
router.get('/requests/incoming', authenticate, FriendsController.getIncoming);
router.get('/requests/outgoing', authenticate, FriendsController.getOutgoing);
router.post('/requests/:id/accept', authenticate, FriendsController.accept);
router.post('/requests/:id/reject', authenticate, FriendsController.reject);
router.post('/requests/:id/cancel', authenticate, FriendsController.cancel);
router.get('/', authenticate, FriendsController.getFriends);

export default router;
