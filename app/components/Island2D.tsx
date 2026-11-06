"use client";

import { useRef } from "react";

type Props = { angle: number; zoom: number; onEnter?: () => void; onAngleChange?: (angle: number) => void; freeRotate?: boolean };

const islandOutline = "M500 76 C626 76 756 132 832 226 C906 318 902 444 842 535 C779 630 651 686 503 690 C354 696 218 650 139 557 C65 470 66 342 126 239 C190 130 338 76 500 76Z";

function Tree({ x, y, scale = 1, color = "sage" }: { x: number; y: number; scale?: number; color?: "sage" | "lavender" | "blossom" }) {
  const palette = color === "lavender" ? ["#7888b4", "#91a0c9", "#b1b9d9"] : color === "blossom" ? ["#bd829e", "#d59bb1", "#e8bdc5"] : ["#6f9276", "#8eae83", "#aec28f"];
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cy="11" rx="32" ry="12" fill="#435e55" opacity=".18"/>
    <path d="M-3 9 Q-7-11 -2-38 L7-38 Q4-12 8 9Z" fill="#8e6c55"/>
    <path d="M0-24L-20-48 M3-28L23-51" fill="none" stroke="#8e6c55" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="-19" cy="-49" r="22" fill={palette[0]}/>
    <circle cx="13" cy="-58" r="27" fill={palette[1]}/>
    <circle cx="-1" cy="-77" r="23" fill={palette[2]}/>
    <circle cx="30" cy="-45" r="14" fill={palette[0]}/>
    <path d="M-22-57q8-8 16-2 M3-82q8-7 15-1" fill="none" stroke="#fff0dc" strokeWidth="3" strokeLinecap="round" opacity=".6"/>
  </g>;
}

function Cottage({ x, y, scale = 1, roof = "#b77d68", wall = "#f4e2c3", width = 1 }: { x: number; y: number; scale?: number; roof?: string; wall?: string; width?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} stroke="#775e52" strokeWidth="3" strokeLinejoin="round">
    <ellipse cx="0" cy="54" rx={58*width} ry="16" fill="#405b51" opacity=".17" stroke="none"/>
    <path d={`M${-42*width} 3 L0-23 ${42*width} 3 V48 H${-42*width}Z`} fill={wall}/>
    <path d={`M${-53*width} 2 L0-48 ${53*width} 2 L0 20Z`} fill={roof}/>
    <path d={`M0-48 L${53*width} 2 L${42*width} 3 L0-23Z`} fill="#d29b7c"/>
    <path d={`M${-53*width} 2 L0-48 ${53*width} 2`} fill="none" stroke="#e9c49e" strokeWidth="5" strokeLinecap="round"/>
    <path d={`M${-42*width} 3 L0-23 ${42*width} 3`} fill="none" stroke="#8a6759" strokeWidth="2" opacity=".6"/>
    <rect x="-10" y="17" width="20" height="31" rx="7" fill="#89634f"/>
    <circle cx="5" cy="32" r="2" fill="#f8d88e" stroke="none"/>
    <rect x={-31*width} y="11" width="15" height="18" rx="5" fill="#a9ceca"/>
    <rect x={16*width} y="11" width="15" height="18" rx="5" fill="#a9ceca"/>
    <path d={`M-15 49H15`} stroke="#b28a68" strokeWidth="6"/>
    <rect x="25" y="-45" width="9" height="23" rx="2" fill="#98735e"/>
    <path d="M23-47h13" stroke="#ead4b6" strokeWidth="4"/>
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
      <path d="M500 116 C632 116 757 166 829 252 C895 334 896 453 827 544 C750 642 633 681 500 684 C363 691 234 646 151 556 C77 476 76 356 131 254 C194 143 353 111 500 116Z" fill="url(#dh-cliff)" stroke="#766879" strokeWidth="8"/>
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
      </g>
      <path d={islandOutline} fill="none" stroke="#e8d8b8" strokeWidth="5" strokeDasharray="2 13" strokeLinecap="round" opacity=".7"/>
      <path d="M500 92l5 12 12 5-12 5-5 12-5-12-12-5 12-5Z M845 375l4 9 9 4-9 4-4 9-4-9-9-4 9-4Z M170 355l4 9 9 4-9 4-4 9-4-9-9-4 9-4Z" fill="#fff0c4" opacity=".85"/>
    </g>
  </svg>;
}
