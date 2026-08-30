import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { nickname, password } = await req.json();

    if (!nickname || !password) {
      return NextResponse.json(
        { error: "请输入昵称和密码" },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("nickname", nickname)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (user.status === "banned") {
  return NextResponse.json(
    { error: "账号已被封禁" },
    { status: 403 }
  );
}
    if (!isMatch) {
      return NextResponse.json(
        { error: "密码错误" },
        { status: 401 }
      );
    }

    return NextResponse.json({
  success: true,

  id: user.id,

  role: user.role,

  nickname: user.nickname,

  avatar_url: user.avatar_url,

  title: user.title,
});
  } catch {
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}