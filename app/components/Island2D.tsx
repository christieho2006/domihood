"use client";

import { useRef } from "react";

type Props = { angle: number; zoom: number; onEnter?: () => void; onAngleChange?: (angle: number) => void; freeRotate?: boolean };

const islandOutline = "M494 64 C602 57 692 100 757 152 C839 177 883 251 873 333 C905 417 855 510 793 562 C738 642 627 700 506 693 C391 714 271 665 194 607 C107 565 66 479 94 391 C62 301 108 214 178 164 C244 91 367 56 494 64Z";


function Pagoda({x,y,scale=1}:{x:number;y:number;scale?:number}) {
 return <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <ellipse cy="36" rx="42" ry="11" fill="#344d54" opacity=".25"/>
  <path d="M-26 17H26L20 32H-20Z" fill="#8d9a91" stroke="#625e63" strokeWidth="2"/>
  <path d="M-19 0H19V18H-19Z" fill="#d9b58c" stroke="#70594d" strokeWidth="2"/>
  <path d="M-31 1L0-17 31 1Q0 8-31 1Z" fill="#344b58" stroke="#725b50" strokeWidth="2"/>
  <path d="M-25-2L0-19 25-2" fill="none" stroke="#b38b67" strokeWidth="3"/>
  <path d="M0-18V-33" stroke="#d9b46e" strokeWidth="3"/><path d="M0-36l4 7-4 7-4-7Z" fill="#ffe5a4"/>
  <rect x="-4" y="5" width="8" height="13" rx="3" fill="#6f5147"/>
 </g>
}
function Waterfall({x,y}:{x:number;y:number}) {
 return <g transform={`translate(${x} ${y})`}>
  <path d="M-48-4Q-31-28-13-12Q7-33 28-9Q48-4 50 13L36 26H-43Z" fill="#697c8d" stroke="#596c77" strokeWidth="3"/>
  <path d="M-14-8Q-9 17-18 43Q-4 52 8 42Q3 17 12-8Z" fill="#a6dce0" opacity=".95"/>
  <path d="M12-8Q22 15 16 35Q28 42 36 31Q28 12 32-8Z" fill="#d1f0e9" opacity=".9"/>
  <ellipse cx="8" cy="48" rx="43" ry="12" fill="#77c1c7" opacity=".8"/>
  <path d="M-24 48q12-8 22 0t22 0t22 0" fill="none" stroke="#e5f6e9" strokeWidth="3"/>
 </g>
}
function Dock({x,y}:{x:number;y:number}) {
 return <g transform={`translate(${x} ${y})`}>
  <path d="M-48-5L20-27 50-7-19 17Z" fill="#9b765c" stroke="#6f574a" strokeWidth="3"/>
  <path d="M-37-3L-11 11 M-13-11L13 3 M12-19L38-5" stroke="#d6b18a" strokeWidth="3"/>
  <path d="M-33 12v12 M25-2v12" stroke="#6d5748" strokeWidth="4"/>
 </g>
}
function HotSpring({x,y}:{x:number;y:number}) {
 return <g transform={`translate(${x} ${y})`}>
  <ellipse cy="10" rx="48" ry="19" fill="#7a9d9a" stroke="#6d8179" strokeWidth="3"/>
  <ellipse cy="5" rx="35" ry="12" fill="#a8d8d1"/>
  <path d="M-18-7q-10-13 0-23 M2-8q-9-15 2-27 M20-7q-8-12 2-22" fill="none" stroke="#f2eee0" strokeWidth="3" strokeLinecap="round" opacity=".85"/>
  <path d="M-29 5q13-8 26 0t26 0" fill="none" stroke="#e6f4e8" strokeWidth="2"/>
 </g>
}
function Cave({x,y}:{x:number;y:number}) {
 return <g transform={`translate(${x} ${y})`}>
  <path d="M-45 22Q-50-12-25-28Q-2-48 23-26Q48-9 43 22Z" fill="#77808b" stroke="#565f6b" strokeWidth="3"/>
  <path d="M-25 22Q-29-3-10-17Q7-28 23-10Q34 3 27 22Z" fill="#344653"/>
  <path d="M-9 20Q-5 5 6 2Q16 9 16 20" fill="#e6ba79" opacity=".7"/>
  <circle cx="-29" cy="-14" r="5" fill="#b8c2c6"/><circle cx="30" cy="-8" r="4" fill="#b8c2c6"/>
 </g>
}
function Orchard({x,y}:{x:number;y:number}) {
 return <g transform={`translate(${x} ${y})`}>
  {[-25,0,25].map((dx,i)=><g key={dx} transform={`translate(${dx} ${i%2?4:0})`}>
   <path d="M0 15V-8" stroke="#89684e" strokeWidth="5"/>
   <circle cy="-17" r="17" fill={i===1?"#91aa79":"#829d70"}/>
   <circle cx="-7" cy="-20" r="4" fill="#d97869"/><circle cx="8" cy="-12" r="4" fill="#d97869"/>
  </g>)}
 </g>
}
function Balloon({x,y}:{x:number;y:number}) {
 return <g transform={`translate(${x} ${y})`}>
  <path d="M0-52C-29-52-35-23-17-7L0 5 17-7C35-23 29-52 0-52Z" fill="#d7a0b3" stroke="#795f65" strokeWidth="2"/>
  <path d="M0-48Q-17-27 0-8Q17-27 0-48Z" fill="#f1c3c9" opacity=".75"/>
  <path d="M-10-5L-7 12 M10-5L7 12" stroke="#80634f" strokeWidth="2"/>
  <path d="M-9 12H9L7 23H-7Z" fill="#a77d59" stroke="#735847" strokeWidth="2"/>
 </g>
}
function RegionPin({x,y,n,label}:{x:number;y:number;n:number;label:string}) {
 return <g transform={`translate(${x} ${y})`}>
  <circle cy="2" r="13" fill="#263c52" opacity=".2"/>
  <circle r="12" fill="#f6e8c9" stroke="#8c765e" strokeWidth="2"/>
  <text y="4" textAnchor="middle" fontSize="12" fontWeight="700" fill="#5e4c40">{n}</text>

 </g>
}
function Tree({ x, y, scale = 1, color = "sage" }: { x: number; y: number; scale?: number; color?: "sage" | "lavender" | "blossom" }) {
  const palette = color === "lavender" ? ["#7183b1", "#8798c5", "#aab4d8", "#c1c8e3"] : color === "blossom" ? ["#b97f9c", "#d095ad", "#e4b6c4", "#f0ced0"] : ["#66896f", "#7fa17a", "#9bb786", "#b9c998"];
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cy="12" rx="39" ry="13" fill="#344f45" opacity=".22"/>
    <path d="M-5 11 Q-9-8 -4-41 L7-41 Q4-12 10 11Z" fill="#88644e"/>
    <path d="M0-27 Q-17-42 -24-56 M3-30 Q19-46 26-58" fill="none" stroke="#88644e" strokeWidth="6" strokeLinecap="round"/>
    <path d="M-3-7Q-15-20-24-31 M5-12Q18-25 25-37" fill="none" stroke="#a17b5d" strokeWidth="3" strokeLinecap="round"/>
    <ellipse cx="-20" cy="-48" rx="24" ry="21" fill={palette[0]}/>
    <ellipse cx="13" cy="-58" rx="29" ry="25" fill={palette[1]}/>
    <ellipse cx="-3" cy="-78" rx="23" ry="22" fill={palette[2]}/>
    <ellipse cx="31" cy="-44" rx="17" ry="18" fill={palette[0]}/>
    <ellipse cx="-34" cy="-63" rx="13" ry="15" fill={palette[1]}/>
    <path d="M-30-55q8-12 18-10 M-2-83q9-10 19-5 M15-48q8-8 15-5" fill="none" stroke={palette[3]} strokeWidth="5" strokeLinecap="round" opacity=".9"/>
    <circle cx="-11" cy="-65" r="4" fill="#fff5df" opacity=".48"/><circle cx="22" cy="-69" r="5" fill="#fff5df" opacity=".4"/>
  </g>;
}
function Cottage({ x, y, scale = 1, roof = "#b77d68", wall = "#f4e2c3", width = 1 }: { x: number; y: number; scale?: number; roof?: string; wall?: string; width?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx="3" cy="55" rx={63*width} ry="18" fill="#405b51" opacity=".2"/>
    <path d={`M${-42*width} 3 L0-23 ${42*width} 3 V48 H${-42*width}Z`} fill="#d3b997" opacity=".55" transform="translate(0 5)"/>
    <path d={`M${-42*width} 0 L0-23 ${42*width} 0 V47 H${-42*width}Z`} fill={wall} stroke="#785e50" strokeWidth="3" strokeLinejoin="round"/>
    <path d={`M0-23V47`} stroke="#d6c4a7" strokeWidth="2" opacity=".8"/>
    <path d={`M${-53*width} 0 L0-50 ${53*width} 0 L0 18Z`} fill={roof} stroke="#765747" strokeWidth="3" strokeLinejoin="round"/>
    <path d={`M0-50 L${53*width} 0 L${42*width} 0 L0-23Z`} fill="#d7a181" stroke="#765747" strokeWidth="2"/>
    <path d={`M${-53*width} 0 L0-50 ${53*width} 0`} fill="none" stroke="#f0c9a2" strokeWidth="5" strokeLinecap="round"/>
    <path d={`M${-42*width} 0 L0-23 ${42*width} 0`} fill="none" stroke="#9a715c" strokeWidth="2" opacity=".65"/>
    <path d="M-36-3L-27-11" stroke="#f6d9b6" strokeWidth="3" strokeLinecap="round" opacity=".65"/>
    <rect x="-11" y="15" width="22" height="32" rx="7" fill="#805d4b" stroke="#684b3d" strokeWidth="2"/>
    <path d="M-7 19V43" stroke="#b48a69" strokeWidth="2" opacity=".8"/><circle cx="6" cy="31" r="2.4" fill="#f8d88e" stroke="none"/>
    <rect x={-32*width} y="10" width="16" height="19" rx="5" fill="#a9ceca" stroke="#80675a" strokeWidth="3"/>
    <path d={`M${-24*width} 11V28 M${-31*width} 19H${-17*width}`} stroke="#f4e6ce" strokeWidth="2"/>
    <rect x={16*width} y="10" width="16" height="19" rx="5" fill="#a9ceca" stroke="#80675a" strokeWidth="3"/>
    <path d={`M${24*width} 11V28 M${17*width} 19H${31*width}`} stroke="#f4e6ce" strokeWidth="2"/>
    <path d="M-17 49H17" stroke="#b28a68" strokeWidth="6" strokeLinecap="round"/>
    <path d="M-18 51L-27 59H27L18 51Z" fill="#b99a7b" stroke="#8c6d57" strokeWidth="2"/>
    <rect x="25" y="-47" width="10" height="24" rx="2" fill="#98735e" stroke="#765747" strokeWidth="2"/>
    <path d="M23-49h14" stroke="#ead4b6" strokeWidth="4" strokeLinecap="round"/>
  </g>;
}
function Lantern({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <ellipse cy="9" rx="11" ry="4" fill="#435c51" opacity=".18"/>
    <path d="M0 7V-24" stroke="#80634f" strokeWidth="4" strokeLinecap="round"/>
    <path d="M-9-25Q0-36 9-25L6-12H-6Z" fill="#ffe2a0" stroke="#8b6c54" strokeWidth="2"/>
    <path d="M-11-29H11" stroke="#80634f" strokeWidth="3" strokeLinecap="round"/>
    <circle cy="-22" r="18" fill="#ffe6a7" opacity=".13"/>
  </g>;
}

function FlowerBed({ x, y, tone = "pink" }: { x: number; y: number; tone?: "pink" | "cream" | "blue" }) {
  const petal = tone === "pink" ? "#e9aebe" : tone === "blue" ? "#a6b4dc" : "#f3d89c";
  return <g transform={`translate(${x} ${y})`}>
    <ellipse cy="5" rx="25" ry="11" fill="#628568" opacity=".45"/>
    {[-15, 0, 15].map((dx, i) => <g key={dx} transform={`translate(${dx} ${i%2?0:-5})`}>
      <path d="M0 6q-2-10 0-17" stroke="#64885f" strokeWidth="2" fill="none"/>
      <circle cy="-18" r="5" fill={petal}/><circle cx="-5" cy="-15" r="4" fill={petal}/><circle cx="5" cy="-15" r="4" fill={petal}/>
      <circle cy="-15" r="2" fill="#f8e4a9"/>
    </g>)}
  </g>;
}

export default function Island2D({ angle, zoom, onEnter, onAngleChange, freeRotate = false }: Props) {
  const pointer = useRef<{ x: number; angle: number; moved: boolean } | null>(null);
  const safeZoom = Math.max(.72, Math.min(1.7, zoom));
  return <svg
    className="island-art island-3d-canvas island-2d-scene"
    viewBox="0 0 1000 760"
    role="button"
    tabIndex={0}
    aria-label="手绘绘本风格的浮空小岛，点击进入探索"
    onPointerDown={e => { if (!freeRotate) return; pointer.current = { x: e.clientX, angle, moved: false }; e.currentTarget.setPointerCapture(e.pointerId); }}
    onPointerMove={e => { if (!pointer.current || !onAngleChange) return; const dx = e.clientX - pointer.current.x; if (Math.abs(dx) > 6) pointer.current.moved = true; if (pointer.current.moved) onAngleChange(pointer.current.angle + dx * .18); }}
    onPointerUp={() => { const moved = pointer.current?.moved; pointer.current = null; if (freeRotate && !moved) onEnter?.(); }}
    onPointerCancel={() => { pointer.current = null; }}
    onClick={() => { if (!freeRotate) onEnter?.(); }}
    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onEnter?.(); } }}
  >
    <defs>
      <linearGradient id="dh-grass" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#b6c99a"/><stop offset=".48" stopColor="#91b58d"/><stop offset="1" stopColor="#75977e"/></linearGradient>
      <linearGradient id="dh-cliff" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#c69a7c"/><stop offset=".55" stopColor="#9b7771"/><stop offset="1" stopColor="#6e6879"/></linearGradient>
      <linearGradient id="dh-water" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#b1ded8"/><stop offset=".55" stopColor="#7dbdc4"/><stop offset="1" stopColor="#9bcbd0"/></linearGradient>
      <radialGradient id="dh-glow"><stop stopColor="#ffe5a3" stopOpacity=".42"/><stop offset="1" stopColor="#ffe5a3" stopOpacity="0"/></radialGradient>
      <filter id="dh-shadow" x="-30%" y="-30%" width="160%" height="180%"><feGaussianBlur stdDeviation="13"/></filter>
      <clipPath id="dh-top"><path d={islandOutline}/></clipPath>
    </defs>

    <ellipse cx="500" cy="665" rx="380" ry="43" fill="#415c58" opacity=".2" filter="url(#dh-shadow)"/>
    <g transform={`translate(500 380) scale(${safeZoom}) rotate(${angle*.1}) translate(-500 -380)`}>
      {/* Floating island strata */}
      <path d="M494 102 C604 95 706 137 773 190 C852 216 894 289 884 369 C914 449 866 533 805 585 C747 665 632 720 505 713 C384 733 261 687 182 625 C94 580 52 491 81 399 C48 305 96 218 168 177 C238 111 365 91 494 102Z" fill="url(#dh-cliff)" stroke="#766879" strokeWidth="8"/>
      <path d="M133 442 C236 542 343 573 499 579 C650 587 766 542 870 438 L831 542 C750 642 633 681 500 684 C363 691 234 646 151 556Z" fill="#806d72" opacity=".62"/>
      <path d={islandOutline} fill="url(#dh-grass)" stroke="#718b72" strokeWidth="7"/>
      <g clipPath="url(#dh-top)">
        {/* Quiet meadow patches */}
        <ellipse cx="270" cy="310" rx="145" ry="100" fill="#c3d0a0" opacity=".28"/>
        <ellipse cx="700" cy="275" rx="145" ry="105" fill="#a8c49a" opacity=".24"/>
        <ellipse cx="500" cy="555" rx="220" ry="95" fill="#71977c" opacity=".22"/>

        {/* Paths: one clear loop and short branches, all connected to destinations */}
        <path d="M190 390 C275 328 357 315 452 343 C548 371 633 369 738 322 C780 303 815 302 850 317" fill="none" stroke="#b49b7d" strokeWidth="42" strokeLinecap="round"/>
        <path d="M190 390 C275 328 357 315 452 343 C548 371 633 369 738 322 C780 303 815 302 850 317" fill="none" stroke="#ead9b9" strokeWidth="32" strokeLinecap="round"/>
        <path d="M255 535 C337 480 405 462 494 473 C591 484 658 535 748 530" fill="none" stroke="#b49b7d" strokeWidth="30" strokeLinecap="round"/>
        <path d="M255 535 C337 480 405 462 494 473 C591 484 658 535 748 530" fill="none" stroke="#ead9b9" strokeWidth="21" strokeLinecap="round"/>
        <path d="M500 350 C499 392 500 425 500 466" fill="none" stroke="#b49b7d" strokeWidth="27" strokeLinecap="round"/>
        <path d="M500 350 C499 392 500 425 500 466" fill="none" stroke="#ead9b9" strokeWidth="18" strokeLinecap="round"/>

        {/* River is a single continuous watercourse, separated from roads */}
        <path d="M733 142 C677 206 650 258 619 309 C585 366 557 403 500 447 C444 489 407 526 372 600" fill="none" stroke="#5f9fa7" strokeWidth="55" strokeLinecap="round"/>
        <path d="M733 142 C677 206 650 258 619 309 C585 366 557 403 500 447 C444 489 407 526 372 600" fill="none" stroke="url(#dh-water)" strokeWidth="46" strokeLinecap="round"/>
        <path d="M715 171 C665 229 642 278 609 326 C575 378 548 415 489 459" fill="none" stroke="#e2f4e9" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 18" opacity=".75"/>
        <path d="M470 468 Q458 481 446 495 M432 510Q421 523 411 538" fill="none" stroke="#e2f4e9" strokeWidth="2.5" strokeLinecap="round" opacity=".55"/>

        {/* River banks: rounded stones and reeds make the water sit inside the terrain. */}
        <g fill="#78958b" stroke="#607f76" strokeWidth="2">
          <ellipse cx="680" cy="201" rx="10" ry="6" transform="rotate(-34 680 201)"/>
          <ellipse cx="653" cy="244" rx="13" ry="7" transform="rotate(-28 653 244)"/>
          <ellipse cx="631" cy="285" rx="9" ry="6" transform="rotate(-30 631 285)"/>
          <ellipse cx="578" cy="378" rx="12" ry="7" transform="rotate(-36 578 378)"/>
          <ellipse cx="548" cy="413" rx="10" ry="6" transform="rotate(-35 548 413)"/>
          <ellipse cx="470" cy="470" rx="11" ry="7" transform="rotate(-35 470 470)"/>
          <ellipse cx="442" cy="501" rx="13" ry="7" transform="rotate(-38 442 501)"/>
          <ellipse cx="409" cy="548" rx="10" ry="6" transform="rotate(-38 409 548)"/>
        </g>
        <g fill="none" stroke="#638a70" strokeWidth="3" strokeLinecap="round">
          <path d="M700 220q-8-15-3-25 M704 220q8-14 15-17 M626 316q-10-12-8-22 M632 315q9-12 17-13"/>
          <path d="M390 560q-10-13-8-23 M395 561q9-13 17-16 M450 535q-8-11-6-19"/>
        </g>
        <g fill="#d7e9d2" opacity=".7">
          <ellipse cx="680" cy="197" rx="4" ry="2" transform="rotate(-34 680 197)"/>
          <ellipse cx="631" cy="281" rx="4" ry="2" transform="rotate(-30 631 281)"/>
          <ellipse cx="442" cy="497" rx="5" ry="2" transform="rotate(-38 442 497)"/>
        </g>

        {/* Subtle stone joints along the main path, kept sparse for readability. */}
        <g fill="none" stroke="#c5b18f" strokeWidth="2" strokeLinecap="round" opacity=".72">
          <path d="M236 359q9 7 18 5 M294 333q8 7 17 5 M361 329q8 7 16 9 M425 343q8 8 16 10 M555 370q8 7 16 7 M686 346q8 4 15 1 M291 510q8 7 17 4 M374 480q8 6 17 5 M566 490q8 7 17 8 M678 526q8 5 16 3"/>
        </g>

        {/* Bridges cross the water at right angles and connect both banks */}
        <g transform="translate(594 351) rotate(-54)">
          <rect x="-44" y="-17" width="88" height="34" rx="5" fill="#8d6e5b" stroke="#72594d" strokeWidth="3"/>
          <rect x="-40" y="-13" width="80" height="26" rx="3" fill="#e6d4b3" stroke="#a78a6e" strokeWidth="2"/>
          {[-25,-8,9,26].map(x => <path key={x} d={`M${x} -11v22`} stroke="#c4ad8d" strokeWidth="2"/>)}
          <path d="M-42-19H42 M-42 19H42" stroke="#85664f" strokeWidth="4" strokeLinecap="round"/>
        </g>
        <g transform="translate(438 494) rotate(-54)">
          <rect x="-35" y="-15" width="70" height="30" rx="5" fill="#8d6e5b" stroke="#72594d" strokeWidth="3"/>
          <rect x="-31" y="-11" width="62" height="22" rx="3" fill="#e6d4b3" stroke="#a78a6e" strokeWidth="2"/>
          <path d="M-33-17H33 M-33 17H33" stroke="#85664f" strokeWidth="4" strokeLinecap="round"/>
        </g>

        {/* New landmarks from the 15-part island deployment plan. */}
        <Waterfall x={725} y={205}/>
        <Pagoda x={445} y={455} scale={1.05}/>
        <Dock x={245} y={580}/>
        <HotSpring x={755} y={515}/>
        <Cave x={840} y={430}/>
        <Orchard x={790} y={580}/>
        <Balloon x={650} y={625}/>
        <g opacity=".9">
          <path d="M270 300Q300 260 340 282Q370 295 382 330" fill="none" stroke="#c3a47e" strokeWidth="24" strokeLinecap="round"/>
          <path d="M270 300Q300 260 340 282Q370 295 382 330" fill="none" stroke="#ead9b9" strokeWidth="17" strokeLinecap="round"/>
          <g transform="translate(315 278)"><path d="M-35 12L0-17 35 12V38H-35Z" fill="#e7c99f" stroke="#765d50" strokeWidth="2"/><path d="M-42 12L0-27 42 12" fill="#a77b6b" stroke="#765d50" strokeWidth="3"/><rect x="-8" y="19" width="16" height="19" fill="#80604f"/><circle cx="-21" cy="23" r="5" fill="#a6d3d2"/><circle cx="21" cy="23" r="5" fill="#a6d3d2"/></g>
        </g>
        {/* Dream lake with a quiet reflective surface. */}
        <ellipse cx="655" cy="335" rx="67" ry="28" transform="rotate(-23 655 335)" fill="#78b8c2" stroke="#638e91" strokeWidth="4"/><ellipse cx="655" cy="335" rx="49" ry="16" transform="rotate(-23 655 335)" fill="#b5e1d9"/><path d="M620 340q16-8 31 0t31 0" fill="none" stroke="#e4f6e9" strokeWidth="3"/>
        {/* A compact farm terrace on the western shelf. */}
        <g transform="translate(190 475)">
          <path d="M-48 8L0-12 51 7 1 28Z" fill="#a77e5f" stroke="#745a49" strokeWidth="3"/>
          <path d="M-38 7L0-7 40 8 M-28 15L8 1 M-12 21L25 7" stroke="#e2c79a" strokeWidth="4" strokeLinecap="round"/>
          {[-22,0,22].map(dx=><g key={dx} transform={`translate(${dx} 0)`}><path d="M0 7q-7-12-3-20 M0 7q8-13 8-20" fill="none" stroke="#78956d" strokeWidth="3"/><circle cx="-3" cy="-13" r="4" fill="#d7a2b2"/><circle cx="8" cy="-13" r="4" fill="#e7d28e"/></g>)}
        </g>
        {/* Main house, north of the central plaza */}
        <Cottage x={493} y={246} scale={1.22} roof="#b67b68" wall="#f5e4c8" width={1.12}/>
        {/* Garden and planting beds on the west */}
        <g>
          <path d="M185 445 Q230 415 286 438 Q313 460 290 500 Q238 519 194 488Z" fill="#7e9d78" stroke="#69856b" strokeWidth="3"/>
          <path d="M203 451Q240 434 279 450 M202 469Q243 453 290 471 M214 488Q249 475 280 488" fill="none" stroke="#d6c59e" strokeWidth="5" strokeLinecap="round"/>
          <FlowerBed x={220} y={450} tone="pink"/><FlowerBed x={263} y={480} tone="cream"/>
          <FlowerBed x={300} y={435} tone="blue"/>
        </g>
        {/* Cafe to the south-east */}
        <Cottage x={678} y={492} scale={.88} roof="#a98eb4" wall="#f6e6cd" width={1.08}/>
        {/* Small shop to the south-west */}
        <Cottage x={315} y={555} scale={.72} roof="#c18c6e" wall="#f4dfbd" width={.95}/>
        {/* Star lookout on the upper-right rise */}
        <g transform="translate(755 228)">
          <ellipse cy="42" rx="54" ry="15" fill="#526c61" opacity=".18"/>
          <path d="M-43 18Q0-6 43 18L34 37H-34Z" fill="#d6c6a7" stroke="#8a735f" strokeWidth="3"/>
          <path d="M-31 14V-13L0-36 31-13V14Z" fill="#f1dfc0" stroke="#806b60" strokeWidth="3"/>
          <path d="M-38-13L0-48 38-13" fill="none" stroke="#a88eaa" strokeWidth="11" strokeLinejoin="round"/>
          <path d="M-8 14V-9Q0-22 8-9V14" fill="#9fc9c5" stroke="#806b60" strokeWidth="2"/>
          <path d="M0-62l5 12 13 2-10 9 2 13-10-7-11 7 3-13-10-9 13-2Z" fill="#ffe5a2" stroke="#a98761" strokeWidth="2"/>
        </g>

        {/* Central plaza with a clear open center */}
        <ellipse cx="500" cy="400" rx="83" ry="57" fill="#d9c9a7" stroke="#b49c7d" strokeWidth="4"/>
        <ellipse cx="500" cy="400" rx="68" ry="44" fill="#eadcbf"/>
        <path d="M455 400Q500 372 545 400Q500 429 455 400Z" fill="#c6b18e" opacity=".42"/>
        <circle cx="500" cy="399" r="10" fill="#b9a17d"/>
        <path d="M500 389V409M490 399H510" stroke="#f8edcf" strokeWidth="3" strokeLinecap="round"/>

        {/* Trees form coherent garden borders, not random scatter */}
        <Tree x={164} y={275} scale={1.08} color="lavender"/>
        <Tree x={245} y={190} scale={.92} color="blossom"/>
        <Tree x={370} y={150} scale={.82}/>
        <Tree x={640} y={165} scale={.9} color="lavender"/>
        <Tree x={835} y={355} scale={.92} color="blossom"/>
        <Tree x={805} y={520} scale={.95}/>
        <Tree x={160} y={510} scale={.82}/>
        <Tree x={390} y={610} scale={.8} color="lavender"/>
        <Tree x={575} y={590} scale={.72} color="blossom"/>
        <Tree x={720} y={590} scale={.82} color="lavender"/>

        {/* Dense hand-painted woodland masses: grouped around the island rim, leaving paths and entrances readable. */}
        <g>
          <Tree x={115} y={360} scale={.72} color="lavender"/><Tree x={205} y={235} scale={.66} color="blossom"/>
          <Tree x={300} y={145} scale={.62} color="lavender"/><Tree x={465} y={132} scale={.58} color="blossom"/>
          <Tree x={725} y={150} scale={.68}/><Tree x={865} y={285} scale={.68} color="lavender"/>
          <Tree x={865} y={465} scale={.7} color="blossom"/><Tree x={750} y={625} scale={.62} color="blossom"/>
          <Tree x={485} y={650} scale={.62}/><Tree x={290} y={630} scale={.64} color="lavender"/>
        </g>
        <g>
          {[
            [130,420,"#7896aa"],[185,315,"#9a8ab8"],[270,205,"#8179a8"],[355,170,"#789675"],
            [575,145,"#657f9c"],[790,240,"#9a8ab8"],[850,390,"#7896aa"],[830,555,"#789675"],
            [690,620,"#9a8ab8"],[535,625,"#657f9c"],[365,625,"#9a8ab8"],[205,560,"#789675"]
          ].map(([x,y,color],i)=><g key={i} transform={\`translate(\${x} \${y})\`}>
            <ellipse cy="7" rx="34" ry="10" fill="#314c49" opacity=".2"/>
            <path d="M-31 5q-7-15 7-23q9-17 23-6q12-18 25-4q17 1 15 18q10 17-8 20Z" fill={String(color)} stroke="#536e63" strokeWidth="2"/>
            <circle cx="-16" cy="-11" r="13" fill={String(color)} opacity=".85"/><circle cx="4" cy="-18" r="15" fill={String(color)} opacity=".72"/><circle cx="22" cy="-8" r="12" fill={String(color)} opacity=".9"/>
            <path d="M-19-15q8-7 14-3 M1-23q8-6 14-1 M16-11q6-5 10-2" fill="none" stroke="#d5d5c0" strokeWidth="3" strokeLinecap="round" opacity=".7"/>
          </g>)}
        </g>
        {/* Small stone outcrops define the island edge and the riverbanks. */}
        <g fill="#87939a" stroke="#5f7276" strokeWidth="2">
          <path d="M92 490l-8-15 12-16 17 4 10 19-13 12Z"/><path d="M158 603l-7-13 11-15 18 4 8 17-15 12Z"/>
          <path d="M327 671l-7-12 10-13 17 4 8 15-15 10Z"/><path d="M608 690l-9-14 13-17 19 5 9 17-17 12Z"/>
          <path d="M813 625l-8-13 11-16 17 4 8 16-15 12Z"/><path d="M871 359l-7-12 9-13 15 4 7 13-13 10Z"/>
        </g>
        <g fill="none" stroke="#c3c9c2" strokeWidth="3" strokeLinecap="round" opacity=".85">
          <path d="M96 475l7-8 6 2 M163 588l8-7 8 3 M333 655l8-5 6 3 M613 674l8-7 8 3 M817 609l7-6 8 3"/>
        </g>
        {/* Wildflower carpets, deliberately placed in open pockets between paths. */}
        <g>
          {[[230,365],[300,390],[390,285],[690,285],[760,395],[730,555],[520,575],[330,575]].map(([x,y],i)=><g key={i} transform={\`translate(\${x} \${y})\`}>
            {Array.from({length:7},(_,j)=><g key={j} transform={\`translate(\${(j-3)*10} \${j%2?-5:0})\`}>
              <path d="M0 7q-2-9 0-15" stroke="#6f956d" strokeWidth="2" fill="none"/>
              <circle cy="-12" r="5" fill={i%3===0?"#d99eb4":i%3===1?"#92a9d2":"#9585c4"}/>
              <circle cx="-4" cy="-9" r="4" fill={i%3===0?"#d99eb4":i%3===1?"#92a9d2":"#9585c4"}/>
              <circle cx="4" cy="-9" r="4" fill={i%3===0?"#d99eb4":i%3===1?"#92a9d2":"#9585c4"}/>
              <circle cy="-9" r="2" fill="#f4d99c"/>
            </g>)}
          </g>)}
        </g>


        {/* Flower borders are grouped along paths and garden edges */}
        <FlowerBed x={345} y={325} tone="pink"/>
        <FlowerBed x={390} y={342} tone="cream"/>
        <FlowerBed x={650} y={340} tone="blue"/>
        <FlowerBed x={700} y={360} tone="pink"/>
        <FlowerBed x={340} y={520} tone="cream"/>
        <FlowerBed x={610} y={550} tone="pink"/>
        <FlowerBed x={760} y={470} tone="blue"/>

        {/* Lanterns placed at path junctions and bridgeheads */}
        <circle cx="390" cy="344" r="36" fill="url(#dh-glow)"/><circle cx="610" cy="458" r="34" fill="url(#dh-glow)"/>
        <Lantern x={390} y={344}/><Lantern x={610} y={458}/><Lantern x={735} y={322}/><Lantern x={280} y={520}/><Lantern x={505} y={510}/>
        {/* The 15 numbered discovery areas correspond to the deployment legend. */}
        <RegionPin x={265} y={210} n={1} label="主屋"/>
        <RegionPin x={745} y={175} n={2} label="瀑布"/>
        <RegionPin x={330} y={286} n={3} label="花园茶屋"/>
        <RegionPin x={500} y={395} n={4} label="中央广场"/>
        <RegionPin x={680} y={485} n={5} label="咖啡馆"/>
        <RegionPin x={180} y={460} n={6} label="田园农场"/>
        <RegionPin x={445} y={445} n={7} label="观景塔"/>
        <RegionPin x={245} y={580} n={8} label="河畔码头"/>
        <RegionPin x={155} y={300} n={9} label="神秘森林"/>
        <RegionPin x={755} y={515} n={10} label="温泉庭院"/>
        <RegionPin x={840} y={430} n={11} label="隐秘洞穴"/>
        <RegionPin x={600} y={580} n={12} label="商业街"/>
        <RegionPin x={650} y={330} n={13} label="梦幻湖泊"/>
        <RegionPin x={790} y={580} n={14} label="果树乐园"/>
        <RegionPin x={650} y={625} n={15} label="气球台"/>
      </g>
      <path d={islandOutline} fill="none" stroke="#e8d8b8" strokeWidth="5" strokeDasharray="2 13" strokeLinecap="round" opacity=".7"/>
      <path d="M500 92l5 12 12 5-12 5-5 12-5-12-12-5 12-5Z M845 375l4 9 9 4-9 4-4 9-4-9-9-4 9-4Z M170 355l4 9 9 4-9 4-4 9-4-9-9-4 9-4Z" fill="#fff0c4" opacity=".85"/>
    </g>
  </svg>;
}
