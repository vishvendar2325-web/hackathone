import React, { useState } from 'react';
import { Download, Copy, Check, Smartphone, BatteryCharging, ShieldAlert, Sparkles, HelpCircle, ExternalLink } from 'lucide-react';
import { playSound } from '../utils/audio';

const SHA256_CHECKSUM = '4c839fc04842c464f6aacd14e3beaff6b51eedf1d6e5aa253690eb8fc4ac37d0';

export const InstallAndDownloadView: React.FC = () => {
  const [copiedSha, setCopiedSha] = useState(false);

  const copySha = () => {
    playSound('tap');
    navigator.clipboard?.writeText(SHA256_CHECKSUM);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 py-6 select-none">
      {/* Download Hero Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1a1424] via-[#120f18] to-black border border-[#2c2537] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-[#b8ff3c]/10 text-[#b8ff3c] border border-[#b8ff3c]/30">
              Latest Release • v1.0.4
            </span>
            <span className="text-xs font-mono text-neutral-400">Android 10+ (API 29+)</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Get the Brainrot APK
          </h2>

          <p className="text-sm text-neutral-300 leading-relaxed font-sans">
            Ready to face the reality of your daily screen time? Download the authentic Android build. Clean, offline, no ads, no trackers.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="/assets/brainrot.apk"
              download="brainrot.apk"
              onClick={() => playSound('stageUp')}
              className="px-6 py-3.5 rounded-2xl bg-[#b8ff3c] hover:bg-[#a5f02c] text-black font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(184,255,60,0.4)] active:scale-95 transition"
            >
              <Download className="w-5 h-5" />
              Download APK (25.8 MB)
            </a>

            <a
              href="https://github.com/ayush78490/brainRot"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3.5 rounded-2xl bg-[#1f1a29] hover:bg-[#2c2537] border border-[#2c2537] text-white font-mono text-xs flex items-center gap-2 transition"
            >
              <ExternalLink className="w-4 h-4 text-neutral-400" />
              GitHub Repository
            </a>
          </div>

          {/* SHA-256 Checksum */}
          <div className="pt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span>SHA-256:</span>
              <code className="text-neutral-200 bg-black/40 px-2 py-0.5 rounded border border-white/5 truncate max-w-[260px] sm:max-w-xs">
                {SHA256_CHECKSUM}
              </code>
              <button
                onClick={copySha}
                className="text-[#b8ff3c] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedSha ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSha ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Brain Rotting Icon Display */}
        <div className="relative flex flex-col items-center">
          <img
            src="/assets/brain-6.png"
            alt="Brainrot Terminal Stage"
            className="w-44 h-36 object-contain animate-breathe drop-shadow-[0_10px_30px_rgba(73,230,255,0.4)]"
          />
          <span className="text-[11px] font-mono text-[#49e6ff] mt-2">
            Stage 6: Brain rot
          </span>
        </div>
      </div>

      {/* 4-Step Installation Guide */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-[#b8ff3c]" />
          4-Step Android Setup
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#17131f] border border-[#2c2537] space-y-2">
            <div className="w-7 h-7 rounded-lg bg-[#b8ff3c]/20 text-[#b8ff3c] flex items-center justify-center font-mono font-bold text-xs">
              1
            </div>
            <h4 className="font-bold text-white text-sm">Install the APK</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Open the downloaded <code className="text-[#b8ff3c]">brainrot.apk</code> file or run <code className="text-[#b8ff3c]">adb install -r app-debug.apk</code>. Android may ask to allow unknown sources.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#17131f] border border-[#2c2537] space-y-2">
            <div className="w-7 h-7 rounded-lg bg-[#b8ff3c]/20 text-[#b8ff3c] flex items-center justify-center font-mono font-bold text-xs">
              2
            </div>
            <h4 className="font-bold text-white text-sm">Turn On Accessibility</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Go to <b>Settings → Accessibility → Installed apps → Brainrot → On</b>. The app's status pill opens this screen for you and turns green ("Tracking") when running.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#17131f] border border-[#2c2537] space-y-2">
            <div className="w-7 h-7 rounded-lg bg-[#b8ff3c]/20 text-[#b8ff3c] flex items-center justify-center font-mono font-bold text-xs">
              3
            </div>
            <h4 className="font-bold text-white text-sm">Unrestricted Battery</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Go to <b>Settings → Apps → Brainrot → Battery → Unrestricted</b>. This prevents OnePlus, Xiaomi, and Samsung task killers from halting the service.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#17131f] border border-[#2c2537] space-y-2">
            <div className="w-7 h-7 rounded-lg bg-[#b8ff3c]/20 text-[#b8ff3c] flex items-center justify-center font-mono font-bold text-xs">
              4
            </div>
            <h4 className="font-bold text-white text-sm">Open Reels and Swipe</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Open Instagram and go to the Reels tab. The floating brain pops up on top of the screen immediately and reacts with every scroll!
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="p-6 rounded-3xl bg-[#120f18] border border-[#2c2537] space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#ff4fd8]" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-3 divide-y divide-white/5 text-xs text-neutral-300">
          <div className="pt-2">
            <b className="text-white block mb-1">Does it slow down Instagram or my phone?</b>
            No. Brainrot only intercepts 3 native OS events: View Scrolled, Window Changed, and Tab Selected. It performs zero heavy operations or OCR on screen content.
          </div>
          <div className="pt-3">
            <b className="text-white block mb-1">What happens when midnight passes?</b>
            Brainrot automatically computes today's count based on current day timestamps. At local midnight, your counter and the brain automatically return to 0 (Fresh).
          </div>
          <div className="pt-3">
            <b className="text-white block mb-1">What if Instagram updates and changes its code?</b>
            Brainrot provides a built-in "Export debug capture" feature that writes recent UI signals to a JSON file. The developers use this corpus to immediately update view ids in `ReelsContext.kt`.
          </div>
        </div>
      </div>
    </div>
  );
};
