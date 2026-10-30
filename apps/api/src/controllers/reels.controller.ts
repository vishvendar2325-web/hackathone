import { Request, Response } from 'express';
import { ReelsService } from '../services/reels.service';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class ReelsController {
  public static async sync(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId || 'student_alex_rivera';
      const result = await ReelsService.syncReelEvent(userId, req.body);
      res.status(200).json(result);
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  public static async today(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId || 'student_alex_rivera';
    const data = await ReelsService.getToday(userId);
    res.status(200).json({ success: true, data });
  }

  public static async submitCorrection(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId || 'student_alex_rivera';
    const result = await ReelsService.submitCorrection(userId, req.body);
    res.status(200).json(result);
  }

  public static async platforms(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId || 'student_alex_rivera';
    const data = await ReelsService.getToday(userId);
    res.status(200).json({
      success: true,
      data: data.platformBreakdown,
      meta: { isEstimate: true },
    });
  }

  public static async weekly(_req: Request, res: Response) {
    res.status(200).json({
      success: true,
      data: [
        { day: 'Mon', estimatedCount: 35, minutes: 28 },
        { day: 'Tue', estimatedCount: 20, minutes: 16 },
        { day: 'Wed', estimatedCount: 65, minutes: 48 },
        { day: 'Thu', estimatedCount: 15, minutes: 12 },
        { day: 'Fri', estimatedCount: 40, minutes: 32 },
        { day: 'Sat', estimatedCount: 50, minutes: 42 },
        { day: 'Sun', estimatedCount: 28, minutes: 24 },
      ],
      meta: { isEstimate: true },
    });
  }
}
