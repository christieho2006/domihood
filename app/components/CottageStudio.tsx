"use client";

import { useEffect, useState } from "react";
import CottageRoom3D from "./CottageRoom3D";

type Theme = "cream" | "blossom" | "mint";
type Furniture = "sofa" | "rug" | "plant" | "lamp" | "table" | "shelf" | "bed" | "picture";
type Cell = { col: number; row: number };
type Layout = { theme: Theme; furniture: Furniture[]; positions?: Partial<Record<Furniture, Cell>> };
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
const defaultPositions: Record<Furniture, Cell> = {
  sofa: { col: 1, row: 1 }, rug: { col: 1, row: 0 }, plant: { col: 2, row: 0 },
  lamp: { col: 0, row: 1 }, table: { col: 2, row: 1 }, shelf: { col: 0, row: 2 },
  bed: { col: 0, row: 0 }, picture: { col: 2, row: 2 },
};
const defaults: Layout = { theme: "cream", furniture: ["sofa", "rug", "plant", "lamp", "table", "picture"], positions: defaultPositions };
const STORAGE_KEY = "domi_cottage_layout";

function isCell(value: unknown): value is Cell {
  if (!value || typeof value !== "object") return false;
  const cell = value as Cell;
  return Number.isInteger(cell.col) && cell.col >= 0 && cell.col < 3 && Number.isInteger(cell.row) && cell.row >= 0 && cell.row < 3;
}

