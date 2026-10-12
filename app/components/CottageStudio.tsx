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
const GUEST_STORAGE_KEY = "domi_cottage_layout_guest";
const accountStorageKey = (userId: string) => `${STORAGE_KEY}:account:${userId}`;

function isCell(value: unknown): value is Cell {
  if (!value || typeof value !== "object") return false;
  const cell = value as Cell;
  return Number.isInteger(cell.col) && cell.col >= 0 && cell.col < 3 && Number.isInteger(cell.row) && cell.row >= 0 && cell.row < 3;
}

function parseLayout(value: unknown): Layout | null {
  if (!value || typeof value !== "object") return null;
  const parsed = value as Layout;
  if (!themes.some(theme => theme.id === parsed.theme) || !Array.isArray(parsed.furniture)) return null;
  const furniture = items.map(item => item.id).filter(id => parsed.furniture.includes(id));
  const positions: Partial<Record<Furniture, Cell>> = {};
  const used = new Set<string>();
  for (const id of furniture) {
    const candidate = parsed.positions?.[id];
    let chosen = isCell(candidate) && !used.has(candidate.col + ":" + candidate.row) ? candidate : null;
    if (!chosen) {
      chosen = Array.from({ length: 9 }, (_, index) => ({ col: index % 3, row: Math.floor(index / 3) }))
        .find(cell => !used.has(cell.col + ":" + cell.row)) ?? defaultPositions[id];
    }
    positions[id] = chosen;
    used.add(chosen.col + ":" + chosen.row);
  }
  return { theme: parsed.theme, furniture, positions };
}

