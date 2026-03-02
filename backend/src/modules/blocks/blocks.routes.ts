import { Router } from 'express';
import { BlocksController } from './blocks.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, BlocksController.block);
router.delete('/:blockedId', authenticate, BlocksController.unblock);
router.get('/', authenticate, BlocksController.getBlocks);

export default router;
