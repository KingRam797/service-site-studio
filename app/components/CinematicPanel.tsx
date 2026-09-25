"use client";

import CinematicBackdrop from "./CinematicBackdrop";
import { toggleMotion, useMotionPaused } from "./motion-preference";

export default function CinematicPanel({ src, poster, label }: { src: string; poster: string; label: string }) {
  const paused = useMotionPaused();
  return <figure className="motion-panel" aria-label={label}>
    <CinematicBackdrop src={src} poster={poster} className="panel-film" />
    <figcaption className="motion-panel-caption">
      <span>{label}</span>
      <button type="button" onClick={toggleMotion} aria-pressed={paused} aria-label={paused ? "Resume all cinematic motion" : "Pause all cinematic motion"}>{paused ? "Resume motion" : "Pause motion"}</button>
    </figcaption>
  </figure>;
}
