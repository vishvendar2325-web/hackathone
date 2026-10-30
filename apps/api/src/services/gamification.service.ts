import { dataStore } from './dataStore';

export const LEVEL_THRESHOLDS = [
  { level: 1, name: 'Beginner', minXP: 0 },
  { level: 2, name: 'Focus Explorer', minXP: 100 },
  { level: 3, name: 'Consistency Builder', minXP: 250 },
  { level: 4, name: 'Deep Worker', minXP: 500 },
  { level: 5, name: 'Productivity Pro', minXP: 1000 },
  { level: 6, name: 'Focus Master', minXP: 2000 },
  { level: 7, name: 'Discipline Champion', minXP: 3500 },
  { level: 8, name: 'Productivity Legend', minXP: 5000 },
];

export function calculateLevel(totalXP: number): {
  level: number;
  name: string;
  currentLevelXP: number;
  nextLevelXP: number;
  progressPercent: number;
} {
  let current = LEVEL_THRESHOLDS[0];
  let next = LEVEL_THRESHOLDS[1];

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i].minXP) {
      current = LEVEL_THRESHOLDS[i];
      next = LEVEL_THRESHOLDS[i + 1] || { level: 8, name: 'Productivity Legend', minXP: 5000 };
      break;
    }
  }

  const range = next.minXP - current.minXP;
  const progress = range > 0 ? Math.min(100, Math.floor(((totalXP - current.minXP) / range) * 100)) : 100;

  return {
    level: current.level,
    name: current.name,
    currentLevelXP: current.minXP,
    nextLevelXP: next.minXP,
    progressPercent: progress,
  };
}

export class GamificationService {
  public static awardXP(
    userId: string,
    amount: number,
    source: string,
    referenceId: string,
    description: string
  ): { xpAwarded: number; newTotalXP: number; levelUp: boolean; newLevel: number } {
    // Anti-duplicate protection: check referenceId
    if (referenceId) {
      const alreadyAwarded = dataStore.xpTransactions.some(
        (t) => t.userId === userId && t.referenceId === referenceId
      );
      if (alreadyAwarded) {
        const user = dataStore.users.get(userId);
        return {
          xpAwarded: 0,
          newTotalXP: user?.currentXP || 0,
          levelUp: false,
          newLevel: user?.level || 1,
        };
      }
    }

    const user = dataStore.users.get(userId);
    const oldLevel = user?.level || 1;
    const oldXP = user?.currentXP || 0;
    const newXP = oldXP + amount;
    const levelInfo = calculateLevel(newXP);

    if (user) {
      user.currentXP = newXP;
      user.level = levelInfo.level;
    }

    dataStore.xpTransactions.unshift({
      id: `xp_${Date.now()}`,
      userId,
      amount,
      source,
      referenceId,
      description,
      createdAt: new Date().toISOString(),
    });

    const levelUp = levelInfo.level > oldLevel;
    if (levelUp) {
      dataStore.notifications.unshift({
        id: `notif_${Date.now()}`,
        userId,
        title: `Level Up! Unlocked ${levelInfo.name} 🏆`,
        message: `You reached Level ${levelInfo.level} with ${newXP} lifetime XP.`,
        type: 'XP',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    return {
      xpAwarded: amount,
      newTotalXP: newXP,
      levelUp,
      newLevel: levelInfo.level,
    };
  }

  public static getProfile(userId: string) {
    const user = dataStore.users.get(userId) || {
      id: userId,
      name: 'Alex Rivera',
      currentXP: 385,
      level: 3,
    };

    const levelInfo = calculateLevel(user.currentXP);
    const streak = dataStore.currentStreak;
    const longestStreak = dataStore.longestStreak;
    const unlockedBadges = dataStore.achievements.filter((a) => !!a.unlockedAt);

    return {
      userId,
      name: user.name,
      currentXP: user.currentXP,
      level: levelInfo.level,
      levelName: levelInfo.name,
      nextLevelXP: levelInfo.nextLevelXP,
      progressPercent: levelInfo.progressPercent,
      streakDays: streak,
      longestStreakDays: longestStreak,
      unlockedBadgesCount: unlockedBadges.length,
      totalBadgesCount: dataStore.achievements.length,
    };
  }

  public static getAchievements() {
    return dataStore.achievements;
  }

  public static getChallenges() {
    return dataStore.challenges;
  }

  public static getStreaks(userId: string) {
    const calendar: Array<{ date: string; isCompleted: boolean; minutes: number }> = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      calendar.push({
        date: dateStr,
        isCompleted: i <= dataStore.currentStreak,
        minutes: i <= dataStore.currentStreak ? 60 + (i * 15) : 0,
      });
    }

    return {
      userId,
      currentStreak: dataStore.currentStreak,
      longestStreak: dataStore.longestStreak,
      calendar,
    };
  }

  public static getLeaderboards(type: 'global' | 'friends' | 'groups') {
    if (type === 'friends') {
      return [
        { rank: 1, name: 'Priya Sharma', username: 'priya_mcat', xp: 520, streak: 9, hours: 22 },
        { rank: 2, name: 'Alex Rivera (You)', username: 'alex_rivera', xp: 385, streak: 5, hours: 18 },
        { rank: 3, name: 'Rahul Verma', username: 'rahul_codes', xp: 310, streak: 4, hours: 14 },
        { rank: 4, name: 'Sarah Chen', username: 'sarah_premed', xp: 260, streak: 3, hours: 11 },
      ];
    }
    if (type === 'groups') {
      return [
        { rank: 1, name: 'Pre-Med MCAT Study Circle', members: 5, totalHours: 68, activeStreak: 14 },
        { rank: 2, name: 'Computer Science Finals Pod', members: 8, totalHours: 42, activeStreak: 8 },
        { rank: 3, name: 'GATE 2027 Aspirants', members: 12, totalHours: 35, activeStreak: 6 },
      ];
    }
    return [
      { rank: 1, name: 'Devon Vance', username: 'devon_v', xp: 2450, level: 6, streak: 34 },
      { rank: 2, name: 'Aarav Mehta', username: 'aarav_m', xp: 1890, level: 5, streak: 28 },
      { rank: 3, name: 'Elena Rostova', username: 'elena_r', xp: 1420, level: 5, streak: 19 },
      { rank: 4, name: 'Alex Rivera (You)', username: 'alex_rivera', xp: 385, level: 3, streak: 5 },
      { rank: 5, name: 'Maya Lin', username: 'maya_lin', xp: 340, level: 3, streak: 4 },
    ];
  }
}
