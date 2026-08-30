import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } =
    await supabase
      .from("messages")
      .select("*")
      .eq("approved", true)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const {
      nickname,
      content,
    } = await req.json();

    const { error } =
      await supabase
        .from("messages")
        .insert({
          nickname,
          content,
        });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}