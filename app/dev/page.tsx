"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  nickname: string;
  role: string;
  title: string;
  status: string;
};

export default function DevPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const userStr =
      localStorage.getItem("domihood_user");

    if (!userStr) {
      window.location.href = "/login";
      return;
    }

    const user = JSON.parse(userStr);

    if (user.role !== "developer") {
      window.location.href = "/";
      return;
    }

    loadUsers();
  }, []);

  async function loadUsers() {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  }

  async function changeRole(
    userId: string,
    role: string
  ) {
    const res = await fetch(
      "/api/users/promote",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          userId,
          role,
        }),
      }
    );

    if (res.ok) {
      loadUsers();
    }
  }

  async function changeStatus(
    userId: string,
    status: string
  ) {
    const res = await fetch(
      "/api/users/status",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          userId,
          status,
        }),
      }
    );

    if (res.ok) {
      loadUsers();
    }
  }

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
            fontSize: 40,
            fontWeight: 900,
            marginBottom: 10,
          }}
        >
          DOMIHOOD 开发者后台
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: 30,
            fontSize: 18,
          }}
        >
          用户总数：{users.length}
        </p>

        <div
  style={{
    display: "flex",
    gap: 12,
    marginBottom: 24,
    flexWrap: "wrap",
  }}
>
  <a href=" ">
    <button
      style={{
        border: "none",
        borderRadius: 14,
        padding: "12px 18px",
        background: "#FF8A00",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      📢 发布公告
    </button>
  </a >

  <a href="/">
    <button
      style={{
        border: "none",
        borderRadius: 14,
        padding: "12px 18px",
        background: "#fff",
        color: "#FF8A00",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      返回首页
    </button>
  </a >
</div>

        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: 24,
            boxShadow:
              "0 10px 30px rgba(0,0,0,.08)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  align="left"
                  style={{
                    padding: 12,
                  }}
                >
                  昵称
                </th>

                <th
                  align="left"
                  style={{
                    padding: 12,
                  }}
                >
                  身份
                </th>

                <th
                  align="left"
                  style={{
                    padding: 12,
                  }}
                >
                  称号
                </th>

                <th
                  align="left"
                  style={{
                    padding: 12,
                  }}
                >
                  状态
                </th>

                <th
                  align="left"
                  style={{
                    padding: 12,
                  }}
                >
                  操作
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  style={{
                    borderTop:
                      "1px solid #eee",
                  }}
                >
                  <td
                    style={{
                      padding: 12,
                    }}
                  >
                    {user.nickname}
                  </td>

                  <td
                    style={{
                      padding: 12,
                    }}
                  >
                    {user.role}
                  </td>

                  <td
                    style={{
                      padding: 12,
                    }}
                  >
                    {user.title}
                  </td>

                  <td
                    style={{
                      padding: 12,
                    }}
                  >
                    {user.status}
                  </td>

                  <td
                    style={{
                      padding: 12,
                    }}
                  >
                    {user.role ===
                      "fan" && (
                      <button
                        onClick={() =>
                          changeRole(
                            user.id,
                            "admin"
                          )
                        }
                      >
                        设为管理员
                      </button>
                    )}

                    {user.role ===
                      "admin" && (
                      <button
                        onClick={() =>
                          changeRole(
                            user.id,
                            "fan"
                          )
                        }
                      >
                        取消管理员
                      </button>
                    )}

                    {user.role ===
                      "developer" && (
                      <span>
                        开发者
                      </span>
                    )}

                    {"  "}

                    {user.role !==
                      "developer" &&
                      user.status ===
                        "active" && (
                        <button
                          onClick={() =>
                            changeStatus(
                              user.id,
                              "banned"
                            )
                          }
                          style={{
                            marginLeft:
                              10,
                          }}
                        >
                          封禁
                        </button>
                      )}

                    {user.role !==
                      "developer" &&
                      user.status ===
                        "banned" && (
                        <button
                          onClick={() =>
                            changeStatus(
                              user.id,
                              "active"
                            )
                          }
                          style={{
                            marginLeft:
                              10,
                          }}
                        >
                          解封
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}