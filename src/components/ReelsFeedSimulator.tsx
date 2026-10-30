import React, { useState, useRef, useEffect } from 'react';
import { FloatingBrainOverlay } from './FloatingBrainOverlay';
import { SimulatedReel, getStage } from '../types/brainrot';
import { Heart, MessageCircle, Send, Bookmark, Music, ChevronUp, ChevronDown, Volume2, Sparkles, Terminal } from 'lucide-react';
import { playSound } from '../utils/audio';

interface ReelsFeedSimulatorProps {
  count: number;
  onCountReel: () => void;
  onBulkAdd: (amount: number) => void;
  onReset: () => void;
}

const SAMPLE_REELS: SimulatedReel[] = [
  {
    id: 1,
    username: 'doomscroll_daily',
    caption: 'POV: You said "just one reel before bed" at 11:30 PM. It is now 3:14 AM. 💀 #brainrot #reels',
    audio: 'Original Audio - Late Night Thoughts',
    likes: '142K',
    comments: '2,891',
    gradient: 'from-purple-900 via-indigo-950 to-black',
    category: 'Meme',
    bgSymbol: '🧠💤',
  },
  {
    id: 2,
    username: 'asmr_kinetic_satisfy',
    caption: 'Satisfying rainbow kinetic sand slicing 1000 cuts ASMR 🌈✂️ Watch until the end!',
    audio: 'Pure ASMR Sand Crunch - binaural',
    likes: '89.4K',
    comments: '942',
    gradient: 'from-pink-900 via-rose-950 to-neutral-950',
    category: 'Satisfying',
    bgSymbol: '✨🌈',
  },
  {
    id: 3,
    username: 'neuroscience_explained',
    caption: 'What rapid short-form video switching does to your dopamine baselines. Notice how hard it is to pause?',
    audio: 'Dr. Huberman on Dopamine',
    likes: '310K',
    comments: '4,102',
    gradient: 'from-teal-950 via-cyan-950 to-slate-950',
    category: 'Science',
    bgSymbol: '🔬⚡',
  },
  {
    id: 4,
    username: 'subway_parkour_reddit',
    caption: 'AITA for refusing to give my seat to a flying cat? (Subway Surfers gameplay in background) 🏃‍♂️💨',
    audio: 'Subway Surfers Main Theme (Sped Up)',
    likes: '520K',
    comments: '12.4K',
    gradient: 'from-amber-950 via-orange-950 to-stone-950',
    category: 'Brainrot Classic',
    bgSymbol: '🛹🚂',
  },
  {
    id: 5,
    username: 'midnight_chef',
    caption: 'Deep frying a whole block of cheddar wrapped in bacon and dusting with hot Cheetos 🧀🔥',
    audio: 'Gourmet Crunch Beat',
    likes: '67.2K',
    comments: '1,530',
    gradient: 'from-red-950 via-rose-950 to-neutral-950',
    category: 'Food',
    bgSymbol: '🍔🔥',
  },
  {
    id: 6,
    username: 'chaotic_cats_hq',
    caption: 'My orange cat trying to catch a laser pointer on the ceiling fan at full speed 🐈',
    audio: 'Funny Cat Meow Remix',
    likes: '940K',
    comments: '8,419',
    gradient: 'from-emerald-950 via-teal-950 to-black',
    category: 'Animals',
    bgSymbol: '🐱🐾',
  },
];

