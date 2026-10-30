import { Router } from 'express';
import { MobileController } from '../controllers/mobile.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/sync', MobileController.syncUsage);
router.post('/usage/sync', MobileController.syncUsage);
router.get('/usage/apps', MobileController.getAppUsage);
router.post('/reels/sync', MobileController.syncReels);

export default router;
