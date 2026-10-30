import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Brain, Clock, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Banner */}
      <div className="bg-indigo-950/60 border-b border-indigo-800/40 px-4 py-2 text-center text-xs text-indigo-300 font-mono flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>FOCUSFLOW Phase 1: Foundation & Monorepo Architecture Initialized</span>
      </div>

      {/* Navigation */}
      <header className="max-w-6xl mx-auto w-full px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-600/30">
            ⚡
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white block">FOCUSFLOW</span>
            <span className="text-[10px] font-mono text-indigo-400 block -mt-1">AI Focus Coach & Digital Wellbeing</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition flex items-center gap-2"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto w-full px-6 py-16 text-center space-y-8 my-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Non-invasive • Zero-keystroke • Student Privacy First</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Reclaim Your Attention Span from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">Doomscroll Algorithm</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Students lose hours each week to Instagram Reels, YouTube Shorts, and distracting feeds. FOCUSFLOW delivers observable feed transition tracking, deep focus timers, and tailored AI coaching.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/dashboard"
            className="px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition flex items-center gap-2.5"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>Enter FocusFlow App</span>
          </Link>
          <Link
            to="/focus"
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-base transition flex items-center gap-2"
          >
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Try Focus Timer</span>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-12 text-left">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/40 flex items-center justify-center font-bold">
              📱
            </div>
            <h3 className="font-bold text-white text-base">Reels & Shorts Awareness</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Estimates short-form video consumption using observable viewport transitions. Zero caption or message inspection.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/40 flex items-center justify-center font-bold">
              ⏱️
            </div>
            <h3 className="font-bold text-white text-base">Deep Work Timer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pomodoro, Deep Work, and Exam Sprint modes. Automatic distraction pauses and strict site blocking.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center justify-center font-bold">
              🧠
            </div>
            <h3 className="font-bold text-white text-base">AI Focus Coach</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes fatigue patterns to recommend actionable study breaks, peak hours, and healthy academic routines.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 font-mono text-center">
        FOCUSFLOW Foundation • Phase 1 Monorepo Architecture • PostgreSQL + Express + React + Chrome Extension
      </footer>
    </div>
  );
};
