import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Smartphone, ExternalLink } from 'lucide-react';
import { playSound } from '../utils/audio';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 text-white shadow-2xl space-y-5 relative">
        <button
          onClick={() => {
            playSound('tap');
            onClose();
          }}
          className="absolute top-5 right-5 p-1 rounded-full text-neutral-400 hover:text-white bg-[#241f33] hover:bg-[#2c2537] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#4cc27e]/20 text-[#4cc27e] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Accessibility Service Status</h3>
            <span className="text-xs font-mono text-[#4cc27e] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4cc27e] animate-pulse" />
              Brainrot Service Active & Tracking
            </span>
          </div>
        </div>

        <div className="space-y-3 text-xs text-neutral-300">
          <div className="p-3.5 rounded-2xl bg-[#120f18] border border-[#2c2537] space-y-1.5">
            <div className="flex items-center gap-2 text-white font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#4cc27e]" />
              <span>Permission: Subscribed to Reel Scroll Events</span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Filtered solely to <code className="text-[#b8ff3c]">com.instagram.android</code>. Brainrot receives scroll events from <code className="text-[#b8ff3c]">clips_viewer_view_pager</code> to detect reel index increments.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#120f18] border border-[#2c2537] space-y-1.5">
            <div className="flex items-center gap-2 text-white font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#4cc27e]" />
              <span>Floating Overlay (SYSTEM_ALERT_WINDOW)</span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Grants permission to display the draggable rotten brain on top of Instagram Reels without intercepting your swipes.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-1 text-amber-200">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>OEM Battery Optimization Advisory</span>
            </div>
            <p className="text-neutral-300">
              If tracking ever stops, verify your Android Battery setting is toggled to <b>Unrestricted</b> so the system won't put Brainrot into deep sleep.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => {
              playSound('tap');
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#b8ff3c] hover:bg-[#a5f02c] text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Got it, Everything Looks Good
          </button>
        </div>
      </div>
    </div>
  );
};
