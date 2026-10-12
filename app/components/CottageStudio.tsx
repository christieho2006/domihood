"use client";
import { useEffect, useState } from "react";

type Theme = "cream" | "blossom" | "mint";
type Furniture = "sofa" | "rug" | "plant" | "lamp" | "table" | "shelf" | "bed" | "picture";
type Layout = { theme: Theme; furniture: Furniture[] };
const themes: { id: Theme; name: string; note: string }[] = [
  { id: "cream", name: "奶油暖阳", note: "温暖奶油色 · 原木家具" },
  { id: "blossom", name: "樱花午后", note: "柔雾粉色 · 甜甜的春日" },
  { id: "mint", name: "薄荷花园", note: "清新薄荷绿 · 植物与阳光" },
];
const items: { id: Furniture; name: string; icon: string }[] = [
  { id: "sofa", name: "云朵沙发", icon: "🛋️" },
  { id: "rug", name: "花瓣地毯", icon: "🌸" },
  { id: "plant", name: "绿植盆栽", icon: "🪴" },
  { id: "lamp", name: "暖光落地灯", icon: "💡" },
  { id: "table", name: "小圆茶几", icon: "🫖" },
  { id: "shelf", name: "回忆书架", icon: "📚" },
  { id: "bed", name: "软软小床", icon: "🛏️" },
  { id: "picture", name: "墙上挂画", icon: "🖼️" },
];
const defaults: Layout = { theme: "cream", furniture: ["sofa", "rug", "plant", "lamp", "table", "picture"] };

export default function CottageStudio({ onClose, nickname }: { onClose: () => void; nickname: string }) {
  const [layout, setLayout] = useState<Layout>(defaults);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("domi_cottage_layout");
      if (raw) {
        const parsed = JSON.parse(raw) as Layout;
        if (themes.some(t => t.id === parsed.theme) && Array.isArray(parsed.furniture)) {
          setLayout({ theme: parsed.theme, furniture: items.map(i => i.id).filter(id => parsed.furniture.includes(id)) });
        }
      }
    } catch { /* Keep the default room if saved data is unavailable. */ }
    setLoaded(true);
  }, []);
  function toggleFurniture(id: Furniture) {
    setLayout(current => ({ ...current, furniture: current.furniture.includes(id) ? current.furniture.filter(item => item !== id) : [...current.furniture, id] }));
    setSaved(false);
  }
  function saveRoom() {
    try { localStorage.setItem("domi_cottage_layout", JSON.stringify(layout)); setSaved(true); }
    catch { setSaved(false); }
  }
  return (
    <div className="modal-backdrop cottage-backdrop" onClick={onClose}>
      <section className="cottage-modal" onClick={e => e.stopPropagation()} aria-label="私人小屋装修工作室">
        <header className="cottage-header">
          <div><div className="eyebrow left-eyebrow">YOUR LITTLE HOME</div><h2>私人小屋</h2><p>欢迎回来，{nickname}。今天想把家布置成什么样？</p></div>
          <button className="modal-close" onClick={onClose} aria-label="关闭小屋">×</button>
        </header>
        <div className={"room-preview room-" + layout.theme}>
          <div className="room-window"><span>☀</span><i /><i /><i /></div>
          <div className="room-wall-art">♡</div>
          <div className="room-shelf"><i /><i /><i /><i /></div>
          <div className="room-floor" />
          {layout.furniture.includes("picture") && <div className="furniture-picture">🌷</div>}
          {layout.furniture.includes("plant") && <div className="furniture-plant"><span>🪴</span><small>little garden</small></div>}
          {layout.furniture.includes("lamp") && <div className="furniture-lamp"><i /><span /><b /></div>}
          {layout.furniture.includes("shelf") && <div className="furniture-bookshelf"><span>📚</span><i /><i /><i /></div>}
          {layout.furniture.includes("bed") && <div className="furniture-bed"><span>☁️</span><i /></div>}
          {layout.furniture.includes("rug") && <div className="furniture-rug" /> }
          {layout.furniture.includes("sofa") && <div className="furniture-sofa"><span /><i /><b /></div>}
          {layout.furniture.includes("table") && <div className="furniture-table"><span>🫖</span><i /></div>}
          <div className="room-label"><span>ROOM 001</span><strong>{themes.find(t => t.id === layout.theme)?.name}</strong><small>{layout.furniture.length} 件家具已布置</small></div>
          {!loaded && <div className="room-loading">正在打开小屋…</div>}
        </div>
        <div className="cottage-controls">
          <section className="decor-section"><div className="decor-heading"><h3>房间氛围</h3><span>ROOM PALETTE</span></div>
            <div className="theme-options">{themes.map(theme => <button key={theme.id} className={"theme-option " + (layout.theme === theme.id ? "selected" : "")} onClick={() => { setLayout(current => ({ ...current, theme: theme.id })); setSaved(false); }}><span className={"theme-swatch swatch-" + theme.id} /><span><b>{theme.name}</b><small>{theme.note}</small></span><i>{layout.theme === theme.id ? "✓" : ""}</i></button>)}</div>
          </section>
          <section className="decor-section"><div className="decor-heading"><h3>挑选家具</h3><span>FURNITURE · {layout.furniture.length}/{items.length}</span></div>
            <div className="furniture-grid">{items.map(item => { const active = layout.furniture.includes(item.id); return <button key={item.id} className={"furniture-option " + (active ? "furniture-active" : "")} aria-pressed={active} onClick={() => toggleFurniture(item.id)}><span>{item.icon}</span><b>{item.name}</b><i>{active ? "已摆放" : "点击添加"}</i></button>; })}</div>
          </section>
        </div>
        <footer className="cottage-footer"><span>✦ 布置会保存在这台设备上</span><div>{saved && <small className="saved-note">已保存 ✓</small>}<button className="cottage-reset" onClick={() => { setLayout(defaults); setSaved(false); }}>恢复初始布置</button><button className="primary-button cottage-save" onClick={saveRoom}>保存我的小屋 <span>♡</span></button></div></footer>
      </section>
    </div>
  );
}
