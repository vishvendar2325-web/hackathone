import React from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuthStore } from '../store/useAuthStore';
import { useFocusStore } from '../store/useFocusStore';
import { useReelsStore } from '../store/useReelsStore';
import {
  Clock,
  PlaySquare,
  ShieldCheck,
  TrendingUp,
  Brain,
  Zap,
  ArrowUpRight,
  Flame,
  Award,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { todayEstimatedReels, todayReelsMinutes, dailyQuotaMinutes } = useReelsStore();
  const { secondsRemaining, isActive, mode } = useFocusStore();

  const minutesRemaining = Math.floor(secondsRemaining / 60);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                Phase 1 Development Dashboard
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                PostgreSQL + Express + Prisma Ready
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Welcome back, {user?.name || 'Student'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Here is your focus rhythm, short-form video breakdown, and daily study momentum.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/focus"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Start Focus Session</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Focus Time */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Today's Focus Time</span>
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-mono font-extrabold text-white">
              1h 45m
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+25% over yesterday</span>
            </div>
          </div>

          {/* Card 2: Short-Form Videos */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Estimated Short Videos</span>
              <PlaySquare className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl font-mono font-extrabold text-white">
              {todayEstimatedReels} <span className="text-xs font-normal text-slate-400">reels</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              ~{todayReelsMinutes}m spent ({dailyQuotaMinutes - todayReelsMinutes}m quota left)
            </div>
          </div>

          {/* Card 3: Study Streak */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Focus Streak</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-mono font-extrabold text-white">
              5 <span className="text-xs font-normal text-slate-400">days</span>
            </div>
            <div className="text-[11px] text-amber-400">
              Personal best: 12 days
            </div>
          </div>

          {/* Card 4: Focus Score */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Productivity Score</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-mono font-extrabold text-white">
              82<span className="text-sm font-normal text-slate-400">/100</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Based on focus vs doomscroll ratio
            </div>
          </div>
        </div>

        {/* Focus Timer Live Widget & AI Coach Recommendation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Timer Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
                Active Session
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                {mode}
              </span>
            </div>

            <div className="text-center py-4">
              <div className="text-6xl font-mono font-extrabold text-white tracking-tight">
                {String(minutesRemaining).padStart(2, '0')}:
                {String(secondsRemaining % 60).padStart(2, '0')}
              </div>
              <p className="text-xs text-slate-400 mt-2 font-mono">
                {isActive ? 'Session in progress • Distractions blocked' : 'Timer paused'}
              </p>
            </div>

            <Link
              to="/focus"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <span>Manage Focus Timer</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* AI Coach Insight */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-bold text-white">AI Focus Coach Insight</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                Personalized
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
              <h4 className="text-sm font-bold text-indigo-300">
                High Evening Reel Scroll Tendency Detected
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                "You typically consume 70% of your daily Reels between 9:00 PM and 11:30 PM. Setting an automatic 20-minute wind-down lock at 10 PM will improve your sleep cycle and focus score for tomorrow's 9 AM study block."
              </p>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">Generated from observable transition telemetry</span>
              <Link to="/ai-coach" className="text-indigo-400 hover:underline font-bold flex items-center gap-1">
                <span>View Full AI Action Plan</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
