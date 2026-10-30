import React, { useState, useEffect, useRef } from 'react';
import { getStage, getStageInfo } from '../types/brainrot';
import { playSound } from '../utils/audio';

interface FloatingBrainOverlayProps {
  count: number;
  lastSwipeTime?: number;
  isStageUpgraded?: boolean;
  onTap?: () => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  compact?: boolean;
}

export const FloatingBrainOverlay: React.FC<FloatingBrainOverlayProps> = ({
  count,
  lastSwipeTime,
  isStageUpgraded,
  onTap,
  containerRef,
  compact = false,
}) => {
  const stage = getStage(count);
  const info = getStageInfo(count);
  const isSlimy = stage >= 4;
  const isSmoking = stage >= 5;

  // Draggable position within container
  const [pos, setPos] = useState({ x: 200, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isSquishing, setIsSquishing] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [drops, setDrops] = useState<Array<{ id: number; x: number; isSlime: boolean }>>([]);
  const [showTooltip, setShowTooltip] = useState(false);

  const prevCount = useRef(count);
  const prevStage = useRef(stage);

  // Trigger squish and drop on count change
  useEffect(() => {
    if (count > prevCount.current) {
      setIsSquishing(true);
      const dropId = Date.now();
      const dropOffset = (Math.random() - 0.5) * 24;
      setDrops((prev) => [...prev.slice(-3), { id: dropId, x: dropOffset, isSlime: isSlimy }]);

      const squishTimer = setTimeout(() => setIsSquishing(false), 450);
      const dropTimer = setTimeout(() => {
        setDrops((prev) => prev.filter((d) => d.id !== dropId));
      }, 900);

      return () => {
        clearTimeout(squishTimer);
        clearTimeout(dropTimer);
      };
    }
    prevCount.current = count;
  }, [count, isSlimy]);

  // Trigger stage upgrade shake & lightning
  useEffect(() => {
    if (stage > prevStage.current || isStageUpgraded) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 600);
      return () => clearTimeout(timer);
    }
    prevStage.current = stage;
  }, [stage, isStageUpgraded]);

  // Handle Dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
    setShowTooltip(false);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      const container = containerRef?.current;
      const bounds = container
        ? container.getBoundingClientRect()
        : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };

      const minX = 10;
      const maxX = bounds.width - (compact ? 70 : 96);
      const minY = 30;
      const maxY = bounds.height - (compact ? 80 : 110);

      const rawX = e.clientX - bounds.left - dragOffset.x;
      const rawY = e.clientY - bounds.top - dragOffset.y;

      setPos({
        x: Math.max(minX, Math.min(maxX, rawX)),
        y: Math.max(minY, Math.min(maxY, rawY)),
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      // Snap to nearest side edge (per OverlayController.kt)
      const container = containerRef?.current;
      const bounds = container ? container.getBoundingClientRect() : { width: window.innerWidth };
      const width = bounds.width;
      const mid = width / 2;

      setPos((p) => ({
        x: p.x < mid ? 14 : width - (compact ? 76 : 106),
        y: p.y,
      }));
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, dragOffset, containerRef, compact]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDragging) return;
    playSound('tap');
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2400);
    onTap?.();
  };

  return (
    <div
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        touchAction: 'none',
      }}
      className={`absolute z-40 select-none cursor-grab active:cursor-grabbing transition-transform ${
        isDragging ? 'duration-0' : 'duration-300 ease-out'
      }`}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      <div
        className={`relative flex flex-col items-center group ${
          isSquishing ? 'animate-squish' : isShaking ? 'animate-shake' : 'animate-breathe'
        }`}
      >
        {/* Shockwave ring on stage upgrade */}
        {isShaking && (
          <img
            src="/assets/fx_ring.png"
            alt=""
            className="absolute -top-3 -left-3 w-28 h-28 pointer-events-none animate-shockwave opacity-80"
          />
        )}

        {/* Lightning bolt on stage upgrade */}
        {isShaking && (
          <img
            src="/assets/fx_bolt.png"
            alt=""
            className="absolute -top-6 -right-2 w-10 h-10 pointer-events-none animate-bounce"
          />
        )}

        {/* Continuous smoke curls for stages 5 & 6 */}
        {isSmoking && (
          <div className="absolute -top-7 inset-x-0 flex justify-center pointer-events-none">
            <img
              src="/assets/fx-smoke-1.png"
              alt=""
              className="w-7 h-7 opacity-75 animate-smoke"
              style={{ animationDelay: '0s' }}
            />
            <img
              src="/assets/fx-smoke-2.png"
              alt=""
              className="w-7 h-7 opacity-70 animate-smoke -ml-3"
              style={{ animationDelay: '0.7s' }}
            />
          </div>
        )}

        {/* Brain Sprite */}
        <div className="relative">
          <img
            src={info.sprite}
            alt={info.name}
            className={`${compact ? 'w-16 h-14' : 'w-22 h-18'} object-contain drop-shadow-[0_4px_12px_${info.glow}] filter transition-all`}
            draggable={false}
          />

          {/* Drip drops falling */}
          {drops.map((d) => (
            <img
              key={d.id}
              src={d.isSlime ? '/assets/fx-drop-green.png' : '/assets/fx-drop-blue.png'}
              alt=""
              style={{ left: `calc(50% + ${d.x}px)` }}
              className="absolute -bottom-1 w-4 h-5 pointer-events-none animate-drop-fall"
            />
          ))}
        </div>

        {/* Reels Count Tag */}
        <div
          className={`-mt-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold tracking-tight shadow-md border flex items-center gap-1 ${
            isSlimy
              ? 'bg-[#17131f] text-[#b8ff3c] border-[#b8ff3c]/40 shadow-[0_0_8px_rgba(184,255,60,0.3)]'
              : 'bg-[#17131f] text-[#ff4fd8] border-[#ff4fd8]/40 shadow-[0_0_8px_rgba(255,79,216,0.3)]'
          }`}
        >
          <span>{count}</span>
          <span className="text-[10px] opacity-75 font-normal">reels</span>
        </div>

        {/* Click tip tooltip */}
        {showTooltip && (
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 text-white text-[11px] px-2.5 py-1 rounded-md border border-white/10 shadow-lg pointer-events-none">
            Stage {stage}: {info.name} • Drag to dock!
          </div>
        )}
      </div>
    </div>
  );
};
