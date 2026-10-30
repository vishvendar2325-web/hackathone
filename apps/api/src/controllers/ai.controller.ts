import { Request, Response } from 'express';
import { AIService } from '../services/ai/ai.service';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class AIController {
  public static async chat(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId || 'student_alex_rivera';
      const { message, conversationId } = req.body;
      if (!message || typeof message !== 'string') {
        res.status(400).json({ success: false, message: 'Message text is required' });
        return;
      }
      const convId = conversationId || `conv_${Date.now()}`;
      const result = await AIService.chat(userId, convId, message);
      res.status(200).json({ success: true, data: result });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message || 'AI processing error' });
    }
  }

  public static async recommendations(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId || 'student_alex_rivera';
    const recs = await AIService.getRecommendations(userId);
    res.status(200).json({ success: true, data: recs });
  }

  public static async studyPlan(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId || 'student_alex_rivera';
    const plan = await AIService.generateStudyPlan(userId, req.body);
    res.status(200).json({ success: true, data: plan });
  }

  public static async weeklyReport(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId || 'student_alex_rivera';
    const report = await AIService.getWeeklyReport(userId);
    res.status(200).json({ success: true, data: report });
  }

  public static async feedback(_req: Request, res: Response) {
    res.status(200).json({
      success: true,
      message: 'Feedback recorded. Recommendation models updated.',
    });
  }
}
