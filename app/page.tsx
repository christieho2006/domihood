"use client";

import { useEffect, useRef, useState } from "react";
import Island3D from "./components/Island3D";
import CottageStudio from "./components/CottageStudio";
import MemoryCafe from "./components/MemoryCafe";

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
  const [exploredPlaces, setExploredPlaces] = useState<Place[]>([]);
  const [nickname, setNickname] = useState("");
  const [savedName, setSavedName] = useState("");
  const [nameOpen, setNameOpen] = useState(false);
  const [accountMode, setAccountMode] = useState<"login" | "register" | "guest">("login");
  const [accountNickname, setAccountNickname] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [accountBusy, setAccountBusy] = useState(false);
  const [accountError, setAccountError] = useState("");
  const [accountUser, setAccountUser] = useState<{ id: string; nickname: string } | null>(null);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startAngle = useRef(-8);
  const moved = useRef(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("domi_island_nickname");
    if (saved) { setSavedName(saved); setNickname(saved); setAccountNickname(saved); }
    try {
      const discoveries = JSON.parse(window.localStorage.getItem("domi_island_discoveries") || "[]");
      if (Array.isArray(discoveries)) setExploredPlaces(discoveries.filter((place): place is Place => place === "square" || place === "cafe" || place === "cottage"));
    } catch { /* Keep a fresh exploration book if local progress is unavailable. */ }
    fetch("/api/auth/session", { cache: "no-store" })
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (data?.user?.nickname) {
          setAccountUser(data.user);
          setSavedName(data.user.nickname);
          setNickname(data.user.nickname);
          setAccountNickname(data.user.nickname);
          window.localStorage.setItem("domi_island_nickname", data.user.nickname);
        }
      })
      .catch(() => { /* Guest mode remains available when account service is offline. */ });
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
  function visitPlace(place: Place) {
    const next = exploredPlaces.includes(place) ? exploredPlaces : [...exploredPlaces, place];
    setExploredPlaces(next);
    try { window.localStorage.setItem("domi_island_discoveries", JSON.stringify(next)); } catch { /* Exploration still works for this visit. */ }
    setActive(place);
  }

  function saveNickname() {
    const clean = nickname.trim().slice(0, 16);
    if (!clean) return;
    window.localStorage.setItem("domi_island_nickname", clean);
    setSavedName(clean);
    setNickname(clean);
    setAccountNickname(clean);
    setNameOpen(false);
  }

  async function submitAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (accountBusy) return;
    setAccountBusy(true);
    setAccountError("");
    try {
      const response = await fetch("/api/auth/" + accountMode, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: accountNickname, password: accountPassword }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.user) {
        setAccountError(data.error || "暂时无法完成操作，请稍后再试。");
        return;
      }
      setAccountUser(data.user);
      setSavedName(data.user.nickname);
      setNickname(data.user.nickname);
      window.localStorage.setItem("domi_island_nickname", data.user.nickname);
      setAccountPassword("");
      setNameOpen(false);
    } catch {
      setAccountError("网络暂时没有连上，请稍后重试。");
    } finally {
      setAccountBusy(false);
    }
  }

  async function logoutAccount() {
    setAccountBusy(true);
    setAccountError("");
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setAccountUser(null);
      setAccountPassword("");
      setAccountMode("login");
      setNameOpen(false);
    } catch {
      setAccountError("退出登录失败，请检查网络后重试。");
    } finally {
      setAccountBusy(false);
    }
  }

  return (
    <main className="island-app">
      <header className="topbar">
        <a className="brand" href="/" aria-label="DOMIHOOD 首页"><span className="brand-mark">d.</span><span>DOMIHOOD<small>OUR LITTLE WORLD</small></span></a>
        <div className="topbar-right">
          <span className="online-dot" /> <span className="quiet-label">A tiny world made of memories</span>
          <button className="profile-chip" onClick={() => { setNameOpen(true); setAccountError(""); setAccountNickname(savedName); }}><span className="avatar">{savedName ? savedName.slice(0,1) : "♡"}</span>{savedName || "岛屿访客"} <span className="chevron">⌄</span></button>
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
            <button className="place-pin pin-square" onClick={() => visitPlace("square")}><span>✿</span><b>粉丝广场</b></button>
            <button className="place-pin pin-cafe" onClick={() => visitPlace("cafe")}><span>☕</span><b>回忆咖啡馆</b></button>
            <button className="place-pin pin-cottage" onClick={() => visitPlace("cottage")}><span>⌂</span><b>私人小屋</b></button>
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
          <div className="island-stats"><div><strong>{exploredPlaces.length.toString().padStart(2, "0")}/03</strong><small>已探索地点</small></div><div><strong>{exploredPlaces.length === 3 ? "✦" : 3 - exploredPlaces.length}</strong><small>{exploredPlaces.length === 3 ? "图鉴已点亮" : "待发现角落"}</small></div></div>
        </aside>
      </section>

      <section className="destination-section">
        <div className="section-heading"><div><span className="eyebrow left-eyebrow">A PLACE FOR EVERY MEMORY</span><h2>岛上的小小目的地</h2></div><span className="section-caption">慢慢探索，不必着急。</span></div>
        <div className="destination-grid">
          {(Object.keys(places) as Place[]).map((key, i) => <button className="destination-card" key={key} onClick={() => visitPlace(key)}><span className={`destination-icon icon-${key}`}>{places[key].icon}</span><span className="destination-copy"><small>0{i+1} / DISCOVER</small><strong>{places[key].title}</strong><span>{key==="square"?"在岛屿中央相遇":key==="cafe"?"收藏每一段珍贵回忆":"装饰属于自己的空间"}</span></span><span className="card-arrow">↗</span></button>)}
        </div>
        <div className="discovery-book"><div className="discovery-book-heading"><div><span className="eyebrow left-eyebrow">YOUR ISLAND FIELD NOTES</span><h3>小岛探索图鉴</h3></div><span className="discovery-progress">{exploredPlaces.length} / 3 已点亮</span></div><div className="discovery-stamps">{(Object.keys(places) as Place[]).map((key) => <div key={key} className={"discovery-stamp " + (exploredPlaces.includes(key) ? "unlocked" : "")}><span className="stamp-icon">{exploredPlaces.includes(key) ? "✦" : "✧"}</span><span className={"stamp-place icon-" + key}>{places[key].icon}</span><strong>{places[key].title}</strong><small>{exploredPlaces.includes(key) ? "已探索 · 收入图鉴" : "等待你来发现"}</small></div>)}</div><p className="discovery-note">每次拜访一个地点，就会点亮一枚小小印章。探索进度保存在当前设备。</p></div>
      </section>
      <footer><span>DOMIHOOD ISLAND</span><span>Made of little moments <b>♡</b></span><span>VERSION 0.1 · THE BEGINNING</span></footer>

      {active === "cottage" && <CottageStudio onClose={() => setActive(null)} nickname={savedName || "岛屿访客"} />}
      {active === "cafe" && <MemoryCafe onClose={() => setActive(null)} />}
      {active === "square" && <div className="modal-backdrop" onClick={() => setActive(null)}><section className="place-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setActive(null)}>×</button><div className="modal-icon">{places.square.icon}</div><div className="eyebrow left-eyebrow">{places.square.subtitle}</div><h2>{places.square.title}</h2><p>{places.square.description}</p><div className="coming-soon">✧ 岛民动态与互动广场正在建造中 ✧</div><button className="primary-button" onClick={() => setActive(null)}>继续探索 <span>↗</span></button></section></div>}
      {nameOpen && <div className="modal-backdrop" onClick={() => setNameOpen(false)}><section className="name-modal account-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setNameOpen(false)} aria-label="关闭">×</button><div className="modal-icon">♡</div><div className="eyebrow left-eyebrow">WELCOME TO YOUR ISLAND</div>{accountUser ? <><h2>欢迎回来，{accountUser.nickname}</h2><p>你的岛民账号已登录。完成服务器配置后，小屋布置可以保存到账号云端，并在其他设备继续使用。</p><div className="account-status"><span /> 已登录账号 · {accountUser.nickname}</div><button className="primary-button" onClick={() => setNameOpen(false)}>继续探索 <span>↗</span></button><button className="secondary-account-button" onClick={() => void logoutAccount()} disabled={accountBusy}>{accountBusy ? "正在退出…" : "退出登录"}</button></> : <><h2>{accountMode === "register" ? "创建你的岛民账号" : accountMode === "guest" ? "先来小岛做客吧" : "欢迎回到小岛"}</h2><p>{accountMode === "guest" ? "访客昵称只保存在当前设备，不会同步到其他设备。" : "使用昵称和密码保存你的身份。昵称不需要填写邮箱。"}</p><div className="account-tabs" role="tablist" aria-label="账号方式"><button type="button" className={accountMode === "login" ? "active" : ""} onClick={() => {setAccountMode("login");setAccountError("");}}>登录</button><button type="button" className={accountMode === "register" ? "active" : ""} onClick={() => {setAccountMode("register");setAccountError("");}}>注册</button><button type="button" className={accountMode === "guest" ? "active" : ""} onClick={() => {setAccountMode("guest");setAccountError("");}}>访客体验</button></div>{accountMode === "guest" ? <><label htmlFor="nickname">岛民昵称</label><input id="nickname" value={nickname} maxLength={16} placeholder="输入一个喜欢的名字" onChange={e => setNickname(e.target.value)} onKeyDown={e => {if(e.key==="Enter")saveNickname()}} autoFocus/><div className="input-count">{nickname.trim().length}/16</div><button className="primary-button" onClick={saveNickname}>进入小岛 <span>↗</span></button></> : <form className="account-form" onSubmit={submitAccount}><label htmlFor="account-nickname">岛民昵称</label><input id="account-nickname" autoComplete="username" value={accountNickname} maxLength={16} placeholder="2–16 个字符" onChange={e => setAccountNickname(e.target.value)} required/><label htmlFor="account-password">密码</label><input id="account-password" type="password" autoComplete={accountMode === "register" ? "new-password" : "current-password"} value={accountPassword} minLength={accountMode === "register" ? 8 : 1} maxLength={72} placeholder={accountMode === "register" ? "至少 8 个字符" : "输入你的密码"} onChange={e => setAccountPassword(e.target.value)} required/><div className="account-hint">{accountMode === "register" ? "昵称 2–16 个字符 · 密码至少 8 位" : "请使用注册时设置的昵称与密码"}</div>{accountError && <div className="account-error" role="alert">{accountError}</div>}<button className="primary-button" type="submit" disabled={accountBusy}>{accountBusy ? "请稍候…" : accountMode === "register" ? "创建账号" : "登录小岛"} <span>↗</span></button></form>}{accountError && accountMode === "guest" && <div className="account-error" role="alert">{accountError}</div>}</>}</section></div>}
    </main>
  );
}
