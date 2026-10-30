import { Router } from 'express';
import healthRoutes from './healthRoutes';
import authRoutes from './auth.routes';
import focusRoutes from './focus.routes';
import reelsRoutes from './reels.routes';
import aiRoutes from './ai.routes';
import gamificationRoutes from './gamification.routes';
import goalsRoutes from './goals.routes';
import websitesRoutes from './websites.routes';
import groupsRoutes from './groups.routes';
import analyticsRoutes from './analytics.routes';
import mobileRoutes from './mobile.routes';

const router = Router();

// Mount all v1 sub-routers
router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/focus', focusRoutes);
router.use('/reels', reelsRoutes);
router.use('/ai', aiRoutes);
router.use('/gamification', gamificationRoutes);
router.use('/goals', goalsRoutes);
router.use('/websites', websitesRoutes);
router.use('/groups', groupsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/mobile', mobileRoutes);

export default router;
