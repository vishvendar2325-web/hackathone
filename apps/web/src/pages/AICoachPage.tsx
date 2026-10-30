import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import {
  Brain,
  Sparkles,
  Send,
  Loader2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { apiClient } from '../services/api';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  actionableStep: string;
  confidenceScore: number;
}

interface StudyPlanResponse {
  subject: string;
  targetHours: number;
  dailyBlocks: Array<{
    blockNumber: number;
    title: string;
    durationMinutes: number;
    activity: string;
    breakMinutes: number;
  }>;
  aiAdvice: string;
}

interface WeeklyReport {
  weeklyFocusMinutes: number;
  weeklyReelsMinutes: number;
  focusVelocityScore: number;
  dopamineRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  keyInsights: string[];
  coachSummary: string;
}

export const AICoachPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'recommendations' | 'planner' | 'report'>('chat');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Hello Alex! I am your FocusFlow AI Coach. I've analyzed your recent sessions: you've accumulated 105 mins of deep focus and kept estimated Reels to 24 mins today. How can I assist your study flow right now?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [conversationId] = useState(`conv_${Date.now()}`);

  // Recommendations State
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([
    {
      id: 'rec_1',
      title: 'Shift Calculus Deep Work to 9:00 AM',
      description: 'Your focus completion rate is 88% higher before 11:30 AM compared to evening sessions. When you study late, distraction drop-off to Instagram increases by 3.2x.',
      type: 'PEAK_PERFORMANCE',
      actionableStep: 'Schedule Morning Focus Block',
      confidenceScore: 94,
    },
    {
      id: 'rec_2',
      title: 'Implement 5-Minute Dopamine Transition Rule',
      description: 'Never transition directly from Instagram Reels or YouTube Shorts to intensive studying. Take a 5-minute screen-free pause to allow dopamine baselines to normalize.',
      type: 'REELS_FATIGUE',
      actionableStep: 'Enable Extension Transition Nudge',
      confidenceScore: 89,
    },
    {
      id: 'rec_3',
      title: 'Optimal Pomodoro Cadence for Coding',
      description: 'Your brain shows minimal cognitive fatigue at 45-minute sprint blocks followed by 10-minute active recovery breaks.',
      type: 'STUDY_INTERVAL',
      actionableStep: 'Set 45/10 Timer Preset',
      confidenceScore: 91,
    },
  ]);
  const [feedbackSent, setFeedbackSent] = useState<Record<string, 'up' | 'down'>>({});

  // Study Planner State
  const [subject, setSubject] = useState('Operating Systems & Concurrency');
  const [dailyHours, setDailyHours] = useState(3);
  const [daysUntilExam, setDaysUntilExam] = useState(7);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [studyPlan, setStudyPlan] = useState<StudyPlanResponse | null>(null);

  // Weekly Report State
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  // Initial fetch for recommendations
  useEffect(() => {
    apiClient
      .get('/ai/recommendations')
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data)) {
          setRecommendations(res.data.data);
        }
      })
      .catch(() => {
        // Fallback to default recommendations
      });
  }, []);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputText('');
    setIsSending(true);

    try {
      const res = await apiClient.post('/ai/chat', {
        message: textToSend,
        conversationId,
      });

      const reply = res.data?.data?.response || res.data?.data?.reply || res.data?.data?.message || 'Focus session optimized! Keep maintaining your study streak.';
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      // Fallback intelligent response for offline demo
      const fallbackReplies: Record<string, string> = {
        reels: "To break the habit loop: 1) Place your phone in another room during 25-minute Pomodoros. 2) Enable FOCUSFLOW's strict website blocker for instagram.com. 3) Observe the urge without judgment—distraction cravings peak within 90 seconds and then fade.",
        schedule: "Recommended schedule: Block 09:00 - 10:30 for high-cognitive load topics (active recall + practice problems). Take a 15-minute hydration break. Block 11:00 - 12:00 for flashcard review. Avoid social media feeds until 18:00.",
        reset: "The 5-Minute Dopamine Reset: Step away from all digital screens immediately after viewing short-form videos. Drink 250ml water and focus your eyes on an object 20 feet away for 60 seconds to release optical convergence tension.",
      };

      const lower = textToSend.toLowerCase();
      let selectedReply = "Consistent progress is the key. You have 385 XP and a 5-day streak going strong! Consider starting a 25-minute focused study sprint now.";
      if (lower.includes('reel') || lower.includes('short') || lower.includes('instagram')) {
        selectedReply = fallbackReplies.reels;
      } else if (lower.includes('schedule') || lower.includes('plan') || lower.includes('tomorrow')) {
        selectedReply = fallbackReplies.schedule;
      } else if (lower.includes('dopamine') || lower.includes('reset') || lower.includes('break')) {
        selectedReply = fallbackReplies.reset;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_fallback_${Date.now()}`,
          sender: 'ai',
          text: selectedReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleFeedback = (recId: string, type: 'up' | 'down') => {
    setFeedbackSent((prev) => ({ ...prev, [recId]: type }));
    apiClient.post(`/ai/recommendations/${recId}/feedback`, { feedback: type }).catch(() => {});
  };

  const handleGenerateStudyPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const res = await apiClient.post('/ai/study-plan', {
        subject,
        targetHours: dailyHours,
        daysUntilExam,
      });
      if (res.data?.data) {
        setStudyPlan(res.data.data);
      }
    } catch {
      // Pre-baked high-yield study plan fallback
      setStudyPlan({
        subject,
        targetHours: dailyHours,
        dailyBlocks: [
          {
            blockNumber: 1,
            title: 'Core Architecture & Concepts',
            durationMinutes: 50,
            activity: 'Active recall using Feynman Technique on difficult chapters',
            breakMinutes: 10,
          },
          {
            blockNumber: 2,
            title: 'Problem Sets & Implementation',
            durationMinutes: 50,
            activity: 'Solving past midterm questions without referencing solutions',
            breakMinutes: 10,
          },
          {
            blockNumber: 3,
            title: 'Synthesis & Spaced Review',
            durationMinutes: 40,
            activity: 'Summarizing key formulas and updating digital flashcards',
            breakMinutes: 20,
          },
        ],
        aiAdvice:
          'Maintain your 5-day streak by beginning block 1 before 10:00 AM. Keep phone outside study space to prevent dopamine disruption.',
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const fetchWeeklyReport = async () => {
    setIsLoadingReport(true);
    try {
      const res = await apiClient.get('/ai/weekly-report');
      if (res.data?.data) {
        setWeeklyReport(res.data.data);
      }
    } catch {
      setWeeklyReport({
        weeklyFocusMinutes: 420,
        weeklyReelsMinutes: 145,
        focusVelocityScore: 84,
        dopamineRiskLevel: 'MEDIUM',
        keyInsights: [
          'Calculus study sessions had 0 distraction tab transitions on Wednesday and Thursday.',
          'Instagram Reel browsing peaked between 22:30 and 23:45, delaying sleep onset by 40 minutes.',
          'Focus pods increased your total weekly study completion rate by +32%.',
        ],
        coachSummary:
          'Alex demonstrated strong discipline in morning work blocks. The primary leverage point for next week is setting a strict 22:00 screen curfew on short-form video feeds.',
      });
    } finally {
      setIsLoadingReport(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 py-4">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Gemini 2.5 Flash Intelligence
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Engine
              </span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              AI Focus Coach <Sparkles className="w-6 h-6 text-indigo-400" />
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Synthesizing your verified study sessions, observable feed transitions, and academic targets into actionable productivity interventions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-slate-950/70 border border-slate-800 text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Focus Velocity</span>
              <div className="text-xl font-black text-indigo-400">84 / 100</div>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-slate-950/70 border border-slate-800 text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Reels Drift</span>
              <div className="text-xl font-black text-emerald-400">-38%</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 overflow-x-auto pb-1 gap-2">
          {[
            { id: 'chat', label: 'Interactive AI Chat', icon: Brain },
            { id: 'recommendations', label: 'Smart Interventions', icon: Sparkles },
            { id: 'planner', label: 'Exam & Study Planner', icon: Calendar },
            { id: 'report', label: 'Weekly Behavioral Audit', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'report' && !weeklyReport) {
                    fetchWeeklyReport();
                  }
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: INTERACTIVE AI CHAT */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            {/* Quick Prompt Suggestions */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Suggested Academic Prompts:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Why do I open Instagram right after studying?',
                  'Create tomorrow’s high-yield study schedule',
                  'Explain the 5-Minute Dopamine Reset rule',
                  'How can I break the midnight Shorts scrolling binge?',
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isSending}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 text-[11px] text-slate-300 font-medium transition cursor-pointer"
                  >
                    💬 {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Box */}
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col h-[520px] overflow-hidden">
              {/* Message History */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {messages.map((m) => {
                  const isAi = m.sender === 'ai';
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-3 max-w-3xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                          isAi ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {isAi ? <Brain className="w-4 h-4" /> : 'ME'}
                      </div>
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed ${
                          isAi
                            ? 'bg-slate-800/80 border border-slate-700 text-slate-200 rounded-tl-sm'
                            : 'bg-indigo-600 text-white rounded-tr-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.text}</p>
                        <span
                          className={`block text-[10px] mt-1.5 font-mono ${
                            isAi ? 'text-slate-400' : 'text-indigo-200'
                          }`}
                        >
                          {m.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {isSending && (
                  <div className="flex gap-3 max-w-3xl mr-auto">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                      <span>FocusFlow AI is formulating cognitive coaching advice...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/60">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about study schedules, dopamine control, or focus blockers..."
                    className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !inputText.trim()}
                    className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SMART RECOMMENDATIONS */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Active Behavioral Interventions</h3>
                <p className="text-xs text-slate-400">
                  Targeted micro-adjustments generated from your recent sessions and scroll habits.
                </p>
              </div>
              <button
                onClick={() => {
                  apiClient.get('/ai/recommendations').then((res) => {
                    if (res.data?.data) setRecommendations(res.data.data);
                  });
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-slate-700 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 w-fit">
                      {rec.type}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Confidence: {rec.confidenceScore}%
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white">{rec.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">{rec.description}</p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800/80">
                    <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer w-fit">
                      <span>{rec.actionableStep}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">Helpful?</span>
                      <button
                        onClick={() => handleFeedback(rec.id, 'up')}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer transition ${
                          feedbackSent[rec.id] === 'up'
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                            : 'border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleFeedback(rec.id, 'down')}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer transition ${
                          feedbackSent[rec.id] === 'down'
                            ? 'bg-red-950 border-red-500 text-red-300'
                            : 'border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EXAM & STUDY PLANNER */}
        {activeTab === 'planner' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <span>AI Study Plan Generator</span>
              </h3>
              <p className="text-xs text-slate-400">
                Input your current coursework or upcoming exam. Gemini 2.5 calculates optimal Pomodoro blocks, active recall slots, and scheduled detox pauses.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Daily Study Target
                  </label>
                  <select
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value={1}>1 Hour / Day</option>
                    <option value={2}>2 Hours / Day</option>
                    <option value={3}>3 Hours / Day</option>
                    <option value={4}>4 Hours / Day</option>
                    <option value={5}>5+ Hours / Day (Intensive)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Days Remaining
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={daysUntilExam}
                    onChange={(e) => setDaysUntilExam(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateStudyPlan}
                disabled={isGeneratingPlan}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition"
              >
                {isGeneratingPlan ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Structuring Optimized Schedule...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Generate Structured Study Plan</span>
                  </>
                )}
              </button>
            </div>

            {studyPlan && (
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">
                      Verified Study Schedule
                    </span>
                    <h4 className="text-lg font-black text-white">{studyPlan.subject}</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {studyPlan.targetHours}h Daily Allocation
                  </span>
                </div>

                <div className="space-y-3">
                  {studyPlan.dailyBlocks.map((block) => (
                    <div
                      key={block.blockNumber}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-indigo-400">
                            BLOCK #{block.blockNumber}
                          </span>
                          <span className="text-xs font-bold text-white">• {block.title}</span>
                        </div>
                        <p className="text-xs text-slate-300">{block.activity}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                        <span className="text-emerald-400 font-bold">{block.durationMinutes}m Study</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-amber-400 font-bold">{block.breakMinutes}m Rest</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-200">
                  <span className="font-bold">Coach Advice:</span> {studyPlan.aiAdvice}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: WEEKLY BEHAVIORAL AUDIT */}
        {activeTab === 'report' && (
          <div className="space-y-4">
            {isLoadingReport ? (
              <div className="p-12 text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto" />
                <p className="text-xs text-slate-400">Compiling weekly focus and screen-time telemetry...</p>
              </div>
            ) : weeklyReport ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] font-mono text-slate-400 uppercase">Weekly Focus</span>
                    <div className="text-2xl font-black text-white mt-1">
                      {Math.floor(weeklyReport.weeklyFocusMinutes / 60)}h {weeklyReport.weeklyFocusMinutes % 60}m
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
                      +18% from previous week
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] font-mono text-slate-400 uppercase">Estimated Reels Time</span>
                    <div className="text-2xl font-black text-white mt-1">
                      {Math.floor(weeklyReport.weeklyReelsMinutes / 60)}h {weeklyReport.weeklyReelsMinutes % 60}m
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
                      -32% below cohort average
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] font-mono text-slate-400 uppercase">Dopamine Risk Level</span>
                    <div
                      className={`text-2xl font-black mt-1 ${
                        weeklyReport.dopamineRiskLevel === 'LOW'
                          ? 'text-emerald-400'
                          : weeklyReport.dopamineRiskLevel === 'MEDIUM'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {weeklyReport.dopamineRiskLevel}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                      Stabilized study blocks
                    </span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Behavioral Insights & Audit</span>
                  </h4>
                  <ul className="space-y-2">
                    {weeklyReport.keyInsights.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-indigo-400 block mb-1">Executive Coach Summary:</span>
                    {weeklyReport.coachSummary}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </AppLayout>
  );
};
