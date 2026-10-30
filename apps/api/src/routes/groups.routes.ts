import { Router } from 'express';
import { GroupsController } from '../controllers/groups.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', GroupsController.list);
router.post('/', GroupsController.create);
router.post('/:id/join', GroupsController.join);
router.post('/:id/leave', GroupsController.leave);

export default router;
