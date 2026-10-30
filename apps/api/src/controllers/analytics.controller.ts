import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class AnalyticsController {
  public static async overview(req: AuthenticatedRequest, res: Response) {
    res.status(200).json({
      success: true,
      data: {
        totalFocusMinutes: 105,
        totalBrowserMinutes: 240,
        estimatedReelsTotal: 28,
        productivityScore: 82,
        activeStreakDays: 5,
        level: 3,
        levelName: 'Consistency Builder',
        xpEarnedToday: 35,
      },
    });
  }

  public static async weekly(req: AuthenticatedRequest, res: Response) {
    res.status(200).json({
      success: true,
      data: [
        { day: 'Mon', focus: 120, reels: 35, browserTotal: 210 },
        { day: 'Tue', focus: 150, reels: 20, browserTotal: 240 },
        { day: 'Wed', focus: 90, reels: 65, browserTotal: 290 },
        { day: 'Thu', focus: 180, reels: 15, browserTotal: 230 },
        { day: 'Fri', focus: 140, reels: 40, browserTotal: 260 },
        { day: 'Sat', focus: 210, reels: 50, browserTotal: 310 },
        { day: 'Sun', focus: 165, reels: 28, browserTotal: 240 },
      ],
      meta: { isEstimate: true },
    });
  }

  public static async websites(req: AuthenticatedRequest, res: Response) {
    res.status(200).json({
      success: true,
      data: [
        { domain: 'github.com', category: 'PRODUCTIVE', minutes: 78 },
        { domain: 'stackoverflow.com', category: 'PRODUCTIVE', minutes: 42 },
        { domain: 'instagram.com', category: 'DISTRACTING', minutes: 24, estimatedReels: 18 },
        { domain: 'youtube.com', category: 'DISTRACTING', minutes: 22, estimatedReels: 8 },
        { domain: 'coursera.org', category: 'PRODUCTIVE', minutes: 55 },
      ],
    });
  }
}
