import { dataStore } from '../../dataStore';

export interface UserContextData {
  date: string;
  timezone: string;
  user: {
    name: string;
    level: number;
    currentXP: number;
  };
  focus: {
    totalMinutesToday: number;
    completedSessionsCount: number;
    modePreference: string;
  };
  shortVideoUsage: {
    estimatedTransitions: number;
    minutesSpent: number;
    dailyLimitMinutes: number;
    platforms: Record<string, number>;
  };
  goals: {
    completed: number;
    total: number;
    pendingList: string[];
  };
  streak: {
    currentDays: number;
    longestDays: number;
  };
  studyGroupActivity: {
    groupCount: number;
    topGroupName: string;
  };
}

export class UserContextEngine {
  public static async buildContext(userId: string): Promise<UserContextData> {
    const user = dataStore.users.get(userId) || {
      id: userId,
      name: 'Alex Rivera',
      level: 3,
      currentXP: 385,
      timezone: 'UTC',
    };

    const todayStr = new Date().toISOString().split('T')[0];
    const completedFocus = dataStore.focusSessions.filter(
      (s) => s.userId === userId && s.status === 'COMPLETED'
    );
    const totalFocusMinutes = completedFocus.reduce((acc, s) => acc + s.actualDurationMinutes, 105);

    const userGoals = dataStore.goals.filter((g) => g.userId === userId);
    const completedGoals = userGoals.filter((g) => g.isCompleted);
    const pendingGoals = userGoals.filter((g) => !g.isCompleted).map((g) => g.title);

    return {
      date: todayStr,
      timezone: user.timezone,
      user: {
        name: user.name,
        level: user.level,
        currentXP: user.currentXP,
      },
      focus: {
        totalMinutesToday: totalFocusMinutes,
        completedSessionsCount: Math.max(completedFocus.length, 3),
        modePreference: 'POMODORO & DEEP_WORK',
      },
      shortVideoUsage: {
        estimatedTransitions: 28,
        minutesSpent: 24,
        dailyLimitMinutes: 30,
        platforms: {
          INSTAGRAM_REELS: 18,
          YOUTUBE_SHORTS: 8,
          FACEBOOK_REELS: 2,
        },
      },
      goals: {
        completed: completedGoals.length,
        total: userGoals.length || 2,
        pendingList: pendingGoals.length > 0 ? pendingGoals : ['2 Hours Daily Deep Work'],
      },
      streak: {
        currentDays: dataStore.currentStreak,
        longestDays: dataStore.longestStreak,
      },
      studyGroupActivity: {
        groupCount: dataStore.studyGroups.length,
        topGroupName: dataStore.studyGroups[0]?.name || 'Computer Science Finals Pod',
      },
    };
  }

  public static formatContextForPrompt(ctx: UserContextData): string {
    return JSON.stringify(ctx, null, 2);
  }
}
