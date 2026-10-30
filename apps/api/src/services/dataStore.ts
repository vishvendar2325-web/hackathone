import bcrypt from 'bcryptjs';

export interface MemoryUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'STUDENT' | 'ADMIN';
  currentXP: number;
  level: number;
  createdAt: string;
  timezone: string;
}

export interface MemoryFocusSession {
  id: string;
  userId: string;
  mode: string;
  targetDurationMinutes: number;
  actualDurationMinutes: number;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ABANDONED';
  startedAt: string;
  endedAt?: string;
  xpEarned: number;
  notes?: string;
}

export interface MemoryReelDailyStat {
  id: string;
  userId: string;
  date: string;
  platform: string;
  estimatedCount: number;
  timeSpentSeconds: number;
  scrollBurstsCount: number;
  interventionsShown: number;
  interventionsRespected: number;
}

export interface MemoryGoal {
  id: string;
  userId: string;
  title: string;
  targetMinutes: number;
  currentMinutes: number;
  targetDate: string;
  isCompleted: boolean;
}

export interface MemoryBlockedWebsite {
  id: string;
  userId: string;
  domain: string;
  category: string;
  isEnabled: boolean;
  strictMode: boolean;
}

export interface MemoryXPTransaction {
  id: string;
  userId: string;
  amount: number;
  source: string;
  referenceId?: string;
  description: string;
  createdAt: string;
}

export interface MemoryAchievement {
  id: string;
  key: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  xpReward: number;
  rarity: string;
  unlockedAt?: string;
}

export interface MemoryChallenge {
  id: string;
  title: string;
  description: string;
  type: 'DAILY' | 'WEEKLY';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  targetType: string;
  targetValue: number;
  currentProgress: number;
  xpReward: number;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
}

export interface MemoryStudyGroup {
  id: string;
  name: string;
  description: string;
  inviteCode: string;
  isPrivate: boolean;
  createdById: string;
  memberCount: number;
  totalGroupFocusMinutes: number;
  activeNowCount: number;
}

export interface MemoryNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface MemoryAIConversation {
  id: string;
  userId: string;
  title: string;
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string; createdAt: string }>;
  createdAt: string;
}

