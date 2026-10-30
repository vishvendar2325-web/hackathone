import React, { useState } from 'react';
import { ShieldCheck, Code, Cpu, Database, EyeOff, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';
import { playSound } from '../utils/audio';

const CODE_SNIPPETS = {
  brainRot: `// service/src/main/java/com/reeltracker/service/BrainRot.kt
object BrainRot {
    /** Stage i is reached at [THRESHOLDS][i] reels today. */
    private val THRESHOLDS = intArrayOf(0, 10, 25, 50, 100, 175, 250)
    private val SPRITES = intArrayOf(
        R.drawable.brain_stage_0,
        R.drawable.brain_stage_1,
        R.drawable.brain_stage_2,
        R.drawable.brain_stage_3,
        R.drawable.brain_stage_4,
        R.drawable.brain_stage_5,
        R.drawable.brain_stage_6,
    )
    private val LABELS = arrayOf("Fresh", "Bruised", "Foggy", "Fried", "Mushy", "Rotting", "Brain rot")
    const val STAGES = 7

    fun stage(count: Int): Int = THRESHOLDS.indexOfLast { count >= it }.coerceAtLeast(0)
    fun sprite(stage: Int): Int = SPRITES[stage.coerceIn(0, STAGES - 1)]
    fun label(stage: Int): String = LABELS[stage.coerceIn(0, STAGES - 1)]

    /** Reels left until next stage, or null at stage 6. */
    fun untilNext(count: Int): Int? {
        val next = stage(count) + 1
        return if (next < STAGES) THRESHOLDS[next] - count else null
    }

    /** From stage 4 the brain turns green: drips switch from sweat to slime. */
    fun isSlimy(stage: Int) = stage >= 4

    /** Smoke rises off the last two stages continuously. */
    fun isSmoking(stage: Int) = stage >= 5
}`,
  indexStrategy: `// core-detect/src/main/kotlin/com/reeltracker/detect/IndexStrategy.kt
class IndexStrategy : DetectionStrategy {
    private var lastSeenIndex = -1
    private var highestIndexInEpoch = -1

    override fun onSignal(signal: UiSignal): Decision {
        if (signal !is UiSignal.Scrolled) return Decision.Ignore

        val index = signal.toIndex ?: return Decision.Ignore

        // Abandoned half-swipe never changes index -> does not count
        if (index == lastSeenIndex) return Decision.Ignore

        // Swiping back lands on an index already seen -> ignore
        if (index <= highestIndexInEpoch) {
            lastSeenIndex = index
            return Decision.Ignore
        }

        // New reel confirmed!
        highestIndexInEpoch = index
        lastSeenIndex = index
        return Decision.CountReel(index)
    }
}`,
  reelsContext: `// core-detect/src/main/kotlin/com/reeltracker/detect/ReelsContext.kt
/**
 * Instagram's internal view ids. Verified on IG 447.0.0.55.81 (Android 15).
 * Brainrot subscribes ONLY to scroll and tab events on these specific IDs.
 */
object ReelsContext {
    const val PACKAGE_INSTAGRAM = "com.instagram.android"
    
    // The main vertical ViewPager2 inside Reels
    const val ID_CLIPS_VIEW_PAGER = "clips_viewer_view_pager"
    
    // Bottom bar tab button for Reels
    const val ID_CLIPS_TAB = "clips_tab"
    
    // Profile view id for optional friend connect
    const val ID_PROFILE_ACTION_BAR = "action_bar_title"
}`,
  schemaSql: `-- supabase/schema.sql
-- Anonymous auth + push_stats RPC that only accepts caller's own updates
create table if not exists daily_stats (
    user_id uuid primary key references auth.users(id) on delete cascade,
    day date not null default current_date,
    count integer not null default 0 check (count >= 0 and count <= 10000),
    scrolling_seconds integer not null default 0,
    updated_at timestamptz not null default now()
);

-- Push totals keeping the maximum value (idempotent, safe against retries)
create or replace function push_stats(p_count int, p_seconds int)
returns void language plpgsql security definer as $$
begin
    insert into daily_stats (user_id, day, count, scrolling_seconds, updated_at)
    values (auth.uid(), current_date, p_count, p_seconds, now())
    on conflict (user_id) do update
    set count = greatest(daily_stats.count, excluded.count),
        scrolling_seconds = greatest(daily_stats.scrolling_seconds, excluded.scrolling_seconds),
        updated_at = now();
end;
$$;`,
};

export const TechnicalArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'brainRot' | 'indexStrategy' | 'reelsContext' | 'schemaSql'>('brainRot');
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    playSound('tap');
    navigator.clipboard?.writeText(CODE_SNIPPETS[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[#49e6ff] flex items-center justify-center gap-1.5">
          <Cpu className="w-4 h-4" /> Engineering & Privacy Architecture
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          How Brainrot Counts Without Spying
        </h2>
        <p className="text-sm text-neutral-400 max-w-2xl mx-auto">
          Unlike sketchy trackers, Brainrot never reads captions, comments, or DMs. It uses an Android AccessibilityService to observe page transitions with mathematical precision.
        </p>
      </div>

      {/* 5-Step Pipeline Flow */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {[
          {
            step: '01',
            title: 'AccessibilityEvent',
            desc: 'Subscribes only to View Scrolled, Window Changed, and Tab Selected from Instagram.',
            icon: EyeOff,
            color: 'text-rose-400',
          },
          {
            step: '02',
            title: 'SignalMapper',
            desc: 'Drops all non-Instagram events. Turns scroll events into lightweight UiSignal objects.',
            icon: Cpu,
            color: 'text-amber-400',
          },
          {
            step: '03',
            title: 'Detector',
            desc: 'Pure state machine: Outside Reels ↔ In Reels. Enters on clips_tab, exits when leaving.',
            icon: Code,
            color: 'text-lime-400',
          },
          {
            step: '04',
            title: 'IndexStrategy',
            desc: 'Only increments when pager settles on an index not yet seen. Re-scrolls are ignored.',
            icon: CheckCircle2,
            color: 'text-[#b8ff3c]',
          },
          {
            step: '05',
            title: 'Room & Overlay',
            desc: 'Saves event timestamp to Room DB (reels.db). Updates overlay brain & home widget.',
            icon: Database,
            color: 'text-[#49e6ff]',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-[#17131f] border border-[#2c2537] relative flex flex-col justify-between group hover:border-[#b8ff3c]/40 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-neutral-500">
                  STEP {item.step}
                </span>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">
                {item.title}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
            {i < 4 && (
              <ChevronRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600 z-10" />
            )}
          </div>
        ))}
      </div>

      {/* Privacy Guarantees */}
      <div className="p-6 rounded-3xl bg-[#120f18] border border-[#2c2537] space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#b8ff3c]" />
          <h3 className="text-lg font-bold text-white">
            100% On-Device Privacy Architecture
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-300">
          <div className="p-3.5 rounded-xl bg-[#17131f] border border-[#2c2537]">
            <b className="text-white block mb-1">No Caption Sniffing</b>
            The service reads no view text and never walks the view tree. Only the scrolling view id and pager position are processed.
          </div>
          <div className="p-3.5 rounded-xl bg-[#17131f] border border-[#2c2537]">
            <b className="text-white block mb-1">Local Room Database</b>
            All counts live on your phone in <code className="text-[#b8ff3c]">reels.db</code>. No telemetry, no third-party analytics trackers.
          </div>
          <div className="p-3.5 rounded-xl bg-[#17131f] border border-[#2c2537]">
            <b className="text-white block mb-1">Optional Supabase Sync</b>
            Data never leaves your phone unless you explicitly connect for friends. Total reels and seconds are pushed with anonymous auth.
          </div>
        </div>
      </div>

      {/* Code Inspector */}
      <div className="rounded-3xl bg-[#120f18] border border-[#2c2537] overflow-hidden shadow-2xl">
        <div className="px-5 py-3 border-b border-[#2c2537] flex flex-wrap items-center justify-between gap-3 bg-[#17131f]">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-[#b8ff3c]" />
            <span className="text-xs font-mono font-bold text-white">
              Authentic Kotlin & SQL Source Code
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {(
              [
                ['brainRot', 'BrainRot.kt'],
                ['indexStrategy', 'IndexStrategy.kt'],
                ['reelsContext', 'ReelsContext.kt'],
                ['schemaSql', 'schema.sql'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  playSound('tap');
                  setActiveTab(key);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                  activeTab === key
                    ? 'bg-[#2c2537] text-white border border-[#b8ff3c]/40'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={copyCode}
            className="flex items-center gap-1 text-xs font-mono text-[#b8ff3c] hover:underline cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Code
              </>
            )}
          </button>
        </div>

        <pre className="p-5 font-mono text-xs text-neutral-300 overflow-x-auto leading-relaxed bg-[#0c0a10]">
          <code>{CODE_SNIPPETS[activeTab]}</code>
        </pre>
      </div>
    </div>
  );
};
