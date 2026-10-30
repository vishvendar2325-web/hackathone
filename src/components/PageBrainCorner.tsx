import React, { useState, useEffect } from 'react';
import { getStage, getStageInfo } from '../types/brainrot';
import { playSound } from '../utils/audio';

export const PageBrainCorner: React.FC = () => {
  const [scrollScreens, setScrollScreens] = useState(0);
  const [talkText, setTalkText] = useState<string | null>(null);
  const [isSquishing, setIsSquishing] = useState(false);

  useEffect(() => {
    let lastSeen = 0;
    const handleScroll = () => {
      const vh = window.innerHeight;
      const n = Math.floor(window.scrollY / (vh * 0.75));
      if (n > lastSeen) {
        lastSeen = n;
        setScrollScreens(n);
        setIsSquishing(true);
        setTimeout(() => setIsSquishing(false), 400);

        if (n === 2) {
          setTalkText('you scrolled 2 screens. your brain is sweating 🧠');
          setTimeout(() => setTalkText(null), 3000);
        } else if (n === 5) {
          setTalkText('5 screens in. still not touching grass 🌱');
          setTimeout(() => setTalkText(null), 3000);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stage = getStage(scrollScreens * 15);
  const info = getStageInfo(scrollScreens * 15);

  const handleClick = () => {
    playSound('tap');
    const msg =
      scrollScreens === 0
        ? 'this whole page counts your scrolling too 👀'
        : `you have scrolled ${scrollScreens} screen${scrollScreens === 1 ? '' : 's'}. imagine reels.`;
    setTalkText(msg);
    setTimeout(() => setTalkText(null), 3000);
  };

  return (
    <div
      onClick={handleClick}
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end cursor-pointer select-none group"
    >
      {/* Speech bubble */}
      {talkText && (
        <div className="mb-2 max-w-[220px] bg-[#17131f] text-white text-xs px-3 py-2 rounded-2xl border border-[#b8ff3c]/40 shadow-xl font-mono leading-tight animate-fade-in">
          {talkText}
        </div>
      )}

      {/* Floating Brain Icon */}
      <div
        className={`relative flex items-center gap-2 p-2 rounded-2xl bg-[#17131f]/90 backdrop-blur-md border border-[#2c2537] hover:border-[#b8ff3c] shadow-2xl transition group-hover:scale-105 ${
          isSquishing ? 'animate-squish' : 'animate-breathe'
        }`}
      >
        <img
          src={info.sprite}
          alt={info.name}
          className="w-10 h-8 object-contain"
        />
        <div className="text-right pr-1">
          <span className="text-xs font-mono font-bold text-white block">
            {scrollScreens * 15}
          </span>
          <span className="text-[9px] font-mono text-[#8f89a0] uppercase block">
            page rot
          </span>
        </div>
      </div>
    </div>
  );
};
