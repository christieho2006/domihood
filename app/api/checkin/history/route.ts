import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } =
    new URL(req.url);

  const userId =
    searchParams.get("userId");

  if (!userId) {
    return NextResponse.json([]);
  }

  const { data, error } =
    await supabase
      .from("checkin_records")
      .select("*")
      .eq("user_id", userId)
      .order("checkin_date");

  if (error) {
    return NextResponse.json(
      [],
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}