"use client";

import { useEffect, useState } from "react";

type Folder = {
  id: string;
  name: string;
};

type GalleryFile = {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
  file_size?: number;
};

export default function GalleryPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<GalleryFile[]>([]);
  const [selectedFolder, setSelectedFolder] =
    useState<Folder | null>(null);

  useEffect(() => {
    loadFolders();
  }, []);

  async function loadFolders() {
    try {
      const res = await fetch(
        "/api/gallery/folders"
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setFolders(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function openFolder(
    folder: Folder
  ) {
    try {
      setSelectedFolder(folder);

      const res = await fetch(
        `/api/gallery/files?folderId=${folder.id}`
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setFiles(data);
      } else {
        setFiles([]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function formatSize(
    bytes?: number
  ) {
    if (!bytes) return "";

    if (bytes < 1024 * 1024) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      1024 /
      1024
    ).toFixed(1)} MB`;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#FFF7EE 0%,#FFE7C8 100%)",
        padding: 30,
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color: "#FF8A00",
            fontSize: 52,
            fontWeight: 900,
            marginBottom: 8,
          }}
        >
          DOMIHOOD 素材库
        </h1>

        <p
          style={{
            color: "#777",
            fontSize: 18,
            marginBottom: 40,
          }}
        >
          高清图片 · 视频素材 · 原画质下载
        </p >

        {!selectedFolder ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(260px,1fr))",
              gap: 24,
            }}
          >
            {folders.map(
              (folder) => (
                <div
                  key={folder.id}
                  onClick={() =>
                    openFolder(folder)
                  }
                  style={{
                    background: "#fff",
                    borderRadius: 28,
                    padding: 28,
                    cursor: "pointer",
                    boxShadow:
                      "0 15px 40px rgba(0,0,0,.08)",
                    border:
                      "1px solid rgba(255,138,0,.08)",
                    transition:
                      "transform .2s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: 64,
                      marginBottom: 10,
                    }}
                  >
                    📁
                  </div>

                  <h3
                    style={{
                      margin: 0,
                      fontSize: 24,
                      color: "#222",
                    }}
                  >
                    {folder.name}
                  </h3>

                  <p
                    style={{
                      marginTop: 10,
                      color: "#999",
                    }}
                  >
                    点击查看素材
                  </p >
                </div>
              )
            )}
          </div>
        ) : (
          <>
            <button
              onClick={() => {
                setSelectedFolder(
                  null
                );
                setFiles([]);
              }}
              style={{
                border: "none",
                borderRadius: 14,
                padding:
                  "12px 22px",
                background:
                  "#FF8A00",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 700,
                boxShadow:
                  "0 10px 20px rgba(255,138,0,.25)",
              }}
            >
              ← 返回文件夹
            </button>

            <h2
              style={{
                marginTop: 24,
                color: "#FF8A00",
                fontSize: 36,
                fontWeight: 900,
              }}
            >
              📂 {selectedFolder.name}
            </h2>

            {files.length === 0 ? (
              <div
                style={{
                  marginTop: 24,
                  background: "#fff",
                  borderRadius: 28,
                  padding: 60,
                  textAlign: "center",
                  boxShadow:
                    "0 15px 40px rgba(0,0,0,.08)",
                }}
              >
                暂无素材
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill,minmax(320px,1fr))",
                  gap: 24,
                  marginTop: 24,
                }}
              >
                {files.map(
                  (file) => (
                    <div
                      key={file.id}
                      style={{
                        background:
                          "#fff",
                        borderRadius:
                          28,
                        padding: 18,
                        boxShadow:
                          "0 18px 40px rgba(0,0,0,.08)",
                        border:
                          "1px solid rgba(255,138,0,.06)",
                      }}
                    >
                      {file.file_type.startsWith(
                        "image"
                      ) ? (
                        <img
                          src={
                            file.file_url
                          }
                          alt={
                            file.title
                          }
                          loading="lazy"
                          style={{
                            width:
                              "100%",
                            maxHeight:
                              500,
                            objectFit:
                              "contain",
                            background:
                              "#f5f5f5",
                            borderRadius:
                              18,
                          }}
                        />
                      ) : (
                        <video
                          controls
                          preload="metadata"
                          style={{
                            width:
                              "100%",
                            maxHeight:
                              500,
                            borderRadius:
                              18,
                            background:
                              "#000",
                          }}
                        >
                          <source
                            src={
                              file.file_url
                            }
                          />
                        </video>
                      )}

                      <h4
                        style={{
                          marginTop: 16,
                          marginBottom:
                            8,
                          wordBreak:
                            "break-all",
                          color:
                            "#333",
                        }}
                      >
                        {file.title}
                      </h4>

                      <div
                        style={{
                          color:
                            "#888",
                          fontSize:
                            14,
                          marginBottom:
                            14,
                        }}
                      >
                        {formatSize(
                          file.file_size
                        )}
                      </div>

                      <a
                        href= "_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration:
                            "none",
                        }}
                      >
                        <button
                          style={{
                            width:
                              "100%",
                            border:
                              "none",
                            borderRadius:
                              14,
                            padding:
                              "14px 0",
                            background:
                              "#FF8A00",
                            color:
                              "#fff",
                            cursor:
                              "pointer",
                            fontWeight:
                              700,
                            fontSize:
                              15,
                            boxShadow:
                              "0 10px 20px rgba(255,138,0,.25)",
                          }}
                        >
                          ⬇ 下载原文件
                        </button>
                      </a >
                    </div>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}