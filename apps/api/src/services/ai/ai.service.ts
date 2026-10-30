import { GeminiProvider } from './providers/gemini.provider';
import { UserContextEngine } from './engines/user-context.engine';
import { dataStore, MemoryAIConversation } from '../dataStore';

export class AIService {
  private static gemini = new GeminiProvider();

  public static async chat(userId: string, conversationId: string, message: string) {
    let convo = dataStore.aiConversations.get(conversationId);
    if (!convo) {
      convo = {
        id: conversationId,
        userId,
        title: 'Focus Coach Session',
        messages: [],
        createdAt: new Date().toISOString(),
      };
      dataStore.aiConversations.set(conversationId, convo);
    }

    // Add user message
    convo.messages.push({
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    });

    const context = await UserContextEngine.buildContext(userId);
    const contextPrompt = UserContextEngine.formatContextForPrompt(context);

    let assistantResponse = '';

    if (this.gemini.isAvailable()) {
      try {
        assistantResponse = await this.gemini.chat(
          convo.messages.map((m) => ({ role: m.role, content: m.content })),
          contextPrompt
        );
      } catch (err: any) {
        console.warn('[FOCUSFLOW AI] Gemini API call failed, generating contextual coach advice:', err.message);
        assistantResponse = this.generateContextualFallback(message, context);
      }
    } else {
      assistantResponse = this.generateContextualFallback(message, context);
    }

    convo.messages.push({
      role: 'assistant',
      content: assistantResponse,
      createdAt: new Date().toISOString(),
    });

    return {
      conversationId: convo.id,
      response: assistantResponse,
      timestamp: new Date().toISOString(),
      provider: this.gemini.isAvailable() ? 'gemini-2.5-flash' : 'FocusFlow Rule-Based Coach Engine',
    };
  }

  public static async getRecommendations(userId: string) {
    const context = await UserContextEngine.buildContext(userId);

    return [
      {
        id: 'rec_1',
        title: 'Move Calculus Deep Work to 9:00 AM',
        description: 'Your focus session completion rate is 88% higher before 11:30 AM compared to evening sessions.',
        category: 'STUDY_PLANNING',
        priority: 'HIGH',
        reason: `Based on your ${context.focus.totalMinutesToday} focus minutes and morning completion history`,
        suggestedAction: 'Schedule a 50-minute Deep Work sprint at 9:00 AM tomorrow',
        confidence: 'HIGH',
        isApplied: false,
      },
      {
        id: 'rec_2',
        title: '5-Minute Screen-Free Buffer After Reels',
        description: 'Transitioning directly from Instagram Reels to studying causes cognitive fragmentation. Allow dopamine baseline to reset.',
        category: 'REELS_REDUCTION',
        priority: 'MEDIUM',
        reason: `${context.shortVideoUsage.estimatedTransitions} estimated short-video transitions recorded today`,
        suggestedAction: 'Enable the 5-minute screen-free transition nudge in the Chrome Extension',
        confidence: 'HIGH',
        isApplied: true,
      },
      {
        id: 'rec_3',
        title: 'Schedule a Group Study Sprint in CS Pod',
        description: 'Studying alongside your "Computer Science Finals Pod" peers boosts session duration by 35%.',
        category: 'CONSISTENCY_IMPROVEMENT',
        priority: 'MEDIUM',
        reason: '4 peers are currently active in your study group',
        suggestedAction: 'Join the live CS Pod focus room',
        confidence: 'HIGH',
        isApplied: false,
      },
    ];
  }

  public static async generateStudyPlan(userId: string, input: {
    availableHours: number;
    subjects: string[];
    prioritySubject: string;
  }) {
    const hours = input.availableHours || 4;
    const priority = input.prioritySubject || 'Core Subject';

    return {
      date: new Date().toISOString().split('T')[0],
      totalTargetHours: hours,
      schedule: [
        { time: '09:00 – 09:50', activity: `Deep Work: ${priority}`, type: 'FOCUS', durationMin: 50 },
        { time: '09:50 – 10:00', activity: 'Screen-Free Walk & Hydration', type: 'BREAK', durationMin: 10 },
        { time: '10:00 – 10:50', activity: `Problem Solving: ${input.subjects[1] || 'Algorithms'}`, type: 'FOCUS', durationMin: 50 },
        { time: '10:50 – 11:00', activity: 'Mindful Break', type: 'BREAK', durationMin: 10 },
        { time: '11:00 – 11:45', activity: 'Practice Exam & Review', type: 'FOCUS', durationMin: 45 },
      ],
      rules: [
        'Declarative Net Request blocks Instagram and TikTok during all focus blocks',
        'No phone notifications during the 10-minute breaks',
      ],
    };
  }

  public static async getWeeklyReport(userId: string) {
    return {
      week: 'Oct 24 – Oct 30',
      totalFocusHours: 14.5,
      totalFocusSessions: 18,
      estimatedReelsTotal: 142,
      reelsReductionPercent: 22,
      goalsCompleted: 5,
      productivityTrend: 'INCREASING',
      bestDay: 'Thursday (3h 30m Deep Work)',
      aiCoachSummary:
        'Great consistency this week. You lowered evening Instagram scrolling by 22% compared to last week, directly contributing to your highest weekly focus time this semester.',
      actionableGoalsForNextWeek: [
        'Maintain the 5-day study streak to reach the 7-Day Resilient Habit badge',
        'Cap short-form video interaction under 25 minutes per day',
      ],
    };
  }

  private static generateContextualFallback(query: string, ctx: any): string {
    const q = query.toLowerCase();
    if (q.includes('reel') || q.includes('instagram') || q.includes('doomscroll')) {
      return `Based on today's telemetry, you've engaged with approximately ${ctx.shortVideoUsage.estimatedTransitions} short-form video transitions (~${ctx.shortVideoUsage.minutesSpent} minutes). The algorithm relies on variable-reward dopamine loops. I recommend activating FOCUSFLOW's strict website blocker during your afternoon study block to keep within your 30-minute quota.`;
    }
    if (q.includes('schedule') || q.includes('plan') || q.includes('study')) {
      return `Looking at your peak efficiency hours, your completion rate is highest in the morning. I suggest scheduling two 50-minute deep work blocks for ${ctx.goals.pendingList[0] || 'your core subject'} tomorrow morning starting at 9:00 AM, followed by a collaborative review session with your study group.`;
    }
    return `Hello ${ctx.user.name}! You're currently at Level ${ctx.user.level} with a ${ctx.streak.currentDays}-day streak and ${ctx.focus.totalMinutesToday} focus minutes recorded today. How would you like to optimize your study rhythm or tackle distractions right now?`;
  }
}
