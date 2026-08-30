"use client";

import {
  useEffect,
  useState,
  useRef,
} from "react";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [announcements, setAnnouncements] =
  useState<any[]>([]);
  const [ranking, setRanking] =
  useState<any[]>([]);
  const [stats, setStats] =
  useState({
    fans: 0,
    checkins: 0,
    points: 0,
  });

  useEffect(() => {
  const savedUser =
    localStorage.getItem("domihood_user");

  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }

  loadAnnouncements();
  loadRanking();
  loadStats();
}, []);

async function loadAnnouncements() {
  try {
    const res = await fetch(
      "/api/announcements"
    );

    const data = await res.json();

    setAnnouncements(data);
  } catch (err) {
    console.error(err);
  }
}
async function loadRanking() {
  try {
    const res = await fetch(
      "/api/ranking?limit=5"
    );

    const data = await res.json();

    setRanking(data);
  } catch (err) {
    console.error(err);
  }
}
async function loadStats() {
  try {
    const res =
      await fetch("/api/stats");

    const data =
      await res.json();

    setStats(data);
  } catch (err) {
    console.error(err);
  }
}


  function logout() {
    localStorage.removeItem("domihood_user");
    window.location.reload();
  }

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background: "#FFF7EE",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Hero Banner */}
          <section
            style={{
              background:
                "linear-gradient(135deg,#FF8A00,#FFB347)",
              borderRadius: "32px",
              padding: "60px 40px",
              color: "white",
              boxShadow:
                "0 20px 50px rgba(255,138,0,.25)",
            }}
          >



            <h1
              style={{
                fontSize: "64px",
                fontWeight: 900,
                margin: 0,
              }}
            >
              DOMIHOOD
            </h1>

            <p
              style={{
                fontSize: "20px",
                marginTop: "12px",
                opacity: 0.95,
              }}
            >
              张奕然粉丝社区
            </p>

            <p
              style={{
                marginTop: "20px",
                maxWidth: "600px",
                lineHeight: 1.7,
              }}
            >
              任务打卡 · 素材存档 · 留言互动
            </p>

            {/* 登录状态区域 */}
            <div
              style={{
                marginTop: 28,
                background:
                  "rgba(255,255,255,.12)",
                backdropFilter: "blur(20px)",
                borderRadius: 28,
                padding: 28,
                border:
                  "1px solid rgba(255,255,255,.15)",
              }}
            >
              {user ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 20,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        opacity: 0.85,
                        letterSpacing: 2,
                        textTransform:
                          "uppercase",
                      }}
                    >
                      DOMIHOOD MEMBER
                    </div>

                    <h2
                      style={{
                        margin: "8px 0",
                        fontSize: 34,
                        fontWeight: 900,
                        color: "#fff",
                      }}
                    >
                      {user.nickname}
                    </h2>

                    <p
                      style={{
                        margin: 0,
                        opacity: 0.95,
                        color: "#fff",
                      }}
                    >
                      欢迎回家 ✦ 张奕然粉丝社区
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                    }}
                  >
                    <a
                      href="/profile"
                      style={{
                        textDecoration:
                          "none",
                      }}
                    >
                      <button
                        style={{
                          border: "none",
                          borderRadius: 16,
                          padding:
                            "14px 22px",
                          cursor: "pointer",
                          fontWeight: 700,
                          background:
                            "#fff",
                          color:
                            "#FF8A00",
                        }}
                      >
                        个人中心
                      </button>
                    </a>

                    <button
                      onClick={logout}
                      style={{
                        border: "none",
                        borderRadius: 16,
                        padding:
                          "14px 22px",
                        cursor: "pointer",
                        fontWeight: 700,
                        background:
                          "#FFF3E0",
                        color:
                          "#FF8A00",
                      }}
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  <h3>
                    欢迎来到 DOMIHOOD
                  </h3>

                  <p>
                    登录后参与签到、任务与社区互动
                  </p>

                  <a
                    href="/login"
                    style={{
                      textDecoration:
                        "none",
                    }}
                  >
                    <button
                      style={{
                        marginTop: 12,
                        padding:
                          "14px 26px",
                        border: "none",
                        borderRadius: 16,
                        fontWeight: 700,
                        cursor: "pointer",
                        background:
                          "#fff",
                        color:
                          "#FF8A00",
                      }}
                    >
                      立即登录
                    </button>
                  </a>
                </div>
              )}
            </div>
          </section>

{/* 数据统计 */}
<div
  style={{
    marginTop: 24,
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",
    gap: 16,
  }}
>
  <StatCard
  icon=""
  title="注册粉丝"
  value={stats.fans}
/>

<StatCard
  icon=""
  title="签到天数"
  value={stats.checkins}
/>

<StatCard
  icon=""
  title="DOMI积分"
  value={stats.points}
/>
</div>

{/* 功能区 */}

