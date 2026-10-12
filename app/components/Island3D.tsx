"use client";

import { useEffect, useRef } from "react";

type Props = { angle: number; zoom: number; onEnter?: () => void; onAngleChange?: (angle: number) => void; freeRotate?: boolean };

export default function Island3D({ angle, zoom, onEnter, onAngleChange, freeRotate = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<any>(null);
  const viewRef = useRef<any>(null);
  const pointerStart = useRef<{x:number;y:number;moved:boolean;angle:number} | null>(null);

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
        camera.position.set(0, 3.2, 8.8); camera.lookAt(0, -0.22, 0);
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
        const wood = mat(0x9a765e);
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
          // One local-coordinate assembly keeps all facade parts aligned when the cottage turns.
          const building = new THREE.Group();
          building.position.set(x, 0, z);
          building.rotation.y = -0.12;
          world.add(building);
          const part = (geometry:any, material:any, px:number, py:number, pz:number, cast=true) => {
            const item = new THREE.Mesh(geometry, material);
            item.position.set(px*scale, py*scale, pz*scale);
            item.castShadow = cast; item.receiveShadow = true; building.add(item); return item;
          };
          const trimMat = mat(0xf9e5cb);
          const glassMat = new THREE.MeshStandardMaterial({color:0x9fcfcf,roughness:.28,metalness:.04,emissive:0x345e59,emissiveIntensity:.18});
          part(new THREE.BoxGeometry(.98,.12,.88),stone,0,.12,0);
          part(new THREE.BoxGeometry(.82,.58,.70),cream,0,.46,0);
          part(new THREE.BoxGeometry(1.00,.075,.88),roofMat,0,.765,0);
          const roofMesh=part(new THREE.ConeGeometry(.70,.48,4),roofMat,0,1.035,0);
          roofMesh.rotation.y=Math.PI/4;
          // Chimney and cap are placed visibly above the rear roof plane.
          part(new THREE.BoxGeometry(.12,.29,.12),woodDark,.24,1.10,-.18);
          part(new THREE.BoxGeometry(.17,.045,.16),stone,.24,1.265,-.18);
          // Tall door with a recessed panel and visible handle.
          part(new THREE.BoxGeometry(.205,.39,.035),woodDark,.035,.365,.368);
          part(new THREE.BoxGeometry(.17,.35,.018),wood,.035,.365,.391,false);
          part(new THREE.SphereGeometry(.018,10,8),flowerCream,.095,.36,.407,false);
          // Upright windows, with all frame/glass parts parallel to the facade.
          for (const wx of [-.245,.275]) {
            part(new THREE.BoxGeometry(.205,.205,.035),woodDark,wx,.535,.367,false);
            part(new THREE.BoxGeometry(.16,.16,.018),glassMat,wx,.535,.389,false);
            part(new THREE.BoxGeometry(.018,.16,.012),trimMat,wx,.535,.402,false);
            part(new THREE.BoxGeometry(.16,.018,.012),trimMat,wx,.535,.402,false);
            part(new THREE.BoxGeometry(.235,.028,.045),wood,wx,.415,.392,false);
          }
          // Step and porch sit outside the front wall.
          part(new THREE.BoxGeometry(.30,.055,.20),stone,.035,.17,.49);
          part(new THREE.BoxGeometry(.34,.045,.24),wood,.035,.205,.53);
          part(new THREE.BoxGeometry(.22,.045,.075),wood,-.245,.405,.43,false);
          for(let i=0;i<3;i++) part(new THREE.SphereGeometry(.027,8,6),i===1?flowerPink:leafB,-.30+i*.055,.445,.455,false);
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
        const top = mesh(new THREE.CylinderGeometry(3.05, 2.82, 0.36, 12, 1), grass, 0, 0.02, 0); top.scale.z = 0.84;
        const shelf = mesh(new THREE.CylinderGeometry(2.82, 2.42, 0.48, 12, 1), earthC, 0, -0.34, 0); shelf.scale.z = 0.84;
        const middle = mesh(new THREE.CylinderGeometry(2.42, 1.62, 0.75, 10, 1), earthA, 0, -0.88, 0); middle.scale.z = 0.84;
        const tip = mesh(new THREE.ConeGeometry(1.65, 1.45, 10, 1), earthB, 0, -1.82, 0); tip.scale.z = 0.84;
        // Rolling lawn patches create a richer, layered terrain instead of a flat green disc.
        const turf = mat(0xb8dc93);
        const turfLight = mat(0xd0e6a9);
        const turfDark = mat(0x91c17c);
        const lawn = mesh(new THREE.CircleGeometry(2.42, 56), grassLight, -.1,.215,.02,false); lawn.rotation.x=-Math.PI/2;
        for (const patch of [[-.9,.25,.58,.42],[.8,.55,.62,.38],[-.3,-.9,.7,.38],[1.1,-.45,.42,.32]]) {
          const meadow=mesh(new THREE.CircleGeometry(patch[2] as number,24),patch[0] as number < 0 ? turf : turfLight,patch[0] as number,.221,patch[1] as number,false);
          meadow.rotation.x=-Math.PI/2; meadow.scale.y=patch[3] as number;
        }
        // The former path tube followed the exact river centerline and created the long brown-grey strip seen in the screenshot. Removed; paths will remain on the banks.
        // Flowing river: a custom ribbon follows the curve on the ground plane,
        // so the water reads as a stream rather than a round pipe.
        const riverMat = new THREE.MeshStandardMaterial({color:0x53bfc6,roughness:.22,metalness:.12,transparent:true,opacity:.94,side:THREE.DoubleSide});
        const riverBedMat = mat(0x8eb8a0);
        const riverPoints=[new THREE.Vector3(.95,.225,1.92),new THREE.Vector3(.78,.225,1.45),new THREE.Vector3(.48,.225,.92),new THREE.Vector3(.18,.225,.38),new THREE.Vector3(.02,.225,-.18),new THREE.Vector3(-.2,.225,-.72),new THREE.Vector3(-.5,.225,-1.25),new THREE.Vector3(-.72,.225,-1.82)];
        const riverCurve=new THREE.CatmullRomCurve3(riverPoints);
        function riverRibbon(curve:any,width:number,material:any,yOffset=0){
          const vertices:number[]=[]; const indices:number[]=[]; const segments=100;
          for(let i=0;i<=segments;i++){const t=i/segments,p=curve.getPoint(t),tan=curve.getTangent(t);const len=Math.hypot(tan.x,tan.z)||1;const nx=-tan.z/len,nz=tan.x/len;vertices.push(p.x+nx*width/2,p.y+yOffset,p.z+nz*width/2,p.x-nx*width/2,p.y+yOffset,p.z-nz*width/2);if(i<segments){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}}
          const geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();return mesh(geo,material,0,0,0,false);
        }
        riverRibbon(riverCurve,.48,riverBedMat,-.035);
        riverRibbon(riverCurve,.39,riverMat,.012);
        // Narrow grassy banks sit beside the water ribbon (never across its center).
        const bankMat = mat(0x9abf86);
        function riverBank(side:number){
          const verts:number[]=[]; const idx:number[]=[]; const segments=100; const width=.105;
          for(let i=0;i<=segments;i++){const t=i/segments,p=riverCurve.getPoint(t),tan=riverCurve.getTangent(t);const len=Math.hypot(tan.x,tan.z)||1;const nx=-tan.z/len,nz=tan.x/len;const inner=side*0.205,outer=side*(0.205+width);verts.push(p.x+nx*inner,p.y-.004,p.z+nz*inner,p.x+nx*outer,p.y-.004,p.z+nz*outer);if(i<segments){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}}
          const geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.Float32BufferAttribute(verts,3));geo.setIndex(idx);geo.computeVertexNormals();mesh(geo,bankMat,0,0,0,false);
        }
        riverBank(-1); riverBank(1);
        // Gentle ripples are small flat highlights, kept above the water surface.
        const rippleMat=new THREE.MeshStandardMaterial({color:0xc4f4e9,roughness:.2,transparent:true,opacity:.62});
        for(let i=0;i<18;i++){const t=.08+i*.047,p=riverCurve.getPoint(t);const ripple=mesh(new THREE.BoxGeometry(.035,.006,.12+(i%3)*.025),rippleMat,p.x,.249,p.z,false);ripple.rotation.y=-Math.atan2(riverCurve.getTangent(t).z,riverCurve.getTangent(t).x);}
        // Arched stone bridge crosses the stream. Each voussoir follows the arch,
        // with a continuous deck and separate parapets to avoid inverted roof-like slabs.
        const bridgeStone=mat(0xb9b4a2);const bridgeTop=mat(0xe5d9c2);const bridgeDark=mat(0x888d83);
        const bridgeZ=.36, halfSpan=.66, archRise=.27, deckY=.34, blocks=15;
        for(let i=0;i<blocks;i++){const t=(i+.5)/blocks,x=-halfSpan+2*halfSpan*t,y=deckY+Math.sin(t*Math.PI)*archRise;const slope=Math.atan2(Math.cos(t*Math.PI)*archRise*Math.PI,2*halfSpan);const block=mesh(new THREE.BoxGeometry(2*halfSpan/blocks+.018,.105,.28),bridgeStone,x,y,bridgeZ,false);block.rotation.z=slope;}
        // Paved walking surface sits on top of the arch stones.
        for(let i=0;i<blocks;i++){const t=(i+.5)/blocks,x=-halfSpan+2*halfSpan*t,y=deckY+Math.sin(t*Math.PI)*archRise+.065;const tread=mesh(new THREE.BoxGeometry(2*halfSpan/blocks+.012,.035,.29),bridgeTop,x,y,bridgeZ,false);tread.rotation.z=Math.atan2(Math.cos(t*Math.PI)*archRise*Math.PI,2*halfSpan);}
        // Side rails follow the same arch profile, using short posts and capstones.
        for(const side of [-1,1]){for(let i=0;i<=8;i++){const t=i/8,x=-halfSpan+2*halfSpan*t,y=deckY+Math.sin(t*Math.PI)*archRise+.12;mesh(new THREE.BoxGeometry(.065,.13,.065),bridgeDark,x,y,bridgeZ+side*.145,false);}for(let i=0;i<10;i++){const t=(i+.5)/10,x=-halfSpan+2*halfSpan*t,y=deckY+Math.sin(t*Math.PI)*archRise+.21;const rail=mesh(new THREE.BoxGeometry(.15,.045,.055),bridgeTop,x,y,bridgeZ+side*.145,false);rail.rotation.z=Math.atan2(Math.cos(t*Math.PI)*archRise*Math.PI,2*halfSpan);}}
        tree(-1.75,-.55,1.0); tree(-2.05,.25,.83); tree(-1.28,-1.35,.75); tree(1.9,-.58,.92); tree(2.12,.18,.78); tree(1.35,-1.35,.72); tree(-.45,-1.72,.68);
        house(1.22,-.55,.78,roof); house(-1.15,.78,.62,roofLilac);
        // Small garden beds, flowering borders, rocks, shrubs and lanterns fill the open spaces.
        const shrubMat=mat(0x85b77d);
        for(const p of [[-2.05,.92],[-2.18,.68],[2.05,.98],[2.18,.72],[-1.85,-1.05],[1.92,-1.08],[-.15,-1.72]]){
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
          const x=side*(1.65+i*.08);
          mesh(new THREE.BoxGeometry(.055,.20,.055),wood,x,.30,-1.02+i*.16,false);
        }
        // Lamps stand on the outer paths, clear of house walls, shrubs and river.
        for(const p of [[-2.25,-.72],[2.28,.62]]) lampPost(p[0],p[1]);
        // Keep the river as one continuous surface; remove the detached waterfall slab that intersected the terrain.
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
    const distance = 8.4 / zoom;
    view.camera.position.set(Math.sin(radians) * distance, 4.0, Math.cos(radians) * distance);
    view.camera.lookAt(0, -0.25, 0);
  }, [angle, zoom]);

  return <canvas
    ref={canvasRef}
    className="island-art island-3d-canvas"
    aria-label="点击进入沉浸式三维小岛，拖动旋转视角"
    role="button"
    tabIndex={0}
    onPointerDown={(event) => { pointerStart.current = { x: event.clientX, y: event.clientY, moved: false, angle }; if (freeRotate) event.currentTarget.setPointerCapture(event.pointerId); }}
    onPointerMove={(event) => { if (!pointerStart.current) return; const dx=event.clientX-pointerStart.current.x; const dy=event.clientY-pointerStart.current.y; if (Math.hypot(dx,dy)>7) pointerStart.current.moved=true; if (freeRotate && pointerStart.current.moved && onAngleChange) onAngleChange(pointerStart.current.angle+dx*.45); }}
    onPointerUp={() => { const moved=pointerStart.current?.moved; pointerStart.current = null; if (freeRotate && !moved) onEnter?.(); }}
    onPointerCancel={() => { pointerStart.current = null; }}
    onClick={() => { if (!freeRotate && !pointerStart.current?.moved) onEnter?.(); }}
    onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onEnter?.(); } }}
  />;
}
