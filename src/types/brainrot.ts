export interface BrainStage {
  stage: number;
  at: number;
  name: string;
  desc: string;
  sprite: string;
  glow: string;
  textColor: string;
  dripType: 'sweat' | 'slime';
  hasSmoke: boolean;
}

export const STAGES: BrainStage[] = [
  {
    stage: 0,
    at: 0,
    name: "Fresh",
    desc: "Pink and intact. Untouched brain tissue. Zero reels scrolled today. You could still put the phone down and read a book.",
    sprite: "/assets/brain-0.png",
    glow: "rgba(255, 79, 216, 0.4)",
    textColor: "text-pink-400",
    dripType: "sweat",
    hasSmoke: false,
  },
  {
    stage: 1,
    at: 10,
    name: "Bruised",
    desc: "A dull purple bruise on the left lobe. The dopamine loop has engaged. 'Just catching up on friend stories' turned into scrolling.",
    sprite: "/assets/brain-1.png",
    glow: "rgba(214, 93, 177, 0.4)",
    textColor: "text-purple-400",
    dripType: "sweat",
    hasSmoke: false,
  },
  {
    stage: 2,
    at: 25,
    name: "Foggy",
    desc: "Graying fissures. Thought processing speed down 18%. You forgot what you picked up your phone to do.",
    sprite: "/assets/brain-2.png",
    glow: "rgba(132, 94, 194, 0.45)",
    textColor: "text-indigo-400",
    dripType: "sweat",
    hasSmoke: false,
  },
  {
    stage: 3,
    at: 50,
    name: "Fried",
    desc: "Cracks web across the frontal cortex. 50 reels in. The sweat is heavier. Subtitles feel mandatory.",
    sprite: "/assets/brain-3.png",
    glow: "rgba(255, 111, 145, 0.5)",
    textColor: "text-rose-400",
    dripType: "sweat",
    hasSmoke: false,
  },
  {
    stage: 4,
    at: 100,
    name: "Mushy",
    desc: "The brain turns sickly toxic green. Blue sweat switches to green dripping slime. Attention span is now 3.2 seconds.",
    sprite: "/assets/brain-4.png",
    glow: "rgba(184, 255, 60, 0.55)",
    textColor: "text-lime-400",
    dripType: "slime",
    hasSmoke: false,
  },
  {
    stage: 5,
    at: 175,
    name: "Rotting",
    desc: "Decomposition in full swing. Green rot spreads across both hemispheres. Smoke starts curling off the top.",
    sprite: "/assets/brain-5.png",
    glow: "rgba(127, 207, 0, 0.6)",
    textColor: "text-emerald-400",
    dripType: "slime",
    hasSmoke: true,
  },
  {
    stage: 6,
    at: 250,
    name: "Brain rot",
    desc: "Terminal brainrot. The final stage. Continuous smoke, lightning tremors, no thoughts head empty, it's 3am and the algorithm won.",
    sprite: "/assets/brain-6.png",
    glow: "rgba(73, 230, 255, 0.65)",
    textColor: "text-cyan-400",
    dripType: "slime",
    hasSmoke: true,
  },
];

export const THRESHOLDS = [0, 10, 25, 50, 100, 175, 250];

export function getStage(count: number): number {
  let stage = 0;
  for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
    if (count >= THRESHOLDS[i]) {
      stage = i;
      break;
    }
  }
  return stage;
}

export function getStageInfo(count: number): BrainStage {
  return STAGES[getStage(count)];
}

export function getUntilNext(count: number): number | null {
  const current = getStage(count);
  if (current < STAGES.length - 1) {
    return THRESHOLDS[current + 1] - count;
  }
  return null;
}

export interface Sitting {
  id: string;
  start: number;
  end: number;
  reels: number;
}

export interface FriendEntry {
  id: string;
  username: string;
  name: string;
  count: number;
  stage: number;
  isOnline: boolean;
  avatarColor: string;
  lastActive: string;
}

export interface SimulatedReel {
  id: number;
  username: string;
  caption: string;
  audio: string;
  likes: string;
  comments: string;
  gradient: string;
  category: string;
  bgSymbol: string;
}
