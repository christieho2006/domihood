import { NextResponse } from "next/server";
import { readSession } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function GET() {
  const user = await readSession();
  return NextResponse.json({ user: user ? { id: user.id, nickname: user.nickname } : null }, {
    headers: { "Cache-Control": "no-store" },
  });
}
