import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // 注册粉丝数
    const { count: userCount } =
      await supabase
        .from("users")
        .select("*", {
          count: "exact",
          head: true,
        });

    // 累计签到数
    const { count: checkinCount } =
      await supabase
        .from("checkin_records")
        .select("*", {
          count: "exact",
          head: true,
        });

    // 社区积分总和
    const { data: users } =
      await supabase
        .from("users")
        .select("points");

    const totalPoints =
      users?.reduce(
        (sum, user) =>
          sum + (user.points || 0),
        0
      ) || 0;

    return NextResponse.json({
      fans: userCount || 0,
      checkins: checkinCount || 0,
      points: totalPoints,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}