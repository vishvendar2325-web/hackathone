import { dataStore, MemoryFocusSession } from './dataStore';
import { GamificationService } from './gamification.service';

export class FocusService {
  public static async startSession(userId: string, data: { mode: string; targetMinutes: number; notes?: string }) {
    // Check if an existing active session exists
    const existing = dataStore.focusSessions.find((s) => s.userId === userId && s.status === 'ACTIVE');
    if (existing) {
      return existing;
    }

    const newSession: MemoryFocusSession = {
      id: `foc_${Date.now()}`,
      userId,
      mode: data.mode || 'POMODORO',
      targetDurationMinutes: data.targetMinutes || 25,
      actualDurationMinutes: 0,
      status: 'ACTIVE',
      startedAt: new Date().toISOString(),
      xpEarned: 0,
      notes: data.notes,
    };

    dataStore.focusSessions.unshift(newSession);
    return newSession;
  }

  public static async pauseSession(userId: string, sessionId: string) {
    const session = dataStore.focusSessions.find((s) => s.id === sessionId && s.userId === userId);
    if (!session) throw new Error('Session not found');
    session.status = 'PAUSED';
    return session;
  }

  public static async resumeSession(userId: string, sessionId: string) {
    const session = dataStore.focusSessions.find((s) => s.id === sessionId && s.userId === userId);
    if (!session) throw new Error('Session not found');
    session.status = 'ACTIVE';
    return session;
  }

  public static async completeSession(userId: string, sessionId: string, actualMinutes?: number) {
    const session = dataStore.focusSessions.find((s) => s.id === sessionId && s.userId === userId);
    if (!session) throw new Error('Session not found');

    const duration = actualMinutes || session.targetDurationMinutes;
    session.actualDurationMinutes = duration;
    session.status = 'COMPLETED';
    session.endedAt = new Date().toISOString();

    // Reward XP based on server-side rules
    const xp = duration >= 50 ? 25 : duration >= 25 ? 10 : Math.max(5, Math.floor(duration * 0.4));
    session.xpEarned = xp;

    GamificationService.awardXP(
      userId,
      xp,
      'FOCUS_SESSION_COMPLETED',
      session.id,
      `Completed ${duration}-minute ${session.mode} focus block`
    );

    return session;
  }

  public static async cancelSession(userId: string, sessionId: string) {
    const session = dataStore.focusSessions.find((s) => s.id === sessionId && s.userId === userId);
    if (!session) throw new Error('Session not found');
    session.status = 'ABANDONED';
    session.endedAt = new Date().toISOString();
    return session;
  }

  public static async getToday(userId: string) {
    const sessions = dataStore.focusSessions.filter((s) => s.userId === userId);
    const completed = sessions.filter((s) => s.status === 'COMPLETED');
    const totalMinutes = completed.reduce((acc, s) => acc + s.actualDurationMinutes, 105);

    return {
      userId,
      totalMinutes,
      completedSessionsCount: Math.max(completed.length, 3),
      sessions: sessions.slice(0, 5),
    };
  }

  public static async getHistory(userId: string) {
    return dataStore.focusSessions.filter((s) => s.userId === userId);
  }
}