export const ReelsFeedSimulator: React.FC<ReelsFeedSimulatorProps> = ({
  count,
  onCountReel,
  onBulkAdd,
  onReset,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [showEventLog, setShowEventLog] = useState(false);
  const [eventLogs, setEventLogs] = useState<string[]>([
    'AccessibilityService: Connected to com.instagram.android',
    'Detector: InReels state armed (target: clips_viewer_view_pager)',
  ]);

  const phoneRef = useRef<HTMLDivElement>(null);

  const reel = SAMPLE_REELS[currentIdx % SAMPLE_REELS.length];
  const stage = getStage(count);

  const logSignal = (msg: string) => {
    setEventLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 9),
    ]);
  };

  const handleNext = () => {
    playSound(stage >= 4 ? 'slime' : 'squish');
    setCurrentIdx((prev) => prev + 1);
    onCountReel();
    logSignal(
      `UiSignal.Scrolled(clips_viewer_view_pager, toIndex: ${currentIdx + 1}) -> Decision.CountReel`
    );
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      playSound('tap');
      setCurrentIdx((prev) => prev - 1);
      logSignal(
        `UiSignal.Scrolled(backwards to ${currentIdx - 1}) -> IndexStrategy: ALREADY_SEEN (ignored)`
      );
    }
  };

  const toggleLike = (id: number) => {
    playSound('tap');
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSave = (id: number) => {
    playSound('tap');
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Keyboard navigation for power users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, stage]);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-6 w-full max-w-5xl mx-auto">
      {/* Simulated Phone Frame */}
      <div className="relative">
        <div
          ref={phoneRef}
          className="relative w-[340px] sm:w-[380px] h-[680px] sm:h-[720px] rounded-[48px] bg-black border-[10px] border-[#221f2d] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_25px_rgba(184,255,60,0.1)] overflow-hidden flex flex-col select-none"
        >
          {/* Phone Dynamic Island / Camera Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-center gap-2 border border-white/10">
            <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/20"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>

          {/* Phone Top Status Bar */}
          <div className="relative z-40 px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-mono text-white/70">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-4 h-2 border border-white/60 rounded-[2px] p-[1px] flex items-center">
                <div className="w-2.5 h-full bg-white rounded-[1px]"></div>
              </div>
            </div>
          </div>

          {/* Simulated Instagram Header */}
          <div className="relative z-30 px-4 py-2 flex items-center justify-between text-white border-b border-white/5 backdrop-blur-sm bg-black/20">
            <span className="font-bold text-lg tracking-tight font-sans">Reels</span>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/80 font-mono">
                clips_viewer
              </span>
              <Volume2 className="w-4 h-4 text-white/80" />
            </div>
          </div>

          {/* Floating Brainrot Overlay (Draggable, Animated) */}
          <FloatingBrainOverlay
            count={count}
            containerRef={phoneRef}
            onTap={() =>
              logSignal(
                `Overlay tapped: Dragged to edge, stage ${stage} displayed`
              )
            }
          />

          {/* Reel Content Area */}
          <div
            className={`flex-1 relative bg-gradient-to-br ${reel.gradient} flex flex-col justify-between p-4 overflow-hidden transition-all duration-300`}
          >
            {/* Reel Ambient Background visuals */}
            <div className="absolute inset-0 opacity-25 flex items-center justify-center pointer-events-none select-none">
              <span className="text-[140px] filter blur-sm">
                {reel.bgSymbol}
              </span>
            </div>

            {/* Reel category pill */}
            <div className="relative z-10 flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-white/90 border border-white/10">
                {reel.category}
              </span>
              <span className="text-[10px] text-white/60 font-mono">
                Index #{currentIdx + 1}
              </span>
            </div>

            {/* Bottom Info + Action Sidebar */}
            <div className="relative z-10 flex items-end justify-between gap-3 pb-12">
              {/* Left Details */}
              <div className="flex-1 space-y-2 pr-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-xs font-bold">
                      {reel.username[0].toUpperCase()}
                    </div>
                  </div>
                  <span className="font-semibold text-sm text-white drop-shadow">
                    @{reel.username}
                  </span>
                  <button className="text-[11px] font-semibold border border-white/60 px-2.5 py-0.5 rounded-md text-white backdrop-blur-sm">
                    Follow
                  </button>
                </div>

                <p className="text-xs text-white/95 line-clamp-3 leading-relaxed drop-shadow">
                  {reel.caption}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-white/80 font-mono">
                  <Music className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="truncate max-w-[200px]">{reel.audio}</span>
                </div>
              </div>

              {/* Right Action Icons */}
              <div className="flex flex-col items-center gap-4 text-white">
                <button
                  onClick={() => toggleLike(reel.id)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div
                    className={`p-2 rounded-full transition-transform group-active:scale-125 ${
                      liked[reel.id] ? 'text-rose-500' : 'text-white'
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${liked[reel.id] ? 'fill-current' : ''}`}
                    />
                  </div>
                  <span className="text-[11px] font-medium">{reel.likes}</span>
                </button>

                <button className="flex flex-col items-center gap-1">
                  <div className="p-2 rounded-full">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-medium">{reel.comments}</span>
                </button>

                <button
                  onClick={() => toggleSave(reel.id)}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`p-2 rounded-full ${
                      saved[reel.id] ? 'text-amber-400' : 'text-white'
                    }`}
                  >
                    <Bookmark
                      className={`w-6 h-6 ${saved[reel.id] ? 'fill-current' : ''}`}
                    />
                  </div>
                </button>

                <button className="flex flex-col items-center gap-1">
                  <div className="p-2 rounded-full">
                    <Send className="w-5 h-5" />
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Instagram Navigation Bar */}
            <div className="absolute bottom-0 inset-x-0 h-12 bg-black/90 backdrop-blur-md border-t border-white/10 flex items-center justify-around text-white/60 text-xs">
              <span>Home</span>
              <span>Search</span>
              <span className="font-bold text-white border-b-2 border-white pb-0.5">
                Reels
              </span>
              <span>Shop</span>
              <span>Profile</span>
            </div>
          </div>
        </div>

        {/* Floating Quick Controls Attached to Phone */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="px-3 py-2 rounded-xl bg-[#17131f] border border-[#2c2537] text-xs font-mono text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm transition"
          >
            <ChevronUp className="w-4 h-4" /> Prev Reel
          </button>
          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-[#b8ff3c] hover:bg-[#a5f02c] text-black font-bold text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(184,255,60,0.35)] active:scale-95 transition"
          >
            <span>Swipe Reel</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Simulator Side Panel: Stats, Fast-Forward, & Accessibility Event Stream */}
      <div className="flex-1 max-w-md w-full space-y-4">
        {/* Simulation Controls Card */}
        <div className="p-5 rounded-2xl bg-[#17131f] border border-[#2c2537] shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#b8ff3c] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Reel Simulator
            </span>
            <span className="text-xs font-mono text-neutral-400">
              Keys: ↑ / ↓ or J / K
            </span>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed mb-4">
            Simulates the real Android background experience. The floating brain
            appears automatically when Reels opens, counts each settle of the
            feed, and visibly rots as you swipe.
          </p>

          {/* Fast Forward & Test Actions */}
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <button
              onClick={() => {
                playSound(stage >= 4 ? 'slime' : 'squish');
                onCountReel();
              }}
              className="py-2.5 px-3 rounded-xl bg-[#1f1a29] hover:bg-[#2c2537] border border-[#2c2537] text-xs font-mono text-white transition flex items-center justify-center gap-2"
            >
              <span>+1 Single Reel</span>
            </button>
            <button
              onClick={() => {
                playSound('stageUp');
                onBulkAdd(10);
                logSignal('Fast-forward: Added +10 reels to session');
              }}
              className="py-2.5 px-3 rounded-xl bg-[#1f1a29] hover:bg-[#2c2537] border border-[#2c2537] text-xs font-mono text-[#b8ff3c] transition flex items-center justify-center gap-2"
            >
              <span>+10 Doomscroll</span>
            </button>
            <button
              onClick={() => {
                playSound('stageUp');
                onBulkAdd(50);
                logSignal('Fast-forward: Added +50 reels (Accelerate rot)');
              }}
              className="py-2.5 px-3 rounded-xl bg-[#1f1a29] hover:bg-[#2c2537] border border-[#2c2537] text-xs font-mono text-[#ff4fd8] transition flex items-center justify-center gap-2"
            >
              <span>+50 Mega Session</span>
            </button>
            <button
              onClick={() => {
                playSound('tap');
                onReset();
                logSignal('Reset: Cleared today counter to 0');
              }}
              className="py-2.5 px-3 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-800/40 text-xs font-mono text-red-300 transition flex items-center justify-center gap-2"
            >
              <span>Reset Counter</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#2c2537] text-xs font-mono text-neutral-400">
            <span>Today's Total: <b className="text-white">{count} reels</b></span>
            <span>Current Stage: <b className="text-[#b8ff3c]">{stage}</b></span>
          </div>
        </div>

        {/* Live Accessibility Event Log Drawer */}
        <div className="p-4 rounded-2xl bg-[#120f18] border border-[#2c2537]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#49e6ff]" />
              Android Accessibility Signal Trace
            </span>
            <button
              onClick={() => setShowEventLog(!showEventLog)}
              className="text-[11px] font-mono text-[#49e6ff] hover:underline"
            >
              {showEventLog ? 'Hide stream' : 'Show full stream'}
            </button>
          </div>

          <div className="font-mono text-[11px] space-y-1.5 bg-black/60 p-3 rounded-xl border border-white/5 max-h-36 overflow-y-auto">
            {eventLogs.slice(0, showEventLog ? 10 : 3).map((log, i) => (
              <div
                key={i}
                className={i === 0 ? 'text-[#b8ff3c]' : 'text-neutral-400'}
              >
                {log}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-neutral-500 mt-2 font-mono">
            Pure signal mapping: zero captions or user messages are read. Only view id & pager index.
          </p>
        </div>
      </div>
    </div>
  );
};
