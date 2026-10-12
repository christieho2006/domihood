import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { assertAuthConfigured, createSession, getAdminDb, isAuthConfigurationError, isValidNickname, normalizeNickname } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const nickname = typeof body?.nickname === "string" ? body.nickname.normalize("NFKC").trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!isValidNickname(nickname) || !password || password.length > 72) {
      return NextResponse.json({ error: "昵称或密码不正确。" }, { status: 401 });
    }

    assertAuthConfigured();\n    const db = getAdminDb();
    const { data, error } = await db.from("domi_accounts")
      .select("id,nickname,password_hash")
      .eq("nickname_normalized", normalizeNickname(nickname))
      .maybeSingle();

    if (error) {
      console.error("Account lookup failed", error.message);
      return NextResponse.json({ error: "暂时无法登录，请稍后再试。" }, { status: 500 });
    }
    if (!data || !(await bcrypt.compare(password, data.password_hash))) {
      return NextResponse.json({ error: "昵称或密码不正确。" }, { status: 401 });
    }
    await createSession(data.id, data.nickname);
    return NextResponse.json({ user: { id: data.id, nickname: data.nickname } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (isAuthConfigurationError(error)) {
      return NextResponse.json({ error: "账号服务尚未配置完成。请先配置 Supabase 数据库与服务器密钥。" }, { status: 503 });
    }
    console.error("Account login error", error);
    return NextResponse.json({ error: "登录暂时失败，请稍后再试。" }, { status: 500 });
  }
}