<div
  style={{
    background:
      "rgba(255,255,255,.95)",
    borderRadius: 24,
    padding: 24,
    boxShadow:
      "0 10px 30px rgba(0,0,0,.08)",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent:
        "space-between",
      alignItems: "center",
      marginBottom: 20,
    }}
  >
    <h3
      style={{
        margin: 0,
        color: "#FF8A00",
      }}
    >
      🏆 粉丝排行榜
    </h3>

    <a
      href="/ranking"
      style={{
        color: "#FF8A00",
        textDecoration:
          "none",
        fontWeight: 700,
      }}
    >
      全部 →
    </a>
  </div>

  {ranking.length === 0 ? (
    <p style={{ color: "#666" }}>
      暂无数据
    </p>
  ) : (
    ranking.map(
      (item, index) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            padding:
              "12px 16px",
            marginBottom: 10,
            borderRadius: 16,

            background:
              index === 0
                ? "linear-gradient(135deg,#FFD700,#FFB800)"
                : index === 1
                ? "linear-gradient(135deg,#EAEAEA,#D7D7D7)"
                : index === 2
                ? "linear-gradient(135deg,#D68C5A,#B56A3E)"
                : "#F7F7F7",

            color:
              index < 3
                ? "#fff"
                : "#333",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems:
                "center",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
              }}
            >
              {index === 0
                ? "🥇"
                : index === 1
                ? "🥈"
                : index === 2
                ? "🥉"
                : `#${index + 1}`}
            </div>

            <div>
              {item.nickname}
            </div>
          </div>

          <div
            style={{
              fontWeight: 900,
            }}
          >
            {item.points}分
          </div>
        </div>
      )
    )
  )}
</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(280px,1fr))",
              gap: "20px",
              marginTop: "24px",
            }}
          >
            <div
  style={{
    background:
      "rgba(255,255,255,.9)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,.08)",
  }}
>
  <h3>📢 最新动态</h3>

  {announcements.length === 0 ? (
    <p style={{ color: "#666" }}>
      暂无公告
    </p >
  ) : (
    announcements
      .slice(0, 3)
      .map((item) => (
        <div
          key={item.id}
          style={{
            marginTop: 16,
            paddingTop: 12,
            borderTop:
              "1px solid #eee",
          }}
        >
          <div
            style={{
              fontWeight: 700,
            }}
          >
            {item.title}
          </div>

          <p
            style={{
              color: "#666",
              marginTop: 8,
            }}
          >
            {item.content}
          </p >

          <div
            style={{
              fontSize: 12,
              color: "#999",
            }}
          >
            {new Date(
              item.created_at
            ).toLocaleDateString()}
          </div>
        </div>
      ))
  )}
</div>

            <Card
              title="✅ 今日任务"
              desc="完成每日应援任务"
            />

            <a
  href="/gallery"
  style={{
    textDecoration: "none",
    color: "inherit",
  }}
>
  <Card
    title="📁 素材库"
    desc="舞台 / 机场 / 官方物料"
  />
</a>

            <div
  style={{
    background:
      "rgba(255,255,255,.9)",
    borderRadius: 24,
    padding: 24,
    boxShadow:
      "0 10px 30px rgba(0,0,0,.08)",
  }}
>
  <h3>💌 留言墙</h3>

  <p
    style={{
      color: "#666",
    }}
  >
    来自粉丝们的留言
  </p>

  <a
    href="/messages"
    style={{
      color: "#FF8A00",
      textDecoration: "none",
      fontWeight: 700,
    }}
  >
    查看全部留言 →
  </a>
</div>
          </div>
        </div>
      </main>

      <BottomNav />
    </>
  );
}

function Card({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div
      style={{
        background:
          "rgba(255,255,255,.9)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        padding: "24px",
        boxShadow:
          "0 10px 30px rgba(0,0,0,.08)",
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
  );
}
function CountUp({
  end,
  duration = 1500,
}: {
  end: number;
  duration?: number;
}) {
  const [count, setCount] =
    useState(0);

  const frame =
    useRef<number | null>(null);

  useEffect(() => {
    const startTime =
      performance.now();

    const animate = (
      currentTime: number
    ) => {
      const progress = Math.min(
        (currentTime - startTime) /
          duration,
        1
      );

      setCount(
        Math.floor(progress * end)
      );

      if (progress < 1) {
        frame.current =
          requestAnimationFrame(
            animate
          );
      }
    };

    frame.current =
      requestAnimationFrame(
        animate
      );

    return () => {
      if (frame.current !== null) {
        cancelAnimationFrame(
          frame.current
        );
      }
    };
  }, [end, duration]);

  return (
    <>{count.toLocaleString()}</>
  );
}
function StatCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: number;
}) {
  return (
    <div
      style={{
        background:
          "rgba(255,255,255,.95)",

        borderRadius: 24,

        padding: 18,

        minHeight: 120,

        display: "flex",

        flexDirection: "column",

        justifyContent:
          "space-between",

        boxShadow:
          "0 10px 30px rgba(0,0,0,.06)",

        border:
          "1px solid rgba(255,255,255,.6)",

        transition: ".25s",
      }}
    >
      <div
        style={{
          fontSize: 24,
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            color: "#999",
            fontSize: 13,
            marginBottom: 6,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: "#FF8A00",
          }}
        >
          <CountUp end={value} />
        </div>
      </div>
    </div>
  );
}