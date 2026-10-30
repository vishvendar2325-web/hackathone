import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { useReelsStore } from '../store/useReelsStore';
import { PlaySquare, AlertCircle, Plus, RotateCcw, ShieldCheck, Flame } from 'lucide-react';
import { calculateDoomscrollFatigue } from '@focusflow/shared-utils';

export const ReelsPage: React.FC = () => {
  const { todayEstimatedReels, todayReelsMinutes, dailyQuotaMinutes, platformBreakdown, incrementReel, resetDay } =
    useReelsStore();

  const fatigue = calculateDoomscrollFatigue(todayEstimatedReels, todayReelsMinutes * 60);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
            Digital Wellbeing & Habit Tracking
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Short-Form Video & Reels Awareness
          </h1>
          <p className="text-sm text-slate-400">
            Estimates your daily Instagram Reels, YouTube Shorts, and Facebook Reels based on observable viewport transitions.
          </p>
        </div>

        {/* Fatigue Status Banner */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-800/40 text-rose-400 flex items-center justify-center text-3xl font-bold">
              🧠
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{fatigue.label}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800">
                  {fatigue.level}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Dopamine fatigue index is at {fatigue.score}/100. Short video transitions accelerate cognitive fragmentation.
              </p>
            </div>
          </div>

          <div className="text-right flex items-center gap-3">
            <button
              onClick={() => incrementReel('INSTAGRAM_REELS')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate +1 Reel</span>
            </button>
            <button
              onClick={resetDay}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              title="Reset Day"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Platform Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Instagram Reels</span>
              <span className="text-pink-400 font-bold">IG</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">
              {platformBreakdown.INSTAGRAM_REELS} <span className="text-xs font-normal text-slate-400">reels</span>
            </div>
            <p className="text-[11px] text-slate-400">Observed via clips_viewer viewport</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>YouTube Shorts</span>
              <span className="text-red-400 font-bold">YT</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">
              {platformBreakdown.YOUTUBE_SHORTS} <span className="text-xs font-normal text-slate-400">shorts</span>
            </div>
            <p className="text-[11px] text-slate-400">Observed via #shorts-container</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Facebook Reels</span>
              <span className="text-blue-400 font-bold">FB</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">
              {platformBreakdown.FACEBOOK_REELS} <span className="text-xs font-normal text-slate-400">reels</span>
            </div>
            <p className="text-[11px] text-slate-400">Observed via [role=main] transitions</p>
          </div>
        </div>

        {/* Privacy Disclosure Callout */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ethical Tracking Notice</span>
          </div>
          <p className="leading-relaxed">
            Public platform APIs do not provide reel view counts. FOCUSFLOW treats these numbers strictly as approximations derived from visible video container scrolling events. No user accounts, passwords, comments, messages, or keystrokes are accessed.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};
