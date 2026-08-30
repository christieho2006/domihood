import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("签到请求 =", body);

    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        {
          error: "缺少用户ID",
        },
        {
          status: 400,
        }
      );
    }

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    // 检查今天是否已经签到
    const { data: existing } =
      await supabase
        .from("checkin_records")
        .select("id")
        .eq("user_id", userId)
        .eq("checkin_date", today)
        .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          error: "今天已经签到过了",
        },
        {
          status: 400,
        }
      );
    }

    // 写入签到记录
    const { error: checkinError } =
      await supabase
        .from("checkin_records")
        .insert({
          user_id: userId,
          checkin_date: today,
        });

    if (checkinError) {
      console.log(
        "签到写入失败 =",
        checkinError
      );

      return NextResponse.json(
        {
          error:
            checkinError.message,
        },
        {
          status: 500,
        }
      );
    }

    // 获取用户当前积分
    const { data: user } =
      await supabase
        .from("users")
        .select(
          "points, level"
        )
        .eq("id", userId)
        .single();

    const newPoints =
      (user?.points || 0) + 5;

    let level = 1;
    let title = "新粉丝";

    if (newPoints >= 1000) {
      level = 5;
      title = "DOMI传奇";
    } else if (
      newPoints >= 500
    ) {
      level = 4;
      title = "DOMI守护者";
    } else if (
      newPoints >= 200
    ) {
      level = 3;
      title = "核心粉丝";
    } else if (
      newPoints >= 50
    ) {
      level = 2;
      title = "活跃粉丝";
    }

    // 更新积分、等级、称号
    const {
      error: updateError,
    } = await supabase
      .from("users")
      .update({
        points: newPoints,
        level,
        title,
      })
      .eq("id", userId);

    if (updateError) {
      console.log(
        "积分更新失败 =",
        updateError
      );

      return NextResponse.json(
        {
          error:
            updateError.message,
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      "签到成功，积分 +5"
    );

    return NextResponse.json({
      success: true,
      checkin_date: today,
      reward: 5,
      points: newPoints,
      level,
      title,
    });
  } catch (err) {
    console.log(
      "签到异常 =",
      err
    );

    return NextResponse.json(
      {
        error: String(err),
      },
      {
        status: 500,
      }
    );
  }
}
