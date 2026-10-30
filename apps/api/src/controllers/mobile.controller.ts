import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class MobileController {
  public static async syncUsage(req: AuthenticatedRequest, res: Response) {
    const { apps } = req.body;
    res.status(200).json({
      success: true,
      message: 'Mobile usage stats from Android UsageStatsManager synchronized successfully.',
      syncedAppsCount: Array.isArray(apps) ? apps.length : 0,
      timestamp: new Date().toISOString(),
    });
  }

  public static async getAppUsage(_req: Request, res: Response) {
    res.status(200).json({
      success: true,
      data: [
        { packageName: 'com.instagram.android', appName: 'Instagram', minutes: 28, isDistracting: true },
        { packageName: 'com.google.android.youtube', appName: 'YouTube', minutes: 22, isDistracting: true },
        { packageName: 'org.coursera.android', appName: 'Coursera', minutes: 45, isDistracting: false },
        { packageName: 'com.duolingo', appName: 'Duolingo', minutes: 15, isDistracting: false },
        { packageName: 'com.whatsapp', appName: 'WhatsApp', minutes: 18, isDistracting: false },
      ],
      meta: { source: 'Android UsageStatsManager' },
    });
  }

  public static async syncReels(req: AuthenticatedRequest, res: Response) {
    const { platform, estimatedTransitions, durationSeconds } = req.body;
    res.status(200).json({
      success: true,
      message: 'Mobile reels transitions from ReelAccessibilityService synchronized.',
      platform: platform || 'INSTAGRAM_REELS',
      estimatedTransitions: estimatedTransitions || 1,
      durationSeconds: durationSeconds || 60,
    });
  }
}
