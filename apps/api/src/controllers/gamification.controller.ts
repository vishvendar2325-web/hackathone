import { Request, Response } from 'express';
import { GamificationService } from '../services/gamification.service';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class GamificationController {
  public static async getProfile(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId || 'student_alex_rivera';
    const profile = GamificationService.getProfile(userId);
    res.status(200).json({ success: true, data: profile });
  }

  public static async getAchievements(_req: Request, res: Response) {
    const achievements = GamificationService.getAchievements();
    res.status(200).json({ success: true, data: achievements });
  }

  public static async getChallenges(_req: Request, res: Response) {
    const challenges = GamificationService.getChallenges();
    res.status(200).json({ success: true, data: challenges });
  }

  public static async getStreaks(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId || 'student_alex_rivera';
    const streaks = GamificationService.getStreaks(userId);
    res.status(200).json({ success: true, data: streaks });
  }

  public static async getLeaderboards(req: Request, res: Response) {
    const type = (req.query.type as 'global' | 'friends' | 'groups') || 'global';
    const rankings = GamificationService.getLeaderboards(type);
    res.status(200).json({ success: true, data: rankings });
  }
}
