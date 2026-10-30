import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Settings, ShieldCheck, Database, Bell, Eye } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
            System & Privacy
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Application Settings
          </h1>
          <p className="text-sm text-slate-400">
            Configure privacy disclosures, extension bridge, and notifications.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Privacy & Consent Controls</span>
          </h3>

          <div className="space-y-3 text-xs text-slate-300">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <div>
                <b className="text-white block">Short-Form Video Transition Tracking</b>
                <span className="text-slate-400">Estimates video count based on visible viewport transitions.</span>
              </div>
              <input type="checkbox" defaultChecked className="rounded accent-indigo-500 w-4 h-4" />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <div>
                <b className="text-white block">Parental Dashboard Access (Consent-Gated)</b>
                <span className="text-slate-400">Allows parents to view high-level focus summaries without browsing details.</span>
              </div>
              <input type="checkbox" className="rounded accent-indigo-500 w-4 h-4" />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <div>
                <b className="text-white block">Counsellor Progress Sharing</b>
                <span className="text-slate-400">Shares focus trends with authorized campus counselling staff.</span>
              </div>
              <input type="checkbox" className="rounded accent-indigo-500 w-4 h-4" />
            </label>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
