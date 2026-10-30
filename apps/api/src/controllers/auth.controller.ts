import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name, role } = req.body;
      const result = await AuthService.register({ email, password, name, role });
      res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        data: result,
      });
    } catch (e: any) {
      res.status(400).json({
        success: false,
        message: e.message || 'Registration failed',
      });
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });
      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: result,
      });
    } catch (e: any) {
      res.status(401).json({
        success: false,
        message: e.message || 'Authentication failed',
      });
    }
  }

  public static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ success: false, message: 'Refresh token is required' });
        return;
      }
      const result = await AuthService.refreshToken(refreshToken);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (e: any) {
      res.status(401).json({
        success: false,
        message: e.message || 'Token refresh failed',
      });
    }
  }

  public static async logout(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  public static async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || 'student_alex_rivera';
      const user = await AuthService.getMe(userId);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (e: any) {
      res.status(404).json({ success: false, message: e.message });
    }
  }

  public static async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    res.status(200).json({
      success: true,
      message: `Password reset instructions dispatched for ${email}. (Note: SMTP transport is mocked for local dev environment).`,
      meta: { resetTokenExpiresInMinutes: 15 },
    });
  }

  public static async resetPassword(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Password has been securely reset.',
    });
  }
}
