"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cinematicPolicy } from "@/lib/cinematic-policy";
import { motionPaused, subscribeMotion } from "./motion-preference";

type CinematicBackdropProps = {
  src: string;
  poster: string;
  className?: string;
  eager?: boolean;
};

/** No video URL is attached until browser preferences and proximity are known. */
export default function CinematicBackdrop({ src, poster, className = "", eager = false }: CinematicBackdropProps) {
  const host = useRef<HTMLDivElement>(null);
  const film = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = host.current;
    const video = film.current;
    if (!node || !video) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
    let near = eager, visible = false, failed = false, disposed = false, pending = false;
    const policy = () => cinematicPolicy({ reduced: reduced.matches, saveData: !!connection?.saveData, paused: motionPaused(), near, visible, hidden: document.hidden, failed });
    const release = () => {
      video.pause();
      node.dataset.ready = "false";
      if (video.hasAttribute("src")) { video.removeAttribute("src"); video.load(); }
    };
    const fail = () => { failed = true; release(); };
    const sync = () => {
      if (disposed) return;
      const state = policy();
      if (state.release) { release(); return; }
      if (state.attach && !video.hasAttribute("src")) { video.src = src; video.load(); }
      if (!state.play) { video.pause(); return; }
      if (!video.hasAttribute("src") || !video.paused || pending) return;
      pending = true;
      video.play().then(() => {
        if (disposed || !policy().play) video.pause();
      }).catch((error: DOMException) => {
        // A pause, preference change or cleanup may interrupt a pending play.
        if (!disposed && policy().play && error.name !== "AbortError") fail();
      }).finally(() => {
        pending = false;
        if (!disposed && !failed && policy().play && video.paused) sync();
      });
    };
    const playing = () => {
      if (policy().play) node.dataset.ready = "true";
      else video.pause();
    };
    const proximity = new IntersectionObserver(([entry]) => { near = entry.isIntersecting; sync(); }, { rootMargin: "35% 0px" });
    const viewport = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    proximity.observe(node); viewport.observe(node);
    video.addEventListener("playing", playing);
    video.addEventListener("error", fail);
    reduced.addEventListener("change", sync);
    connection?.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    const unsubscribe = subscribeMotion(sync);
    sync();
    return () => {
      disposed = true;
      proximity.disconnect(); viewport.disconnect(); unsubscribe();
      reduced.removeEventListener("change", sync);
      connection?.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      video.removeEventListener("playing", playing); video.removeEventListener("error", fail);
      release();
    };
  }, [src, eager]);

  return (
    <div ref={host} className={`cinematic-backdrop ${className}`} aria-hidden="true">
      <Image className="cinematic-poster" src={poster} alt="" fill sizes={eager ? "(max-width: 900px) 90vw, 45vw" : "100vw"} preload={eager} />
      <video ref={film} muted loop playsInline preload="none" tabIndex={-1} disablePictureInPicture />
      <span className="cinematic-backdrop-scrim" />
    </div>
  );
}
