import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { assertAuthConfigured, createSession, getAdminDb, isAuthConfigurationError, isValidNickname, normalizeNickname } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const nickname = typeof body?.nickname === "string" ? body.nickname.normalize("NFKC").trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!isValidNickname(nickname)) {
      return NextResponse.json({ error: "昵称需为 2–16 个字，只能包含中文、字母、数字、下划线或连字符。" }, { status: 400 });
    }
    if (password.length < 8 || password.length > 72) {
      return NextResponse.json({ error: "密码长度需要为 8–72 个字符。" }, { status: 400 });
    }

    assertAuthConfigured();\n    const db = getAdminDb();
    const password_hash = await bcrypt.hash(password, 12);
    const { data, error } = await db.from("domi_accounts")
      .insert({ nickname, nickname_normalized: normalizeNickname(nickname), password_hash })
      .select("id,nickname")
      .single();

    if (error?.code === "23505") {
      return NextResponse.json({ error: "这个昵称已经被使用，请换一个昵称。" }, { status: 409 });
    }
    if (error || !data) {
      console.error("Account registration failed", error?.message);
      return NextResponse.json({ error: "暂时无法创建账号，请稍后再试。" }, { status: 500 });
    }
    await createSession(data.id, data.nickname);
    return NextResponse.json({ user: { id: data.id, nickname: data.nickname } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (isAuthConfigurationError(error)) {
      return NextResponse.json({ error: "账号服务尚未配置完成。请先配置 Supabase 数据库与服务器密钥。" }, { status: 503 });
    }
    console.error("Account registration error", error);
    return NextResponse.json({ error: "注册暂时失败，请稍后再试。" }, { status: 500 });
  }
}
