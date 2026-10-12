import { NextResponse } from "next/server";
import { getAdminDb, readSession } from "@/lib/server-auth";

export const runtime = "nodejs";
const moods = new Set(["gentle", "happy", "support", "daily"]);

export async function GET() {
  const user = await readSession();
  try {
    const db = getAdminDb();
    const { data: rows, error } = await db.from("domi_square_posts")
      .select("id,user_id,nickname,content,mood,created_at")
      .order("created_at", { ascending: false }).limit(100);
    if (error) throw error;
    const posts = rows ?? [];
    if (!posts.length) return NextResponse.json({ posts: [] }, { headers: { "Cache-Control": "no-store" } });
    const ids = posts.map(post => post.id);
    const [{ data: likes, error: likesError }, { data: comments, error: commentsError }] = await Promise.all([
      db.from("domi_square_likes").select("post_id,user_id").in("post_id", ids),
      db.from("domi_square_comments").select("id,post_id,user_id,nickname,content,created_at").in("post_id", ids).order("created_at", { ascending: true }),
    ]);
    if (likesError || commentsError) throw likesError || commentsError;
    const result = posts.map(post => ({
      id: post.id,
      nickname: post.nickname,
      content: post.content,
      mood: post.mood,
      createdAt: post.created_at,
      likes: (likes ?? []).filter(like => like.post_id === post.id).length,
      likedByMe: !!user && (likes ?? []).some(like => like.post_id === post.id && like.user_id === user.id),
      comments: (comments ?? []).filter(comment => comment.post_id === post.id).map(comment => ({
        id: comment.id, nickname: comment.nickname, content: comment.content, createdAt: comment.created_at,
      })),
    }));
    return NextResponse.json({ posts: result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Fan square load failed", error);
    return NextResponse.json({ error: "广场暂时无法连接，请稍后刷新。" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const user = await readSession();
  if (!user) return NextResponse.json({ error: "请先登录岛民账号，再参与广场互动。" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.action !== "string") return NextResponse.json({ error: "请求内容无效。" }, { status: 400 });
  const db = getAdminDb();

  try {
    if (body.action === "create") {
      const content = typeof body.content === "string" ? body.content.trim() : "";
      const mood = typeof body.mood === "string" ? body.mood : "gentle";
      if (!content || content.length > 500 || !moods.has(mood)) {
        return NextResponse.json({ error: "动态需要 1–500 个字符，并选择有效的心情标签。" }, { status: 400 });
      }
      const { data, error } = await db.from("domi_square_posts").insert({
        user_id: user.id, nickname: user.nickname, content, mood,
      }).select("id").single();
      if (error) throw error;
      return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
    }

    if (body.action === "like") {
      const postId = typeof body.postId === "string" ? body.postId : "";
      if (!postId) return NextResponse.json({ error: "动态不存在。" }, { status: 400 });
      const { data: existing, error: lookupError } = await db.from("domi_square_likes")
        .select("post_id").eq("post_id", postId).eq("user_id", user.id).maybeSingle();
      if (lookupError) throw lookupError;
      if (existing) {
        const { error } = await db.from("domi_square_likes").delete().eq("post_id", postId).eq("user_id", user.id);
        if (error) throw error;
        return NextResponse.json({ ok: true, liked: false });
      }
      const { error } = await db.from("domi_square_likes").insert({ post_id: postId, user_id: user.id });
      if (error) {
        if (error.code === "23505") return NextResponse.json({ ok: true, liked: true });
        throw error;
      }
      return NextResponse.json({ ok: true, liked: true });
    }

    if (body.action === "comment") {
      const postId = typeof body.postId === "string" ? body.postId : "";
      const content = typeof body.content === "string" ? body.content.trim() : "";
      if (!postId || !content || content.length > 300) {
        return NextResponse.json({ error: "留言需要 1–300 个字符。" }, { status: 400 });
      }
      const { error } = await db.from("domi_square_comments").insert({
        post_id: postId, user_id: user.id, nickname: user.nickname, content,
      });
      if (error) {
        if (error.code === "23503") return NextResponse.json({ error: "这条动态已不存在。" }, { status: 404 });
        throw error;
      }
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    return NextResponse.json({ error: "不支持的操作。" }, { status: 400 });
  } catch (error) {
    console.error("Fan square write failed", error);
    return NextResponse.json({ error: "操作暂时失败，请稍后重试。" }, { status: 503 });
  }
}
