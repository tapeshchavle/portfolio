"use client";

import { create } from "zustand";

export type Phase = "breach" | "signal" | "memory" | "scan" | "terminal";

interface CursorState {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
}

interface VoidState {
  // Scroll state
  scrollProgress: number;
  scrollVelocity: number;
  phase: Phase;

  // Cursor state
  cursor: CursorState;
  isHovering: boolean;

  // Reality state
  realityIntegrity: number;
  breachComplete: boolean;

  // Audio
  audioEnabled: boolean;

  // Terminal
  terminalActive: boolean;
  terminalHistory: string[];

  // Actions
  setScrollProgress: (progress: number) => void;
  setScrollVelocity: (velocity: number) => void;
  setCursor: (cursor: Partial<CursorState>) => void;
  setIsHovering: (hovering: boolean) => void;
  incrementRealityIntegrity: (amount: number) => void;
  setBreachComplete: (complete: boolean) => void;
  toggleAudio: () => void;
  setTerminalActive: (active: boolean) => void;
  addTerminalHistory: (command: string) => void;
}

const getPhaseFromProgress = (progress: number): Phase => {
  if (progress < 0.1) return "breach";
  if (progress < 0.3) return "signal";
  if (progress < 0.6) return "memory";
  if (progress < 0.8) return "scan";
  return "terminal";
};

export const useVoidStore = create<VoidState>((set) => ({
  // Initial state
  scrollProgress: 0,
  scrollVelocity: 0,
  phase: "breach",

  cursor: {
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
  },
  isHovering: false,

  realityIntegrity: 0,
  breachComplete: false,

  audioEnabled: false,

  terminalActive: false,
  terminalHistory: [],

  // Actions
  setScrollProgress: (progress) =>
    set({
      scrollProgress: progress,
      phase: getPhaseFromProgress(progress),
    }),

  setScrollVelocity: (velocity) => set({ scrollVelocity: velocity }),

  setCursor: (cursor) =>
    set((state) => ({
      cursor: { ...state.cursor, ...cursor },
    })),

  setIsHovering: (hovering) => set({ isHovering: hovering }),

  incrementRealityIntegrity: (amount) =>
    set((state) => ({
      realityIntegrity: Math.min(100, state.realityIntegrity + amount),
    })),

  setBreachComplete: (complete) => set({ breachComplete: complete }),

  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),

  setTerminalActive: (active) => set({ terminalActive: active }),

  addTerminalHistory: (command) =>
    set((state) => ({
      terminalHistory: [...state.terminalHistory, command],
    })),
}));
