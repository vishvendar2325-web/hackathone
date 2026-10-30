/**
 * FOCUSFLOW - Shared Domain Types
 * Single source of truth for frontend, backend API, and Chrome extension.
 */

// User & Role
export type UserRole = 'STUDENT' | 'PARENT' | 'COUNSELLOR' | 'ADMIN';
export type EducationLevel = 'SCHOOL' | 'COLLEGE' | 'UNIVERSITY' | 'SELF_STUDY';

export interface UserSummary {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  institution?: string;
  gradeLevel?: string;
  dailyFocusTargetMinutes: number;
  dailyReelsLimitMinutes: number;
  allowParentConsent: boolean;
  allowCounsellorConsent: boolean;
  timezone: string;
}

// Device & Extension Sync
export type DeviceType = 'CHROME_EXTENSION' | 'DESKTOP_WEB' | 'MOBILE_PWA';

export interface DeviceInfo {
  id: string;
  userId: string;
  deviceType: DeviceType;
  browser: string;
  extensionVersion?: string;
  lastSyncAt: string;
}

// Focus & Timer
export type FocusSessionMode = 'POMODORO' | 'DEEP_WORK' | 'EXAM_PREP' | 'QUICK_SPRINT';
export type FocusSessionStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ABANDONED';

export interface FocusSession {
  id: string;
  userId: string;
  mode: FocusSessionMode;
  targetDurationMinutes: number;
  actualDurationMinutes: number;
  startedAt: string;
  endedAt?: string;
  status: FocusSessionStatus;
  notes?: string;
  xpEarned: number;
}

// Short-form Video & Reels Tracking
export type ShortFormPlatform = 'INSTAGRAM_REELS' | 'YOUTUBE_SHORTS' | 'FACEBOOK_REELS' | 'TIKTOK';

export interface ReelDailyStat {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  platform: ShortFormPlatform;
  estimatedCount: number;
  timeSpentSeconds: number;
  scrollBurstsCount: number; // rapid swipe sequences
  interventionsShown: number;
  interventionsRespected: number;
}

// Website Blocker
export interface BlockedWebsite {
  id: string;
  userId: string;
  domain: string;
  category: 'SOCIAL_MEDIA' | 'GAMING' | 'ENTERTAINMENT' | 'CUSTOM';
  isEnabled: boolean;
  strictMode: boolean; // Cannot bypass during active focus session
  redirectUrl?: string;
}

// AI Focus Coach Recommendations
export type AIRecommendationCategory = 'REELS_FATIGUE' | 'HABIT_ROUTINE' | 'STUDY_BURNOUT' | 'PEAK_HOURS' | 'EXAM_STRATEGY';

export interface AIRecommendation {
  id: string;
  userId: string;
  category: AIRecommendationCategory;
  title: string;
  content: string;
  actionableSteps: string[];
  severity: 'INFO' | 'MODERATE' | 'CRITICAL';
  createdAt: string;
  isApplied: boolean;
}

// Gamification: XP & Streaks
export interface XPTransaction {
  id: string;
  userId: string;
  amount: number;
  source: 'FOCUS_SESSION_COMPLETED' | 'REEL_LIMIT_RESPECTED' | 'DAILY_STREAK' | 'CHALLENGE_WON';
  description: string;
  createdAt: string;
}

export interface StreakInfo {
  id: string;
  userId: string;
  currentStreakDays: number;
  longestStreakDays: number;
  lastActiveDate: string;
}

// Study Groups
export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  inviteCode: string;
  memberCount: number;
  createdById: string;
  totalGroupFocusMinutes: number;
}

// Privacy & Consent
export interface PrivacyConsent {
  id: string;
  userId: string;
  hasConsentedTracking: boolean;
  hasConsentedAnonymousAnalytics: boolean;
  allowParentalViewing: boolean;
  allowCounsellorViewing: boolean;
  consentTimestamp: string;
  ipHash?: string;
}

// Standard API Response Structure
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    details?: unknown;
  };
}

export interface HealthCheckResponse {
  success: true;
  message: string;
  version?: string;
  timestamp?: string;
  uptime?: number;
}
