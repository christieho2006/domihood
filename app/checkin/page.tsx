"use client";

import { useEffect, useState } from "react";

export default function CheckinPage() {
  const [records, setRecords] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const user = JSON.parse(
      localStorage.getItem(
        "domihood_user"
      ) || "{}"
    );

    if (!user.id) return;

    const res = await fetch(
      `/api/checkin/history?userId=${user.id}`
    );

    const data = await res.json();

    setRecords(
      data.map(
        (item: any) =>
          item.checkin_date
      )
    );
  }

  async function checkin() {
    const user = JSON.parse(
      localStorage.getItem(
        "domihood_user"
      ) || "{}"
    );

    if (!user.id) {
      alert("请重新登录");
      return;
    }

    setLoading(true);

    const res = await fetch(
      "/api/checkin",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      }
    );

    const data =
      await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("签到成功 🎉 DOMI +5");

    loadHistory();
  }

  const now = new Date();

  const year =
    now.getFullYear();

  const month =
    now.getMonth();

  const days =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#FFF7EE,#FFE7C8)",
        padding: 30,
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        {/* 顶部卡片 */}
        <div
          style={{
            background:
              "linear-gradient(135deg,#FF8A00,#FFB347)",
            borderRadius: 30,
            padding: 40,
            color: "#fff",
            boxShadow:
              "0 20px 50px rgba(255,138,0,.25)",
          }}
        >
            <div
  style={{
    display: "flex",
    gap: 12,
    marginTop: 20,
    marginBottom: 24,
  }}
>
  <a
    href="/"
    style={{
      textDecoration: "none",
    }}
  >
    <button
      style={{
        border: "none",
        borderRadius: 14,
        padding: "12px 20px",
        background: "#fff",
        color: "#FF8A00",
        fontWeight: 700,
        cursor: "pointer",
        boxShadow:
          "0 8px 20px rgba(0,0,0,.06)",
      }}
    >
      ← 返回首页
    </button>
  </a>
</div>
          <h1
            style={{
              margin: 0,
              fontSize: 42,
              fontWeight: 900,
            }}
          >
            🔥 每日签到
          </h1>

        

          <p
            style={{
              marginTop: 10,
              opacity: 0.9,
            }}
          >
            签到获取DOMI积分 · 点亮签到日历
          </p >

          {/* 按钮区域 */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 24,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={checkin}
              disabled={loading}
              style={{
                border: "none",
                borderRadius: 16,
                padding:
                  "14px 28px",
                background:
                  "#fff",
                color:
                  "#FF8A00",
                fontWeight: 800,
                cursor:
                  "pointer",
                fontSize: 16,
              }}
            >
              {loading
                ? "签到中..."
                : "✅ 立即签到"}
            </button>

            <a
  href=" "
  target="_blank"
  rel="noreferrer"
>
  <button
    style={{
      background: "#ff8200",
      color: "#fff",
      border: "none",
      borderRadius: 12,
      padding: "14px 28px",
      cursor: "pointer",
      fontWeight: 700,
    }}
  >
    🔥超话签到
  </button>
</a>
          </div>
        </div>

        {/* 日历 */}
        <div
          style={{
            background: "#fff",
            borderRadius: 30,
            padding: 30,
            marginTop: 30,
            boxShadow:
              "0 10px 30px rgba(0, 0, 0, 0.06)",
          }}
        >
          <h2
            style={{
              color: "#FF8A00",
              marginBottom: 20,
            }}
          >
            📅 {year}年{month + 1}月签到记录
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(7,1fr)",
              gap: 12,
            }}
          >
            {Array.from({
              length: days,
            }).map((_, i) => {
              const day = i + 1;

              const date =
                `${year}-${String(
                  month + 1
                ).padStart(
                  2,
                  "0"
                )}-${String(
                  day
                ).padStart(
                  2,
                  "0"
                )}`;

              const checked =
                records.includes(
                  date
                );

              return (
                <div
                  key={day}
                  style={{
                    height: 60,
                    borderRadius: 18,
                    background:
                      checked
                        ? "linear-gradient(135deg,#FF8A00,#FFB347)"
                        : "#F5F5F5",
                    color:
                      checked
                        ? "#fff"
                        : "#555",
                    display:
                      "flex",
                    justifyContent:
                      "center",
                    alignItems:
                      "center",
                    fontWeight: 800,
                    fontSize: 18,
                    transition:
                      ".2s",
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 20,
              color: "#888",
            }}
          >
            🟧 已签到 
            ⬜ 未签到
          </div>
        </div>
      </div>
    </main>
  );
}