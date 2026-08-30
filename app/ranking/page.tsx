"use client";

import {
  useEffect,
  useState,
} from "react";

type User = {
  id: string;
  nickname: string;
  avatar_url?: string;
  title?: string;
  points: number;
  level: number;
};

export default function RankingPage() {
  const [users, setUsers] =
    useState<User[]>([]);

  const [currentUserId,
    setCurrentUserId] =
    useState("");

  useEffect(() => {
    loadRanking();

    const user =
      JSON.parse(
        localStorage.getItem(
          "domihood_user"
        ) || "{}"
      );

    setCurrentUserId(
      user.id || ""
    );
  }, []);

  async function loadRanking() {
    const res =
      await fetch(
        "/api/ranking"
      );

    const data =
      await res.json();

    setUsers(data);
  }

  const top3 =
    users.slice(0, 3);

  const others =
    users.slice(3);

  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          "linear-gradient(180deg,#FFF7EE,#FFE8C9)",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin:
            "0 auto",
        }}
      >
        <h1
          style={{
            color:
              "#FF8A00",
            fontSize: 42,
            fontWeight: 900,
            textAlign:
              "center",
          }}
        >
          🏆 DOMI排行榜
        </h1>

        <p
          style={{
            textAlign:
              "center",
            color: "#888",
          }}
        >
          积分越高排名越靠前
        </p>

        {/* TOP3 */}
        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: 20,
            marginTop: 40,
          }}
        >
          {top3.map(
            (
              user,
              index
            ) => (
              <div
                key={
                  user.id
                }
                style={{
                  background:
                    "#fff",
                  borderRadius:
                    32,
                  padding:
                    30,
                  textAlign:
                    "center",
                  boxShadow:
                    "0 15px 40px rgba(0,0,0,.08)",
                  transform:
                    index === 0
                      ? "scale(1.05)"
                      : "none",
                }}
              >
                <div
                  style={{
                    fontSize:
                      48,
                  }}
                >
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : "🥉"}
                </div>

                <div
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius:
                      "50%",
                    margin:
                      "12px auto",
                    background:
                      "#FFE7C8",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    fontSize: 32,
                    fontWeight: 900,
                    color:
                      "#FF8A00",
                  }}
                >
                  {user.nickname
                    ?.charAt(
                      0
                    )
                    .toUpperCase()}
                </div>

                <h3>
                  {
                    user.nickname
                  }
                </h3>

                <div
                  style={{
                    color:
                      "#999",
                  }}
                >
                  {
                    user.title
                  }
                </div>

                <div
                  style={{
                    marginTop:
                      12,
                    color:
                      "#FF8A00",
                    fontWeight:
                      800,
                    fontSize: 24,
                  }}
                >
                  {user.points}
                </div>

                <div>
                  Lv.
                  {
                    user.level
                  }
                </div>
              </div>
            )
          )}
        </div>

        {/* 其他用户 */}
        <div
          style={{
            marginTop: 40,
            background:
              "#fff",
            borderRadius:
              30,
            overflow:
              "hidden",
          }}
        >
          {others.map(
            (
              user,
              index
            ) => (
              <div
                key={
                  user.id
                }
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "space-between",
                  padding:
                    "18px 24px",
                  borderBottom:
                    "1px solid #eee",
                  background:
                    user.id ===
                    currentUserId
                      ? "#FFF5E8"
                      : "#fff",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                    }}
                  >
                    #
                    {index +
                      4}
                  </div>

                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius:
                        "50%",
                      background:
                        "#FFE7C8",
                      display:
                        "flex",
                      justifyContent:
                        "center",
                      alignItems:
                        "center",
                      fontWeight: 900,
                      color:
                        "#FF8A00",
                    }}
                  >
                    {user.nickname
                      ?.charAt(
                        0
                      )
                      .toUpperCase()}
                  </div>

                  <div>
                    <div>
                      {
                        user.nickname
                      }
                    </div>

                    <div
                      style={{
                        color:
                          "#999",
                        fontSize: 13,
                      }}
                    >
                      {
                        user.title
                      }
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    textAlign:
                      "right",
                  }}
                >
                  <div
                    style={{
                      color:
                        "#FF8A00",
                      fontWeight:
                        800,
                    }}
                  >
                    {user.points}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color:
                        "#888",
                    }}
                  >
                    Lv.
                    {
                      user.level
                    }
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}