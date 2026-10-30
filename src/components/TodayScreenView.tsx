import React, { useState, useEffect } from 'react';
import { getStage, getStageInfo, getUntilNext, Sitting, FriendEntry } from '../types/brainrot';
import { Download, Share2, Check, Sparkles, Smartphone, ShieldCheck, Plus, UserPlus, Users, ArrowUpRight } from 'lucide-react';
import { playSound } from '../utils/audio';

interface TodayScreenViewProps {
  count: number;
  sittings: Sitting[];
  hourly: number[];
  lastEventAt: number | null;
  onAddWidget: () => void;
  onOpenAccessibilityModal: () => void;
  friends: FriendEntry[];
  myCode: string;
  onAddFriend: (username: string) => void;
}

export const TodayScreenView: React.FC<TodayScreenViewProps> = ({
  count,
  sittings,
  hourly,
  lastEventAt,
  onAddWidget,
  onOpenAccessibilityModal,
  friends,
  myCode,
  onAddFriend,
}) => {
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [friendInput, setFriendInput] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stage = getStage(count);
  const info = getStageInfo(count);
  const untilNext = getUntilNext(count);

  // Time formatters
  const dateStr = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  // Compute stats
  const totalScrollingMs = sittings.reduce((acc, s) => acc + (s.end - s.start), count * 22000);
  const totalMinutes = Math.max(1, Math.round(totalScrollingMs / 60000));
  const secondsPerReel = count > 0 ? Math.round((totalMinutes * 60) / count) : 0;

  // Chart data
  const maxHourly = Math.max(...hourly, 1);
  const peakHour = hourly.indexOf(Math.max(...hourly));
  const activeFocusHour = selectedHour !== null ? selectedHour : (hourly[peakHour] > 0 ? peakHour : null);

  const formatHourLabel = (h: number) => {
    const startH = h % 12 || 12;
    const startAm = h >= 12 ? 'PM' : 'AM';
    const nextH = (h + 1) % 12 || 12;
    const nextAm = (h + 1) >= 12 ? 'PM' : 'AM';
    return `${startH}:00 ${startAm} – ${nextH}:00 ${nextAm}`;
  };

  const copyInvite = () => {
    playSound('tap');
    const link = `https://brain-rot-drab.vercel.app/?invite=${myCode}`;
    navigator.clipboard?.writeText(link);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const handleExport = () => {
    playSound('tap');
    const captureData = {
      timestamp: new Date().toISOString(),
      device: 'Android 15 (Simulated)',
      instagramVersion: '447.0.0.55.81',
      totalCountToday: count,
      stage: stage,
      sittingsCount: sittings.length,
      signals: [
        { type: 'TYPE_VIEW_SCROLLED', sourceId: 'clips_viewer_view_pager', toIndex: count, itemCount: count + 5 },
        { type: 'TYPE_VIEW_SELECTED', sourceId: 'clips_tab', decision: 'ENTER_REELS' },
      ],
    };
    const blob = new Blob([JSON.stringify(captureData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reel-capture-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMessage('Exported debug capture JSON');
    setTimeout(() => setExportMessage(null), 3000);
  };

  const handleAddFriendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendInput.trim()) return;
    playSound('tap');
    onAddFriend(friendInput.trim());
    setFriendInput('');
    setShowAddFriend(false);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#0f0f10] text-[#f5f1e8] rounded-[36px] border border-[#2e2e2c] shadow-2xl p-5 space-y-4 font-sans select-none overflow-hidden">
      {/* Header with Date, Live Clock & Tracking Pill */}
      <div className="flex items-start justify-between pt-1">
        <div>
          <p className="text-xs font-medium text-[#8c8b84]">{dateStr}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-semibold tracking-tight font-mono text-white">
              {displayHours}:{minutes}
            </span>
            <span className="text-xs font-semibold text-[#8c8b84]">{ampm}</span>
          </div>
        </div>

        {/* Status Pill: Tracking */}
        <button
          onClick={onOpenAccessibilityModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a19] border border-[#2e2e2c] hover:border-[#4cc27e]/40 transition group cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-[#4cc27e] animate-ping" />
          <span className="text-xs font-medium text-white group-hover:text-[#4cc27e] transition">
            Tracking
          </span>
        </button>
      </div>

      {/* Hero: Count Section */}
      <div className="py-2">
        <p className="text-xs font-medium text-[#8c8b84]">Reels watched today</p>
        <div className="flex items-baseline gap-3 my-1">
          <span className="text-7xl sm:text-8xl font-bold tracking-tighter text-white font-mono leading-none">
            {count}
          </span>
        </div>
        <p className="text-xs text-[#8c8b84]">
          {lastEventAt ? `Last one counted just now` : `Nothing counted yet`}
        </p>
      </div>

      {/* Brain Card */}
      <div className="p-4 rounded-2xl bg-[#1a1a19] border border-[#2e2e2c] flex items-center gap-4">
        <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
          <img
            src={info.sprite}
            alt={info.name}
            className="w-16 h-14 object-contain animate-breathe"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-white">{info.name}</h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#242423] text-neutral-300">
              Stage {stage}/6
            </span>
          </div>
          <p className="text-xs text-[#8c8b84] mt-0.5">
            {untilNext !== null
              ? `${untilNext} more until it gets worse`
              : "It can't get any worse."}
          </p>
          <button
            onClick={onAddWidget}
            className="mt-2 text-xs font-semibold text-[#f4533f] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            Add to home screen
          </button>
        </div>
      </div>

      {/* Friends Card */}
      <div className="p-4 rounded-2xl bg-[#1a1a19] border border-[#2e2e2c] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#ff4fd8]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Friends Live Rot
            </span>
          </div>
          <button
            onClick={() => setShowAddFriend(!showAddFriend)}
            className="text-[11px] font-mono text-[#ff4fd8] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <UserPlus className="w-3 h-3" />
            {showAddFriend ? 'Cancel' : 'Add friend'}
          </button>
        </div>

        {/* Add Friend Form */}
        {showAddFriend && (
          <form onSubmit={handleAddFriendSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Instagram username or invite code"
              value={friendInput}
              onChange={(e) => setFriendInput(e.target.value)}
              className="flex-1 bg-[#242423] border border-[#2e2e2c] rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff4fd8]"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#ff4fd8] text-black text-xs font-bold rounded-xl cursor-pointer hover:opacity-90"
            >
              Add
            </button>
          </form>
        )}

        {/* Friends Mini Leaderboard */}
        <div className="space-y-2">
          {friends.slice(0, 3).map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between py-1 border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${f.avatarColor}`}
                >
                  {f.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white leading-tight">
                    @{f.username}
                  </p>
                  <p className="text-[10px] text-[#8c8b84]">
                    Stage {f.stage}: {getStageInfo(f.count).name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-white">
                  {f.count}
                </span>
                <span className="text-[10px] text-[#8c8b84] block">reels</span>
              </div>
            </div>
          ))}
        </div>

        {/* Invite link action */}
        <div className="pt-1 flex items-center justify-between text-xs border-t border-[#2e2e2c]">
          <span className="text-[11px] font-mono text-[#8c8b84]">
            Your code: <b className="text-white">{myCode}</b>
          </span>
          <button
            onClick={copyInvite}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#b8ff3c] hover:underline cursor-pointer"
          >
            {copiedInvite ? (
              <>
                <Check className="w-3 h-3" /> Copied!
              </>
            ) : (
              <>
                <Share2 className="w-3 h-3" /> Copy Invite Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stat Tiles Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-[#1a1a19] border border-[#2e2e2c]">
          <span className="text-[11px] font-medium text-[#8c8b84]">In Reels</span>
          <p className="text-lg font-bold text-white mt-1">
            {count === 0 ? '0 min' : `${totalMinutes} min`}
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-[#1a1a19] border border-[#2e2e2c]">
          <span className="text-[11px] font-medium text-[#8c8b84]">Sittings</span>
          <p className="text-lg font-bold text-white mt-1">
            {sittings.length || (count > 0 ? 1 : 0)}
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-[#1a1a19] border border-[#2e2e2c]">
          <span className="text-[11px] font-medium text-[#8c8b84]">Per reel</span>
          <p className="text-lg font-bold text-white mt-1">
            {count > 0 ? `${secondsPerReel}s` : '–'}
          </p>
        </div>
      </div>

      {/* By Hour Chart Panel */}
      <div className="p-4 rounded-2xl bg-[#1a1a19] border border-[#2e2e2c] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white">By hour</span>
          <span className="text-[11px] font-mono text-[#8c8b84]">
            {activeFocusHour !== null
              ? `${formatHourLabel(activeFocusHour)}: ${hourly[activeFocusHour]} reels`
              : 'Tap a bar to inspect'}
          </span>
        </div>

        {/* 24-hour column bars */}
        <div className="h-20 flex items-end justify-between gap-[2px] pt-2 border-b border-[#2e2e2c] pb-1">
          {hourly.map((val, h) => {
            const heightPercent = maxHourly > 0 ? Math.max((val / maxHourly) * 100, 4) : 4;
            const isSelected = selectedHour === h;
            const isPeak = h === peakHour && val > 0;

            return (
              <button
                key={h}
                type="button"
                onClick={() => {
                  playSound('tap');
                  setSelectedHour(selectedHour === h ? null : h);
                }}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer focus:outline-none"
                title={`${formatHourLabel(h)}: ${val} reels`}
              >
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-sm transition-all ${
                    isSelected
                      ? 'bg-[#f4533f]'
                      : isPeak
                      ? 'bg-[#b8ff3c]'
                      : val > 0
                      ? 'bg-neutral-300 group-hover:bg-neutral-100'
                      : 'bg-neutral-800'
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-[#8c8b84]">
          <span>12 AM</span>
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>11 PM</span>
        </div>
      </div>

      {/* Sittings History Panel */}
      <div className="p-4 rounded-2xl bg-[#1a1a19] border border-[#2e2e2c] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white">When you scrolled</span>
          <span className="text-[10px] text-[#8c8b84]">Break ≥3 min = new sitting</span>
        </div>

        {sittings.length === 0 ? (
          <p className="text-xs text-[#8c8b84] py-2">
            No reels recorded yet today. Swipe reels to begin.
          </p>
        ) : (
          <div className="space-y-2 divide-y divide-white/5">
            {sittings.slice(-4).reverse().map((sit, idx) => (
              <div key={sit.id} className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-white">
                    {new Date(sit.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' – '}
                    {new Date(sit.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {idx === 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      live
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono font-bold text-[#b8ff3c]">
                  {sit.reels} reels
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions & Export */}
      <div className="pt-2 flex items-center justify-between text-xs text-[#8c8b84]">
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white font-mono cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Export debug capture
        </button>
        {exportMessage && (
          <span className="text-[11px] text-[#4cc27e] font-mono">
            {exportMessage}
          </span>
        )}
      </div>
    </div>
  );
};
