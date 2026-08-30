import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const folderId =
    searchParams.get("folderId");

  if (!folderId) {
    return NextResponse.json([]);
  }

  const { data, error } =
    await supabase
      .from("gallery_files")
      .select("*")
      .eq("folder_id", folderId)
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