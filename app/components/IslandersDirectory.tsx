"use client";

import { useEffect, useMemo, useState } from "react";
import CottageRoom3D from "./CottageRoom3D";

type Theme = "cream" | "blossom" | "mint";
type Furniture = "sofa" | "rug" | "plant" | "lamp" | "table" | "shelf" | "bed" | "picture";
type Cell = { col: number; row: number };
type PublicLayout = { theme: Theme; furniture: Furniture[]; positions: Partial<Record<Furniture, Cell>> };
type Islander = { id: string; nickname: string; hasCottage: boolean; layout: PublicLayout | null; updatedAt: string | null };
type Visitor = { id: string; nickname: string; visitedAt: string };
const themeNames: Record<Theme, string> = { cream: "奶油暖阳", blossom: "樱花午后", mint: "薄荷花园" };
const furnitureInfo: { id: Furniture; name: string; icon: string }[] = [
  { id: "sofa", name: "云朵沙发", icon: "🛋️" }, { id: "rug", name: "花瓣地毯", icon: "🌸" },
  { id: "plant", name: "绿植盆栽", icon: "🪴" }, { id: "lamp", name: "暖光落地灯", icon: "💡" },
  { id: "table", name: "小圆茶几", icon: "🫖" }, { id: "shelf", name: "回忆书架", icon: "📚" },
  { id: "bed", name: "软软小床", icon: "🛏️" }, { id: "picture", name: "墙上挂画", icon: "🖼️" },
];
const defaultPositions: Record<Furniture, Cell> = {
  sofa: { col: 1, row: 1 }, rug: { col: 1, row: 0 }, plant: { col: 2, row: 0 }, lamp: { col: 0, row: 1 },
  table: { col: 2, row: 1 }, shelf: { col: 0, row: 2 }, bed: { col: 0, row: 0 }, picture: { col: 2, row: 2 },
};

