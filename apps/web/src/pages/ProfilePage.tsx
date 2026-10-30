import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuthStore } from '../store/useAuthStore';
import { User, ShieldCheck, Mail, School, Award } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
            Student Identity
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            User Profile
          </h1>
          <p className="text-sm text-slate-400">
            Manage your personal settings, academic level, and consent preferences.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {user?.name?.[0] || 'A'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name || 'Alex Rivera'}</h2>
              <p className="text-xs text-slate-400 font-mono">{user?.email || 'student@university.edu'}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                ROLE: {user?.role || 'STUDENT'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-slate-400 font-mono">Daily Focus Target</span>
              <p className="text-sm font-bold text-white">120 Minutes / Day</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-slate-400 font-mono">Daily Reels Quota</span>
              <p className="text-sm font-bold text-white">30 Minutes / Day</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
