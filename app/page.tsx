"use client";

import { useEffect, useRef, useState } from "react";
import Island3D from "./components/Island3D";
import CottageStudio from "./components/CottageStudio";

type Place = "square" | "cafe" | "cottage";

const places: Record<Place, { title: string; subtitle: string; icon: string; description: string }> = {
  square: { title: "粉丝广场", subtitle: "THE GATHERING GARDEN", icon: "✿", description: "和朋友们在岛屿中央相遇，留下今天的小小心情。广场留言、岛民动态将陆续开放。" },
  cafe: { title: "回忆咖啡馆", subtitle: "MEMORY CAFE", icon: "☕", description: "把珍贵的片段收藏成一杯温暖的回忆。未来可以在这里整理照片、纪念日与共同故事。" },
  cottage: { title: "私人小屋", subtitle: "MY LITTLE COTTAGE", icon: "⌂", description: "一间属于你的岛上小屋。现在就可以搭配房间主题、摆放立体家具并保存布置；拍照机与访客留言会继续慢慢开放。" },
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
            <Island3D angle={angle} zoom={zoom} />
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

      {active === "cottage" && <CottageStudio onClose={() => setActive(null)} nickname={savedName || "岛屿访客"} />}
      {active && active !== "cottage" && <div className="modal-backdrop" onClick={() => setActive(null)}><section className="place-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setActive(null)}>×</button><div className="modal-icon">{places[active].icon}</div><div className="eyebrow left-eyebrow">{places[active].subtitle}</div><h2>{places[active].title}</h2><p>{places[active].description}</p><div className="coming-soon">✧ 这片天地正在慢慢建造中 ✧</div><button className="primary-button" onClick={() => setActive(null)}>继续探索 <span>↗</span></button></section></div>}
      {nameOpen && <div className="modal-backdrop" onClick={() => setNameOpen(false)}><section className="name-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setNameOpen(false)}>×</button><div className="modal-icon">♡</div><div className="eyebrow left-eyebrow">WELCOME TO YOUR ISLAND</div><h2>给自己取个名字吧</h2><p>访客模式，无需注册密码。昵称保存在当前设备，之后可以再修改。</p><label htmlFor="nickname">岛民昵称</label><input id="nickname" value={nickname} maxLength={16} placeholder="输入一个喜欢的名字" onChange={e => setNickname(e.target.value)} onKeyDown={e => {if(e.key==="Enter")saveNickname()}} autoFocus/><div className="input-count">{nickname.trim().length}/16</div><button className="primary-button" onClick={saveNickname}>进入小岛 <span>↗</span></button></section></div>}
    </main>
  );
}
