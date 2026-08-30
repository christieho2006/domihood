"use client";

import { useEffect } from "react";

export default function AdminPage() {
  useEffect(() => {
    const userStr =
      localStorage.getItem("domihood_user");

    if (!userStr) {
      window.location.href = "/login";
      return;
    }

    const user = JSON.parse(userStr);

    if (
      user.role !== "admin" &&
      user.role !== "developer"
    ) {
      window.location.href = "/";
    }
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#FFF7EE 0%,#FFE7C8 100%)",
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
            color: "#FF8A00",
            fontSize: 42,
            fontWeight: 900,
            marginBottom: 10,
          }}
        >
          DOMIHOOD 管理组后台
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: 30,
          }}
        >
          社区内容管理中心
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: 20,
          }}
        >
          <AdminCard
            title="📢 发布动态"
            desc="发布首页公告与社区通知"
            href="/dev/announcement"
          />

          <AdminCard
            title="✅ 发布任务"
            desc="创建每日应援任务"
            href="#"
          />

          <AdminCard
            title="💌 审核留言"
            desc="审核用户留言内容"
            href="/admin/messages"
          />

          <AdminCard
            title="📁 上传素材"
            desc="管理图片与视频素材"
            href="/admin/gallery"
          />
        </div>
      </div>
    </main>
  );
}

function AdminCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <a
      href={href}
      style={{
        textDecoration: "none",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: 24,
          boxShadow:
            "0 10px 30px rgba(0,0,0,.08)",
          transition: ".2s",
          cursor: "pointer",
        }}
      >
        <h3>{title}</h3>

        <p
          style={{
            color: "#666",
          }}
        >
          {desc}
        </p>
      </div>
    </a>
  );
}

