import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    // 查素材
    const { data: file } = await supabase
      .from("gallery_files")
      .select("*")
      .eq("id", id)
      .single();

    if (!file) {
      return NextResponse.json(
        { error: "素材不存在" },
        { status: 404 }
      );
    }

    // 从 URL 提取 Storage 路径
    const path =
      file.file_url.split("/gallery/")[1];

    // 删除 Storage
    const { error: storageError } =
      await supabase.storage
        .from("gallery")
        .remove([path]);

    if (storageError) {
      return NextResponse.json(
        { error: storageError.message },
        { status: 500 }
      );
    }

    // 删除数据库记录
    const { error: dbError } =
      await supabase
        .from("gallery_files")
        .delete()
        .eq("id", id);

    if (dbError) {
      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}