"use client";

import { useEffect, useRef, useState } from "react";

type Place = "square" | "cafe" | "cottage";

const places: Record<Place, { title: string; subtitle: string; icon: string; description: string }> = {
  square: { title: "粉丝广场", subtitle: "THE GATHERING GARDEN", icon: "✿", description: "和朋友们在岛屿中央相遇，留下今天的小小心情。广场留言、岛民动态将陆续开放。" },
  cafe: { title: "回忆咖啡馆", subtitle: "MEMORY CAFE", icon: "☕", description: "把珍贵的片段收藏成一杯温暖的回忆。未来可以在这里整理照片、纪念日与共同故事。" },
  cottage: { title: "私人小屋", subtitle: "MY LITTLE COTTAGE", icon: "⌂", description: "一间属于你的岛上小屋。小屋装修、家具摆放、拍照机与访客留言将作为后续独立模块逐步加入。" },
};

export default function Home() {
  const [angle, setAngle] = useState(-8);
  const [zoom, setZoom] = useState(1);
  const [active, setActive] = useState<Place | null>(null);
  const [nickname, setNickname] = useState("");
  const [savedName, setSavedName] = useState("");
  const [nameOpen, setNameOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startAngle = useRef(-8);
  const moved = useRef(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("domi_island_nickname");
    if (saved) { setSavedName(saved); setNickname(saved); }
  }, []);

  function pointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    startX.current = event.clientX;
    startAngle.current = angle;
    moved.current = false;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function pointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const delta = event.clientX - startX.current;
    if (Math.abs(delta) > 3) moved.current = true;
    setAngle(Math.max(-35, Math.min(35, startAngle.current + delta * 0.35)));
  }
  function pointerUp() { setDragging(false); }
  function saveNickname() {
    const clean = nickname.trim().slice(0, 16);
    if (!clean) return;
    window.localStorage.setItem("domi_island_nickname", clean);
    setSavedName(clean);
    setNickname(clean);
    setNameOpen(false);
  }

  return (
    <main className="island-app">
      <header className="topbar">
        <a className="brand" href="/" aria-label="DOMIHOOD 首页"><span className="brand-mark">d.</span><span>DOMIHOOD<small>OUR LITTLE WORLD</small></span></a>
        <div className="topbar-right">
          <span className="online-dot" /> <span className="quiet-label">A tiny world made of memories</span>
          <button className="profile-chip" onClick={() => setNameOpen(true)}><span className="avatar">{savedName ? savedName.slice(0,1) : "♡"}</span>{savedName || "岛屿访客"} <span className="chevron">⌄</span></button>
        </div>
      </header>

      <section className="hero-copy">
        <div className="eyebrow"><span /> YOUR OWN FLOATING ISLAND <span /></div>
        <h1>把喜欢的日子，<br /><em>安放在一座小岛上。</em></h1>
        <p>一个可以慢慢长大的童话世界。转动视角，去拜访岛上的每个角落。</p>
      </section>

      <section className="world-layout">
        <aside className="side-note left-note">
          <div className="note-number">01 / WELCOME</div>
          <div className="note-icon">✧</div>
          <h2>一座小岛<br />一整个宇宙</h2>
          <p>这里收藏喜欢、相遇和那些舍不得忘记的瞬间。</p>
          <div className="tiny-rule" />
          <span className="handwritten">made with love ♡</span>
        </aside>

        <div className="island-stage" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onWheel={(e) => setZoom(z => Math.max(.78, Math.min(1.22, z - e.deltaY * .0005)))} style={{ cursor: dragging ? "grabbing" : "grab" }}>
          <div className="stage-glow" />
          <div className="sun-orb" />
          <div className="cloud cloud-one"><i /><i /><i /></div>
          <div className="cloud cloud-two"><i /><i /><i /></div>
          <div className="sparkle sparkle-one">✦</div><div className="sparkle sparkle-two">✧</div><div className="sparkle sparkle-three">·</div><div className="sparkle sparkle-four">✦</div>
          <div className="island-scene" style={{ transform: `translateY(8px) scale(${zoom}) rotateY(${angle}deg)` }}>
            <svg className="island-art" viewBox="0 0 760 520" role="img" aria-label="漂浮在云间的童话小岛，岛上有草地、树木、小屋和一条小路">
              <defs>
                <linearGradient id="grass" x1="0" y1="0" x2="0.8" y2="1"><stop stopColor="#d5e9a5"/><stop offset=".48" stopColor="#a8d48a"/><stop offset="1" stopColor="#79b77b"/></linearGradient>
                <linearGradient id="earth" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c99b79"/><stop offset=".55" stopColor="#a87966"/><stop offset="1" stopColor="#775d72"/></linearGradient>
                <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#a9d7d2"/><stop offset="1" stopColor="#80b8bc"/></linearGradient>
                <linearGradient id="roof" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f4a18c"/><stop offset="1" stopColor="#d97978"/></linearGradient>
                <filter id="soft"><feGaussianBlur stdDeviation="10"/></filter>
              </defs>
              <ellipse cx="380" cy="405" rx="260" ry="38" fill="#658caa" opacity=".16" filter="url(#soft)"/>
              <path d="M118 239 Q128 173 224 151 Q300 91 393 125 Q490 104 560 163 Q650 176 656 240 Q624 292 548 311 Q470 351 370 346 Q251 354 173 310 Q117 288 118 239Z" fill="url(#earth)"/>
              <path d="M132 253 Q188 286 245 300 L224 329 Q183 316 151 289Z" fill="#9b746a" opacity=".9"/>
              <path d="M245 300 Q311 319 371 318 L360 346 Q296 347 224 329Z" fill="#8d6b68" opacity=".92"/>
              <path d="M371 318 Q447 317 508 291 L529 315 Q463 346 360 346Z" fill="#806571" opacity=".94"/>
              <path d="M508 291 Q582 272 624 244 L640 258 Q602 294 529 315Z" fill="#916d70" opacity=".9"/>
              <path d="M183 289 L198 301 L187 314 L173 301Z M269 313 L284 316 L275 334 L258 330Z M420 315 L438 311 L445 328 L426 336Z M548 288 L563 281 L571 294 L556 302Z" fill="#d2a18a" opacity=".72"/>
              <path d="M203 299 Q214 311 222 329 M318 319 Q321 333 316 344 M470 306 Q469 326 460 338 M585 270 Q588 285 578 299" fill="none" stroke="#684f68" strokeWidth="3" strokeLinecap="round" opacity=".32"/>
              <path d="M388 319 Q391 334 385 350 Q379 357 374 350 L376 322Z" fill="#9dd3d1" opacity=".9"/>
              <path d="M397 316 Q403 333 399 344" fill="none" stroke="#e2f4e9" strokeWidth="3" strokeLinecap="round" opacity=".9"/>
              <path d="M126 235 Q151 188 230 166 Q299 113 393 143 Q480 120 551 174 Q628 187 646 236 Q614 279 538 297 Q456 329 372 326 Q259 337 180 297 Q133 278 126 235Z" fill="url(#grass)"/>
              <path d="M147 241 Q212 204 278 221 Q353 248 409 215 Q484 180 558 216 Q604 232 624 250 Q575 290 511 298 Q413 322 344 309 Q239 313 176 278Z" fill="#b9dc93" opacity=".85"/>
              <path d="M348 298 Q377 268 398 247 Q423 225 451 227 Q477 232 481 250 Q467 270 445 275 Q412 285 397 315Z" fill="#e8d4b2"/>
              <path d="M347 299 Q375 273 397 252" fill="none" stroke="#f7e9cf" strokeWidth="3" strokeLinecap="round"/>
              <path d="M449 228 Q475 213 501 227 Q518 236 514 250 Q500 263 478 253" fill="none" stroke="#f4e2c2" strokeWidth="3"/>
              <ellipse cx="280" cy="224" rx="35" ry="16" fill="#8abf7b" opacity=".55"/>
              <ellipse cx="520" cy="246" rx="42" ry="15" fill="#8abf7b" opacity=".55"/>
              {[[207,192,1],[243,169,.83],[294,154,.9],[541,184,.9],[576,207,.75],[188,244,.65],[484,178,.7],[339,172,.65]].map(([x,y,s],i)=><g key={i} transform={`translate(${x} ${y}) scale(${s})`}><rect x="-4" y="19" width="8" height="28" rx="3" fill="#94715f"/><circle cy="7" r="23" fill={i%2?"#8fbd85":"#a7cf91"}/><circle cx="-10" cy="2" r="14" fill="#b9dba0"/><circle cx="10" cy="-4" r="13" fill="#c4dfa6"/></g>)}
              <g transform="translate(433 164)">
                <ellipse cx="2" cy="73" rx="48" ry="9" fill="#7fae7c" opacity=".35"/>
                <path d="M-31 27 L0 0 L34 27Z" fill="url(#roof)"/><path d="M-25 27 L0 5 L27 27" fill="none" stroke="#f8c3a8" strokeWidth="3"/>
                <rect x="-25" y="27" width="51" height="42" rx="3" fill="#fff0d9"/><rect x="-8" y="43" width="17" height="26" rx="7" fill="#bd8b77"/>
                <rect x="-20" y="35" width="11" height="13" rx="2" fill="#9fc7c0"/><rect x="11" y="35" width="10" height="13" rx="2" fill="#9fc7c0"/>
                <path d="M-24 30 L27 30" stroke="#d5a38b" strokeWidth="3"/>
                <circle cx="0" cy="-2" r="4" fill="#fff1d0"/>
              </g>
              <g transform="translate(305 193)">
                <ellipse cx="0" cy="51" rx="34" ry="7" fill="#7fae7c" opacity=".3"/>
                <path d="M-25 15 L0 -7 L26 15Z" fill="#b9a6d7"/><rect x="-20" y="15" width="40" height="32" rx="3" fill="#f9e8d4"/>
                <rect x="-6" y="29" width="12" height="18" rx="6" fill="#b98f79"/><rect x="-16" y="21" width="9" height="10" rx="2" fill="#9fc7c0"/><rect x="8" y="21" width="9" height="10" rx="2" fill="#9fc7c0"/>
              </g>
              <g transform="translate(365 142)"><path d="M0 18 C-14 6 -23 14 -16 24 L0 37 L16 24 C23 14 14 6 0 18Z" fill="#f2a4b2" opacity=".9"/></g>
              <g fill="#fff6e7"><circle cx="222" cy="254" r="3"/><circle cx="260" cy="276" r="2.5"/><circle cx="539" cy="265" r="3"/><circle cx="574" cy="238" r="2"/><circle cx="320" cy="236" r="2.5"/></g>
              <path d="M172 298 Q215 323 272 326" fill="none" stroke="#6d9f78" strokeWidth="4" strokeLinecap="round" opacity=".5"/>
              <path d="M550 296 Q587 283 607 264" fill="none" stroke="#6d9f78" strokeWidth="4" strokeLinecap="round" opacity=".5"/>
              <path d="M143 246 Q157 268 184 276" fill="none" stroke="#d4e8a6" strokeWidth="5" strokeLinecap="round"/>
            </svg>
            <button className="place-pin pin-square" onClick={() => setActive("square")}><span>✿</span><b>粉丝广场</b></button>
            <button className="place-pin pin-cafe" onClick={() => setActive("cafe")}><span>☕</span><b>回忆咖啡馆</b></button>
            <button className="place-pin pin-cottage" onClick={() => setActive("cottage")}><span>⌂</span><b>私人小屋</b></button>
          </div>
          <div className="stage-hint"><span>↔</span> 拖动小岛旋转 <i /> 滚动缩放</div>
          <div className="zoom-tools"><button aria-label="缩小" onClick={() => setZoom(z => Math.max(.78,z-.1))}>−</button><span>{Math.round(zoom*100)}%</span><button aria-label="放大" onClick={() => setZoom(z => Math.min(1.22,z+.1))}>＋</button><button aria-label="重置视角" onClick={() => {setAngle(-8);setZoom(1)}}>↺</button></div>
        </div>

        <aside className="side-note right-note">
          <div className="note-number">02 / EXPLORE</div>
          <div className="weather-pill"><span>☀</span> 温柔晴天 <i /></div>
          <h2>今天也要<br /><em>好好生活。</em></h2>
          <p>点选岛上的小屋，开始探索这个正在慢慢生长的世界。</p>
          <button className="explore-button" onClick={() => setActive("cottage")}>拜访我的小屋 <span>↗</span></button>
          <div className="island-stats"><div><strong>03</strong><small>岛上地点</small></div><div><strong>∞</strong><small>未来可能</small></div></div>
        </aside>
      </section>

      <section className="destination-section">
        <div className="section-heading"><div><span className="eyebrow left-eyebrow">A PLACE FOR EVERY MEMORY</span><h2>岛上的小小目的地</h2></div><span className="section-caption">慢慢探索，不必着急。</span></div>
        <div className="destination-grid">
          {(Object.keys(places) as Place[]).map((key, i) => <button className="destination-card" key={key} onClick={() => setActive(key)}><span className={`destination-icon icon-${key}`}>{places[key].icon}</span><span className="destination-copy"><small>0{i+1} / DISCOVER</small><strong>{places[key].title}</strong><span>{key==="square"?"在岛屿中央相遇":key==="cafe"?"收藏每一段珍贵回忆":"装饰属于自己的空间"}</span></span><span className="card-arrow">↗</span></button>)}
        </div>
      </section>
      <footer><span>DOMIHOOD ISLAND</span><span>Made of little moments <b>♡</b></span><span>VERSION 0.1 · THE BEGINNING</span></footer>

      {active && <div className="modal-backdrop" onClick={() => setActive(null)}><section className="place-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setActive(null)}>×</button><div className="modal-icon">{places[active].icon}</div><div className="eyebrow left-eyebrow">{places[active].subtitle}</div><h2>{places[active].title}</h2><p>{places[active].description}</p><div className="coming-soon">✧ 这片天地正在慢慢建造中 ✧</div><button className="primary-button" onClick={() => {setActive(null);if(active==="cottage")setNameOpen(true)}}>{active==="cottage"?"设置岛民昵称":"继续探索"} <span>↗</span></button></section></div>}
      {nameOpen && <div className="modal-backdrop" onClick={() => setNameOpen(false)}><section className="name-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setNameOpen(false)}>×</button><div className="modal-icon">♡</div><div className="eyebrow left-eyebrow">WELCOME TO YOUR ISLAND</div><h2>给自己取个名字吧</h2><p>访客模式，无需注册密码。昵称保存在当前设备，之后可以再修改。</p><label htmlFor="nickname">岛民昵称</label><input id="nickname" value={nickname} maxLength={16} placeholder="输入一个喜欢的名字" onChange={e => setNickname(e.target.value)} onKeyDown={e => {if(e.key==="Enter")saveNickname()}} autoFocus/><div className="input-count">{nickname.trim().length}/16</div><button className="primary-button" onClick={saveNickname}>进入小岛 <span>↗</span></button></section></div>}
    </main>
  );
}