export default function CottageStudio({ onClose, nickname }: { onClose: () => void; nickname: string }) {
  const [layout, setLayout] = useState<Layout>(defaults);
  const [selected, setSelected] = useState<Furniture>("sofa");
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [accountSignedIn, setAccountSignedIn] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [cloudStatus, setCloudStatus] = useState<"guest" | "loading" | "synced" | "empty" | "error">("guest");
  const [lastCloudSave, setLastCloudSave] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLayout() {
      let session: { user?: { id?: string } | null } | null = null;
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (response.ok) session = await response.json();
      } catch { /* If session lookup is unavailable, keep guest mode available. */ }

      if (cancelled) return;
      const userId = session?.user?.id;
      if (userId) {
        // Signed-in users must never read the shared legacy/guest layout.
        setAccountSignedIn(true);
        setAccountId(userId);
        setCloudStatus("loading");
        const userStorageKey = accountStorageKey(userId);

        try {
          const response = await fetch("/api/cottage/layout", { cache: "no-store" });
          if (!response.ok) throw new Error("CLOUD_LAYOUT_UNAVAILABLE");
          const data = await response.json();
          if (cancelled) return;

          if (data.layout) {
            const cloudLayout = parseLayout(data.layout);
            if (!cloudLayout) throw new Error("INVALID_CLOUD_LAYOUT");
            setLayout(cloudLayout);
            try { localStorage.setItem(userStorageKey, JSON.stringify(cloudLayout)); } catch { /* Cloud remains authoritative. */ }
            if (typeof data.updatedAt === "string") setLastCloudSave(data.updatedAt);
            setDirty(false);
            setSaved(false);
            setCloudStatus("synced");
            return;
          }

          // A new account with no cloud layout starts with a clean default room,
          // not another account's browser-cached layout.
          setLayout(defaults);
          setDirty(false);
          setSaved(false);
          setLastCloudSave(null);
          try { localStorage.removeItem(userStorageKey); } catch { /* Ignore unavailable browser storage. */ }
          setCloudStatus("empty");
          return;
        } catch {
          if (cancelled) return;
          // Offline fallback is scoped to this exact account ID.
          try {
            const raw = localStorage.getItem(userStorageKey);
            const cached = raw ? parseLayout(JSON.parse(raw)) : null;
            setLayout(cached ?? defaults);
          } catch {
            setLayout(defaults);
          }
          setCloudStatus("error");
          return;
        }
      }

      // Guest layouts use their own key. Do not reuse the old shared key,
      // which may contain a layout saved while another account was logged in.
      setAccountSignedIn(false);
      setAccountId(null);
      setCloudStatus("guest");
      try {
        const raw = localStorage.getItem(GUEST_STORAGE_KEY);
        const guestLayout = raw ? parseLayout(JSON.parse(raw)) : null;
        setLayout(guestLayout ?? defaults);
      } catch {
        setLayout(defaults);
      }
    }

    void loadLayout();
    return () => { cancelled = true; };
  }, []);

  function toggleFurniture(id: Furniture) {
    setSelected(id);
    if (layout.furniture.includes(id)) return;
    setLayout(current => ({ ...current, furniture: [...current.furniture, id] }));
    setSaved(false);
    setSaveError(false);
    setDirty(true);
  }

  function removeSelectedFurniture() {
    setLayout(current => ({ ...current, furniture: current.furniture.filter(id => id !== selected) }));
    setSaved(false);
    setSaveError(false);
    setDirty(true);
  }

  function moveSelected(col: number, row: number) {
    setLayout(current => ({
      ...current,
      positions: { ...defaultPositions, ...current.positions, [selected]: { col, row } },
    }));
    setSaved(false);
    setSaveError(false);
    setDirty(true);
  }

  async function saveRoom() {
    const nextLayout = { ...layout, positions: { ...defaultPositions, ...layout.positions } };
    try {
      const storageKey = accountId ? accountStorageKey(accountId) : GUEST_STORAGE_KEY;
      try { localStorage.setItem(storageKey, JSON.stringify(nextLayout)); } catch { /* Cloud save should still be attempted. */ }
      if (accountId) {
        const response = await fetch("/api/cottage/layout", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ layout: nextLayout }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          setSaved(false);
          setSaveError(true);
          setCloudStatus("error");
          return;
        }
        if (typeof data.updatedAt === "string") setLastCloudSave(data.updatedAt);
        setCloudStatus("synced");
      }
      setSaved(true);
      setSaveError(false);
      setDirty(false);
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
    setDirty(true);
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
                setDirty(true);
              }
            }}
          />
          <div className="room-label"><span>3D ROOM 001</span><strong>{themes.find(t => t.id === layout.theme)?.name}</strong><small>拖动家具摆放 · 拖动空白处旋转 · 滚轮缩放</small><small>{layout.furniture.length} 件家具已布置</small></div>
        </div>
        <div className="cottage-controls">
          <section className="decor-section"><div className="decor-heading"><h3>房间氛围</h3><span>ROOM PALETTE</span></div>
            <div className="theme-options">{themes.map(theme => <button key={theme.id} className={"theme-option " + (layout.theme === theme.id ? "selected" : "")} onClick={() => { setLayout(current => ({ ...current, theme: theme.id })); setSaved(false); setSaveError(false); setDirty(true); }}><span className={"theme-swatch swatch-" + theme.id} /><span><b>{theme.name}</b><small>{theme.note}</small></span><i>{layout.theme === theme.id ? "✓" : ""}</i></button>)}</div>
          </section>
          <section className="decor-section"><div className="decor-heading"><h3>挑选家具</h3><span>FURNITURE · {layout.furniture.length}/{items.length}</span></div>
            <div className="furniture-grid">{items.map(item => { const active = layout.furniture.includes(item.id); const focused = selected === item.id; return <button key={item.id} className={"furniture-option " + (active ? "furniture-active" : "") + (focused ? " furniture-focused" : "")} aria-pressed={focused} onClick={() => toggleFurniture(item.id)}><span>{item.icon}</span><b>{item.name}</b><i>{active ? (focused ? "已选中 · 可移动" : "已摆放 · 点选调整") : "点击添加"}</i></button>; })}</div>
            <div className="placement-panel">
              <div className="placement-copy"><strong>网格摆放</strong><span>先选家具，再选择房间中的位置</span><small>当前：{selectedItem.icon} {selectedItem.name} · 第 {selectedCell.row + 1} 行 / 第 {selectedCell.col + 1} 列</small>{layout.furniture.includes(selected) && <button type="button" className="remove-selected-furniture" onClick={removeSelectedFurniture}>移除这件家具 −</button>}</div>
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
        <footer className="cottage-footer"><span>✦ {dirty ? accountSignedIn ? "有未同步的更改 · 点击保存同步到云端" : "有未保存的更改 · 点击保存保留布置" : accountSignedIn ? cloudStatus === "synced" ? "账号已连接 · 小屋已同步到云端" : cloudStatus === "empty" ? "账号已连接 · 保存后将建立云端布局" : cloudStatus === "error" ? "云端暂不可用 · 本地布局仍可使用" : "正在连接你的云端小屋…" : "当前保存在这台设备；登录后可同步到云端"}</span><div>{accountSignedIn && cloudStatus === "synced" && lastCloudSave && <small className="saved-note">最近同步：{new Date(lastCloudSave).toLocaleString()}</small>}{saveError && <small className="save-error">{accountSignedIn ? "云端同步失败；本地布局仍已保存，请稍后重试" : "保存失败，请检查设备存储空间或浏览器设置"}</small>}{saved && <small className="saved-note">{accountSignedIn && cloudStatus === "synced" ? "已保存并同步 ✓" : "已保存 ✓"}</small>}<button className="cottage-reset" onClick={resetRoom}>恢复初始布置</button><button className="primary-button cottage-save" onClick={() => void saveRoom()}>{accountSignedIn ? "保存并同步小屋" : "保存我的小屋"} <span>♡</span></button></div></footer>
      </section>
    </div>
  );
}
