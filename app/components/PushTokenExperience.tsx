"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const phases = [
  { label: "Commit", note: "Map the business", href: "#start" },
  { label: "Build", note: "Shape the working system", href: "#process" },
  { label: "Push", note: "Verify and launch", href: "#proof" },
];

export default function PushTokenExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.15, 6.2);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const controls = new OrbitControls(camera, canvas);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    controls.autoRotateSpeed = 1.25;

    scene.add(new THREE.HemisphereLight(0xbfdcff, 0x111827, 2.4));
    const key = new THREE.DirectionalLight(0xffffff, 4.5);
    key.position.set(3, 4, 5);
    scene.add(key);
    const blue = new THREE.PointLight(0x3157ff, 28, 12);
    blue.position.set(-3, 0, 2);
    scene.add(blue);
    const orange = new THREE.PointLight(0xff5c35, 20, 10);
    orange.position.set(3, -2, 1);
    scene.add(orange);

    let token: THREE.Object3D | null = null;
    let frame = 0;
    let disposed = false;
    const loader = new GLTFLoader();
    loader.load(
      "/push-token.glb",
      (gltf) => {
        if (disposed) return;
        token = gltf.scene;
        const box = new THREE.Box3().setFromObject(token);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        token.position.sub(center);
        token.scale.setScalar(3.4 / Math.max(size.x, size.y, size.z));
        token.rotation.set(-0.18, 0.35, 0.08);
        scene.add(token);
        setReady(true);
      },
      undefined,
      () => setReady(false),
    );

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const animate = () => {
      frame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="token-experience">
      <div className="token-console">
        <div className="token-console-bar"><span>P2S / PUSH TOKEN</span><b>{ready ? "ONLINE" : "LOADING"}</b></div>
        <button className="token-canvas-button" type="button" onClick={() => setPhase((current) => (current + 1) % phases.length)} aria-label="Rotate to the next Push2Start phase">
          <canvas ref={canvasRef} />
          {!ready && <span className="token-fallback" aria-hidden="true">↑</span>}
        </button>
        <div className="token-readout">
          <span>0{phase + 1} / 03</span>
          <div><strong>{phases[phase].label}</strong><small>{phases[phase].note}</small></div>
          <a href={phases[phase].href}>Enter phase ↘</a>
        </div>
      </div>
      <div className="token-phases" aria-label="Push2Start production phases">
        {phases.map((item, index) => <button className={index === phase ? "is-active" : ""} onClick={() => setPhase(index)} type="button" key={item.label}>{item.label}</button>)}
      </div>
      <p>Drag the token to inspect it. Press it to move from commit to launch.</p>
    </div>
  );
}
