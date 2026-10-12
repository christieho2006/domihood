"use client";

import { useEffect, useRef } from "react";

type Props = { angle: number; zoom: number };

export default function Island3D({ angle, zoom }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<any>(null);
  const viewRef = useRef<any>(null);

  useEffect(() => {
    let disposed = false;
    let renderer: any;
    let frame = 0;
    let THREE: any;
    const canvas = canvasRef.current;
    if (!canvas) return;

    async function build() {
      try {
        THREE = await import("three");
        if (disposed) return;
        const scene = new THREE.Scene();
        scene.background = null;
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
        camera.position.set(0, 3.2, 8.8); camera.lookAt(0, -0.25, 0);
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setClearColor(0x000000, 0);
        scene.add(new THREE.HemisphereLight(0xf5ffe9, 0x80657a, 2.1));
        const sun = new THREE.DirectionalLight(0xfff0d4, 3.1);
        sun.position.set(-5, 9, 6); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
        scene.add(sun);
        const fill = new THREE.DirectionalLight(0xc8e6ff, 1.15); fill.position.set(6, 4, -5); scene.add(fill);
        const world = new THREE.Group(); scene.add(world); worldRef.current = world; viewRef.current = { camera, renderer, scene };
        const mat = (color: number, roughness = 0.95) => new THREE.MeshStandardMaterial({ color, roughness, flatShading: true });
        const grass = mat(0xa9d58a); const grassLight = mat(0xc2dfa0);
        const earthA = mat(0xa87968); const earthB = mat(0x8a6872); const earthC = mat(0xc5967d);
        const trunk = mat(0x94715f); const leafA = mat(0x8fbd85); const leafB = mat(0xb7d99c);
        const cream = mat(0xffefd9); const roof = mat(0xe88d83); const roofLilac = mat(0xb7a4d4); const windowMat = new THREE.MeshStandardMaterial({ color: 0x9fc7c0, roughness: 0.35, emissive: 0x456d68, emissiveIntensity: 0.15 });
        function mesh(geometry: any, material: any, x: number, y: number, z: number, cast = true) {
          const item = new THREE.Mesh(geometry, material); item.position.set(x, y, z); item.castShadow = cast; item.receiveShadow = true; world.add(item); return item;
        }
        function tree(x: number, z: number, size: number) {
          mesh(new THREE.CylinderGeometry(0.055 * size, 0.08 * size, 0.48 * size, 7), trunk, x, 0.48 * size, z);
          const crown = mesh(new THREE.IcosahedronGeometry(0.31 * size, 1), leafA, x, 0.83 * size, z); crown.scale.y = 1.08;
          mesh(new THREE.IcosahedronGeometry(0.2 * size, 1), leafB, x - 0.13 * size, 0.88 * size, z + 0.08 * size, false);
        }
        function house(x: number, z: number, scale: number, roofMat: any) {
          const base = mesh(new THREE.BoxGeometry(0.78 * scale, 0.55 * scale, 0.65 * scale), cream, x, 0.38 * scale, z);
          base.rotation.y = -0.12;
          const top = mesh(new THREE.ConeGeometry(0.62 * scale, 0.5 * scale, 4), roofMat, x, 0.9 * scale, z); top.rotation.y = Math.PI / 4;
          mesh(new THREE.BoxGeometry(0.15 * scale, 0.3 * scale, 0.035 * scale), trunk, x + 0.05 * scale, 0.27 * scale, z + 0.333 * scale, false);
          mesh(new THREE.BoxGeometry(0.16 * scale, 0.15 * scale, 0.04 * scale), windowMat, x - 0.22 * scale, 0.44 * scale, z + 0.34 * scale, false);
          mesh(new THREE.BoxGeometry(0.16 * scale, 0.15 * scale, 0.04 * scale), windowMat, x + 0.27 * scale, 0.44 * scale, z + 0.32 * scale, false);
        }
        // Floating island: stacked tapered strata make the underside visibly three-dimensional.
        const top = mesh(new THREE.CylinderGeometry(2.45, 2.25, 0.36, 9, 1), grass, 0, 0.02, 0); top.scale.z = 0.78;
        const shelf = mesh(new THREE.CylinderGeometry(2.25, 1.95, 0.48, 9, 1), earthC, 0, -0.34, 0); shelf.scale.z = 0.78;
        const middle = mesh(new THREE.CylinderGeometry(1.95, 1.28, 0.75, 8, 1), earthA, 0, -0.88, 0); middle.scale.z = 0.78;
        const tip = mesh(new THREE.ConeGeometry(1.3, 1.45, 8, 1), earthB, 0, -1.82, 0); tip.scale.z = 0.8;
        // Bright grassy patches and a winding stone path.
        mesh(new THREE.CircleGeometry(1.62, 12), grassLight, -0.2, 0.215, 0.02, false).rotation.x = -Math.PI / 2;
        const pathMat = mat(0xe8d6b7);
        const path = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.6,0.225,1.05),new THREE.Vector3(0.35,0.23,0.7),new THREE.Vector3(0.05,0.23,0.38),new THREE.Vector3(-0.18,0.23,0.08),new THREE.Vector3(-0.55,0.23,-0.28)]), 28, 0.085, 7, false), pathMat, 0, 0, 0, false);
        path.position.y = 0;
        tree(-1.35, -0.35, 1.0); tree(-1.72, 0.15, 0.83); tree(-0.95, -1.02, 0.75);
        tree(1.45, -0.5, 0.92); tree(1.78, 0.08, 0.78); tree(0.95, -1.1, 0.72); tree(-0.3, -1.45, 0.68);
        house(0.7, -0.15, 0.86, roof); house(-0.68, 0.45, 0.65, roofLilac);
        // A tiny stream spills over the front edge.
        const water = new THREE.MeshStandardMaterial({ color: 0x8fcfce, roughness: 0.24, metalness: 0.05, transparent: true, opacity: 0.9 });
        const cascade = mesh(new THREE.BoxGeometry(0.12, 0.78, 0.1), water, 0.48, -0.78, 1.53, false); cascade.rotation.z = -0.14;
        for (let i = 0; i < 8; i++) {
          const a = i * Math.PI * 2 / 8 + 0.2;
          const x = Math.cos(a) * 2.05; const z = Math.sin(a) * 1.55;
          mesh(new THREE.IcosahedronGeometry(0.07 + (i % 3) * 0.025, 0), i % 2 ? grassLight : leafB, x, 0.24, z, false);
        }
        // Soft cloud puffs float behind the island.
        const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.62 });
        const clouds = new THREE.Group(); scene.add(clouds);
        [[-3.1,-0.4,-1.8,0.45],[ -2.7,-0.28,-1.8,0.55],[-2.3,-0.38,-1.8,0.38],[2.8,-0.55,-1.7,0.4],[3.15,-0.42,-1.7,0.55],[3.5,-0.55,-1.7,0.35]].forEach((p: number[]) => {
          const puff = new THREE.Mesh(new THREE.SphereGeometry(p[3], 12, 8), cloudMat); puff.position.set(p[0], p[1], p[2]); clouds.add(puff);
        });
        function resize() {
          if (!canvas || !renderer) return;
          const rect = canvas.getBoundingClientRect(); const w = Math.max(1, rect.width); const h = Math.max(1, rect.height);
          renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
        }
        resize(); window.addEventListener("resize", resize);
        const start = performance.now();
        function animate(now: number) {
          if (disposed) return;
          frame = requestAnimationFrame(animate);
          world.position.y = Math.sin((now - start) * 0.0008) * 0.07;
          world.rotation.y += 0.0007;
          clouds.position.x = Math.sin((now - start) * 0.00025) * 0.12;
          renderer.render(scene, camera);
        }
        (viewRef.current as any).cleanup = () => window.removeEventListener("resize", resize);
        frame = requestAnimationFrame(animate);
      } catch (error) { console.error("Unable to initialize 3D island", error); }
    }
    build();
    return () => { disposed = true; cancelAnimationFrame(frame); if (viewRef.current?.cleanup) viewRef.current.cleanup(); if (renderer) renderer.dispose(); worldRef.current = null; viewRef.current = null; };
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const radians = (angle * Math.PI) / 180;
    const distance = 8.8 / zoom;
    view.camera.position.set(Math.sin(radians) * distance, 3.2, Math.cos(radians) * distance);
    view.camera.lookAt(0, -0.25, 0);
  }, [angle, zoom]);

  return <canvas ref={canvasRef} className="island-art island-3d-canvas" aria-label="可旋转观察的三维童话浮空小岛" role="img" />;
}
