import React, { useState } from 'react';
import { STAGES, getStage, getStageInfo, getUntilNext } from '../types/brainrot';
import { playSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Flame, Droplets, Zap, Sparkles } from 'lucide-react';

interface StageRotExplorerProps {
  currentCount: number;
  onApplyCount: (n: number) => void;
}

export const StageRotExplorer: React.FC<StageRotExplorerProps> = ({
  currentCount,
  onApplyCount,
}) => {
  const [sliderValue, setSliderValue] = useState(currentCount || 0);

  const stage = getStage(sliderValue);
  const info = getStageInfo(sliderValue);
  const untilNext = getUntilNext(sliderValue);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const oldStage = getStage(sliderValue);
    const newStage = getStage(val);
    setSliderValue(val);

    if (newStage !== oldStage) {
      playSound('stageUp');
      if (newStage >= 4) {
        confetti({
          particleCount: 40,
          spread: 60,
          colors: ['#b8ff3c', '#7fcf00', '#49e6ff'],
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleSelectStage = (stageAt: number) => {
    playSound('stageUp');
    setSliderValue(stageAt);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[#b8ff3c] flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4" /> The 7 Stages of Rot
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Watch Your Brain Decay in Real-Time
        </h2>
        <p className="text-sm text-neutral-400 max-w-xl mx-auto">
          Counting resets every day at local midnight. As reels add up, the brain changes sprite, sweats blue droplets, then decays to dripping green slime and smoke.
        </p>
      </div>

      {/* Main Interactive Stage Display */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#17131f] border border-[#2c2537] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Ambient Glow */}
        <div
          style={{ backgroundColor: info.glow }}
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-[90px] opacity-25 pointer-events-none transition-all duration-700"
        />

        {/* Big Animated Brain View */}
        <div className="relative flex flex-col items-center justify-center min-w-[240px]">
          {/* Continuous Smoke for stages 5 & 6 */}
          {info.hasSmoke && (
            <div className="absolute -top-10 inset-x-0 flex justify-center pointer-events-none">
              <img
                src="/assets/fx-smoke-1.png"
                alt=""
                className="w-12 h-12 opacity-80 animate-smoke"
                style={{ animationDelay: '0s' }}
              />
              <img
                src="/assets/fx-smoke-2.png"
                alt=""
                className="w-12 h-12 opacity-70 animate-smoke -ml-4"
                style={{ animationDelay: '0.8s' }}
              />
            </div>
          )}

          <div className="relative group">
            <img
              src={info.sprite}
              alt={info.name}
              className="w-44 h-36 object-contain animate-breathe drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)] transition-all duration-300"
            />
            {/* Visual Drip */}
            <img
              src={info.dripType === 'slime' ? '/assets/fx-drop-green.png' : '/assets/fx-drop-blue.png'}
              alt=""
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-6 animate-drop-fall"
            />
          </div>

          <div className="mt-4 text-center">
            <span className="text-4xl font-extrabold text-white font-mono">
              {sliderValue}
              {sliderValue >= 300 ? '+' : ''}
            </span>
            <span className="text-xs text-neutral-400 font-mono block">
              reels today
            </span>
          </div>
        </div>

        {/* Stage Description & Controls */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#241f33] text-[#b8ff3c] border border-[#b8ff3c]/30">
              Stage {stage}: {info.name}
            </span>
            {info.hasSmoke && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-red-950/60 text-red-400 border border-red-800/40 flex items-center gap-1">
                <Flame className="w-3 h-3" /> Smoking
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#1f1a29] text-neutral-300 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-cyan-400" />
              {info.dripType === 'slime' ? 'Green slime' : 'Blue sweat'}
            </span>
          </div>

          <p className="text-base text-neutral-200 leading-relaxed font-sans">
            {info.desc}
          </p>

          <p className="text-xs font-mono text-[#8f89a0]">
            {untilNext !== null
              ? `${untilNext} more reels until stage ${stage + 1}`
              : "Maximum brain rot unlocked. It doesn't get worse than this."}
          </p>

          {/* Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>0 (Fresh)</span>
              <span>100 (Mushy)</span>
              <span>250+ (Terminal)</span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              step="1"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full h-2 bg-[#2c2537] rounded-lg appearance-none cursor-pointer accent-[#b8ff3c]"
            />
          </div>

          <button
            onClick={() => {
              playSound('stageUp');
              onApplyCount(sliderValue);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#b8ff3c] hover:bg-[#a5f02c] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" />
            Apply {sliderValue} Reels to Today's Simulator
          </button>
        </div>
      </div>

      {/* 7 Stages Quick Select Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {STAGES.map((s) => {
          const isSelected = stage === s.stage;
          return (
            <button
              key={s.stage}
              onClick={() => handleSelectStage(s.at)}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#1f1a29] border-[#b8ff3c] shadow-[0_0_15px_rgba(184,255,60,0.25)] scale-105'
                  : 'bg-[#120f18] border-[#2c2537] hover:border-neutral-500 hover:bg-[#17131f]'
              }`}
            >
              <img
                src={s.sprite}
                alt={s.name}
                className="w-12 h-10 object-contain"
              />
              <div>
                <span className="text-xs font-bold text-white block">
                  {s.name}
                </span>
                <span className="text-[10px] font-mono text-[#8f89a0]">
                  {s.stage === 6 ? `${s.at}+ reels` : `${s.at} reels`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
