import { NextResponse } from "next/server";
import { getAdminDb, readSession } from "@/lib/server-auth";

export const runtime = "nodejs";

const themes = new Set(["cream", "blossom", "mint"]);
const furnitureIds = new Set(["sofa", "rug", "plant", "lamp", "table", "shelf", "bed", "picture"]);

function validLayout(value: unknown): value is { theme: string; furniture: string[]; positions: Record<string, { col: number; row: number }> } {
  if (!value || typeof value !== "object") return false;
  const layout = value as { theme?: unknown; furniture?: unknown; positions?: unknown };
  if (typeof layout.theme !== "string" || !themes.has(layout.theme)) return false;
  if (!Array.isArray(layout.furniture) || layout.furniture.length > furnitureIds.size) return false;
  if (!layout.furniture.every(id => typeof id === "string" && furnitureIds.has(id)) ||
      new Set(layout.furniture).size !== layout.furniture.length) return false;
  if (!layout.positions || typeof layout.positions !== "object" || Array.isArray(layout.positions)) return false;
  const positions = layout.positions as Record<string, unknown>;
  const usedCells = new Set<string>();
  for (const id of layout.furniture) {
    const cell = positions[id] as { col?: unknown; row?: unknown } | undefined;
    if (!cell || !Number.isInteger(cell.col) || !Number.isInteger(cell.row) ||
        (cell.col as number) < 0 || (cell.col as number) > 2 ||
        (cell.row as number) < 0 || (cell.row as number) > 2) return false;
    const key = String(cell.col) + ":" + String(cell.row);
    if (usedCells.has(key)) return false;
    usedCells.add(key);
  }
  return true;
}

export async function GET() {
  const user = await readSession();
  if (!user) return NextResponse.json({ error: "请先登录岛民账号。" }, { status: 401 });
  try {
    const { data, error } = await getAdminDb().from("domi_cottage_layouts")
      .select("layout_json,updated_at").eq("user_id", user.id).maybeSingle();
    if (error) {
      console.error("Cloud cottage layout lookup failed", error.message);
      return NextResponse.json({ error: "云端装修服务尚未配置，请稍后再试。" }, { status: 503 });
    }
    return NextResponse.json({ layout: data?.layout_json ?? null, updatedAt: data?.updated_at ?? null }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Cloud cottage layout error", error);
    return NextResponse.json({ error: "云端装修服务暂时不可用。" }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  const user = await readSession();
  if (!user) return NextResponse.json({ error: "请先登录岛民账号。" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!validLayout(body?.layout)) {
    return NextResponse.json({ error: "小屋布局数据无效，请检查家具位置后重试。" }, { status: 400 });
  }
  try {
    const layout = {
      theme: body.layout.theme,
      furniture: body.layout.furniture,
      positions: Object.fromEntries(body.layout.furniture.map(id => [id, body.layout.positions[id]])),
    };
    const { error } = await getAdminDb().from("domi_cottage_layouts").upsert({
      user_id: user.id,
      layout_json: layout,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    if (error) {
      console.error("Cloud cottage layout save failed", error.message);
      return NextResponse.json({ error: "云端保存失败，请稍后重试。" }, { status: 503 });
    }
    return NextResponse.json({ ok: true, updatedAt: new Date().toISOString() }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Cloud cottage layout save error", error);
    return NextResponse.json({ error: "云端保存暂时不可用。" }, { status: 503 });
  }
}