export default function CottageStudio({ onClose, nickname }: { onClose: () => void; nickname: string }) {
  const [layout, setLayout] = useState<Layout>(defaults);
  const [selected, setSelected] = useState<Furniture>("sofa");
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Layout;
        if (themes.some(t => t.id === parsed.theme) && Array.isArray(parsed.furniture)) {
          const positions = { ...defaultPositions };
          if (parsed.positions && typeof parsed.positions === "object") {
            for (const item of items) {
              const cell = parsed.positions[item.id];
              if (isCell(cell)) positions[item.id] = cell;
            }
          }
          setLayout({
            theme: parsed.theme,
            furniture: items.map(i => i.id).filter(id => parsed.furniture.includes(id)),
            positions,
          });
        }
      }
    } catch { /* Keep the default room if saved data is unavailable. */ }
    setLoaded(true);
  }, []);

  function toggleFurniture(id: Furniture) {
    setLayout(current => {
      const exists = current.furniture.includes(id);
      return { ...current, furniture: exists ? current.furniture.filter(item => item !== id) : [...current.furniture, id] };
    });
    setSelected(id);
    setSaved(false);
    setSaveError(false);
  }

  function moveSelected(col: number, row: number) {
    setLayout(current => ({
      ...current,
      positions: { ...defaultPositions, ...current.positions, [selected]: { col, row } },
    }));
    setSaved(false);
    setSaveError(false);
  }

  function saveRoom() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...layout, positions: { ...defaultPositions, ...layout.positions } }));
      setSaved(true);
      setSaveError(false);
    } catch {
      setSaved(false);
      setSaveError(true);
    }
  }

  function resetRoom() {
    setLayout(defaults);
    setSelected("sofa");
    setSaved(false);
    setSaveError(false);
  }

  const selectedItem = items.find(item => item.id === selected)!;
  const selectedCell = layout.positions?.[selected] ?? defaultPositions[selected];

  return (
    <div className="modal-backdrop cottage-backdrop" onClick={onClose}>
      <section className="cottage-modal" onClick={e => e.stopPropagation()} aria-label="私人小屋装修工作室">
        <header className="cottage-header">
          <div><div className="eyebrow left-eyebrow">YOUR LITTLE HOME</div><h2>私人小屋</h2><p>欢迎回来，{nickname}。把喜欢的小家具，安放在合适的位置。</p></div>
          <button className="modal-close" onClick={onClose} aria-label="关闭小屋">×</button>
        </header>
        <div className={"room-preview room-" + layout.theme}>
          <CottageRoom3D
            theme={layout.theme}
            furniture={layout.furniture}
            positions={{ ...defaultPositions, ...layout.positions }}
            selected={selected}
            onSelect={setSelected}
            onMove={(id, col, row) => {
              const occupied = items.some(item => item.id !== id && layout.furniture.includes(item.id) &&
                (layout.positions?.[item.id] ?? defaultPositions[item.id]).col === col &&
                (layout.positions?.[item.id] ?? defaultPositions[item.id]).row === row);
              if (!occupied) {
                setLayout(current => ({ ...current, positions: { ...defaultPositions, ...current.positions, [id]: { col, row } } }));
                setSaved(false);
                setSaveError(false);
              }
            }}
          />
          <div className="room-label"><span>3D ROOM 001</span><strong>{themes.find(t => t.id === layout.theme)?.name}</strong><small>拖动家具摆放 · 拖动空白处旋转 · 滚轮缩放</small><small>{layout.furniture.length} 件家具已布置</small></div>
          {!loaded && <div className="room-loading">正在打开小屋…</div>}
        </div>
        <div className="cottage-controls">
          <section className="decor-section"><div className="decor-heading"><h3>房间氛围</h3><span>ROOM PALETTE</span></div>
            <div className="theme-options">{themes.map(theme => <button key={theme.id} className={"theme-option " + (layout.theme === theme.id ? "selected" : "")} onClick={() => { setLayout(current => ({ ...current, theme: theme.id })); setSaved(false); setSaveError(false); }}><span className={"theme-swatch swatch-" + theme.id} /><span><b>{theme.name}</b><small>{theme.note}</small></span><i>{layout.theme === theme.id ? "✓" : ""}</i></button>)}</div>
          </section>
          <section className="decor-section"><div className="decor-heading"><h3>挑选家具</h3><span>FURNITURE · {layout.furniture.length}/{items.length}</span></div>
            <div className="furniture-grid">{items.map(item => { const active = layout.furniture.includes(item.id); const focused = selected === item.id; return <button key={item.id} className={"furniture-option " + (active ? "furniture-active" : "") + (focused ? " furniture-focused" : "")} aria-pressed={active} onClick={() => toggleFurniture(item.id)}><span>{item.icon}</span><b>{item.name}</b><i>{active ? (focused ? "已选中 · 可移动" : "已摆放 · 点选调整") : "点击添加"}</i></button>; })}</div>
            <div className="placement-panel">
              <div className="placement-copy"><strong>网格摆放</strong><span>先选家具，再选择房间中的位置</span><small>当前：{selectedItem.icon} {selectedItem.name} · 第 {selectedCell.row + 1} 行 / 第 {selectedCell.col + 1} 列</small></div>
              <div className="placement-grid" role="group" aria-label="家具网格位置">
                {Array.from({ length: 9 }, (_, index) => {
                  const col = index % 3;
                  const row = 2 - Math.floor(index / 3);
                  const occupied = items.some(item => item.id !== selected && layout.furniture.includes(item.id) && (layout.positions?.[item.id] ?? defaultPositions[item.id]).col === col && (layout.positions?.[item.id] ?? defaultPositions[item.id]).row === row);
                  const current = selectedCell.col === col && selectedCell.row === row;
                  return <button key={index} type="button" className={(current ? "cell-current " : "") + (occupied ? "cell-occupied" : "")} aria-label={`放在第${row + 1}行第${col + 1}列`} aria-pressed={current} onClick={() => moveSelected(col, row)}><span>{current ? "✦" : occupied ? "·" : ""}</span></button>;
                })}
              </div>
            </div>
          </section>
        </div>
        <footer className="cottage-footer"><span>✦ 当前保存在这台设备；云端同步将在账号系统接入后开放</span><div>{saveError && <small className="save-error">保存失败，请检查设备存储空间或浏览器设置</small>}{saved && <small className="saved-note">已保存 ✓</small>}<button className="cottage-reset" onClick={resetRoom}>恢复初始布置</button><button className="primary-button cottage-save" onClick={saveRoom}>保存我的小屋 <span>♡</span></button></div></footer>
      </section>
    </div>
  );
}
