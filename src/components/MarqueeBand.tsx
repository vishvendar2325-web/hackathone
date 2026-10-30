import React from 'react';

interface MarqueeBandProps {
  words: string[];
  reverse?: boolean;
}

export const MarqueeBand: React.FC<MarqueeBandProps> = ({ words, reverse = false }) => {
  const content = words.map((w, i) => (
    <span key={i} className="inline-flex items-center gap-3 mx-3">
      <span className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-bold">{w}</span>
      <span className="text-[#b8ff3c]">✦</span>
    </span>
  ));

  return (
    <div className="w-full overflow-hidden whitespace-nowrap py-2 border-y border-[#2c2537] bg-[#120f18] select-none">
      <div
        className={`inline-block animate-marquee flex items-center ${
          reverse ? 'flex-row-reverse' : ''
        }`}
        style={{
          display: 'inline-flex',
          animation: `marquee 26s linear infinite ${reverse ? 'reverse' : 'normal'}`,
        }}
      >
        {content}
        {content}
        {content}
        {content}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
