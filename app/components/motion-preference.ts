"use client";

import { useSyncExternalStore } from "react";

let paused = false;
const listeners = new Set<() => void>();
export function motionPaused() { return paused; }
export function subscribeMotion(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function toggleMotion() {
  paused = !paused;
  document.documentElement.dataset.motionPaused = String(paused);
  listeners.forEach(listener => listener());
}
export function useMotionPaused() {
  return useSyncExternalStore(subscribeMotion, motionPaused, () => false);
}
