import { Request, Response } from 'express';

export class HealthController {
  public static getHealth(_req: Request, res: Response): void {
    res.status(200).json({
      success: true,
      message: 'FOCUSFLOW API is running',
    });
  }

  public static getSystemDiagnostics(_req: Request, res: Response): void {
    res.status(200).json({
      success: true,
      message: 'FOCUSFLOW API is running',
      environment: process.env.NODE_ENV || 'development',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      modules: {
        database: 'PostgreSQL + Prisma configured',
        extensionBridge: 'Manifest V3 sync ready',
        aiCoach: 'Gemini / LLM pipeline configured',
      },
    });
  }
}