// Initial default seed achievements
const SEED_ACHIEVEMENTS: MemoryAchievement[] = [
  {
    id: 'ach_1',
    key: 'FIRST_FOCUS_SESSION',
    title: 'First Step',
    description: 'Completed your first 25-minute deep focus block',
    category: 'FOCUS',
    icon: '⚡',
    xpReward: 25,
    rarity: 'COMMON',
    unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ach_2',
    key: 'DEEP_WORK_CHAMPION',
    title: 'Deep Worker',
    description: 'Completed a full 50-minute uninterrupted study block',
    category: 'FOCUS',
    icon: '🎯',
    xpReward: 50,
    rarity: 'RARE',
    unlockedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'ach_3',
    key: 'THREE_DAY_STREAK',
    title: 'Consistency Starter',
    description: 'Maintained a verified 3-day active study streak',
    category: 'CONSISTENCY',
    icon: '🔥',
    xpReward: 50,
    rarity: 'COMMON',
    unlockedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'ach_4',
    key: 'SEVEN_DAY_STREAK',
    title: 'Resilient Habit',
    description: 'Achieved a consecutive 7-day study flow',
    category: 'CONSISTENCY',
    icon: '🏆',
    xpReward: 100,
    rarity: 'EPIC',
  },
  {
    id: 'ach_5',
    key: 'REELS_REDUCER',
    title: 'Algorithm Tamer',
    description: 'Kept daily estimated Reels under your 30-minute target',
    category: 'WELLBEING',
    icon: '🛡️',
    xpReward: 40,
    rarity: 'RARE',
    unlockedAt: new Date().toISOString(),
  },
  {
    id: 'ach_6',
    key: 'STUDY_POD_PIONEER',
    title: 'Team Player',
    description: 'Joined an accountability study group',
    category: 'SOCIAL',
    icon: '👥',
    xpReward: 30,
    rarity: 'COMMON',
    unlockedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

const SEED_CHALLENGES: MemoryChallenge[] = [
  {
    id: 'ch_1',
    title: '2 Focus Sessions Sprint',
    description: 'Complete two verified 25-minute study sessions today',
    type: 'DAILY',
    difficulty: 'EASY',
    targetType: 'FOCUS_SESSIONS',
    targetValue: 2,
    currentProgress: 1,
    xpReward: 20,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    isCompleted: false,
  },
  {
    id: 'ch_2',
    title: 'Curb Doomscrolling Below 30m',
    description: 'Keep total estimated short-form video interactions under 30 minutes',
    type: 'DAILY',
    difficulty: 'MEDIUM',
    targetType: 'REELS_LIMIT',
    targetValue: 30,
    currentProgress: 24,
    xpReward: 25,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    isCompleted: false,
  },
  {
    id: 'ch_3',
    title: '10 Hours Weekly Deep Work',
    description: 'Accumulate 600 minutes of deep focus throughout the week',
    type: 'WEEKLY',
    difficulty: 'HARD',
    targetType: 'WEEKLY_MINUTES',
    targetValue: 600,
    currentProgress: 420,
    xpReward: 100,
    startDate: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    isCompleted: false,
  },
];

class FocusFlowDataStore {
  public users: Map<string, MemoryUser> = new Map();
  public focusSessions: MemoryFocusSession[] = [];
  public reelDailyStats: MemoryReelDailyStat[] = [];
  public goals: MemoryGoal[] = [];
  public blockedWebsites: MemoryBlockedWebsite[] = [];
  public xpTransactions: MemoryXPTransaction[] = [];
  public achievements: MemoryAchievement[] = [...SEED_ACHIEVEMENTS];
  public challenges: MemoryChallenge[] = [...SEED_CHALLENGES];
  public studyGroups: MemoryStudyGroup[] = [];
  public notifications: MemoryNotification[] = [];
  public aiConversations: Map<string, MemoryAIConversation> = new Map();
  public currentStreak = 5;
  public longestStreak = 12;

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    // Seed default student user
    const defaultUserId = 'student_alex_rivera';
    const hash = bcrypt.hashSync('FocusFlow2026!', 10);
    this.users.set(defaultUserId, {
      id: defaultUserId,
      email: 'student@university.edu',
      passwordHash: hash,
      name: 'Alex Rivera',
      role: 'STUDENT',
      currentXP: 385,
      level: 3, // Level 3: Consistency Builder
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      timezone: 'UTC',
    });

    // Seed goals
    this.goals.push(
      {
        id: 'goal_1',
        userId: defaultUserId,
        title: '2 Hours Daily Deep Work',
        targetMinutes: 120,
        currentMinutes: 105,
        targetDate: new Date().toISOString().split('T')[0],
        isCompleted: false,
      },
      {
        id: 'goal_2',
        userId: defaultUserId,
        title: 'Keep Reels Under 30 Mins Daily',
        targetMinutes: 30,
        currentMinutes: 24,
        targetDate: new Date().toISOString().split('T')[0],
        isCompleted: false,
      }
    );

    // Seed Blocked Websites
    this.blockedWebsites.push(
      { id: 'b_1', userId: defaultUserId, domain: 'instagram.com', category: 'SOCIAL_MEDIA', isEnabled: true, strictMode: true },
      { id: 'b_2', userId: defaultUserId, domain: 'tiktok.com', category: 'SOCIAL_MEDIA', isEnabled: true, strictMode: true },
      { id: 'b_3', userId: defaultUserId, domain: 'netflix.com', category: 'ENTERTAINMENT', isEnabled: true, strictMode: false }
    );

    // Seed Study Groups
    this.studyGroups.push(
      {
        id: 'grp_1',
        name: 'Computer Science Finals Pod',
        description: 'Daily Pomodoros and shared accountability for Distributed Systems and Algorithms.',
        inviteCode: 'CS-FINAL-99',
        isPrivate: false,
        createdById: defaultUserId,
        memberCount: 8,
        totalGroupFocusMinutes: 2520,
        activeNowCount: 4,
      },
      {
        id: 'grp_2',
        name: 'Pre-Med MCAT Study Circle',
        description: 'Zero-distraction biology review blocks. Strict Reels limits enforced.',
        inviteCode: 'MED-MCAT-24',
        isPrivate: false,
        createdById: 'user_sarah',
        memberCount: 5,
        totalGroupFocusMinutes: 4080,
        activeNowCount: 2,
      }
    );

    // Seed Notifications
    this.notifications.push(
      {
        id: 'n_1',
        userId: defaultUserId,
        title: 'Level 3 Unlocked!',
        message: 'Congratulations! You reached Level 3: Consistency Builder.',
        type: 'XP',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'n_2',
        userId: defaultUserId,
        title: 'Streak Milestone 🔥',
        message: '5-day study streak maintained! +25 XP awarded.',
        type: 'STREAK',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      }
    );
  }
}

export const dataStore = new FocusFlowDataStore();
