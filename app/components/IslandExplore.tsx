"use client";

import { useEffect, useRef, useState } from "react";

type Place = "square" | "cafe" | "cottage";
type Props = { onClose: () => void; onVisit: (place: Place) => void };

export default function IslandExplore({ onClose, onVisit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [focus, setFocus] = useState<"overview" | "garden" | "cottage" | "bridge">("overview");
  const [nightMode, setNightMode] = useState(false);
  const drag = useRef({ active: false, x: 0, y: 0, moved: false });
  const cameraState = useRef({ theta: -0.62, phi: 1.02, radius: 13.5, targetX: 0, targetY: 0.25, targetZ: 0 });
  const engine = useRef<any>(null);

  useEffect(() => {
    let disposed = false;
    let renderer: any;
    let raf = 0;
    let cleanup: (() => void) | undefined;
    async function build() {
      try {
        const THREE: any = await import("three");
        if (disposed || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#cfe2e3");
        scene.fog = new THREE.Fog("#cfe2e3", 20, 42);
        const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        scene.add(new THREE.HemisphereLight(0xf4fff0, 0x8b766a, 2.15));
        const sun = new THREE.DirectionalLight(0xffedcf, 3.2);
        sun.position.set(-8, 13, 7); sun.castShadow = true;
        sun.shadow.mapSize.set(2048, 2048);
        sun.shadow.camera.left = -14; sun.shadow.camera.right = 14;
        sun.shadow.camera.top = 14; sun.shadow.camera.bottom = -14;
        sun.shadow.bias = -0.0002; scene.add(sun);
        const fill = new THREE.DirectionalLight(0xb4dcff, 1.25);
        fill.position.set(8, 5, -8); scene.add(fill);

        const mat = (color: string, roughness = 0.88, extra: any = {}) => new THREE.MeshStandardMaterial({ color, roughness, ...extra });
        const grass = mat("#82b979"), grassLight = mat("#a6ce86"), grassDark = mat("#679c6a");
        const soil = mat("#a9785b"), soilLight = mat("#c29270"), stone = mat("#b8b7a7"), stoneLight = mat("#ded9c6");
        const wood = mat("#956746"), woodLight = mat("#c49265"), roof = mat("#bd7770"), roofLight = mat("#d99583");
        const cream = mat("#fff0d3"), glass = mat("#9ccbc8", 0.28, { metalness: 0.05 });
        const leaf1 = mat("#4f8d61"), leaf2 = mat("#70aa6e"), leaf3 = mat("#93bf78");
        const flowerMats = [mat("#fff5df"), mat("#f4c3ca"), mat("#e9d58f"), mat("#d7c8ef")];
        const world = new THREE.Group(); scene.add(world);

        function add(geo: any, material: any, x: number, y: number, z: number, parent = world, cast = true) {
          const m = new THREE.Mesh(geo, material);
          m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = true; parent.add(m); return m;
        }
        function box(x:number,y:number,z:number,sx:number,sy:number,sz:number,material:any,parent=world) {
          return add(new THREE.BoxGeometry(sx,sy,sz),material,x,y,z,parent);
        }
        function sphere(x:number,y:number,z:number,sx:number,sy:number,sz:number,material:any,parent=world, detail=1) {
          const m=add(new THREE.IcosahedronGeometry(1,detail),material,x,y,z,parent); m.scale.set(sx,sy,sz); return m;
        }
        function cylinder(x:number,y:number,z:number,rt:number,rb:number,h:number,material:any,parent=world, sides=10) {
          return add(new THREE.CylinderGeometry(rt,rb,h,sides),material,x,y,z,parent);
        }
        function path(points:number[][], radius:number, material:any, parent=world) {
          const curve = new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(p[0],p[1],p[2])));
          return add(new THREE.TubeGeometry(curve, Math.max(32,points.length*12),radius,8,false),material,0,0,0,parent,false);
        }

        // Floating island foundation: stratified soil, rock shelves and a soft grass cap.
        const outline = new THREE.Shape();
        outline.moveTo(-5.8,-1.0); outline.bezierCurveTo(-6.3,1.2,-4.7,3.9,-2.0,4.1);
        outline.bezierCurveTo(-0.3,5.0,2.5,4.1,4.5,2.8); outline.bezierCurveTo(6.0,1.2,5.8,-1.8,4.1,-3.4);
        outline.bezierCurveTo(2.2,-4.7,-1.6,-4.8,-3.8,-3.5); outline.bezierCurveTo(-5.3,-2.9,-6.0,-2.0,-5.8,-1.0);
        const cliff = add(new THREE.ExtrudeGeometry(outline,{depth:1.65,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.18,bevelThickness:.2,curveSegments:14}),soil,0,-.2,0);
        cliff.rotation.x=-Math.PI/2; cliff.position.y=-.35; cliff.receiveShadow=true;
        // Faceted rock outcrops layered under the island rim.
        for(let i=0;i<54;i++){
          const a=i*Math.PI*2/54, r=5.25+(i%4)*.16;
          const rockMesh=sphere(Math.cos(a)*r,-.48-(i%5)*.17,Math.sin(a)*3.65,.55+(i%3)*.13,.38+(i%4)*.13,.42, i%3?soilLight:soil,world,0);
          rockMesh.rotation.set((i%3)*.18,a,(i%4)*.12);
        }
        const top = add(new THREE.CylinderGeometry(5.55,5.18,.38,12,1),grass,0,.47,0);
        top.scale.z=.72; top.receiveShadow=true;
        const top2=add(new THREE.CylinderGeometry(5.28,5.02,.12,18),grassLight,0,.69,0); top2.scale.z=.72;
        // Ground contour mounds make the terrain feel sculpted rather than flat.
        for(const p of [[-3.5,.78,-1.8,1.5,.42,1.1],[2.8,.75,-2.2,1.4,.35,1.1],[3.8,.74,1.25,1.0,.24,.75],[-4,.74,1.3,.9,.22,.75]] as number[][]){
          sphere(p[0],p[1],p[2],p[3],p[4],p[5],p[0]<0?grassLight:grassDark,world,1);
        }
        // Winding stone path with individual paving blocks and fine seams.
        const pathPoints=[[-.1,.78,3.35],[-.65,.79,2.6],[-.3,.8,1.8],[.4,.8,1.0],[.65,.8,.1],[1.35,.8,-.7],[2.25,.8,-1.45],[2.9,.8,-2.15]];
        path(pathPoints,.29,stone);
        const pavers=mat("#d7d0bd");
        for(let i=0;i<68;i++){
          const t=i/67, idx=Math.min(pathPoints.length-2,Math.floor(t*(pathPoints.length-1))), f=t*(pathPoints.length-1)-idx;
          const a=pathPoints[idx],b=pathPoints[idx+1], x=a[0]+(b[0]-a[0])*f, z=a[2]+(b[2]-a[2])*f;
          const block=box(x+Math.sin(i*7)*.15,.86+Math.sin(i*4)*.015,z+Math.cos(i*3)*.12,.28+(i%3)*.035,.055,.24+(i%2)*.04,i%4?pavers:stoneLight);
          block.rotation.y=Math.atan2(b[0]-a[0],b[2]-a[2])+(i%2)*.12;
        }
        // A shallow turquoise creek curves past the lower garden and over the edge.
        const waterMat=mat("#8bcac9",.23,{metalness:.08,transparent:true,opacity:.9});
        path([[-3.5,.79,1.9],[-2.7,.79,1.2],[-2.3,.79,.15],[-2.7,.78,-.8],[-3.7,.78,-1.8],[-4.4,.35,-2.7],[-4.55,-.4,-3.0]],.16,waterMat);
        path([[-3.5,.82,1.9],[-2.7,.82,1.2],[-2.3,.82,.15],[-2.7,.81,-.8]],.018,mat("#d6f4e5",.2),world);

        // A curved wooden footbridge with plank deck, rails, posts and stone abutments.
        for(let i=0;i<9;i++) box(-2.55+i*.19,.93,.78,.17,.09,.72,woodLight);
        for(const z of [.45,1.1]){
          for(let i=0;i<5;i++) cylinder(-2.5+i*.36,1.12,z,.045,.045,.38,wood,world,7);
          path([[-2.65,1.29,z],[-1.95,1.34,z],[-1.35,1.29,z]],.045,wood);
        }
        // Cottage builder: walls, foundation, separate roof slopes, trim, door, windows and porch.
        function house(x:number,z:number,scale=1,body="#f2dfbd",roofColor="#bd7770"){
          const g=new THREE.Group(); g.position.set(x,.82,z); g.scale.setScalar(scale); world.add(g);
          const bodyMat=mat(body), rMat=mat(roofColor), trim=mat("#fff0d7"), dark=mat("#795441");
          box(0,.5,0,1.25,1.0,1.0,bodyMat,g); box(0,.02,0,1.42,.12,1.15,stoneLight,g);
          // roof is built from two independent sloped panels
          const r1=box(-.34,1.12,0,.82,.13,1.28,rMat,g); r1.rotation.z=-.55;
          const r2=box(.34,1.12,0,.82,.13,1.28,rMat,g); r2.rotation.z=.55;
          box(0,1.05,-.01,.08,.12,1.32,roofLight,g);
          box(0,1.13,.55,.25,.48,.08,dark,g);
          box(0,1.34,.6,.35,.08,.08,woodLight,g);
          for(const wx of [-.38,.38]){
            box(wx,.68,.515,.25,.3,.035,trim,g); box(wx,.68,.54,.17,.22,.025,glass,g);
            box(wx,.68,.56,.035,.25,.025,trim,g); box(wx,.68,.56,.19,.035,.025,trim,g);
            box(wx,.52,.58,.3,.04,.08,woodLight,g);
            box(wx,.84,.59,.3,.035,.07,trim,g);
          }
          box(-.68,.47,0,.09,.72,.1,trim,g); box(.68,.47,0,.09,.72,.1,trim,g);
          box(0,.12,.8,1.65,.12,.42,woodLight,g);
          for(const px of [-.68,.68]) cylinder(px,.48,.91,.035,.035,.72,wood,g,8);
          const chimney=box(-.39,1.47,-.28,.18,.48,.2,soilLight,g); chimney.rotation.z=-.08;
          // flower boxes, tiny plants and warm glowing porch light
          for(const wx of [-.38,.38]){
            box(wx,.48,.62,.3,.09,.12,wood,g);
            for(let k=0;k<3;k++) sphere(wx-.09+k*.09,.57,.64,.045,.05,.045,k%2?flowerMats[1]:flowerMats[0],g,1);
          }
          const glow=mat("#ffdca0",.4,{emissive:new THREE.Color("#ffc66b"),emissiveIntensity:.7});
          sphere(.36,.82,.67,.055,.055,.055,glow,g,1);
          return g;
        }
        house(-2.9,-2.0,1.05,"#f5e3c5","#c77973");
        house(2.5,-2.55,.76,"#e9d6d2","#8aa9a0");
        house(3.5,.15,.62,"#f4e8d0","#d8a66e");

        // Multi-layer trees: trunks, branching limbs, clustered leaf crowns and highlight leaves.
        function tree(x:number,z:number,s=1){
          const g=new THREE.Group();g.position.set(x,.78,z);g.scale.setScalar(s);world.add(g);
          cylinder(0,.65,0,.12,.18,1.3,wood,g,9);
          for(let i=0;i<4;i++){
            const branch=cylinder((i%2?-.2:.2),1.02+(i%3)*.13,0,.055,.08,.68,wood,g,7);
            branch.rotation.z=(i%2?-.6:.6); branch.rotation.x=(i%3-1)*.25;
          }
          const clusters=[[-.34,1.35,0,.54],[.2,1.55,.12,.62],[.43,1.28,-.12,.46],[-.05,1.86,-.08,.48],[-.42,1.68,.12,.38]];
          clusters.forEach((p,i)=>sphere(p[0],p[1],p[2],p[3],p[3]*(i%2?.9:1.12),p[3],i%3===0?leaf1:i%3===1?leaf2:leaf3,g,1));
          for(let i=0;i<8;i++){
            const a=i*2.4, rr=.28+(i%3)*.12;
            sphere(Math.cos(a)*rr,1.55+(i%4)*.1,Math.sin(a)*rr,.12,.13,.12,i%2?leaf3:leaf2,g,1);
          }
        }
        [[-4,-1.3,1.15],[-4.2,1.4,.9],[0,-3.25,.82],[4.1,-1.45,.88],[3.8,1.9,.72],[-1.2,2.65,.7],[1.25,2.7,.72]].forEach((p:number[])=>tree(p[0],p[1],p[2]));

        // A profusion of grass blades, grouped into one draw call for each tint.
        const grassGeo=new THREE.ConeGeometry(.025,.19,3);
        for(let group=0;group<3;group++){
          const inst=new THREE.InstancedMesh(grassGeo,[grass,grassLight,grassDark][group],850);
          const dummy=new THREE.Object3D(); let count=0;
          for(let i=0;i<850;i++){
            const x=(Math.random()*10.3)-5.15,z=(Math.random()*7.0)-3.5;
            if((x/5.3)**2+(z/3.7)**2>.88)continue;
            if(x>-.7&&x<2.7&&z>-.9&&z<2.2)continue;
            if(x<-2&&z>-.4&&z<2.2)continue;
            dummy.position.set(x,.78+Math.random()*.02,z); dummy.rotation.y=Math.random()*Math.PI; dummy.rotation.z=(Math.random()-.5)*.25; dummy.scale.setScalar(.5+Math.random()*.9);dummy.updateMatrix();inst.setMatrixAt(count++,dummy.matrix);
          }
          inst.count=count;inst.castShadow=false;inst.receiveShadow=true;world.add(inst);
        }
        // Garden beds, blossoms, clover, mushrooms and pebble clusters.
        for(let i=0;i<115;i++){
          const a=i*2.399, r=1.9+(i%13)*.22, x=Math.cos(a)*r,z=Math.sin(a)*r*.72;
          if((x/5.1)**2+(z/3.6)**2>.85 || (x>-.8&&x<2.7&&z>-.7&&z<2.0))continue;
          const fm=flowerMats[i%flowerMats.length];
          cylinder(x,.84,z,.022,.025,.08,mat("#628e56"),world,5);
          for(let k=0;k<5;k++){const ang=k*Math.PI*2/5;sphere(x+Math.cos(ang)*.055,.89,z+Math.sin(ang)*.055,.055,.035,.045,fm,world,1);}
          sphere(x,.91,z,.026,.025,.026,mat("#e9bd69"),world,1);
        }
        for(let i=0;i<26;i++){
          const a=i*2.4,r=2.4+(i%4)*.35,x=Math.cos(a)*r,z=Math.sin(a)*r*.72;
          sphere(x,.84,z,.13,.07,.1,i%2?stone:stoneLight,world,0);
        }
        // Lanterns, benches and a picnic corner.
        function lantern(x:number,z:number){
          cylinder(x,1.14,z,.035,.05,.7,wood,world,8);
          box(x,1.53,z,.24,.22,.24,wood,world);
          const light=mat("#ffe8ad",.25,{emissive:new THREE.Color("#ffcd72"),emissiveIntensity:1.6});
          sphere(x,1.54,z,.105,.105,.105,light,world,1);
          const cap=add(new THREE.ConeGeometry(.19,.12,8),wood,x,1.72,z); cap.rotation.y=.2;
        }
        lantern(-.9,2.65);lantern(2.9,-.35);lantern(-3.8,.35);
        box(-1.2,.9,2.5,.9,.12,.25,woodLight);box(-1.55, .72,2.5,.08,.28,.08,wood);box(-.85,.72,2.5,.08,.28,.08,wood);
        const table=add(new THREE.CylinderGeometry(.42,.45,.1,12),woodLight,.05,.96,2.65);cylinder(.05,.7,2.65,.07,.08,.48,wood);
        // Puffy cloud islands and warm floating particles add depth to the atmosphere.
        const cloudMat=mat("#ffffff",1,{transparent:true,opacity:.72});
        for(const p of [[-8,1,-5,.8],[-7,1.3,-4.5,.9],[7,0,-5,.8],[8,.5,-4.5,1.0]] as number[][])sphere(p[0],p[1],p[2],p[3],p[3]*.55,p[3]*.65,cloudMat,scene,2);
        const motes: any[]=[];
        const moteMat=mat("#fff0bd",.3,{emissive:new THREE.Color("#f8d88a"),emissiveIntensity:1.5});
        for(let i=0;i<34;i++){const m=sphere((Math.random()-.5)*9,.95+Math.random()*2,(Math.random()-.5)*6,.025,.025,.025,moteMat,scene,1);motes.push({m,phase:Math.random()*Math.PI*2});}

        function setCamera(){
          const s=cameraState.current;
          s.phi=Math.max(.38,Math.min(1.42,s.phi));
          camera.position.set(s.targetX+s.radius*Math.sin(s.phi)*Math.sin(s.theta),s.targetY+s.radius*Math.cos(s.phi),s.targetZ+s.radius*Math.sin(s.phi)*Math.cos(s.theta));
          camera.lookAt(s.targetX,s.targetY,s.targetZ);
        }
        function resize(){
          if(disposed)return;
          const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);
          renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();setCamera();
        }
        const onResize=()=>resize();window.addEventListener("resize",onResize);resize();
        function setNight(night:boolean){
          const sky = new THREE.Color(night ? "#182b42" : "#cfe2e3");
          scene.background = sky;
          scene.fog.color.copy(sky);
          sun.intensity = night ? 0.72 : 3.2;
          fill.intensity = night ? 1.65 : 1.25;
          scene.children.forEach((child:any)=>{ if(child.isHemisphereLight) child.intensity = night ? 0.72 : 2.15; });
          renderer.toneMappingExposure = night ? 0.9 : 1.12;
        }
        engine.current={camera,scene,renderer,setCamera,setNight};
        const start=performance.now();
        function animate(now:number){
          if(disposed)return;raf=requestAnimationFrame(animate);
          world.rotation.y=Math.sin(now*.00012)*.025;
          motes.forEach((o:any)=>{o.m.position.y=1.1+Math.sin(now*.001+o.phase)*.25; o.m.position.x+=Math.sin(now*.0003+o.phase)*.0007;});
          renderer.render(scene,camera);
        }
        raf=requestAnimationFrame(animate);
        cleanup=()=>window.removeEventListener("resize",onResize);
        setLoading(false);
      } catch(err){console.error("Immersive island failed to initialize",err);setLoading(false);}
    }
    void build();
    return ()=>{disposed=true;cancelAnimationFrame(raf);cleanup?.();if(renderer)renderer.dispose();engine.current=null;};
  }, []);

  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if(e.key==="Escape")onClose();
      if(e.key==="+"||e.key==="=")zoomBy(-1);
      if(e.key==="-")zoomBy(1);
      if(["w","a","s","d","W","A","S","D","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)){
        const s=cameraState.current, step=.42;
        const forwardX=-Math.sin(s.theta), forwardZ=-Math.cos(s.theta);
        if(e.key==="w"||e.key==="W"||e.key==="ArrowUp"){s.targetX+=forwardX*step;s.targetZ+=forwardZ*step;}
        if(e.key==="s"||e.key==="S"||e.key==="ArrowDown"){s.targetX-=forwardX*step;s.targetZ-=forwardZ*step;}
        if(e.key==="a"||e.key==="A"||e.key==="ArrowLeft"){s.targetX-=forwardZ*step;s.targetZ+=forwardX*step;}
        if(e.key==="d"||e.key==="D"||e.key==="ArrowRight"){s.targetX+=forwardZ*step;s.targetZ-=forwardX*step;}
        setFocus("overview");engine.current?.setCamera();
      }
    };
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[onClose]);

  function zoomBy(direction:number){
    const state=cameraState.current;state.radius=Math.max(6.5,Math.min(21,state.radius+direction*1.1));engine.current?.setCamera();
  }
  function focusOn(area:"overview"|"garden"|"cottage"|"bridge"){
    const s=cameraState.current;
    const targets={overview:[0,.25,0,13.5],garden:[-2,.72,.8,9.8],cottage:[2.15,.8,-2.0,9.6],bridge:[-2.25,.75,.75,8.9]} as const;
    const t=targets[area];s.targetX=t[0];s.targetY=t[1];s.targetZ=t[2];s.radius=t[3];
    setFocus(area);engine.current?.setCamera();
  }
  function toggleNight(){
    const next=!nightMode;setNightMode(next);engine.current?.setNight(next);
  }
  function onPointerDown(e:React.PointerEvent<HTMLCanvasElement>){
    drag.current={active:true,x:e.clientX,y:e.clientY,moved:false};e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e:React.PointerEvent<HTMLCanvasElement>){
    if(!drag.current.active)return;
    const dx=e.clientX-drag.current.x,dy=e.clientY-drag.current.y;
    if(Math.abs(dx)+Math.abs(dy)>2)drag.current.moved=true;
    const s=cameraState.current;s.theta-=dx*.006;s.phi=Math.max(.38,Math.min(1.42,s.phi+dy*.004));
    drag.current.x=e.clientX;drag.current.y=e.clientY;engine.current?.setCamera();
  }
  function onPointerUp(){drag.current.active=false;}
  function onWheel(e:React.WheelEvent<HTMLCanvasElement>){cameraState.current.radius=Math.max(8,Math.min(21,cameraState.current.radius+e.deltaY*.012));engine.current?.setCamera();}

  return <div className="island-explore" role="dialog" aria-modal="true" aria-label="沉浸式小岛探索">
    <canvas ref={canvasRef} className="island-explore-canvas" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onWheel={onWheel} />
    <div className="explore-vignette" />
    <header className="explore-topbar">
      <button className="explore-back" onClick={onClose} aria-label="返回主页">← <span>返回主页</span></button>
      <div className="explore-title"><span>DOMIHOOD · OPEN WORLD</span><strong>云端小岛</strong><small>一座可以慢慢探索的童话岛屿</small></div>
      <div className="explore-status"><i /> {loading ? "正在生成岛屿" : "世界已载入"}</div>
    </header>
    <div className="explore-hint"><span>✧</span> 拖动环顾四周 <i /> 滚轮缩放 <i /> WASD 移动视点 <i /> ESC 返回</div>
    <nav className="explore-viewpoints" aria-label="小岛观景点">
      <button className={focus==="overview"?"active":""} onClick={()=>focusOn("overview")}>全岛</button>
      <button className={focus==="garden"?"active":""} onClick={()=>focusOn("garden")}>花园</button>
      <button className={focus==="bridge"?"active":""} onClick={()=>focusOn("bridge")}>小桥</button>
      <button className={focus==="cottage"?"active":""} onClick={()=>focusOn("cottage")}>小屋</button>
    </nav>
    <button className="explore-time-toggle" onClick={toggleNight}>{nightMode?"☾ 星夜模式":"☀ 日光模式"}</button>
    <aside className="explore-card">
      <span className="explore-kicker">YOUR LITTLE WORLD</span>
      <h2>每个角落，<br/><em>都藏着一段故事。</em></h2>
      <p>沿着石板路散步，穿过花园与小桥，去拜访属于岛民的温暖角落。</p>
      <div className="explore-weather"><span>{nightMode?"☾":"☀"}</span><div><b>{nightMode?"星光夜晚":"晴朗午后"}</b><small>{nightMode?"暮色降临 · 萤火微亮 · 静谧时分":"微风 · 花香 · 云朵缓慢飘过"}</small></div></div>
      <div className="explore-locations">
        <button onClick={()=>{onClose();onVisit("square");}}><span>✿</span><div><b>粉丝广场</b><small>GATHERING GARDEN</small></div><i>↗</i></button>
        <button onClick={()=>{onClose();onVisit("cafe");}}><span>☕</span><div><b>回忆咖啡馆</b><small>MEMORY CAFE</small></div><i>↗</i></button>
        <button onClick={()=>{onClose();onVisit("cottage");}}><span>⌂</span><div><b>私人小屋</b><small>MY LITTLE COTTAGE</small></div><i>↗</i></button>
      </div>
    </aside>
    <div className="explore-bottom"><span>✦ 3D TERRAIN</span><span>自然光照</span><span>细节花园</span><span>动态萤火</span></div>
    <div className="explore-zoom"><button onClick={()=>zoomBy(1)} aria-label="拉远">−</button><button onClick={()=>zoomBy(-1)} aria-label="拉近">＋</button></div>
  </div>;
}
