import { Router } from 'express';
import { ReelsController } from '../controllers/reels.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/sync', ReelsController.sync);
router.get('/today', ReelsController.today);
router.get('/platforms', ReelsController.platforms);
router.get('/weekly', ReelsController.weekly);
router.post('/correction', ReelsController.submitCorrection);

export default router;
