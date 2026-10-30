import { Router } from 'express';
import { GamificationController } from '../controllers/gamification.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/profile', GamificationController.getProfile);
router.get('/status', GamificationController.getProfile);
router.get('/achievements', GamificationController.getAchievements);
router.get('/challenges', GamificationController.getChallenges);
router.get('/streaks', GamificationController.getStreaks);
router.get('/leaderboard', GamificationController.getLeaderboards);

export default router;
