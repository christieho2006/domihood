"use client";

import { useEffect, useState } from "react";

type GalleryFile = {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
};

export default function FolderPage({
  params,
}: {
  params: {
    folderId: string;
  };
}) {
  const [files, setFiles] =
    useState<GalleryFile[]>([]);

  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    const res = await fetch(
      `/api/gallery/files?folderId=${params.folderId}`
    );

    const data =
      await res.json();

    if (Array.isArray(data)) {
      setFiles(data);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "#FFF7EE",
        padding: 30,
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <a
          href=" "
          style={{
            color: "#FF8A00",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ← 返回素材库
        </a >

        <h1
          style={{
            marginTop: 20,
            color: "#FF8A00",
            fontSize: 42,
            fontWeight: 900,
          }}
        >
          素材列表
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(280px,1fr))",
            gap: 24,
            marginTop: 30,
          }}
        >
          {files.map((item) => (
            <div
              key={item.id}
              style={{
                background:
                  "#fff",
                borderRadius: 24,
                overflow:
                  "hidden",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,.08)",
              }}
            >
              {item.file_type.startsWith(
                "image"
              ) ? (
                <img
                  src={
                    item.file_url
                  }
                  alt={
                    item.title
                  }
                  style={{
                    width:
                      "100%",
                    display:
                      "block",
                  }}
                />
              ) : (
                <video
                  controls
                  style={{
                    width:
                      "100%",
                  }}
                >
                  <source
                    src={
                      item.file_url
                    }
                  />
                </video>
              )}

              <div
                style={{
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontWeight:
                      700,
                    wordBreak:
                      "break-all",
                  }}
                >
                  {item.title}
                </div>

                <a
                  href={
                    item.file_url
                  }
                  download
                  target="_blank"
                  style={{
                    display:
                      "inline-block",
                    marginTop: 12,
                    padding:
                      "10px 16px",
                    background:
                      "#FF8A00",
                    color:
                      "#fff",
                    borderRadius:
                      12,
                    textDecoration:
                      "none",
                    fontWeight:
                      700,
                  }}
                >
                  ⬇ 下载原文件
                </a >
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}