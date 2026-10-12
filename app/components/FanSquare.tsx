"use client";

import { useCallback, useEffect, useState } from "react";

type Mood = "gentle" | "happy" | "support" | "daily";
type Comment = { id: string; nickname: string; content: string; createdAt: string };
type Post = { id: string; nickname: string; content: string; mood: Mood; createdAt: string; likes: number; likedByMe: boolean; comments: Comment[] };
const moodOptions: { id: Mood; label: string; icon: string }[] = [
  { id: "gentle", label: "温柔日常", icon: "☁" },
  { id: "happy", label: "今日开心", icon: "✿" },
  { id: "support", label: "一起应援", icon: "♡" },
  { id: "daily", label: "岛上碎碎念", icon: "✧" },
];
function timeLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "刚刚";
  return new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

export default function FanSquare({ onClose }: { onClose: () => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood>("gentle");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [user, setUser] = useState<{ id: string; nickname: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sessionResponse, postsResponse] = await Promise.all([
        fetch("/api/auth/session", { cache: "no-store" }),
        fetch("/api/square/posts", { cache: "no-store" }),
      ]);
      const sessionData = sessionResponse.ok ? await sessionResponse.json() : null;
      const postsData = postsResponse.ok ? await postsResponse.json() : null;
      if (!postsResponse.ok) throw new Error(postsData?.error || "广场暂时无法加载。");
      setUser(sessionData?.user ?? null);
      setPosts(Array.isArray(postsData?.posts) ? postsData.posts : []);
      setNotice("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "广场暂时无法加载，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function act(payload: Record<string, string>) {
    if (busy) return;
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch("/api/square/posts", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "操作失败，请稍后再试。");
      if (payload.action === "create") setContent("");
      if (payload.action === "comment" && payload.postId) setCommentDrafts(current => ({ ...current, [payload.postId]: "" }));
      await load();
      if (payload.action === "create") setNotice("你的心情已经送到小岛广场 ♡");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "操作失败，请稍后再试。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop square-backdrop" onClick={onClose}>
      <section className="square-modal" onClick={event => event.stopPropagation()} aria-label="粉丝广场">
        <button className="modal-close" onClick={onClose} aria-label="关闭粉丝广场">×</button>
        <div className="square-hero">
          <div className="square-flower">✿</div>
          <div className="eyebrow left-eyebrow">THE GATHERING GARDEN · FAN SQUARE</div>
          <h2>在这里，和喜欢的人相遇。</h2>
          <p>分享一点今天的心情，也给别人的小小日常留一颗心。</p>
          <div className="square-hero-bottom"><span>✦ 岛民动态</span><span>♡ 温柔互动</span><span>☁ 一起长大</span></div>
        </div>
        <div className="square-content">
          <form className="square-compose" onSubmit={event => { event.preventDefault(); void act({ action: "create", content, mood }); }}>
            <div className="square-compose-heading"><div><span className="eyebrow left-eyebrow">LEAVE A LITTLE NOTE</span><h3>分享你的岛上时刻</h3></div><span className="square-count">{content.length}/500</span></div>
            <textarea value={content} onChange={event => setContent(event.target.value.slice(0, 500))} placeholder={user ? "今天有什么想和岛民们分享的？" : "登录岛民账号后，就可以发布动态啦。"} rows={3} maxLength={500} disabled={!user || busy} />
            <div className="square-compose-bottom"><div className="square-mood-options">{moodOptions.map(option => <button type="button" key={option.id} className={mood === option.id ? "selected" : ""} onClick={() => setMood(option.id)} disabled={!user || busy}>{option.icon} {option.label}</button>)}</div><button className="primary-button" type="submit" disabled={!user || busy || !content.trim()}>{busy ? "发送中…" : "发布动态"} <span>↗</span></button></div>
            {!user && <p className="square-login-note">请先点击小岛右上角的岛民头像登录或注册，再回来发布动态、点赞和留言。</p>}
          </form>
          {notice && <p className="square-notice" role="status">{notice}</p>}
          <div className="square-feed-heading"><h3>岛民最近在说什么</h3><button type="button" onClick={() => void load()} disabled={loading}>↻ 刷新</button></div>
          {loading ? <div className="square-empty">正在把岛民们的消息带过来…</div> : posts.length === 0 ? <div className="square-empty"><span>✧</span><strong>广场还很安静。</strong><p>发布第一条动态，让小岛热闹起来吧。</p></div> :
            <div className="square-feed">{posts.map(post => <article className="square-post" key={post.id}>
              <div className="square-post-top"><span className="square-avatar">{post.nickname.slice(0,1) || "♡"}</span><div className="square-author"><strong>{post.nickname}</strong><time>{timeLabel(post.createdAt)}</time></div><span className={"square-post-mood mood-" + post.mood}>{moodOptions.find(option => option.id === post.mood)?.icon} {moodOptions.find(option => option.id === post.mood)?.label}</span></div>
              <p className="square-post-content">{post.content}</p>
              <div className="square-post-actions"><button type="button" className={post.likedByMe ? "liked" : ""} disabled={!user || busy} onClick={() => void act({ action: "like", postId: post.id })}>♡ {post.likedByMe ? "已喜欢" : "喜欢"} · {post.likes}</button><span>☁ {post.comments.length} 条留言</span></div>
              {post.comments.length > 0 && <div className="square-comments">{post.comments.map(comment => <p key={comment.id}><strong>{comment.nickname}</strong><span>{comment.content}</span></p>)}</div>}
              {user && <form className="square-comment-form" onSubmit={event => { event.preventDefault(); const draft = (commentDrafts[post.id] || "").trim(); if (draft) void act({ action: "comment", postId: post.id, content: draft }); }}><input value={commentDrafts[post.id] || ""} onChange={event => setCommentDrafts(current => ({ ...current, [post.id]: event.target.value.slice(0, 300) }))} placeholder="留下一句温柔的留言…" maxLength={300} disabled={busy}/><button type="submit" disabled={busy || !(commentDrafts[post.id] || "").trim()}>发送</button></form>}
            </article>)}</div>}
        </div>
        <div className="square-footer"><span>每一份喜欢，都能让小岛再亮一点。</span><button className="memory-done" onClick={onClose}>回到小岛 ↗</button></div>
      </section>
    </div>
  );
}
