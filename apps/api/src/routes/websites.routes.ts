import { Router } from 'express';
import { WebsitesController } from '../controllers/websites.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/blocked', WebsitesController.listBlocked);
router.post('/blocked', WebsitesController.addBlocked);
router.delete('/blocked/:id', WebsitesController.removeBlocked);

export default router;
