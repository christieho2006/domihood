"use client";

import { useState } from "react";

export default function LoginPage() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin() {
    try {
      setMessage("");

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "登录失败");
        return;
      }

      setMessage("登录成功");

      localStorage.setItem(
  "domihood_user",
  JSON.stringify(data)
);
 
      if (data.role === "developer") {
        window.location.href = "/dev";
      } else if (data.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch {
      setMessage("网络错误");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#FFF7EE 0%,#FFE7C8 50%,#FFF4E8 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: 420,
          background: "rgba(255,255,255,.75)",
          backdropFilter: "blur(25px)",
          borderRadius: 32,
          padding: 36,
          boxShadow:
            "0 20px 60px rgba(255,138,0,.15)",
          border: "1px solid rgba(255,255,255,.5)",
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg,#FF8A00,#FFB347)",
            margin: "0 auto",
            boxShadow:
              "0 10px 30px rgba(255,138,0,.3)",
          }}
        />

        <h1
          style={{
            textAlign: "center",
            marginTop: 20,
            marginBottom: 6,
            fontSize: 34,
            fontWeight: 900,
            color: "#FF8A00",
          }}
        >
          DOMIHOOD
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#888",
            marginBottom: 28,
          }}
        >
          欢迎回来
        </p>

        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="请输入昵称"
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 18,
            border: "none",
            background: "#fff",
            boxShadow:
              "0 5px 20px rgba(0,0,0,.05)",
            marginBottom: 14,
            fontSize: 15,
          }}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入密码"
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 18,
            border: "none",
            background: "#fff",
            boxShadow:
              "0 5px 20px rgba(0,0,0,.05)",
            marginBottom: 18,
            fontSize: 15,
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: 16,
            border: "none",
            borderRadius: 18,
            background:
              "linear-gradient(135deg,#FF8A00,#FFB347)",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          登录
        </button>

        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: 16,
              color: "#FF8A00",
              fontWeight: 600,
            }}
          >
            {message}
          </p>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: 18,
            color: "#999",
            fontSize: 13,
          }}
        >
          DOMIHOOD 张奕然粉丝社区
        </p>
      </div>
    </main>
  );
}