import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/chat', AIController.chat);
router.get('/recommendations', AIController.recommendations);
router.post('/study-plan', AIController.studyPlan);
router.get('/weekly-report', AIController.weeklyReport);
router.post('/recommendations/:id/feedback', AIController.feedback);

export default router;
