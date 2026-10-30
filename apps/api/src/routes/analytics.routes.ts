import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/overview', AnalyticsController.overview);
router.get('/weekly', AnalyticsController.weekly);
router.get('/websites', AnalyticsController.websites);

export default router;
