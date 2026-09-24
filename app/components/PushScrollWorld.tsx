"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const HERO_FILM = "https://d8j0ntlcm91z4.cloudfront.net/user_3Bnh4rFMZnk5sksDeNoJN4Y4Mee/hf_20260924_215442_83413cd2-c035-4d5a-8163-d19aade07f85.mp4";

export default function PushScrollWorld() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [filmReady, setFilmReady] = useState(false);
  const [filmEnabled, setFilmEnabled] = useState(false);
  const [paused, setPaused] = useState(false);
  const pauseRef = useRef(false);

  useEffect(() => {
    const container = host.current;
    const surface = canvas.current;
    const main = document.getElementById("main");
    if (!container || !surface || !main) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setFilmEnabled(!reduced.matches && !connection?.saveData);
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
    let disposed = false, frame = 0, visible = true;
    let renderModel: ((progress: number) => void) | undefined;
    let cleanupModel: (() => void) | undefined;
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
      schedule();
    };
    const draw = () => {
      frame = 0;
      if (disposed || document.hidden || pauseRef.current) return;
      const tip = scrollY + innerHeight * .85;
      points.forEach((p, i) => {
        const amount = reduced.matches ? 1 : Math.max(0, Math.min(1, (tip - p.start) / Math.max(1, p.end - p.start)));
        paths[i].style.strokeDashoffset = String(1 - amount);
        cards[i].style.setProperty("--arrival", String(amount));
      });
      if (visible && !reduced.matches) {
        const rect = container.getBoundingClientRect();
        renderModel?.(Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height) + .25)));
      }
    };
    function schedule() { if (!frame && !disposed) frame = requestAnimationFrame(draw); }
    const resize = new ResizeObserver(measure); resize.observe(main); resize.observe(container);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); });
    intersection.observe(container);
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", schedule);
    const resume = () => schedule();
    container.addEventListener("click", resume);
    measure();

    async function load() {
      if (reduced.matches || connection?.saveData) return;
      const [THREE, { GLTFLoader }, { RoomEnvironment }] = await Promise.all([
        import("three"), import("three/examples/jsm/loaders/GLTFLoader.js"), import("three/examples/jsm/environments/RoomEnvironment.js"),
      ]);
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ canvas: surface!, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment(); const env = pmrem.fromScene(room); scene.environment = env.texture;
      room.dispose(); pmrem.dispose();
      const camera = new THREE.PerspectiveCamera(35, 1, .1, 40); camera.position.set(0, 0, 8);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x14252c, 1.2));
      const key = new THREE.DirectionalLight(0xffffff, 2); key.position.set(-3, 4, 5); scene.add(key);
      const fill = new THREE.DirectionalLight(0x00cdf0, 2); fill.position.set(3, -2, 4); scene.add(fill);
      let model: import("three").Group | undefined;
      const release = (root: import("three").Object3D) => root.traverse(o => {
        if (o instanceof THREE.Mesh) { o.geometry.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()); }
      });
      const contextLost = (event: Event) => { event.preventDefault(); setReady(false); renderModel = undefined; };
      surface!.addEventListener("webglcontextlost", contextLost);
      cleanupModel = () => { surface!.removeEventListener("webglcontextlost", contextLost); if (model) release(model); env.dispose(); renderer.dispose(); };
      const gltf = await new GLTFLoader().loadAsync("/brand/push-symbol.glb");
      if (disposed) { release(gltf.scene); return; }
      model = gltf.scene;
      model.traverse(object => {
        if (!(object instanceof THREE.Mesh)) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        const corrected = materials.map(material => {
          if (material.name !== "BranchGradient") return material;
          // Keep the logo's exported lime/cyan colors independent of studio
          // lights, white reflections, and filmic highlight desaturation.
          const branded = new THREE.MeshBasicMaterial({
            name: "BranchGradient",
            vertexColors: true,
            toneMapped: false,
            side: material.side,
          });
          material.dispose();
          return branded;
        });
        object.material = Array.isArray(object.material) ? corrected : corrected[0];
      });
      const orientation = new THREE.Group(); orientation.rotation.x = Math.PI / 2; orientation.add(model);
      const assembly = new THREE.Group(); assembly.add(orientation); scene.add(assembly);
      let width = 0, height = 0;
      renderModel = progress => {
        const w = container!.clientWidth, h = container!.clientHeight;
        if (w !== width || h !== height) {
          width = w; height = h;
          renderer.setSize(w, h, false); camera.aspect = w / Math.max(1, h); camera.updateProjectionMatrix();
        }
        assembly.rotation.set(-.08 + progress * .16, -.22 + progress * .6, -.025 + progress * .05);
        renderer.render(scene, camera);
      };
      renderModel(0); setReady(true); schedule();
    }
    if (reduced.matches || connection?.saveData) {
      load().catch(() => { cleanupModel?.(); cleanupModel = undefined; if (!disposed) setReady(false); });
    }
    return () => {
      disposed = true; cancelAnimationFrame(frame); cleanupModel?.(); resize.disconnect(); intersection.disconnect(); svg.remove();
      window.removeEventListener("scroll", schedule); document.removeEventListener("visibilitychange", schedule);
      reduced.removeEventListener("change", schedule); container.removeEventListener("click", resume);
      cards.forEach(card => card.style.removeProperty("--arrival"));
    };
  }, []);

  return <div className="push-world" ref={host} data-ready={ready} data-film-ready={filmReady}>
    {filmEnabled && <video
      ref={film}
      className="push-world-film"
      src={HERO_FILM}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      onCanPlay={() => setFilmReady(true)}
      onError={() => setFilmReady(false)}
    />}
    <Image className="push-world-poster" src="/brand/push2start-symbol.jpeg" alt="Chrome Push2Start diamond with luminous lime and cyan branches" width={1280} height={1280} priority sizes="(max-width:900px) 90vw,45vw" />
    <canvas ref={canvas} aria-hidden="true" />
    <div className="push-world-caption"><span>One commit. A world of possibilities.</span><button type="button" aria-pressed={paused} onClick={() => {
      const nextPaused = !pauseRef.current;
      pauseRef.current = nextPaused;
      setPaused(nextPaused);
      if (nextPaused) film.current?.pause();
      else film.current?.play().catch(() => undefined);
      if (!nextPaused) requestAnimationFrame(() => window.dispatchEvent(new Event("scroll")));
    }}>{paused ? "Resume motion" : "Pause motion"}</button></div>
  </div>;
}
