import { NextResponse } from "next/server";
import { getAdminDb, readSession } from "@/lib/server-auth";

export const runtime = "nodejs";

const themes = new Set(["cream", "blossom", "mint"]);
const furnitureIds = ["sofa", "rug", "plant", "lamp", "table", "shelf", "bed", "picture"] as const;
type Furniture = typeof furnitureIds[number];
type Cell = { col: number; row: number };
type PublicLayout = { theme: "cream" | "blossom" | "mint"; furniture: Furniture[]; positions: Partial<Record<Furniture, Cell>> };

function safeLayout(value: unknown): PublicLayout | null {
  if (!value || typeof value !== "object") return null;
  const input = value as { theme?: unknown; furniture?: unknown; positions?: unknown };
  if (typeof input.theme !== "string" || !themes.has(input.theme) || !Array.isArray(input.furniture)) return null;
  const furniture = furnitureIds.filter(id => input.furniture!.includes(id));
  if (furniture.length !== input.furniture.length) return null;
  const rawPositions = input.positions && typeof input.positions === "object" && !Array.isArray(input.positions)
    ? input.positions as Record<string, unknown> : {};
  const positions: Partial<Record<Furniture, Cell>> = {};
  const occupied = new Set<string>();
  for (const id of furniture) {
    const candidate = rawPositions[id] as { col?: unknown; row?: unknown } | undefined;
    if (!candidate || !Number.isInteger(candidate.col) || !Number.isInteger(candidate.row) ||
      (candidate.col as number) < 0 || (candidate.col as number) > 2 ||
      (candidate.row as number) < 0 || (candidate.row as number) > 2) return null;
    const key = candidate.col + ":" + candidate.row;
    if (occupied.has(key)) return null;
    occupied.add(key);
    positions[id] = { col: candidate.col as number, row: candidate.row as number };
  }
  return { theme: input.theme as PublicLayout["theme"], furniture, positions };
}

export async function GET() {
  try {
    const db = getAdminDb();
    const [{ data: accounts, error: accountError }, viewer] = await Promise.all([
      db.from("domi_accounts").select("id,nickname").order("nickname", { ascending: true }).limit(100),
      readSession(),
    ]);
    if (accountError) throw accountError;
    const users = accounts ?? [];
    if (!users.length) {
      return NextResponse.json({ islanders: [], viewerId: viewer?.id ?? null }, { headers: { "Cache-Control": "no-store" } });
    }
    const { data: layouts, error: layoutError } = await db.from("domi_cottage_layouts")
      .select("user_id,layout_json,updated_at").in("user_id", users.map(user => user.id));
    if (layoutError) throw layoutError;
    const byUser = new Map((layouts ?? []).map(row => [row.user_id, row]));
    const islanders = users.map(user => {
      const row = byUser.get(user.id);
      const layout = row ? safeLayout(row.layout_json) : null;
      return {
        id: user.id,
        nickname: user.nickname,
        hasCottage: !!layout,
        layout,
        updatedAt: layout ? row?.updated_at ?? null : null,
      };
    });
    return NextResponse.json({ islanders, viewerId: viewer?.id ?? null }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Islander directory failed", error);
    return NextResponse.json({ error: "岛民名册暂时无法打开，请稍后重试。" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
