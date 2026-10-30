import { Router } from 'express';
import { GoalsController } from '../controllers/goals.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', GoalsController.list);
router.post('/', GoalsController.create);
router.put('/:id', GoalsController.update);
router.delete('/:id', GoalsController.delete);

export default router;
