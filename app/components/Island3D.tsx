"use client";

import { useEffect, useRef } from "react";

type Props = { angle: number; zoom: number; onEnter?: () => void };

export default function Island3D({ angle, zoom, onEnter }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<any>(null);
  const viewRef = useRef<any>(null);
  const pointerStart = useRef<{x:number;y:number;moved:boolean} | null>(null);

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
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12;
        renderer.setClearColor(0x000000, 0);
        scene.add(new THREE.HemisphereLight(0xf5ffe9, 0x80657a, 2.1));
        const sun = new THREE.DirectionalLight(0xfff0d4, 3.1);
        sun.position.set(-5, 9, 6); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left=-5; sun.shadow.camera.right=5; sun.shadow.camera.top=5; sun.shadow.camera.bottom=-5; sun.shadow.bias=-0.00025;
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
        const barkLight = mat(0xb58a6c);
        const leafDeep = mat(0x709c70);
        const flowerPink = mat(0xf1b2c0);
        const flowerCream = mat(0xffe5a7);
        const stone = mat(0xd8c9ae);
        const pathEdge = mat(0xb9a68c);
        const woodDark = mat(0x795b4c);
        function tree(x: number, z: number, size: number) {
          const root = mesh(new THREE.CylinderGeometry(0.10 * size, 0.14 * size, 0.12 * size, 8), barkLight, x, 0.27 * size, z);
          root.scale.x = 1.25;
          mesh(new THREE.CylinderGeometry(0.065 * size, 0.10 * size, 0.58 * size, 9), trunk, x, 0.52 * size, z);
          const branchA = mesh(new THREE.CylinderGeometry(0.025 * size, 0.045 * size, 0.3 * size, 7), trunk, x - .1 * size, .62 * size, z, false);
          branchA.rotation.z = -.55;
          const branchB = mesh(new THREE.CylinderGeometry(0.022 * size, 0.04 * size, 0.27 * size, 7), trunk, x + .1 * size, .68 * size, z + .015 * size, false);
          branchB.rotation.z = .58;
          const crown = mesh(new THREE.IcosahedronGeometry(0.34 * size, 2), leafA, x, 0.92 * size, z); crown.scale.set(1,1.14,.92);
          mesh(new THREE.IcosahedronGeometry(0.245 * size, 1), leafB, x - 0.18 * size, 0.91 * size, z + 0.08 * size);
          mesh(new THREE.IcosahedronGeometry(0.23 * size, 1), leafDeep, x + 0.17 * size, 0.83 * size, z - 0.08 * size);
          mesh(new THREE.IcosahedronGeometry(0.18 * size, 1), leafA, x + 0.04 * size, 1.15 * size, z + 0.02 * size);
        }
        function house(x: number, z: number, scale: number, roofMat: any) {
          const foundation = mesh(new THREE.BoxGeometry(.94 * scale,.12 * scale,.82 * scale), stone, x,.17 * scale,z);
          foundation.rotation.y = -.12;
          const base = mesh(new THREE.BoxGeometry(.82 * scale,.58 * scale,.7 * scale), cream,x,.48 * scale,z);
          base.rotation.y = -.12;
          const top = mesh(new THREE.ConeGeometry(.68 * scale,.52 * scale,4),roofMat,x,.99 * scale,z);
          top.rotation.y = Math.PI / 4 - .12;
          // Eaves, chimney and a tiny front porch make each cottage read as a complete building.
          const eave = mesh(new THREE.BoxGeometry(.98 * scale,.07 * scale,.83 * scale),roofMat,x,.78 * scale,z);
          eave.rotation.y = -.12;
          mesh(new THREE.BoxGeometry(.12 * scale,.38 * scale,.13 * scale),trunk,x+.22 * scale,.98 * scale,z-.18 * scale);
          mesh(new THREE.BoxGeometry(.16 * scale,.32 * scale,.045 * scale),woodDark,x+.06 * scale,.34 * scale,z+.36 * scale,false);
          mesh(new THREE.CircleGeometry(.025 * scale,12),flowerCream,x+.1 * scale,.42 * scale,z+.388 * scale,false).rotation.y = 0;
          for (const wx of [-.22,.27]) {
            mesh(new THREE.BoxGeometry(.18 * scale,.17 * scale,.045 * scale),woodDark,x+wx*scale,.51 * scale,z+.365 * scale,false);
            mesh(new THREE.BoxGeometry(.135 * scale,.125 * scale,.025 * scale),windowMat,x+wx*scale,.52 * scale,z+.39 * scale,false);
            mesh(new THREE.BoxGeometry(.025 * scale,.17 * scale,.025 * scale),cream,x+wx*scale,.51 * scale,z+.408 * scale,false);
            mesh(new THREE.BoxGeometry(.18 * scale,.025 * scale,.025 * scale),cream,x+wx*scale,.51 * scale,z+.408 * scale,false);
          }
          // Window boxes and flower boxes.
          mesh(new THREE.BoxGeometry(.22 * scale,.055 * scale,.08 * scale),wood,x-.22 * scale,.405 * scale,z+.42 * scale,false);
          for(let i=0;i<3;i++) mesh(new THREE.SphereGeometry(.035 * scale,8,6),i===1?flowerPink:leafB,x+(-.28+i*.06)*scale,.46 * scale,z+.45 * scale,false);
          mesh(new THREE.BoxGeometry(.28 * scale,.055 * scale,.18 * scale),wood,x+.06 * scale,.2 * scale,z+.48 * scale);
          for(let i=0;i<3;i++) mesh(new THREE.CylinderGeometry(.018*scale,.018*scale,.16*scale,6),trunk,x+(-.04+i*.1)*scale,.12*scale,z+.52*scale,false);
        }
        function flower(x:number,z:number,size:number,color:any) {
          mesh(new THREE.CylinderGeometry(.008*size,.012*size,.09*size,5),leafDeep,x,.27*size,z,false);
          mesh(new THREE.SphereGeometry(.035*size,8,6),color,x,.32*size,z,false);
          for(let i=0;i<5;i++){const a=i*Math.PI*2/5;mesh(new THREE.SphereGeometry(.022*size,7,5),color,x+Math.cos(a)*.035*size,.32*size,z+Math.sin(a)*.035*size,false);}
        }
        function lampPost(x:number,z:number) {
          mesh(new THREE.CylinderGeometry(.018,.024,.42,8),woodDark,x,.43,z);
          mesh(new THREE.SphereGeometry(.075,12,8),flowerCream,x,.68,z);
          mesh(new THREE.CylinderGeometry(.11,.11,.035,12),woodDark,x,.73,z);
        }
        // Floating island: stacked tapered strata make the underside visibly three-dimensional.
        const top = mesh(new THREE.CylinderGeometry(2.45, 2.25, 0.36, 9, 1), grass, 0, 0.02, 0); top.scale.z = 0.78;
        const shelf = mesh(new THREE.CylinderGeometry(2.25, 1.95, 0.48, 9, 1), earthC, 0, -0.34, 0); shelf.scale.z = 0.78;
        const middle = mesh(new THREE.CylinderGeometry(1.95, 1.28, 0.75, 8, 1), earthA, 0, -0.88, 0); middle.scale.z = 0.78;
        const tip = mesh(new THREE.ConeGeometry(1.3, 1.45, 8, 1), earthB, 0, -1.82, 0); tip.scale.z = 0.8;
        // Rolling lawn patches create a richer, layered terrain instead of a flat green disc.
        const turf = mat(0xb8dc93);
        const turfLight = mat(0xd0e6a9);
        const turfDark = mat(0x91c17c);
        const lawn = mesh(new THREE.CircleGeometry(1.82, 48), grassLight, -.1,.215,.02,false); lawn.rotation.x=-Math.PI/2;
        for (const patch of [[-.9,.25,.58,.42],[.8,.55,.62,.38],[-.3,-.9,.7,.38],[1.1,-.45,.42,.32]]) {
          const meadow=mesh(new THREE.CircleGeometry(patch[2] as number,24),patch[0] as number < 0 ? turf : turfLight,patch[0] as number,.221,patch[1] as number,false);
          meadow.rotation.x=-Math.PI/2; meadow.scale.y=patch[3] as number;
        }
        const pathMat = mat(0xe8d9be);
        const routePoints=[new THREE.Vector3(.7,.232,1.18),new THREE.Vector3(.52,.235,.88),new THREE.Vector3(.28,.238,.62),new THREE.Vector3(.1,.24,.34),new THREE.Vector3(-.08,.24,.1),new THREE.Vector3(-.32,.24,-.08),new THREE.Vector3(-.62,.24,-.28),new THREE.Vector3(-.82,.24,-.54)];
        const routeCurve=new THREE.CatmullRomCurve3(routePoints);
        mesh(new THREE.TubeGeometry(routeCurve,48,.13,10,false),pathEdge,0,0,0,false);
        mesh(new THREE.TubeGeometry(routeCurve,48,.095,10,false),pathMat,0,.006,0,false);
        // Individual stepping stones follow the curve and add visible surface detail.
        for(let i=0;i<26;i++){
          const p=routeCurve.getPoint(i/27), tangent=routeCurve.getTangent(i/27);
          const tile=mesh(new THREE.BoxGeometry(.12,.025,.085),i%4===0?stone:pathMat,p.x,.255,p.z,false);
          tile.rotation.y=-Math.atan2(tangent.z,tangent.x); tile.rotation.y+=.08*Math.sin(i*1.7);
        }
        // A miniature footbridge crosses the stream at the island's front edge.
        for(let i=0;i<5;i++) mesh(new THREE.BoxGeometry(.12,.045,.42),wood, .42+i*.12,.245,1.08,false);
        for(const x of [.38,.98]) for(const z of [.88,1.28]) mesh(new THREE.CylinderGeometry(.025,.03,.24,7),trunk,x,.19,z,false);
        tree(-1.35,-.35,1.0); tree(-1.72,.15,.83); tree(-.95,-1.02,.75); tree(1.45,-.5,.92); tree(1.78,.08,.78); tree(.95,-1.1,.72); tree(-.3,-1.45,.68);
        house(.68,-.2,.86,roof); house(-.68,.45,.65,roofLilac);
        // Small garden beds, flowering borders, rocks, shrubs and lanterns fill the open spaces.
        const shrubMat=mat(0x85b77d);
        for(const p of [[-1.15,.82],[-1.42,.72],[1.18,.75],[1.38,.72],[-1.05,-.72],[1.12,-.82],[.18,-1.52]]){
          mesh(new THREE.SphereGeometry(.16,10,8),shrubMat,p[0],.29,p[1],false);
          mesh(new THREE.SphereGeometry(.11,10,8),leafB,p[0]+.09,.32,p[1]+.03,false);
        }
        for(let i=0;i<38;i++){
          const a=i*2.399, r=.85+(i%7)*.15, x=Math.cos(a)*r, z=Math.sin(a)*r*.78;
          if(Math.abs(x)<.55 && z>-.35 && z<.75) continue;
          flower(x,z,.7+(i%3)*.18,i%2?flowerPink:flowerCream);
        }
        for(const p of [[-1.82,-.42],[1.92,-.34],[-.75,1.15],[.12,-1.78],[1.48,.35]]){
          const rock=mesh(new THREE.DodecahedronGeometry(.12,0),stone,p[0],.25,p[1],false); rock.scale.set(1,.55,.8);
        }
        // Low wooden fences frame the cottage gardens without enclosing the island.
        for(const side of [-1,1]) for(let i=0;i<4;i++){
          const x=side*(1.42+i*.09);
          mesh(new THREE.BoxGeometry(.07,.25,.07),wood,x,.32,-.82+i*.18,false);
        }
        for(const p of [[-.98,.95],[1.2,.32]]) lampPost(p[0],p[1]);
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
          world.rotation.y += 0.00032;
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
    const distance = 7.5 / zoom;
    view.camera.position.set(Math.sin(radians) * distance, 3.2, Math.cos(radians) * distance);
    view.camera.lookAt(0, -0.25, 0);
  }, [angle, zoom]);

  return <canvas
    ref={canvasRef}
    className="island-art island-3d-canvas"
    aria-label="点击进入沉浸式三维小岛，拖动旋转视角"
    role="button"
    tabIndex={0}
    onPointerDown={(event) => { pointerStart.current = { x: event.clientX, y: event.clientY, moved: false }; }}
    onPointerMove={(event) => { if (pointerStart.current && Math.hypot(event.clientX-pointerStart.current.x,event.clientY-pointerStart.current.y)>7) pointerStart.current.moved=true; }}
    onPointerUp={() => { pointerStart.current = pointerStart.current; }}
    onClick={() => { if (!pointerStart.current?.moved) onEnter?.(); pointerStart.current = null; }}
    onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onEnter?.(); } }}
  />;
}
