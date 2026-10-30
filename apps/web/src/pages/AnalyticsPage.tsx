import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { BarChart3, TrendingUp, Calendar, Clock, PlaySquare } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 py-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
            Data & Trends
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Focus & Distraction Analytics
          </h1>
          <p className="text-sm text-slate-400">
            Compare your deep study blocks against short-form video consumption over time.
          </p>
        </div>

        {/* 7-Day Trend Overview */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Weekly Focus vs Short-Form Video Trend</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Past 7 Days (Demo Data)</span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-4 border-b border-slate-800 pb-4 h-48 items-end">
            {[
              { day: 'Mon', focus: 120, reels: 35 },
              { day: 'Tue', focus: 150, reels: 20 },
              { day: 'Wed', focus: 90, reels: 65 },
              { day: 'Thu', focus: 180, reels: 15 },
              { day: 'Fri', focus: 140, reels: 40 },
              { day: 'Sat', focus: 210, reels: 50 },
              { day: 'Sun', focus: 165, reels: 28 },
            ].map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full max-w-[28px] flex items-end justify-center gap-1 h-36">
                  {/* Focus Bar */}
                  <div
                    style={{ height: `${(d.focus / 210) * 100}%` }}
                    className="w-1/2 bg-indigo-500 rounded-t-sm"
                    title={`Focus: ${d.focus}m`}
                  />
                  {/* Reels Bar */}
                  <div
                    style={{ height: `${(d.reels / 210) * 100}%` }}
                    className="w-1/2 bg-rose-500 rounded-t-sm"
                    title={`Reels: ${d.reels}m`}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs font-mono pt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-indigo-500" />
              <span className="text-slate-300">Focus Time (minutes)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-rose-500" />
              <span className="text-slate-300">Short Video Time (minutes)</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
