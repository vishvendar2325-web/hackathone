import { Request, Response } from 'express';
import { FocusService } from '../services/focus.service';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class FocusController {
  public static async start(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId || 'student_alex_rivera';
      const session = await FocusService.startSession(userId, req.body);
      res.status(201).json({ success: true, message: 'Focus session started', data: session });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  public static async pause(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId || 'student_alex_rivera';
      const session = await FocusService.pauseSession(userId, req.body.sessionId);
      res.status(200).json({ success: true, message: 'Focus session paused', data: session });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  public static async resume(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId || 'student_alex_rivera';
      const session = await FocusService.resumeSession(userId, req.body.sessionId);
      res.status(200).json({ success: true, message: 'Focus session resumed', data: session });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  public static async complete(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId || 'student_alex_rivera';
      const session = await FocusService.completeSession(userId, req.body.sessionId, req.body.actualMinutes);
      res.status(200).json({ success: true, message: 'Focus session completed and XP awarded', data: session });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  public static async cancel(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId || 'student_alex_rivera';
      const session = await FocusService.cancelSession(userId, req.body.sessionId);
      res.status(200).json({ success: true, message: 'Focus session cancelled', data: session });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  public static async today(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId || 'student_alex_rivera';
    const data = await FocusService.getToday(userId);
    res.status(200).json({ success: true, data });
  }

  public static async history(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId || 'student_alex_rivera';
    const data = await FocusService.getHistory(userId);
    res.status(200).json({ success: true, data });
  }
}
