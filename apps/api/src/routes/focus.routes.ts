import { Router } from 'express';
import { FocusController } from '../controllers/focus.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/start', FocusController.start);
router.post('/pause', FocusController.pause);
router.post('/resume', FocusController.resume);
router.post('/complete', FocusController.complete);
router.post('/cancel', FocusController.cancel);
router.get('/today', FocusController.today);
router.get('/history', FocusController.history);

export default router;
