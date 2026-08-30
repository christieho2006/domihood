"use client";

import { useState } from "react";

export default function AnnouncementPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function publishAnnouncement() {
    try {
      setLoading(true);
      setMessage("");

      const currentUser =
        localStorage.getItem(
          "domihood_user"
        );

      const nickname =
        currentUser
          ? JSON.parse(
              currentUser
            ).nickname
          : "Developer";

      const res = await fetch(
        "/api/announcements/create",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title,
            content,
            author: nickname,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        setMessage(
          data.error ||
            "发布失败"
        );
        return;
      }

      setMessage(
        "公告发布成功 🎉"
      );

      setTitle("");
      setContent("");
    } catch {
      setMessage(
        "网络错误"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          "linear-gradient(135deg,#FFF7EE 0%,#FFE7C8 50%,#FFF4E8 100%)",
        padding: 40,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin:
            "0 auto",
        }}
      >
        {/* 顶部 */}
        <div
          style={{
            marginBottom: 30,
          }}
        >
          <h1
            style={{
              fontSize: 42,
              fontWeight: 900,
              color:
                "#FF8A00",
              marginBottom: 8,
            }}
          >
            📢 公告发布中心
          </h1>

          <p
            style={{
              color:
                "#777",
              fontSize: 16,
            }}
          >
            发布后将自动显示在首页最新动态区域
          </p >
        </div>

        {/* 主卡片 */}
        <div
          style={{
            background:
              "rgba(255,255,255,.75)",
            backdropFilter:
              "blur(25px)",
            borderRadius: 32,
            padding: 32,
            boxShadow:
              "0 20px 60px rgba(255,138,0,.12)",
            border:
              "1px solid rgba(255,255,255,.5)",
          }}
        >
          {/* 标题 */}
          <div
            style={{
              marginBottom: 22,
            }}
          >
            <label
              style={{
                display:
                  "block",
                marginBottom: 10,
                fontWeight: 700,
              }}
            >
              公告标题
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="请输入公告标题"
              style={{
                width: "100%",
                padding: 16,
                border: "none",
                borderRadius: 18,
                background:
                  "#fff",
                fontSize: 15,
                boxShadow:
                  "0 5px 20px rgba(0,0,0,.05)",
                outline:
                  "none",
              }}
            />
          </div>

          {/* 内容 */}
          <div
            style={{
              marginBottom: 22,
            }}
          >
            <label
              style={{
                display:
                  "block",
                marginBottom: 10,
                fontWeight: 700,
              }}
            >
              公告内容
            </label>

            <textarea
              value={content}
              onChange={(e) =>
                setContent(
                  e.target.value
                )
              }
              placeholder="请输入公告内容..."
              rows={10}
              style={{
                width: "100%",
                padding: 18,
                border: "none",
                borderRadius: 18,
                background:
                  "#fff",
                fontSize: 15,
                resize:
                  "vertical",
                boxShadow:
                  "0 5px 20px rgba(0,0,0,.05)",
                outline:
                  "none",
              }}
            />
          </div>

          {/* 按钮 */}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap:
                "wrap",
            }}
          >
            <button
              onClick={
                publishAnnouncement
              }
              disabled={
                loading
              }
              style={{
                border:
                  "none",
                borderRadius: 18,
                padding:
                  "14px 24px",
                background:
                  "linear-gradient(135deg,#FF8A00,#FFB347)",
                color:
                  "#fff",
                fontWeight: 700,
                cursor:
                  "pointer",
                boxShadow:
                  "0 10px 30px rgba(255,138,0,.25)",
              }}
            >
              {loading
                ? "发布中..."
                : "🚀 发布公告"}
            </button>

            <a
              href=" "
              style={{
                textDecoration:
                  "none",
              }}
            >
              <button
                style={{
                  border:
                    "none",
                  borderRadius:
                    18,
                  padding:
                    "14px 24px",
                  background:
                    "#fff",
                  color:
                    "#FF8A00",
                  fontWeight:
                    700,
                  cursor:
                    "pointer",
                }}
              >
                ← 返回后台
              </button>
            </a >
          </div>

          {/* 消息 */}
          {message && (
            <div
              style={{
                marginTop: 24,
                padding: 16,
                borderRadius:
                  18,
                background:
                  "#FFF4E8",
                color:
                  "#FF8A00",
                fontWeight:
                  700,
              }}
            >
              {message}
            </div>
          )}
        </div>

        {/* 说明卡片 */}
        <div
          style={{
            marginTop: 24,
            background:
              "#fff",
            borderRadius: 24,
            padding: 24,
            boxShadow:
              "0 10px 30px rgba(0,0,0,.05)",
          }}
        >
          <h3>
            发布说明
          </h3>

          <p
            style={{
              color:
                "#666",
              lineHeight:
                1.8,
            }}
          >
            • 公告发布后会立即出现在首页「最新动态」
            <br />
            • 首页默认显示最近3条公告
            <br />
            • 发布时间自动记录
            <br />
            • 发布人自动记录为当前登录开发者
          </p >
        </div>
      </div>
    </main>
  );
}