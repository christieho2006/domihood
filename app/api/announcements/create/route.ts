import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const {
      title,
      content,
      author,
    } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        {
          error: "标题和内容不能为空",
        },
        {
          status: 400,
        }
      );
    }

    const { error } =
      await supabase
        .from("announcements")
        .insert({
          title,
          content,
          author,
        });

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      {
        error: "服务器错误",
      },
      {
        status: 500,
      }
    );
  }
}