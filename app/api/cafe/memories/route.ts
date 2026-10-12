import { NextResponse } from "next/server";
import { getAdminDb, readSession } from "@/lib/server-auth";

export const runtime = "nodejs";

const moods = new Set(["warm", "happy", "calm", "nostalgic"]);
type Memory = { id: string; title: string; body: string; mood: string; createdAt: string };

function normalizeMemories(value: unknown): Memory[] | null {
  if (!Array.isArray(value) || value.length > 100) return null;
  const result: Memory[] = [];
  const ids = new Set<string>();
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const memory = item as Record<string, unknown>;
    if (typeof memory.id !== "string" || memory.id.length < 1 || memory.id.length > 100 ||
        ids.has(memory.id) ||
        typeof memory.title !== "string" || !memory.title.trim() || memory.title.length > 48 ||
        typeof memory.body !== "string" || !memory.body.trim() || memory.body.length > 1200 ||
        typeof memory.mood !== "string" || !moods.has(memory.mood) ||
        typeof memory.createdAt !== "string" || Number.isNaN(Date.parse(memory.createdAt))) return null;
    ids.add(memory.id);
    result.push({
      id: memory.id,
      title: memory.title.trim(),
      body: memory.body.trim(),
      mood: memory.mood,
      createdAt: new Date(memory.createdAt).toISOString(),
    });
  }
  return result;
}

export async function GET() {
  const user = await readSession();
  if (!user) return NextResponse.json({ error: "请先登录岛民账号。" }, { status: 401 });
  try {
    const { data, error } = await getAdminDb().from("domi_memory_cafe")
      .select("memories_json,updated_at").eq("user_id", user.id).maybeSingle();
    if (error) {
      console.error("Memory cafe lookup failed", error.message);
      return NextResponse.json({ error: "回忆云端服务尚未配置，请稍后再试。" }, { status: 503 });
    }
    const memories = normalizeMemories(data?.memories_json ?? []);
    return NextResponse.json({
      memories: memories ?? [],
      updatedAt: data?.updated_at ?? null,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Memory cafe lookup error", error);
    return NextResponse.json({ error: "回忆云端服务暂时不可用。" }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  const user = await readSession();
  if (!user) return NextResponse.json({ error: "请先登录岛民账号。" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const memories = normalizeMemories(body?.memories);
  if (!memories) {
    return NextResponse.json({ error: "回忆内容无效，或收藏数量已达到上限。" }, { status: 400 });
  }
  try {
    const updatedAt = new Date().toISOString();
    const { error } = await getAdminDb().from("domi_memory_cafe").upsert({
      user_id: user.id,
      memories_json: memories,
      updated_at: updatedAt,
    }, { onConflict: "user_id" });
    if (error) {
      console.error("Memory cafe save failed", error.message);
      return NextResponse.json({ error: "回忆云端保存失败，请稍后重试。" }, { status: 503 });
    }
    return NextResponse.json({ ok: true, updatedAt }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Memory cafe save error", error);
    return NextResponse.json({ error: "回忆云端保存暂时不可用。" }, { status: 503 });
  }
}
