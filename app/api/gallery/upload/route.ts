import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const folderId = formData.get("folderId") as string | null;

    console.log("收到上传请求");
    console.log("folderId =", folderId);
    console.log("file =", file?.name);

    if (!file) {
      return NextResponse.json(
        { error: "未选择文件" },
        { status: 400 }
      );
    }

    if (!folderId) {
      return NextResponse.json(
        { error: "未选择文件夹" },
        { status: 400 }
      );
    }

    const fileExt = file.name.split(".").pop();

    const fileName = `${Date.now()}.${fileExt}`;

    const fileBuffer = await file.arrayBuffer();

    console.log("开始上传 Storage");

    const { data: uploadData, error: uploadError } =
      await supabase.storage
        .from("gallery")
        .upload(
          fileName,
          fileBuffer,
          {
            contentType: file.type,
            upsert: false,
          }
        );

    console.log("uploadData =", uploadData);
    console.log("uploadError =", uploadError);

    if (uploadError) {
      return NextResponse.json(
        {
          error: uploadError.message,
        },
        { status: 500 }
      );
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from("gallery")
      .getPublicUrl(fileName);

    console.log(
      "publicUrl =",
      publicUrlData.publicUrl
    );

    const { data, error } =
      await supabase
        .from("gallery_files")
        .insert({
  folder_id: folderId,

  title: file.name,

  original_name: file.name,

  file_url: publicUrlData.publicUrl,

  file_type: file.type,

  file_size: file.size,
})
        .select()
        .single();

    console.log("dbData =", data);
    console.log("dbError =", error);

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(
      "上传接口异常：",
      err
    );

    return NextResponse.json(
      {
        error: String(err),
      },
      { status: 500 }
    );
  }
}