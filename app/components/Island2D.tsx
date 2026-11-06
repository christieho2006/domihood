"use client";

import { useRef } from "react";

type Props = {
  angle: number;
  zoom: number;
  onEnter?: () => void;
  onAngleChange?: (angle: number) => void;
  freeRotate?: boolean;
};

function Tree({ x, y, s = 1, tone = "sage" }: { x: number; y: number; s?: number; tone?: "sage" | "blue" | "pink" }) {
  const colors = tone === "blue" ? ["#8194c5", "#9ba9d5", "#b8b9df"] : tone === "pink" ? ["#c98fae", "#e0a9bd", "#f0c5cc"] : ["#759a78", "#91b58b", "#b0c99a"];
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="12" rx="31" ry="10" fill="#536f62" opacity=".18"/>
    <path d="M-2 4 Q-7-16 -3-35 L5-35 Q2-14 7 5Z" fill="#98745e"/>
    <path d="M0-25 Q-22-39 -26-58 M2-23 Q20-42 24-58" fill="none" stroke="#98745e" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="-18" cy="-54" r="23" fill={colors[0]}/>
    <circle cx="13" cy="-61" r="27" fill={colors[1]}/>
    <circle cx="0" cy="-78" r="22" fill={colors[2]}/>
    <circle cx="-28" cy="-69" r="10" fill={colors[2]} opacity=".8"/>
    <circle cx="29" cy="-49" r="12" fill={colors[0]} opacity=".8"/>
    <path d="M-21-62q8-9 15-2 M5-82q8-8 15-2" fill="none" stroke="#fff3dc" strokeWidth="3" strokeLinecap="round" opacity=".65"/>
  </g>;
}

function House({ x, y, s = 1, roof = "#b98269", wall = "#f4dfbd", wide = false }: { x: number; y: number; s?: number; roof?: string; wall?: string; wide?: boolean }) {
  const w = wide ? 104 : 82;
  return <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#795f55" strokeWidth="3" strokeLinejoin="round">
    <ellipse cx="0" cy="42" rx={w*.72} ry="17" fill="#526d60" opacity=".18" stroke="none"/>
    <path d={`M-${w/2} 0 L0-45 ${w/2} 0 V42 H-${w/2}Z`} fill={wall}/>
    <path d={`M-${w/2-3} 1 L0-55 ${w/2-3} 1 L0 13Z`} fill={roof} />
    <path d={`M0-55 L${w/2+13}-7 L${w/2-3} 1Z`} fill="#d29a78"/>
    <path d={`M-${w/2-4} 1 L0-55 ${w/2+13}-7`} fill="none" stroke="#f1c99d" strokeWidth="5" opacity=".8"/>
    <rect x="-11" y="10" width="22" height="32" rx="8" fill="#916b57"/>
    <circle cx="5" cy="27" r="2" fill="#f5d48b" stroke="none"/>
    <rect x={-w/2+10} y="8" width="17" height="19" rx="5" fill="#a8c9c7"/>
    <rect x={w/2-27} y="8" width="17" height="19" rx="5" fill="#a8c9c7"/>
    <path d={`M-${w/2+7} 0 L0-61 ${w/2+19}-7`} fill="none" stroke="#f6d7ae" strokeWidth="4" strokeLinecap="round"/>
    <path d={`M-${w/2-8} 44 H${w/2+8}`} stroke="#a77d61" strokeWidth="7"/>
    <rect x="23" y="-58" width="10" height="24" rx="2" fill="#a77d61"/>
    <path d="M21-60h14" stroke="#f2d8b5" strokeWidth="4"/>
  </g>;
}

