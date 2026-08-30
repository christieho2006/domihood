import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const {
      nickname,
      password,
      inviteCode,
    } = await req.json();

    console.log("昵称 =", nickname);
    console.log("密码 =", password);
    console.log("邀请码 =", inviteCode);

    // 测试 admin_codes 是否能读取
    const {
      data: allCodes,
      error: allCodesError,
    } = await supabase
      .from("admin_codes")
      .select("*");

    console.log(
      "全部邀请码 =",
      allCodes
    );

    console.log(
      "邀请码错误 =",
      allCodesError
    );

    // 初始密码校验
    if (password !== "0915") {
      return NextResponse.json(
        { error: "初始密码错误" },
        { status: 400 }
      );
    }

    // 昵称校验
    if (!nickname?.trim()) {
      return NextResponse.json(
        { error: "昵称不能为空" },
        { status: 400 }
      );
    }

    // 检查昵称是否存在
    const {
      data: existingUser,
    } = await supabase
      .from("users")
      .select("id")
      .eq("nickname", nickname)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: "昵称已存在" },
        { status: 400 }
      );
    }

    // 默认身份
    let role = "fan";

    // 邀请码注册管理员
    if (
      inviteCode &&
      inviteCode.trim() !== ""
    ) {
      const {
        data: codeData,
        error: codeError,
      } = await supabase
        .from("admin_codes")
        .select("*")
        .eq(
          "code",
          inviteCode.trim()
        )
        .eq("used", false)
        .maybeSingle();

      console.log(
        "邀请码查询结果 =",
        codeData
      );

      console.log(
        "邀请码查询错误 =",
        codeError
      );

      if (!codeData) {
        return NextResponse.json(
          {
            error:
              "邀请码无效或已使用",
          },
          { status: 400 }
        );
      }

      role = "admin";

      await supabase
        .from("admin_codes")
        .update({
          used: true,
          used_by: nickname,
        })
        .eq("id", codeData.id);
    }

    // 密码加密
    const passwordHash =
      await bcrypt.hash(
        password,
        10
      );

    // 创建用户
    const { error } =
      await supabase
        .from("users")
        .insert({
          nickname,
          password_hash:
            passwordHash,
          role,
          avatar_url: null,
          status: "active",
          title: "新粉丝",
          days_active: 0,
          first_login: true,
          must_change_password:
            false,
          visit_days: 0,
          last_login: null,
        });

    if (error) {
      console.log(
        "创建用户失败 =",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      role,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}