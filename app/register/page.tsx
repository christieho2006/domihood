"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister() {
    try {
      setMessage("");

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname,
          password,
          inviteCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "注册失败");
        return;
      }

      setMessage("注册成功！");

      setNickname("");
      setPassword("");
      setInviteCode("");
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
          张奕然粉丝社区
        </p>

        <input
          value={nickname}
          onChange={(e) =>
            setNickname(e.target.value)
          }
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
          onChange={(e) =>
            setPassword(e.target.value)
          }
          placeholder="初始密码 0915"
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
          value={inviteCode}
          onChange={(e) =>
            setInviteCode(e.target.value)
          }
          placeholder="邀请码（可选）"
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
          onClick={handleRegister}
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
          加入 DOMIHOOD
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
          首次注册请输入初始密码 0915
        </p>
      </div>
    </main>
  );
}