function Lamp({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <ellipse cy="13" rx="14" ry="5" fill="#526f60" opacity=".18"/>
    <path d="M0 10V-27" stroke="#816957" strokeWidth="5" strokeLinecap="round"/>
    <path d="M-10-28Q0-40 10-28L7-15H-7Z" fill="#f8d58b" stroke="#97765b" strokeWidth="2"/>
    <circle cy="-25" r="9" fill="#ffe5a7" opacity=".42"/>
    <path d="M-13-31H13" stroke="#816957" strokeWidth="3" strokeLinecap="round"/>
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
    onPointerMove={e => { if (!pointer.current || !onAngleChange) return; const dx=e.clientX-pointer.current.x; if(Math.abs(dx)>5) pointer.current.moved=true; if(pointer.current.moved) onAngleChange(pointer.current.angle+dx*.22); }}
    onPointerUp={() => { const moved=pointer.current?.moved; pointer.current=null; if(freeRotate&&!moved) onEnter?.(); }}
    onPointerCancel={() => { pointer.current=null; }}
    onClick={() => { if(!freeRotate) onEnter?.(); }}
    onKeyDown={e => { if(e.key==="Enter"||e.key===" "){e.preventDefault();onEnter?.();} }}
  >
    <defs>
      <linearGradient id="islandGrass" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#9dbd91"/><stop offset=".52" stopColor="#87aa87"/><stop offset="1" stopColor="#6f947d"/></linearGradient>
      <linearGradient id="islandCliff" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#b98e7a"/><stop offset=".55" stopColor="#92736f"/><stop offset="1" stopColor="#6c6578"/></linearGradient>
      <linearGradient id="islandWater" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#a5d7d5"/><stop offset=".5" stopColor="#79b9c0"/><stop offset="1" stopColor="#a5c8d2"/></linearGradient>
      <radialGradient id="lampGlow"><stop stopColor="#fff0bd" stopOpacity=".7"/><stop offset="1" stopColor="#fff0bd" stopOpacity="0"/></radialGradient>
      <filter id="softShadow" x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur stdDeviation="12"/></filter>
      <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .07 0"/></filter>
      <clipPath id="islandTop"><path d="M500 92 C625 87 746 151 817 242 C894 341 868 464 790 548 C720 626 606 660 475 650 C345 653 225 608 151 518 C81 432 100 312 170 221 C244 126 365 91 500 92Z"/></clipPath>
    </defs>
    <ellipse cx="500" cy="642" rx="390" ry="52" fill="#526d68" opacity=".18" filter="url(#softShadow)"/>
    <g transform={`translate(500 380) scale(${safeZoom}) rotate(${angle*.12}) translate(-500 -380)`}>
      <path d="M500 128 C631 119 765 181 836 272 C906 365 872 494 793 574 C712 656 599 692 475 679 C344 683 216 631 140 540 C64 448 82 317 158 224 C240 126 368 125 500 128Z" fill="url(#islandCliff)" stroke="#6e6674" strokeWidth="8"/>
      <path d="M145 465 Q220 526 305 550 T480 578 Q650 602 842 477 L816 558 Q714 656 475 679 Q245 671 140 540Z" fill="#806c72" opacity=".65"/>
      <path d="M500 92 C625 87 746 151 817 242 C894 341 868 464 790 548 C720 626 606 660 475 650 C345 653 225 608 151 518 C81 432 100 312 170 221 C244 126 365 91 500 92Z" fill="url(#islandGrass)" stroke="#647f6c" strokeWidth="7"/>
      <g clipPath="url(#islandTop)">
        <path d="M115 370 C235 325 318 340 390 393 C465 447 545 474 645 431 C740 390 823 378 914 414" fill="none" stroke="#d8c7a3" strokeWidth="46" strokeLinecap="round"/>
        <path d="M115 370 C235 325 318 340 390 393 C465 447 545 474 645 431 C740 390 823 378 914 414" fill="none" stroke="#ead9b7" strokeWidth="34" strokeLinecap="round"/>
        <path d="M183 514 C276 469 343 452 430 464 C540 481 617 535 744 510" fill="none" stroke="#d8c7a3" strokeWidth="27" strokeLinecap="round"/>
        <path d="M183 514 C276 469 343 452 430 464 C540 481 617 535 744 510" fill="none" stroke="#f0dfbd" strokeWidth="18" strokeLinecap="round"/>
        <path d="M706 155 C653 210 617 258 581 314 C547 368 511 410 456 445 C409 475 369 511 336 571" fill="none" stroke="#659eaa" strokeWidth="52" strokeLinecap="round"/>
        <path d="M706 155 C653 210 617 258 581 314 C547 368 511 410 456 445 C409 475 369 511 336 571" fill="none" stroke="url(#islandWater)" strokeWidth="43" strokeLinecap="round"/>
        <path d="M692 183 Q645 257 597 322 T466 444 T352 552" fill="none" stroke="#d8f0e8" strokeWidth="3" strokeDasharray="12 20" opacity=".8"/>
        <path d="M530 375 Q563 352 590 337" fill="none" stroke="#8d7967" strokeWidth="15" strokeLinecap="round"/>
        <path d="M530 375 Q563 352 590 337" fill="none" stroke="#ead6b7" strokeWidth="10" strokeLinecap="round"/>
        <path d="M474 443 Q506 411 532 380" fill="none" stroke="#8d7967" strokeWidth="14" strokeLinecap="round"/>
        <path d="M474 443 Q506 411 532 380" fill="none" stroke="#ead6b7" strokeWidth="9" strokeLinecap="round"/>
        <ellipse cx="495" cy="380" rx="93" ry="66" fill="#a8c38f" opacity=".45"/>
        <ellipse cx="495" cy="380" rx="66" ry="47" fill="#d5c79f" opacity=".75"/>
        <path d="M430 383 Q496 341 558 383 Q500 424 430 383Z" fill="#b99d7d" opacity=".4"/>
        <House x={325} y={275} s={1.08} roof="#bd8b70" wall="#f2dfbd" wide/>
        <House x={700} y={315} s={.85} roof="#9a91b7" wall="#f5e5c9"/>
        <House x={605} y={500} s={.88} roof="#b87e68" wall="#f2d9b5"/>
        <House x={220} y={475} s={.7} roof="#a58b9d" wall="#f5e5c9"/>
        <g transform="translate(492 354)">
          <path d="M-46 0 L0-42 46 0 V44 H-46Z" fill="#f6e8ca" stroke="#806b60" strokeWidth="3"/>
          <path d="M-52 0 L0-52 52 0" fill="none" stroke="#a87868" strokeWidth="13" strokeLinejoin="round"/>
          <rect x="-12" y="13" width="24" height="31" rx="9" fill="#98745e"/>
          <circle cx="5" cy="29" r="2.5" fill="#f9d991"/>
          <path d="M-28 11h15v18h-15z M14 11h15v18H14z" fill="#9dc9c8" stroke="#806b60" strokeWidth="2"/>
        </g>
        <path d="M456 405 Q495 422 535 405" fill="none" stroke="#8e6d58" strokeWidth="7" strokeLinecap="round"/>
        <g fill="#fff0c2" opacity=".75">
          <circle cx="456" cy="393" r="30" fill="url(#lampGlow)"/><circle cx="555" cy="431" r="28" fill="url(#lampGlow)"/><circle cx="688" cy="374" r="26" fill="url(#lampGlow)"/>
        </g>
        <Lamp x={456} y={390}/><Lamp x={555} y={431}/><Lamp x={688} y={374}/><Lamp x={270} y={392}/><Lamp x={770} y={465}/>
        <Tree x={205} y={240} s={1.1} tone="blue"/><Tree x={265} y={180} s={.82} tone="pink"/><Tree x={390} y={160} s={.75} tone="sage"/>
        <Tree x={765} y={210} s={1.05} tone="blue"/><Tree x={820} y={315} s={.8} tone="pink"/><Tree x={795} y={520} s={.9} tone="sage"/>
        <Tree x={170} y={450} s={.85} tone="sage"/><Tree x={275} y={555} s={.82} tone="blue"/><Tree x={680} y={585} s={.82} tone="pink"/>
        <Tree x={390} y={575} s={.72} tone="sage"/><Tree x={580} y={185} s={.7} tone="blue"/>
        {Array.from({length:54},(_,i)=>{const x=145+(i*83%710),y=165+(i*47%430);return <g key={i} transform={`translate(${x} ${y})`} opacity=".9"><circle r={i%3===0?7:5} fill={i%2?"#d6a9c1":"#f0d8a7"}/><circle cx="-7" cy="-3" r="4" fill="#e6c5d2"/><circle cx="7" cy="-2" r="4" fill="#e6c5d2"/></g>;})}
        <g transform="translate(545 445)">
          <path d="M-50 0 Q0-24 50 0" fill="none" stroke="#92765f" strokeWidth="10" strokeLinecap="round"/>
          <path d="M-50-5 Q0-28 50-5" fill="none" stroke="#f0dfbd" strokeWidth="7" strokeLinecap="round"/>
          <path d="M-44 0v12 M44 0v12" stroke="#8b705d" strokeWidth="5"/>
        </g>
        <g transform="translate(735 430)">
          <path d="M-35 0 Q0-23 35 0 V35 H-35Z" fill="#e8d7b9" stroke="#8b725e" strokeWidth="3"/>
          <path d="M-42 0 L0-34 42 0" fill="none" stroke="#b17e68" strokeWidth="11" strokeLinejoin="round"/>
          <rect x="-8" y="10" width="16" height="25" rx="7" fill="#98745e"/>
        </g>
        <g fill="#fff0b7" opacity=".8"><circle cx="735" cy="398" r="30" fill="url(#lampGlow)"/><circle cx="500" cy="300" r="22" fill="url(#lampGlow)"/></g>
        <path d="M255 320q30-18 55 0 M275 333q25-12 42 0 M640 270q30-16 55 0" fill="none" stroke="#fff4d7" strokeWidth="4" strokeLinecap="round" opacity=".5"/>
      </g>
      <path d="M500 92 C625 87 746 151 817 242 C894 341 868 464 790 548 C720 626 606 660 475 650 C345 653 225 608 151 518 C81 432 100 312 170 221 C244 126 365 91 500 92Z" fill="none" stroke="#e2d1b0" strokeWidth="5" strokeDasharray="3 12" opacity=".8"/>
      <g fill="#fff0c4" opacity=".9"><path d="M170 290l5 12 12 5-12 5-5 12-5-12-12-5 12-5Z"/><path d="M815 370l4 9 9 4-9 4-4 9-4-9-9-4 9-4Z"/><path d="M600 120l4 9 9 4-9 4-4 9-4-9-9-4 9-4Z"/></g>
    </g>
    <rect width="1000" height="760" filter="url(#paper)" opacity=".2" pointerEvents="none"/>
  </svg>;
}
