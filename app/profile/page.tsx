"use client";

import {
  useEffect,
  useState,
} from "react";

export default function ProfilePage() {
  const [user, setUser] =
    useState<any>(null);

  const [message, setMessage] =
    useState("");

  const [days, setDays] =
    useState(0);

  const [points, setPoints] =
  useState(0);

  const [title, setTitle] =
    useState("新手养猪");

  useEffect(() => {
    const data =
      localStorage.getItem(
        "domihood_user"
      );

    if (data) {
      const currentUser =
        JSON.parse(data);

      setUser(
        currentUser
      );

      loadProfile(
        currentUser.nickname
      );
    }
  }, []);

  async function loadProfile(
    nickname: string
  ) {
    try {
      const res =
        await fetch(
          "/api/profile",
          {
            method:
              "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify(
                {
                  nickname,
                }
              ),
          }
        );

      const data =
        await res.json();

      setDays(data.days || 0);
setTitle(data.title || "新手养猪");
setPoints(data.points || 0);
    } catch {}
  }

  function handleCheckin() {
  window.location.href = "/checkin";
}

  function logout() {
    localStorage.removeItem(
      "domihood_user"
    );

    window.location.href =
      "/";
  }

  if (!user) {
    return (
      <main
        style={{
          minHeight:
            "100vh",
          display:
            "flex",
          justifyContent:
            "center",
          alignItems:
            "center",
          background:
            "#FFF7EE",
        }}
      >
        <div>
          <h2>
            请先登录
          </h2>

          <a href="/login">
            前往登录
          </a>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          "#FFF7EE",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin:
            "0 auto",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg,#FF8A00,#FFB347)",
            borderRadius:
              32,
            padding: 40,
            color: "#fff",
            boxShadow:
              "0 20px 50px rgba(255,138,0,.25)",
          }}
        >
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius:
                "50%",
              background:
                "#fff",
              color:
                "#FF8A00",
              fontSize: 36,
              fontWeight: 900,
              display:
                "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
            }}
          >
            {user.nickname
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          <h1
            style={{
              marginTop:
                20,
            }}
          >
            {
              user.nickname
            }
          </h1>

          <p>
            DOMIHOOD
            Member
          </p>
        </div>

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: 20,
            marginTop:
              24,
          }}
        >
          <InfoCard
            title="身份"
            value={
              user.role
            }
          />

          <InfoCard
            title="社区称号"
            value={
              title
            }
          />

          <InfoCard
            title="累计签到"
            value={`${days} 天`}
          />

          <InfoCard
            title="社区状态"
            value="活跃"
          />
        </div>

        <div
          style={{
            marginTop:
              24,
            display:
              "flex",
            gap: 12,
            flexWrap:
              "wrap",
          }}
        >
          <a href="/">
            <button
              style={
                buttonStyle
              }
            >
              返回首页
            </button>
          </a>

          <button
            onClick={
              handleCheckin
            }
            style={
              buttonStyle
            }
          >
            每日签到
          </button>

          <button
            onClick={
              logout
            }
            style={{
              ...buttonStyle,
              background:
                "#fff",
              color:
                "#FF8A00",
            }}
          >
            退出登录
          </button>
        </div>

        {message && (
          <div
            style={{
              marginTop:
                18,
              background:
                "#fff",
              borderRadius:
                16,
              padding: 16,
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
    </main>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background:
          "#fff",
        borderRadius:
          24,
        padding: 24,
        boxShadow:
          "0 10px 30px rgba(0,0,0,.06)",
      }}
    >
      <div
        style={{
          color:
            "#999",
          fontSize: 14,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop:
            10,
          fontSize: 24,
          fontWeight:
            800,
        }}
      >
        {value}
      </div>
    </div>
  );
}

const buttonStyle = {
  border: "none",
  borderRadius: "16px",
  padding:
    "14px 22px",
  background:
    "linear-gradient(135deg,#FF8A00,#FFB347)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};