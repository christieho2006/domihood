"use client";
import { useEffect, useRef, useState } from "react";

type Furniture = "sofa" | "rug" | "plant" | "lamp" | "table" | "shelf" | "bed" | "picture";
type Theme = "cream" | "blossom" | "mint";
type Cell = { col: number; row: number };
type Props = { theme: Theme; furniture: Furniture[]; positions: Record<Furniture, Cell>; selected: Furniture; onSelect: (id: Furniture) => void; onMove: (id: Furniture, col: number, row: number) => void };
const palette: Record<Theme, { wall: number; floor: number; trim: number; pink: number; green: number; wood: number }> = {
 cream: { wall: 0xf5e9d8, floor: 0xd5b99c, trim: 0xfff7e9, pink: 0xd8a8a0, green: 0x9eb797, wood: 0x98785f },
 blossom: { wall: 0xf7e3e7, floor: 0xd7b5b3, trim: 0xfff5f4, pink: 0xd99aa9, green: 0xb6a1c9, wood: 0x9b7774 },
 mint: { wall: 0xe3eee0, floor: 0xc2cdb0, trim: 0xf7fff0, pink: 0xa9c7a6, green: 0xe3bda7, wood: 0x8a9d7e }
};
const pointFor = (col: number, row: number) => ({ x: (col - 1) * 1.05, z: (1 - row) * 1.05 });
export default function CottageRoom3D({ theme, furniture, positions, selected, onSelect, onMove }: Props) {
 const canvasRef = useRef<HTMLCanvasElement>(null);
 const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
 const viewRef = useRef<any>(null);
 const callbacks = useRef({ onSelect, onMove });
 const state = useRef({ positions, selected, furniture });
 callbacks.current = { onSelect, onMove }; state.current = { positions, selected, furniture };
 useEffect(() => {
  let dead = false; let frame = 0; let renderer: any; let cleanup = () => {};
  setStatus("loading");
  async function start() {
   const canvas = canvasRef.current; if (!canvas) return;
   const canvasElement = canvas as HTMLCanvasElement;
   try {
    const T = await import("three"); if (dead) return;
    const p = palette[theme], scene = new T.Scene(); scene.background = new T.Color(p.wall);
    const camera = new T.PerspectiveCamera(38, 1, 0.1, 100); camera.position.set(4.8, 4.5, 6.6); camera.lookAt(0, 0.65, 0);
    renderer = new T.WebGLRenderer({ canvas: canvasElement, antialias: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)); renderer.outputColorSpace = T.SRGBColorSpace; renderer.shadowMap.enabled = true;
    scene.add(new T.HemisphereLight(0xfff8ed, 0x8c7d83, 2));
    const sun = new T.DirectionalLight(0xffefd4, 2.8); sun.position.set(-3, 7, 5); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); scene.add(sun);
    const room = new T.Group(); scene.add(room);
    const mat = (c: number) => new T.MeshStandardMaterial({ color: c, roughness: 0.85 });
    const wall = mat(p.wall), floor = mat(p.floor), trim = mat(p.trim), pink = mat(p.pink), green = mat(p.green), wood = mat(p.wood), cream = mat(0xfff1df);
    const add = (g: any, geo: any, m: any, x: number, y: number, z: number) => { const o = new T.Mesh(geo, m); o.position.set(x,y,z); o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };
    add(room,new T.BoxGeometry(4.2,.14,4),floor,0,-.08,0);
    // Fine timber floorboards add warmth and scale to the little room.
    for (let z=-1.72, row=0; z<=1.73; z+=.34,row++) {
      add(room,new T.BoxGeometry(4.08,.012,.012),wood,0,-.002,z);
      if (row%2===0) for (let x=-1.65; x<1.8; x+=.82) {
        add(room,new T.BoxGeometry(.012,.012,.33),wood,x,-.001,z+.16);
      }
    }
    add(room,new T.BoxGeometry(4.2,2.8,.12),wall,0,1.32,-1.98);
    add(room,new T.BoxGeometry(.12,2.8,4),wall,-2.04,1.32,0);
    add(room,new T.BoxGeometry(4.2,.1,.12),trim,0,.08,-1.9);
    add(room,new T.BoxGeometry(4.2,.13,.1),wood,0,.18,-1.9);
    add(room,new T.BoxGeometry(.12,.1,4),trim,-1.97,.08,0);
    add(room,new T.BoxGeometry(.1,.13,4),wood,-1.9,.18,0);
    add(room,new T.BoxGeometry(.12,.1,4),trim,-1.97,.08,0);
    add(room,new T.BoxGeometry(1.05,1.12,.06),trim,-.86,1.65,-1.88);
    add(room,new T.BoxGeometry(.86,.92,.07),mat(0xa8d9db),-.86,1.65,-1.83);
    // A soft sky gradient is suggested by two translucent-looking color panes.
    add(room,new T.BoxGeometry(.4,.88,.012),mat(0xc7e8e8),-.64,1.65,-1.785);
    add(room,new T.BoxGeometry(.86,.045,.03),trim,-.86,2.12,-1.79);
    add(room,new T.BoxGeometry(.86,.045,.03),trim,-.86,1.18,-1.79);
    add(room,new T.BoxGeometry(.08,1.02,.08),pink,-1.43,1.65,-1.77);
    add(room,new T.BoxGeometry(.08,1.02,.08),pink,-.29,1.65,-1.77);
    add(room,new T.CylinderGeometry(.025,.025,1.24,10),wood,-.86,2.23,-1.77).rotation.z=Math.PI/2;
    add(room,new T.BoxGeometry(.045,.92,.03),trim,-.86,1.65,-1.79);
    add(room,new T.BoxGeometry(.86,.045,.03),trim,-.86,1.65,-1.79);
    add(room,new T.BoxGeometry(1.12,.08,.18),wood,-.86,1.08,-1.75);
    // Small wall sconce and framed botanical print.
    add(room,new T.BoxGeometry(.1,.12,.07),wood,.35,1.75,-1.87);
    add(room,new T.SphereGeometry(.075,12,8),mat(0xffe4a6),.35,1.78,-1.82);
    add(room,new T.BoxGeometry(.5,.62,.07),trim,1.08,1.65,-1.88);
    add(room,new T.BoxGeometry(.4,.52,.03),mat(0xe5ead6),1.08,1.65,-1.83);
    add(room,new T.CylinderGeometry(.012,.012,.26,8),green,1.08,1.68,-1.8);
    add(room,new T.SphereGeometry(.07,8,6),green,1.0,1.76,-1.8);
    add(room,new T.SphereGeometry(.07,8,6),pink,1.16,1.72,-1.8);
    add(room,new T.BoxGeometry(.55,.7,.06),wood,1.1,1.62,-1.88);
    add(room,new T.BoxGeometry(.42,.56,.07),pink,1.1,1.62,-1.83);
    const objects: Record<string, any> = {};
    function make(id: Furniture) {
     const g = new T.Group(), part = (geo: any,m: any,x:number,y:number,z:number) => add(g,geo,m,x,y,z);
     if(id==="sofa") { part(new T.BoxGeometry(.95,.34,.42),pink,0,.28,0); part(new T.BoxGeometry(.98,.38,.15),pink,0,.42,-.15); part(new T.BoxGeometry(.16,.32,.44),green,-.42,.34,0); part(new T.BoxGeometry(.16,.32,.44),green,.42,.34,0); part(new T.BoxGeometry(.27,.1,.27),cream,-.18,.48,.01); part(new T.BoxGeometry(.27,.1,.27),cream,.18,.48,.01); for(const x of [-.34,.34])for(const z of [-.13,.13])part(new T.CylinderGeometry(.035,.035,.16,10),wood,x,.09,z); }
     else if(id==="rug") { part(new T.CylinderGeometry(.72,.72,.035,40),pink,0,.025,0); part(new T.CylinderGeometry(.56,.56,.012,40),cream,0,.048,0); part(new T.CylinderGeometry(.42,.42,.012,40),pink,0,.056,0); for(let i=0;i<8;i++){let a=i*Math.PI/4;const petal=part(new T.SphereGeometry(.16,12,8),green,Math.cos(a)*.58,.05,Math.sin(a)*.58);petal.scale.set(1,.18,.7);} }
     else if(id==="plant") { part(new T.CylinderGeometry(.15,.12,.22,12),pink,0,.12,0); for(let i=0;i<5;i++){let leaf=part(new T.IcosahedronGeometry(.16,1),green,Math.cos(i*1.25)*.13,.42+(i%2)*.1,Math.sin(i*1.25)*.12);leaf.scale.set(.7,1.3,.6);} }
     else if(id==="lamp") { part(new T.CylinderGeometry(.2,.22,.06,16),wood,0,.03,0);part(new T.CylinderGeometry(.035,.045,.66,12),wood,0,.38,0);part(new T.ConeGeometry(.24,.27,16),cream,0,.77,0);part(new T.SphereGeometry(.07,10,8),mat(0xffd88d),0,.62,0); }
     else if(id==="table") { part(new T.CylinderGeometry(.35,.35,.09,24),wood,0,.42,0);part(new T.CylinderGeometry(.05,.08,.38,12),wood,0,.22,0);part(new T.CylinderGeometry(.23,.26,.05,16),green,0,.04,0);part(new T.CylinderGeometry(.07,.07,.12,12),cream,0,.52,0);part(new T.BoxGeometry(.2,.025,.13),pink,-.13,.49,.08);part(new T.BoxGeometry(.16,.02,.11),cream,.13,.49,-.08); }
     else if(id==="shelf") { part(new T.BoxGeometry(.62,.9,.24),wood,0,.46,0);for(let i=0;i<3;i++){part(new T.BoxGeometry(.55,.035,.22),trim,0,.2+i*.25,.02);for(let j=0;j<3;j++)part(new T.BoxGeometry(.1,.15+(j%2)*.04,.12),[pink,green,cream][(i+j)%3],-.18+j*.17,.29+i*.25,.02);} }
     else if(id==="bed") { part(new T.BoxGeometry(.86,.22,1),wood,0,.18,0);part(new T.BoxGeometry(.82,.13,.92),cream,0,.32,.02);part(new T.BoxGeometry(.82,.2,.12),pink,0,.43,-.42);part(new T.BoxGeometry(.27,.09,.22),green,-.2,.43,-.26);part(new T.BoxGeometry(.27,.09,.22),green,.2,.43,-.26);for(const x of [-.34,.34])for(const z of [-.38,.38])part(new T.BoxGeometry(.07,.17,.07),wood,x,.08,z);part(new T.BoxGeometry(.82,.025,.24),pink,0,.4,.26); }
     else { part(new T.BoxGeometry(.06,.52,.48),wood,0,.78,0);part(new T.BoxGeometry(.035,.42,.38),green,.04,.78,.01);part(new T.SphereGeometry(.1,12,8),pink,.06,.8,.02); }
     g.userData.furnitureId=id; room.add(g); objects[id]=g;
    }
    furniture.forEach(make);
    const grid = new T.GridHelper(3.15,3,0xffffff,0xffffff); grid.position.y=.012; (grid.material as any).transparent=true; (grid.material as any).opacity=.18; room.add(grid);
    const plane = new T.Plane(new T.Vector3(0,1,0),0), ray = new T.Raycaster(), pointer = new T.Vector2();
    let dragging: string | null = null;
    let rotating = false;
    let lastX = 0, lastY = 0;
    const pointers = new Map<number, { x: number; y: number }>();
    let pinchStartDistance = 0, pinchStartRadius = 0;
    const target = new T.Vector3(0, 0.65, 0);
    let radius = camera.position.distanceTo(target);
    let theta = Math.atan2(camera.position.x - target.x, camera.position.z - target.z);
    let phi = Math.acos((camera.position.y - target.y) / radius);
    const initialView = { radius, theta, phi };
    function updateCamera() {
      phi = Math.max(0.42, Math.min(1.32, phi));
      radius = Math.max(5.8, Math.min(12, radius));
      camera.position.set(target.x + radius * Math.sin(phi) * Math.sin(theta), target.y + radius * Math.cos(phi), target.z + radius * Math.sin(phi) * Math.cos(theta));
      camera.lookAt(target);
    }
    function position(id: string,col:number,row:number,y=.03){const q=pointFor(col,row);if(objects[id])objects[id].position.set(q.x,y,q.z);}
    Object.keys(objects).forEach(id=>{const c=state.current.positions[id as Furniture]||{col:1,row:1};position(id,c.col,c.row);});
    function highlight(){Object.entries(objects).forEach(([id,g]:any)=>{g.scale.setScalar(id===state.current.selected?1.035:1);g.traverse((o:any)=>{if(o.isMesh)o.material.emissiveIntensity=0;});});}
    highlight();
    function resize(){const r=canvasElement.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix();}
    function setRay(e:PointerEvent){const r=canvasElement.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width*2-1;pointer.y=-(e.clientY-r.top)/r.height*2+1;ray.setFromCamera(pointer,camera);}
    function findGroup(o:any):any{while(o&&o!==room&&!o.userData.furnitureId)o=o.parent;return o&&o!==room?o:null;}
    function down(e:PointerEvent){pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});canvasElement.setPointerCapture(e.pointerId);if(pointers.size>=2){if(dragging){const old=state.current.positions[dragging as Furniture]||{col:1,row:1};position(dragging,old.col,old.row);}dragging=null;rotating=false;const pts=Array.from(pointers.values());pinchStartDistance=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y);pinchStartRadius=radius;e.preventDefault();return;}setRay(e);const hit=ray.intersectObjects(Object.values(objects).flatMap((g:any)=>g.children),true)[0];const g=hit?findGroup(hit.object):null;lastX=e.clientX;lastY=e.clientY;if(g){dragging=g.userData.furnitureId;callbacks.current.onSelect(dragging as Furniture);}else{rotating=true;}e.preventDefault();}
    function move(e:PointerEvent){if(pointers.has(e.pointerId))pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size>=2){const pts=Array.from(pointers.values());const distance=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y);radius=pinchStartRadius-(distance-pinchStartDistance)*.018;updateCamera();return;}if(dragging){setRay(e);const v=new T.Vector3();if(!ray.ray.intersectPlane(plane,v))return;const col=Math.max(0,Math.min(2,Math.round(v.x/1.05+1))),row=Math.max(0,Math.min(2,Math.round(1-v.z/1.05)));position(dragging,col,row,.06);return;}if(rotating){const dx=e.clientX-lastX,dy=e.clientY-lastY;theta-=dx*.008;phi+=dy*.006;lastX=e.clientX;lastY=e.clientY;updateCamera();}}
    function up(e:PointerEvent){if(dragging){setRay(e);const v=new T.Vector3();if(ray.ray.intersectPlane(plane,v)){const col=Math.max(0,Math.min(2,Math.round(v.x/1.05+1))),row=Math.max(0,Math.min(2,Math.round(1-v.z/1.05)));const occupied=state.current.furniture.some((id)=>id!==dragging&&state.current.positions[id]?.col===col&&state.current.positions[id]?.row===row);if(occupied){const old=state.current.positions[dragging as Furniture]||{col:1,row:1};position(dragging,old.col,old.row);}else callbacks.current.onMove(dragging as Furniture,col,row);}dragging=null;}rotating=false;pointers.delete(e.pointerId);if(pointers.size===1){const remaining=Array.from(pointers.values())[0];lastX=remaining.x;lastY=remaining.y;}}
    function wheel(e:WheelEvent){e.preventDefault();radius+=e.deltaY*.012;updateCamera();}
    canvasElement.addEventListener("pointerdown",down);canvasElement.addEventListener("pointermove",move);canvasElement.addEventListener("pointerup",up);canvasElement.addEventListener("pointercancel",up);canvasElement.addEventListener("wheel",wheel,{passive:false});
    const resizeHandler=()=>resize();window.addEventListener("resize",resizeHandler);resize();
    const tick=()=>{if(dead)return;frame=requestAnimationFrame(tick);renderer.render(scene,camera);};frame=requestAnimationFrame(tick);
    cleanup=()=>{window.removeEventListener("resize",resizeHandler);canvasElement.removeEventListener("pointerdown",down);canvasElement.removeEventListener("pointermove",move);canvasElement.removeEventListener("pointerup",up);canvasElement.removeEventListener("pointercancel",up);canvasElement.removeEventListener("wheel",wheel);scene.traverse((object:any)=>{if(object.geometry)object.geometry.dispose();if(object.material){const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach((material:any)=>material.dispose());}});};
    viewRef.current={objects,position,highlight,zoom:(factor:number)=>{radius*=factor;updateCamera();},resetView:()=>{radius=initialView.radius;theta=initialView.theta;phi=initialView.phi;updateCamera();}};
    setStatus("ready");
   } catch(e){console.error("Could not build 3D cottage room",e); if(!dead) setStatus("error");}
  }
  start(); return ()=>{dead=true;cancelAnimationFrame(frame);cleanup();renderer?.dispose();viewRef.current=null;};
 }, [theme, furniture.join("|")]);
 useEffect(()=>{const v=viewRef.current;if(!v)return;Object.keys(v.objects).forEach(id=>{const c=positions[id as Furniture]||{col:1,row:1};v.position(id,c.col,c.row);});v.highlight();},[positions,selected,furniture]);
 return <div className="cottage-3d-wrap">
   <canvas ref={canvasRef} className="cottage-3d-canvas" aria-label="可拖动家具的三维私人小屋" role="img" />
   {status === "ready" && <div className="cottage-view-tools" role="group" aria-label="房间视角控制">
     <button type="button" onClick={() => viewRef.current?.zoom(1.12)} aria-label="放大房间">＋</button>
     <button type="button" onClick={() => viewRef.current?.resetView()} aria-label="重置房间视角">↻</button>
     <button type="button" onClick={() => viewRef.current?.zoom(.89)} aria-label="缩小房间">−</button>
   </div>}
   {status !== "ready" && <div className={"cottage-3d-status " + (status === "error" ? "status-error" : "")} role="status">
     <span>{status === "error" ? "✧" : "✦"}</span>
     <strong>{status === "error" ? "小屋暂时没有打开" : "正在点亮你的小屋…"}</strong>
     <small>{status === "error" ? "当前浏览器可能无法启动 3D 画面，请尝试更新浏览器或关闭省电模式。" : "正在准备家具与柔和的光线"}</small>
   </div>}
 </div>;
}
