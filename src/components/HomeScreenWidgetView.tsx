import React from 'react';
import { getStage, getStageInfo } from '../types/brainrot';
import { playSound } from '../utils/audio';
import { Instagram, Camera, MessageSquare, Phone, Chrome, Settings } from 'lucide-react';

interface HomeScreenWidgetViewProps {
  count: number;
  onOpenApp: () => void;
  onOpenReels: () => void;
}

export const HomeScreenWidgetView: React.FC<HomeScreenWidgetViewProps> = ({
  count,
  onOpenApp,
  onOpenReels,
}) => {
  const stage = getStage(count);
  const info = getStageInfo(count);

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full max-w-md mx-auto select-none">
      {/* Android Phone Mockup */}
      <div className="relative w-[340px] sm:w-[360px] h-[660px] rounded-[48px] bg-gradient-to-b from-indigo-950 via-slate-900 to-black border-[10px] border-[#221f2d] shadow-2xl overflow-hidden flex flex-col justify-between p-5 text-white">
        {/* Notch / Status Bar */}
        <div className="flex items-center justify-between text-xs text-white/80 font-mono px-2 pt-1">
          <span>10:24</span>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <span>89%</span>
          </div>
        </div>

        {/* Center Content: Big Widget */}
        <div className="space-y-6 my-auto">
          {/* Big Clock on Home Screen */}
          <div className="text-center">
            <h1 className="text-5xl font-mono font-light tracking-tight text-white/90">
              10:24
            </h1>
            <p className="text-xs text-white/60 font-mono mt-1">
              Friday, Oct 30 • 22°C Clear
            </p>
          </div>

          {/* Brainrot 4x2 Home Screen Widget */}
          <div
            onClick={() => {
              playSound('tap');
              onOpenApp();
            }}
            className="group cursor-pointer p-4 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 hover:border-[#b8ff3c]/40 shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="relative w-16 h-14 flex items-center justify-center">
                <img
                  src={info.sprite}
                  alt={info.name}
                  className="w-14 h-12 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#b8ff3c]">
                  Brainrot Widget
                </span>
                <h4 className="text-lg font-bold text-white tracking-tight">
                  {info.name}
                </h4>
                <p className="text-xs text-neutral-400">
                  Tap to open dashboard
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-3xl font-mono font-extrabold text-white block">
                {count}
              </span>
              <span className="text-[10px] text-neutral-400 uppercase font-mono">
                reels today
              </span>
            </div>
          </div>

          {/* Widget Feature Note */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
            <p className="text-[11px] text-neutral-300">
              Widget automatically refreshes with every reel counted and rolls back to 0 at midnight.
            </p>
          </div>
        </div>

        {/* Bottom App Grid */}
        <div className="space-y-4 pb-2">
          {/* Row of Apps including Instagram and Brainrot */}
          <div className="grid grid-cols-4 gap-4 px-2 text-center">
            {/* Brainrot App Icon */}
            <button
              onClick={() => {
                playSound('tap');
                onOpenApp();
              }}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#17131f] border border-white/10 p-1 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <img
                  src="/assets/ic_launcher_brain.png"
                  alt="Brainrot App"
                  className="w-9 h-9 object-contain"
                />
              </div>
              <span className="text-[11px] text-white/90 font-medium truncate w-full">
                Brainrot
              </span>
            </button>

            {/* Instagram App Icon */}
            <button
              onClick={() => {
                playSound('tap');
                onOpenReels();
              }}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 p-2 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <span className="text-[11px] text-white/90 font-medium truncate w-full">
                Instagram
              </span>
            </button>

            {/* Camera */}
            <div className="flex flex-col items-center gap-1.5 opacity-60">
              <div className="w-12 h-12 rounded-2xl bg-neutral-800 p-2 flex items-center justify-center shadow">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-[11px] text-white/90 font-medium">Camera</span>
            </div>

            {/* Settings */}
            <div className="flex flex-col items-center gap-1.5 opacity-60">
              <div className="w-12 h-12 rounded-2xl bg-neutral-800 p-2 flex items-center justify-center shadow">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <span className="text-[11px] text-white/90 font-medium">Settings</span>
            </div>
          </div>

          {/* Dock Bar */}
          <div className="p-2.5 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-around border border-white/10">
            <Phone className="w-5 h-5 text-white/80" />
            <MessageSquare className="w-5 h-5 text-white/80" />
            <Chrome className="w-5 h-5 text-white/80" />
          </div>
        </div>
      </div>
    </div>
  );
};