export default function IslandersDirectory({ onClose }: { onClose: () => void }) {
  const [islanders, setIslanders] = useState<Islander[]>([]);
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Islander | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [visitorError, setVisitorError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch("/api/islanders", { cache: "no-store" })
      .then(async response => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "岛民名册暂时无法打开。");
        if (!cancelled) {
          setIslanders(Array.isArray(data.islanders) ? data.islanders : []);
          const currentViewerId = typeof data.viewerId === "string" ? data.viewerId : null;
          setViewerId(currentViewerId);
          if (currentViewerId) {
            fetch("/api/cottage-visits", { cache: "no-store" })
              .then(async response => {
                const visitData = await response.json().catch(() => ({}));
                if (!response.ok) throw new Error(visitData.error || "来访记录暂时无法读取。");
                if (!cancelled) { setVisitors(Array.isArray(visitData.visitors) ? visitData.visitors : []); setVisitorError(""); }
              })
              .catch(reason => { if (!cancelled) setVisitorError(reason instanceof Error ? reason.message : "来访记录暂时无法读取。"); });
          } else { setVisitors([]); setVisitorError(""); }
        }
      })
      .catch(reason => { if (!cancelled) setError(reason instanceof Error ? reason.message : "网络暂时没有连上，请稍后重试。"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [refreshKey]);

  const selectedLayout = selected?.layout ?? null;
  const positions = useMemo(() => ({ ...defaultPositions, ...(selectedLayout?.positions ?? {}) }), [selectedLayout]);
  const selectedFurniture = selectedLayout?.furniture ?? [];

  function visitIslander(islander: Islander) {
    setSelected(islander);
    if (viewerId && islander.id !== viewerId && islander.hasCottage) {
      void fetch("/api/cottage-visits", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId: islander.id }),
      }).catch(() => { /* Visiting remains available if the history service is temporarily offline. */ });
    }
  }

  return (
    <div className="modal-backdrop islanders-backdrop" onClick={onClose}>
      <section className="islanders-modal" onClick={event => event.stopPropagation()} aria-label="岛民名册与拜访小屋">
        <header className="islanders-hero">
          <button className="modal-close" onClick={selected ? () => setSelected(null) : onClose} aria-label={selected ? "返回岛民名册" : "关闭岛民名册"}>{selected ? "←" : "×"}</button>
          <div className="islanders-hero-icon">{selected ? "⌂" : "✿"}</div>
          <div className="eyebrow left-eyebrow">OUR LITTLE ISLAND COMMUNITY</div>
          <h2>{selected ? `拜访 ${selected.nickname} 的小屋` : "岛民名册"}</h2>
          <p>{selected ? "轻轻推开门，拖动旋转视角，双指捏合或使用按钮缩放，看看这位岛民的小小空间。" : "每一间小屋，都藏着一位岛民喜欢的生活模样。来认识新朋友吧。"}</p>
          {!selected && <div className="islanders-total"><strong>{islanders.length}</strong> 位岛民 · 一起慢慢长大的小岛</div>}
        </header>

        <div className="islanders-content">
          {selected ? (
            selectedLayout ? (
              <>
                <div className="islander-visit-meta">
                  <div><span className="islander-avatar">{selected.nickname.slice(0, 1)}</span><span><strong>{selected.nickname}</strong><small>{themeNames[selectedLayout.theme]} · {selectedFurniture.length} 件家具</small></span></div>
                  <span className="islander-readonly-tag">只读参观 · 不会更改屋主布置</span>
                </div>
                <div className={`islander-room-preview room-${selectedLayout.theme}`}>
                  <CottageRoom3D theme={selectedLayout.theme} furniture={selectedFurniture} positions={positions}
                    selected={selectedFurniture[0] ?? "sofa"} onSelect={() => {}} onMove={() => {}} viewOnly />
                  <div className="islander-room-caption"><span>✦</span> {themeNames[selectedLayout.theme]} <i /> 屋主的私人小宇宙</div>
                </div>
                <section className="islander-furniture-list">
                  <div className="islander-section-heading"><h3>屋主的布置</h3><span>ROOM DETAILS</span></div>
                  {selectedFurniture.length ? <div className="islander-furniture-grid">{selectedFurniture.map(id => {
                    const item = furnitureInfo.find(entry => entry.id === id)!;
                    return <div className="islander-furniture-item" key={id}><span>{item.icon}</span><b>{item.name}</b></div>;
                  })}</div> : <div className="islanders-empty">这间小屋目前还没有摆放家具。</div>}
                  {selected.updatedAt && <p className="islander-updated">最近布置：{new Date(selected.updatedAt).toLocaleDateString()}</p>}
                </section>
              </>
            ) : <div className="islanders-empty"><span>⌂</span><strong>这间小屋还在准备中</strong><p>屋主还没有保存公开的小屋布置，过段时间再来看看吧。</p></div>
          ) : loading ? (
            <div className="islanders-empty"><span>✦</span><strong>正在寻找岛民…</strong><p>小岛的灯光正在一盏盏亮起。</p></div>
          ) : error ? (
            <div className="islanders-empty"><span>☁</span><strong>暂时没有连上小岛</strong><p>{error}</p><button className="islanders-retry" onClick={() => setRefreshKey(value => value + 1)}>重新加载</button></div>
          ) : islanders.length ? (
            <div className="islanders-list">
              {islanders.map(islander => {
                const isMe = islander.id === viewerId;
                return <article className="islander-card" key={islander.id}>
                  <div className="islander-avatar">{islander.nickname.slice(0, 1)}</div>
                  <div className="islander-card-copy"><strong>{islander.nickname}{isMe && <span className="islander-me-tag">我</span>}</strong><small>{isMe ? "这是属于你的小岛身份" : islander.hasCottage ? `${themeNames[islander.layout!.theme]} · 已布置小屋` : "小屋还在准备中"}</small></div>
                  <button className="islander-visit-button" disabled={isMe || !islander.hasCottage} onClick={() => visitIslander(islander)}>{isMe ? "我的小屋" : islander.hasCottage ? "拜访小屋 ↗" : "尚未开放"}</button>
                </article>;
              })}
            </div>
          ) : (
            <div className="islanders-empty"><span>✿</span><strong>岛上还很安静</strong><p>目前还没有岛民。注册并布置小屋后，就会出现在这里。</p></div>
          )}
        </div>
        <footer className="islanders-footer"><span>DOMIHOOD ISLAND · LITTLE HOMES, BIG HEARTS</span><button className="memory-done" onClick={selected ? () => setSelected(null) : onClose}>{selected ? "返回岛民名册" : "回到小岛"} <span>↗</span></button></footer>
      </section>
    </div>
  );
}
