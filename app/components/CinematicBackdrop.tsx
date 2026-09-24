"use client";

import { useEffect, useRef, useState } from "react";

type CinematicBackdropProps = {
  src: string;
  className?: string;
  eager?: boolean;
};

export default function CinematicBackdrop({ src, className = "", eager = false }: CinematicBackdropProps) {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(eager);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduced.matches || connection?.saveData) {
      setActive(false);
      return;
    }
    if (eager) {
      setActive(true);
      return;
    }
    const node = host.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setActive(true);
        observer.disconnect();
      }
    }, { rootMargin: "35% 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [eager]);

  return (
    <div ref={host} className={`cinematic-backdrop ${className}`} data-ready={ready} aria-hidden="true">
      {active && (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload={eager ? "auto" : "metadata"}
          onCanPlay={() => setReady(true)}
          onError={() => setReady(false)}
        />
      )}
      <span className="cinematic-backdrop-scrim" />
    </div>
  );
}
