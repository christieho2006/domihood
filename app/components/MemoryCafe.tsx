"use client";

import { useEffect, useMemo, useState } from "react";

type Mood = "warm" | "happy" | "calm" | "nostalgic";
type Memory = { id: string; title: string; body: string; mood: Mood; createdAt: string };
const GUEST_KEY = "domi_memory_cafe_guest_v1";
const accountStorageKey = (userId: string) => `domi_memory_cafe_v1:account:${userId}`;
const moods: { id: Mood; label: string; icon: string }[] = [
  { id: "warm", label: "温暖", icon: "☀" },
  { id: "happy", label: "开心", icon: "✿" },
  { id: "calm", label: "平静", icon: "☁" },
  { id: "nostalgic", label: "想念", icon: "♡" },
];

function parseMemories(value: unknown): Memory[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Memory =>
    item && typeof item.id === "string" && item.id.length <= 100 &&
    typeof item.title === "string" && item.title.length <= 48 &&
    typeof item.body === "string" && item.body.length <= 1200 &&
    moods.some(m => m.id === item.mood) &&
    typeof item.createdAt === "string" && !Number.isNaN(Date.parse(item.createdAt))
  ).slice(0, 100);
}

function dateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "一段珍藏的时光";
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

export default function MemoryCafe({ onClose }: { onClose: () => void }) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<Mood>("warm");
  const [notice, setNotice] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [accountNickname, setAccountNickname] = useState("");
  const [loading, setLoading] = useState(true);
  const [cloudStatus, setCloudStatus] = useState<"guest" | "synced" | "error">("guest");

  useEffect(() => {
    let cancelled = false;

    async function loadMemories() {
      try {
        const sessionResponse = await fetch("/api/auth/session", { cache: "no-store" });
        const sessionData = sessionResponse.ok ? await sessionResponse.json() : null;
        const user = sessionData?.user;
        if (cancelled) return;

        if (user?.id) {
          setAccountId(user.id);
          setAccountNickname(typeof user.nickname === "string" ? user.nickname : "");
          try {
            const response = await fetch("/api/cafe/memories", { cache: "no-store" });
            if (!response.ok) throw new Error("CLOUD_MEMORIES_UNAVAILABLE");
            const data = await response.json();
            if (cancelled) return;
            const cloudMemories = parseMemories(data.memories);
            setMemories(cloudMemories);
            setCloudStatus("synced");
            try {
              if (cloudMemories.length) localStorage.setItem(accountStorageKey(user.id), JSON.stringify(cloudMemories));
              else localStorage.removeItem(accountStorageKey(user.id));
            } catch { /* Cloud remains authoritative. */ }
          } catch {
            if (cancelled) return;
            setCloudStatus("error");
            try {
              const cached = localStorage.getItem(accountStorageKey(user.id));
              setMemories(cached ? parseMemories(JSON.parse(cached)) : []);
            } catch {
              setMemories([]);
            }
            setNotice("云端暂时无法连接，当前显示的是此账号在这台设备上的缓存。");
          }
          return;
        }

        setAccountId(null);
        setAccountNickname("");
        setCloudStatus("guest");
        try {
          const cached = localStorage.getItem(GUEST_KEY);
          setMemories(cached ? parseMemories(JSON.parse(cached)) : []);
        } catch {
          setMemories([]);
        }
      } catch {
        if (!cancelled) {
          setAccountId(null);
          setCloudStatus("guest");
          try {
            const cached = localStorage.getItem(GUEST_KEY);
            setMemories(cached ? parseMemories(JSON.parse(cached)) : []);
          } catch {
            setMemories([]);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadMemories();
    return () => { cancelled = true; };
  }, []);

  const sorted = useMemo(() => [...memories].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [memories]);

  async function persist(next: Memory[]) {
    const safeNext = parseMemories(next);
    const storageKey = accountId ? accountStorageKey(accountId) : GUEST_KEY;
    try {
      localStorage.setItem(storageKey, JSON.stringify(safeNext));
    } catch {
      setNotice("本地保存失败，请检查浏览器存储空间或隐私设置。");
      return false;
    }
    setMemories(safeNext);

    if (accountId) {
      try {
        const response = await fetch("/api/cafe/memories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memories: safeNext }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "CLOUD_SAVE_FAILED");
        setCloudStatus("synced");
        setNotice("已珍藏并同步到账号云端 ♡");
      } catch {
        setCloudStatus("error");
        setNotice("已保存在这台设备，但云端同步失败；请检查网络后重试。");
      }
    } else {
      setNotice("已珍藏在这台设备里 ♡");
    }
    return true;
  }

  async function saveMemory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanBody = body.trim();
    if (!cleanTitle || !cleanBody) {
      setNotice("给这段回忆取个名字，再写下想留下的话吧。");
      return;
    }
    const next: Memory[] = [{
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2),
      title: cleanTitle.slice(0, 48),
      body: cleanBody.slice(0, 1200),
      mood,
      createdAt: new Date().toISOString(),
    }, ...memories].slice(0, 100);
    if (await persist(next)) {
      setTitle("");
      setBody("");
      setMood("warm");
    }
  }

  async function deleteMemory(id: string) {
    await persist(memories.filter(memory => memory.id !== id));
    setConfirmDelete(null);
  }

  return (
    <div className="modal-backdrop memory-backdrop" onClick={onClose}>
      <section className="memory-modal" onClick={event => event.stopPropagation()} aria-label="回忆咖啡馆">
        <button className="modal-close" onClick={onClose} aria-label="关闭回忆咖啡馆">×</button>
        <div className="memory-hero">
          <div className="memory-cup">☕</div>
          <div className="eyebrow left-eyebrow">MEMORY CAFE · YOUR LITTLE JOURNAL</div>
          <h2>把今天，收藏起来。</h2>
          <p>开心的小事、想念的人、偶然遇见的温柔，都值得有一个位置。</p>
          <div className="memory-count"><strong>{memories.length.toString().padStart(2, "0")}</strong><span>段回忆，正在这里慢慢发光</span></div>
          <div className="memory-sync-state">{loading ? "正在打开你的回忆收藏夹…" : accountId ? cloudStatus === "synced" ? `已连接云端 · ${accountNickname}` : "云端暂不可用 · 已启用账号本地缓存" : "访客模式 · 仅保存在当前设备"}</div>
        </div>
        <div className="memory-content">
          <form className="memory-form" onSubmit={saveMemory}>
            <div className="memory-form-heading"><h3>写下一段回忆</h3><span>ONE LITTLE MOMENT</span></div>
            <label htmlFor="memory-title">给这段时光取个名字</label>
            <input id="memory-title" value={title} onChange={event => setTitle(event.target.value)} maxLength={48} placeholder="例如：今天的天空很漂亮" required disabled={loading} />
            <label>今天的心情</label>
            <div className="memory-moods" role="group" aria-label="选择心情">
              {moods.map(item => <button type="button" key={item.id} className={mood === item.id ? "selected" : ""} onClick={() => setMood(item.id)} aria-pressed={mood === item.id} disabled={loading}><span>{item.icon}</span>{item.label}</button>)}
            </div>
            <label htmlFor="memory-body">想留下的话</label>
            <textarea id="memory-body" value={body} onChange={event => setBody(event.target.value)} maxLength={1200} rows={4} placeholder="不用写得很完整，只要是你想记住的就好……" required disabled={loading} />
            <div className="memory-form-bottom"><small>{body.length}/1200 · {accountId ? "登录后同步到账号云端" : "仅保存在当前设备"}</small><button className="primary-button" type="submit" disabled={loading}>珍藏这段回忆 <span>♡</span></button></div>
            {notice && <p className="memory-notice" role="status">{notice}</p>}
          </form>
          <div className="memory-archive">
            <div className="memory-form-heading"><h3>回忆收藏夹</h3><span>{sorted.length} SAVED</span></div>
            {loading ? <div className="memory-empty"><span>☕</span><strong>正在准备一杯温暖的咖啡。</strong><p>马上就好……</p></div> : sorted.length === 0 ? <div className="memory-empty"><span>✧</span><strong>这里还空着一页。</strong><p>写下第一段回忆，让这家小小咖啡馆亮起灯来。</p></div> :
              <div className="memory-list">{sorted.map(memory => {
                const memoryMood = moods.find(item => item.id === memory.mood)!;
                return <article className={"memory-card mood-" + memory.mood} key={memory.id}>
                  <div className="memory-card-top"><span className="memory-mood-tag">{memoryMood.icon} {memoryMood.label}</span><time>{dateLabel(memory.createdAt)}</time></div>
                  <h4>{memory.title}</h4>
                  <p>{memory.body}</p>
                  <div className="memory-card-actions">{confirmDelete === memory.id ? <><span>确定删除这段回忆？</span><button type="button" onClick={() => void deleteMemory(memory.id)}>确认删除</button><button type="button" onClick={() => setConfirmDelete(null)}>取消</button></> : <button type="button" onClick={() => setConfirmDelete(memory.id)}>移出收藏</button>}</div>
                </article>;
              })}</div>}
          </div>
        </div>
        <div className="memory-footer"><span>小小的瞬间，也可以拥有很长的回声。</span><button className="memory-done" onClick={onClose}>回到小岛 ↗</button></div>
      </section>
    </div>
  );
}
