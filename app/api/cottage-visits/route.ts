import { NextResponse } from "next/server";
import { getAdminDb, readSession } from "@/lib/server-auth";

export const runtime = "nodejs";
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET() {
  const viewer = await readSession();
  if (!viewer) {
    return NextResponse.json({ visitors: [], authenticated: false }, { headers: { "Cache-Control": "no-store" } });
  }
  try {
    const db = getAdminDb();
    const { data: visits, error } = await db.from("domi_cottage_visits")
      .select("id,visitor_id,visited_at")
      .eq("owner_id", viewer.id)
      .order("visited_at", { ascending: false })
      .limit(30);
    if (error) throw error;
    const rows = visits ?? [];
    const ids = Array.from(new Set(rows.map(row => row.visitor_id)));
    const names = new Map<string, string>();
    if (ids.length) {
      const { data: accounts, error: accountError } = await db.from("domi_accounts").select("id,nickname").in("id", ids);
      if (accountError) throw accountError;
      for (const account of accounts ?? []) names.set(account.id, account.nickname);
    }
    return NextResponse.json({
      authenticated: true,
      visitors: rows.map(row => ({ id: row.id, nickname: names.get(row.visitor_id) ?? "已离岛的岛民", visitedAt: row.visited_at })),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Cottage visitor list failed", error);
    return NextResponse.json({ error: "暂时无法读取来访记录，请稍后重试。" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

export async function POST(request: Request) {
  const viewer = await readSession();
  if (!viewer) return NextResponse.json({ error: "登录岛民账号后，才能留下来访足迹。" }, { status: 401 });
  try {
    const body = await request.json().catch(() => null);
    const ownerId = typeof body?.ownerId === "string" ? body.ownerId : "";
    if (!uuidPattern.test(ownerId)) return NextResponse.json({ error: "小屋信息无效。" }, { status: 400 });
    if (ownerId === viewer.id) return NextResponse.json({ recorded: false, reason: "own-cottage" });
    const db = getAdminDb();
    const [{ data: owner, error: ownerError }, { data: layout, error: layoutError }] = await Promise.all([
      db.from("domi_accounts").select("id").eq("id", ownerId).maybeSingle(),
      db.from("domi_cottage_layouts").select("user_id").eq("user_id", ownerId).maybeSingle(),
    ]);
    if (ownerError || layoutError) throw ownerError ?? layoutError;
    if (!owner || !layout) return NextResponse.json({ error: "这间小屋暂时不可拜访。" }, { status: 404 });

    const cutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const { data: recent, error: recentError } = await db.from("domi_cottage_visits")
      .select("id").eq("visitor_id", viewer.id).eq("owner_id", ownerId).gte("visited_at", cutoff).limit(1);
    if (recentError) throw recentError;
    if (recent?.length) return NextResponse.json({ recorded: false, deduplicated: true });

    const { error: insertError } = await db.from("domi_cottage_visits").insert({ visitor_id: viewer.id, owner_id: ownerId });
    if (insertError) throw insertError;
    return NextResponse.json({ recorded: true }, { status: 201 });
  } catch (error) {
    console.error("Cottage visit record failed", error);
    return NextResponse.json({ error: "暂时无法记录这次拜访，请稍后重试。" }, { status: 503 });
  }
}
