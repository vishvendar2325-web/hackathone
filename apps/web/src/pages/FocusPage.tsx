import React, { useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { useFocusStore } from '../store/useFocusStore';
import { Play, Pause, RotateCcw, ShieldCheck, Clock, Zap, Coffee, Sparkles } from 'lucide-react';

export const FocusPage: React.FC = () => {
  const {
    mode,
    status,
    targetMinutes,
    secondsRemaining,
    isActive,
    setMode,
    startSession,
    pauseSession,
    resumeSession,
    resetSession,
    tick,
  } = useFocusStore();

  useEffect(() => {
    const timer = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(timer);
  }, [tick]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
            Deep Focus Module
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Focus Timer & Distraction Blocker
          </h1>
          <p className="text-sm text-slate-400">
            Select your session mode. When active, distracting platforms are automatically blocked by the Chrome Extension.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'POMODORO', label: 'Pomodoro', duration: '25 min', icon: Coffee },
            { id: 'DEEP_WORK', label: 'Deep Work', duration: '50 min', icon: Zap },
            { id: 'EXAM_PREP', label: 'Exam Prep', duration: '90 min', icon: Clock },
            { id: 'QUICK_SPRINT', label: 'Quick Sprint', duration: '15 min', icon: Sparkles },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMode(item.id as any)}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'} mb-2`} />
                <h4 className="text-sm font-bold text-white">{item.label}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{item.duration}</p>
              </button>
            );
          })}
        </div>

        {/* Central Timer Display */}
        <div className="p-10 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 text-xs font-mono text-indigo-400 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Mode: {mode} ({targetMinutes} min target)</span>
          </div>

          <div className="text-8xl sm:text-9xl font-mono font-extrabold text-white tracking-tighter">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            {!isActive ? (
              <button
                onClick={() => (status === 'PAUSED' ? resumeSession() : startSession())}
                className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{status === 'PAUSED' ? 'Resume Session' : 'Start Focus'}</span>
              </button>
            ) : (
              <button
                onClick={pauseSession}
                className="px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-base shadow-xl shadow-amber-600/30 transition flex items-center gap-2 cursor-pointer"
              >
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause Session</span>
              </button>
            )}

            <button
              onClick={resetSession}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Declarative Net Request active: 14 distracting social domains blocked during timer</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
