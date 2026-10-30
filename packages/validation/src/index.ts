import { z } from 'zod';

// Authentication
export const RegisterSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['STUDENT', 'PARENT', 'COUNSELLOR', 'ADMIN']).default('STUDENT'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Focus Sessions
export const StartFocusSessionSchema = z.object({
  mode: z.enum(['POMODORO', 'DEEP_WORK', 'EXAM_PREP', 'QUICK_SPRINT']),
  targetDurationMinutes: z.number().int().min(5).max(360),
  notes: z.string().max(500).optional(),
});

export const CompleteFocusSessionSchema = z.object({
  sessionId: z.string().uuid(),
  actualDurationMinutes: z.number().int().min(1),
  status: z.enum(['COMPLETED', 'ABANDONED']),
  notes: z.string().max(500).optional(),
});

// Reel / Short-form Video Sync (from Extension)
export const SyncReelStatSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  platform: z.enum(['INSTAGRAM_REELS', 'YOUTUBE_SHORTS', 'FACEBOOK_REELS', 'TIKTOK']),
  estimatedCount: z.number().int().min(0).max(10000),
  timeSpentSeconds: z.number().int().min(0).max(86400),
  scrollBurstsCount: z.number().int().min(0).default(0),
  interventionsShown: z.number().int().min(0).default(0),
  interventionsRespected: z.number().int().min(0).default(0),
});

// Website Blocker Rule
export const BlockWebsiteSchema = z.object({
  domain: z
    .string()
    .min(3)
    .max(253)
    .regex(/^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/, 'Must be a valid domain (e.g. instagram.com)'),
  category: z.enum(['SOCIAL_MEDIA', 'GAMING', 'ENTERTAINMENT', 'CUSTOM']).default('SOCIAL_MEDIA'),
  strictMode: z.boolean().default(false),
  redirectUrl: z.string().url().optional(),
});

// Privacy Consent Submission
export const PrivacyConsentSchema = z.object({
  hasConsentedTracking: z.boolean(),
  hasConsentedAnonymousAnalytics: z.boolean().default(false),
  allowParentalViewing: z.boolean().default(false),
  allowCounsellorViewing: z.boolean().default(false),
});
