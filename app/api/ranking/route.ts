import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } =
      await supabase
        .from("users")
        .select(`
          id,
          nickname,
          avatar_url,
          title,
          points
        `)
        .order("points", {
          ascending: false,
        })
        .limit(100);

    if (error) {
      console.log(error);

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      data || []
    );
  } catch (err) {
    console.log(err);

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