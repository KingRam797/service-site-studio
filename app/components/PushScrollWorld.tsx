"use client";

import { useEffect, useRef } from "react";

import CinematicBackdrop from "./CinematicBackdrop";
import { cinematicAssets } from "@/config/cinematic-assets";
import { motionPaused, subscribeMotion, toggleMotion, useMotionPaused } from "./motion-preference";

export default function PushScrollWorld() {
  const host = useRef<HTMLDivElement>(null);
  const paused = useMotionPaused();

  useEffect(() => {
    const container = host.current;
    const main = document.getElementById("main");
    if (!container || !main) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("push-paths"); svg.setAttribute("aria-hidden", "true");
    const paths: SVGPathElement[] = [];
    const cards = Array.from(main.querySelectorAll<HTMLElement>(".proof-card"));
    cards.forEach((_, i) => {
      const path = document.createElementNS(svg.namespaceURI, "path") as SVGPathElement;
      path.setAttribute("fill", "none"); path.setAttribute("stroke", i % 2 ? "#00cdf0" : "#ceff00");
      path.setAttribute("stroke-width", "2"); path.setAttribute("pathLength", "1");
      path.style.strokeDasharray = "1"; paths.push(path); svg.appendChild(path);
    });
    main.prepend(svg);
    let disposed = false, frame = 0;
    const stages = Array.from(main.querySelectorAll<HTMLElement>(".signal-stage"));
    let stageTops: number[] = [];
    let points: { start: number; end: number }[] = [];

    const measure = () => {
      const bounds = main.getBoundingClientRect();
      const from = container.getBoundingClientRect();
      const startX = from.left - bounds.left + from.width / 2;
      const startY = from.top - bounds.top + from.height * .82;
      svg.setAttribute("width", String(bounds.width));
      svg.setAttribute("height", String(main.querySelector("#proof")!.getBoundingClientRect().bottom - bounds.top));
      points = cards.map((card, i) => {
        const b = card.getBoundingClientRect();
        const x = b.left - bounds.left + b.width / 2;
        const y = b.top - bounds.top;
        const gutter = window.innerWidth < 700 ? b.left - bounds.left - 10 : (i % 2 ? b.right - bounds.left + 12 : b.left - bounds.left - 12);
        const bridgeY = Math.min(startY + 150, y - 50);
        paths[i].setAttribute("d", `M${startX},${startY} C${startX},${bridgeY} ${gutter},${startY} ${gutter},${bridgeY} L${gutter},${y - 25} Q${gutter},${y - 12} ${gutter + (x > gutter ? 18 : -18)},${y - 12} L${x},${y - 12} L${x},${y + 10}`);
        return { start: startY + bounds.top + scrollY, end: y + bounds.top + scrollY };
      });
      stageTops = stages.map(stage => stage.getBoundingClientRect().top + scrollY);
      schedule();
    };
    const draw = () => {
      frame = 0;
      if (disposed || document.hidden || motionPaused()) return;
      const tip = scrollY + innerHeight * .85;
      stages.forEach((stage, i) => stage.style.setProperty("--signal-arrival", String(reduced.matches ? 1 : Math.max(0, Math.min(1, (tip - stageTops[i]) / 180)))));
      points.forEach((p, i) => {
        const amount = reduced.matches ? 1 : Math.max(0, Math.min(1, (tip - p.start) / Math.max(1, p.end - p.start)));
        paths[i].style.strokeDashoffset = String(1 - amount);
        cards[i].style.setProperty("--arrival", String(amount));
      });
    };
    function schedule() { if (!frame && !disposed) frame = requestAnimationFrame(draw); }
    const resize = new ResizeObserver(measure); resize.observe(main); resize.observe(container);
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", schedule);
    const unsubscribe = subscribeMotion(schedule);
    measure();

    return () => {
      disposed = true; cancelAnimationFrame(frame); resize.disconnect(); unsubscribe(); svg.remove();
      window.removeEventListener("scroll", schedule); document.removeEventListener("visibilitychange", schedule);
      reduced.removeEventListener("change", schedule);
      cards.forEach(card => card.style.removeProperty("--arrival"));
      stages.forEach(stage => stage.style.removeProperty("--signal-arrival"));
    };
  }, []);

  return <div className="push-world" ref={host}>
    <CinematicBackdrop {...cinematicAssets.hero} className="hero-film" eager />
    <div className="push-world-caption"><span>One commit. A world of possibilities.</span><button type="button" aria-pressed={paused} aria-label={paused ? "Resume all cinematic motion" : "Pause all cinematic motion"} onClick={toggleMotion}>{paused ? "Resume motion" : "Pause motion"}</button></div>
  </div>;
}
