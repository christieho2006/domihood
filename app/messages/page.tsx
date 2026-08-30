"use client";

import { useEffect, useState } from "react";

type Message = {
  id: string;
  nickname: string;
  content: string;
};

export default function MessagesPage() {
  const [messages, setMessages] =
    useState<Message[]>([]);

  const [content, setContent] =
    useState("");

  const [nickname, setNickname] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    const user =
      localStorage.getItem(
        "domihood_user"
      );

    if (user) {
      setNickname(
        JSON.parse(user).nickname
      );
    }

    loadMessages();
  }, []);

  async function loadMessages() {
    const res =
      await fetch("/api/messages");

    const data =
      await res.json();

    setMessages(data);
  }

  async function submitMessage() {
    if (!content.trim()) {
      setMessage("请输入留言内容");
      return;
    }

    try {
      const res =
        await fetch(
          "/api/messages",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              nickname,
              content,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        setMessage(
          data.error || "发送失败"
        );
        return;
      }

      setMessage(
        "留言成功，等待审核 ❤️"
      );

      setContent("");
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
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        {/* 顶部Banner */}
        <section
          style={{
            background:
              "linear-gradient(135deg,#FF8A00,#FFB347)",
            borderRadius: 36,
            padding: "50px 40px",
            color: "#fff",
            boxShadow:
              "0 30px 60px rgba(255,138,0,.25)",
            marginBottom: 30,
          }}
        >
          <h1
            style={{
              fontSize: 48,
              fontWeight: 900,
              margin: 0,
            }}
          >
            💌 DOMI留言墙
          </h1>

          <p
            style={{
              marginTop: 14,
              fontSize: 18,
              opacity: 0.95,
            }}
          >
            留下想对张奕然说的话
          </p>
        </section>

        {/* 留言输入 */}
        <div
          style={{
            background:
              "rgba(255,255,255,.75)",
            backdropFilter:
              "blur(25px)",
            borderRadius: 30,
            padding: 28,
            boxShadow:
              "0 20px 50px rgba(0,0,0,.08)",
            border:
              "1px solid rgba(255,255,255,.5)",
            marginBottom: 30,
          }}
        >
          <textarea
            value={content}
            onChange={(e) =>
              setContent(
                e.target.value
              )
            }
            placeholder="今天也会继续支持张奕然..."
            rows={5}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              resize: "none",
              padding: 20,
              borderRadius: 20,
              background: "#fff",
              fontSize: 15,
              boxShadow:
                "inset 0 2px 10px rgba(0,0,0,.04)",
            }}
          />

          <button
            onClick={
              submitMessage
            }
            style={{
              width: "100%",
              marginTop: 18,
              padding: 16,
              border: "none",
              borderRadius: 18,
              background:
                "linear-gradient(135deg,#FF8A00,#FFB347)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
              boxShadow:
                "0 10px 25px rgba(255,138,0,.25)",
            }}
          >
            发送留言
          </button>

          {message && (
            <p
              style={{
                marginTop: 14,
                textAlign:
                  "center",
                color:
                  "#FF8A00",
                fontWeight: 700,
              }}
            >
              {message}
            </p>
          )}
        </div>

        {/* 留言列表 */}
        <div
          style={{
            display: "grid",
            gap: 18,
          }}
        >
          {messages.map(
            (msg) => (
              <div
                key={msg.id}
                style={{
                  background:
                    "rgba(255,255,255,.85)",
                  backdropFilter:
                    "blur(20px)",
                  borderRadius: 28,
                  padding: 24,
                  border:
                    "1px solid rgba(255,255,255,.5)",
                  boxShadow:
                    "0 15px 35px rgba(0,0,0,.08)",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius:
                        "50%",
                      background:
                        "linear-gradient(135deg,#FF8A00,#FFB347)",
                      boxShadow:
                        "0 8px 20px rgba(255,138,0,.25)",
                    }}
                  />

                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 16,
                      }}
                    >
                      {msg.nickname}
                    </div>

                    <div
                      style={{
                        color:
                          "#999",
                        fontSize: 12,
                      }}
                    >
                      DOMIHOOD会员
                    </div>
                  </div>
                </div>

                <p
                  style={{
                    marginTop: 18,
                    color:
                      "#555",
                    lineHeight: 1.8,
                  }}
                >
                  {msg.content}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}
