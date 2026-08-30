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
};

export default function GalleryAdminPage() {
  const [folders, setFolders] =
    useState<Folder[]>([]);

  const [files, setFiles] =
    useState<GalleryFile[]>([]);

  const [name, setName] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

  const [folderId, setFolderId] =
    useState("");

  useEffect(() => {
    loadFolders();
    loadFiles();
  }, []);

  async function loadFolders() {
    const res = await fetch(
      "/api/gallery/folders"
    );

    const data =
      await res.json();

    if (Array.isArray(data)) {
      setFolders(data);
    } else {
      console.error(
        "获取文件夹失败：",
        data
      );
    }
  }

  async function loadFiles() {
    const res = await fetch(
      "/api/gallery/files/all"
    );

    const data =
      await res.json();

    if (Array.isArray(data)) {
      setFiles(data);
    }
  }

  async function createFolder() {
    if (!name.trim()) return;

    await fetch(
      "/api/gallery/folders",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      }
    );

    setName("");

    loadFolders();
  }

  async function uploadFile() {
    if (!file || !folderId) {
      alert(
        "请选择文件和文件夹"
      );
      return;
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "folderId",
      folderId
    );

    const res = await fetch(
      "/api/gallery/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data =
      await res.json();

    if (res.ok) {
      alert("上传成功");

      setFile(null);

      loadFiles();
    } else {
      alert(data.error);
    }
  }

  async function deleteFile(
    id: string
  ) {
    const ok = confirm(
      "确定删除该素材？"
    );

    if (!ok) return;

    const res = await fetch(
      "/api/gallery/delete",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      }
    );

    if (res.ok) {
      loadFiles();
    } else {
      alert("删除失败");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "#FFF7EE",
        padding: 40,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color:
              "#FF8A00",
            fontSize: 40,
            fontWeight: 900,
          }}
        >
          📁 素材库管理
        </h1>

        <div
          style={{
            marginTop: 30,
            background:
              "#fff",
            borderRadius: 24,
            padding: 24,
            boxShadow:
              "0 10px 30px rgba(0,0,0,.08)",
          }}
        >
          <h3>
            新建文件夹
          </h3>

          <input
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            placeholder="例如：演唱会"
            style={{
              width: 300,
              padding: 12,
              borderRadius: 12,
              border:
                "1px solid #ddd",
            }}
          />

          <button
            onClick={
              createFolder
            }
            style={{
              marginLeft: 10,
              padding:
                "12px 20px",
              border: "none",
              borderRadius: 12,
              background:
                "#FF8A00",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            创建
          </button>

          <div
            style={{
              marginTop: 30,
              padding: 20,
              background:
                "#FFF7EE",
              borderRadius: 16,
            }}
          >
            <h3>
              上传素材
            </h3>

            <select
              value={folderId}
              onChange={(e) =>
                setFolderId(
                  e.target.value
                )
              }
              style={{
                padding: 12,
                borderRadius: 12,
                marginRight: 10,
              }}
            >
              <option value="">
                选择文件夹
              </option>

              {folders.map(
                (folder) => (
                  <option
                    key={
                      folder.id
                    }
                    value={
                      folder.id
                    }
                  >
                    {
                      folder.name
                    }
                  </option>
                )
              )}
            </select>

            <input
              type="file"
              onChange={(e) =>
                setFile(
                  e.target
                    .files?.[0] ||
                    null
                )
              }
            />

            <button
              onClick={
                uploadFile
              }
              style={{
                marginLeft: 10,
                padding:
                  "12px 20px",
                border: "none",
                borderRadius: 12,
                background:
                  "#FF8A00",
                color: "#fff",
                cursor:
                  "pointer",
              }}
            >
              上传
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(220px,1fr))",
            gap: 20,
            marginTop: 30,
          }}
        >
          {folders.map(
            (folder) => (
              <div
                key={
                  folder.id
                }
                style={{
                  background:
                    "#fff",
                  borderRadius:
                    24,
                  padding: 24,
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,.08)",
                }}
              >
                <div
                  style={{
                    fontSize:
                      48,
                  }}
                >
                  📁
                </div>

                <h3>
                  {
                    folder.name
                  }
                </h3>
              </div>
            )
          )}
        </div>

        <div
          style={{
            marginTop: 50,
          }}
        >
          <h2
            style={{
              color:
                "#FF8A00",
              fontWeight: 900,
              marginBottom: 20,
            }}
          >
            已上传素材
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(280px,1fr))",
              gap: 20,
            }}
          >
            {files.map(
              (item) => (
                <div
                  key={
                    item.id
                  }
                  style={{
                    background:
                      "#fff",
                    borderRadius:
                      24,
                    padding: 16,
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
                        borderRadius:
                          16,
                      }}
                    />
                  ) : (
                    <video
                      controls
                      style={{
                        width:
                          "100%",
                        borderRadius:
                          16,
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
                      marginTop:
                        12,
                      fontWeight:
                        700,
                      wordBreak:
                        "break-all",
                    }}
                  >
                    {item.title}
                  </div>

                  <button
                    onClick={() =>
                      deleteFile(
                        item.id
                      )
                    }
                    style={{
                      width:
                        "100%",
                      marginTop:
                        12,
                      padding: 12,
                      border:
                        "none",
                      borderRadius:
                        12,
                      background:
                        "#FF4D4F",
                      color:
                        "#fff",
                      cursor:
                        "pointer",
                      fontWeight:
                        700,
                    }}
                  >
                    删除素材
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
