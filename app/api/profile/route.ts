import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { nickname } = await req.json();

    const { data: checkins, error } =
      await supabase
        .from("checkins")
        .select("*")
        .eq("nickname", nickname);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const days = checkins?.length || 0;

    let title = "新手养猪";

    if (days >= 100) {
      title = "DOMI守护者";
    } else if (days >= 30) {
      title = "奕然挚爱";
    } else if (days >= 10) {
      title = "顶级屯民";
    }

    return NextResponse.json({
      days,
      title,
    });
  } catch {
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}