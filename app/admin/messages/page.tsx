"use client";

import { useEffect, useState } from "react";

type Message = {
  id: string;
  nickname: string;
  content: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] =
    useState<Message[]>([]);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const res = await fetch(
      "/api/messages/pending"
    );

    const data = await res.json();

    setMessages(data);
  }

  async function approve(id: string) {
    await fetch(
      "/api/messages/approve",
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

    loadMessages();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 40,
        background: "#FFF7EE",
      }}
    >
      <h1
        style={{
          color: "#FF8A00",
        }}
      >
        💌 留言审核
      </h1>

      {messages.length === 0 && (
        <p>暂无待审核留言</p>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 20,
            marginTop: 20,
          }}
        >
          <h3>{msg.nickname}</h3>

          <p>{msg.content}</p>

          <button
            onClick={() =>
              approve(msg.id)
            }
            style={{
              border: "none",
              background:
                "#FF8A00",
              color: "#fff",
              padding:
                "10px 16px",
              borderRadius: 12,
            }}
          >
            通过审核
          </button>
        </div>
      ))}
    </main>
  );
}