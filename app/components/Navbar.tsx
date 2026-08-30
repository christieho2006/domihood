"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
} from "next/navigation";

export default function Navbar() {
  const pathname =
    usePathname();

  const [user, setUser] =
    useState<any>(null);

  const [mobile, setMobile] =
    useState(false);

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "domihood_user"
      );

    if (saved) {
      setUser(
        JSON.parse(saved)
      );
    }

    const checkScreen = () => {
      setMobile(
        window.innerWidth < 768
      );
    };

    checkScreen();

    window.addEventListener(
      "resize",
      checkScreen
    );

    return () =>
      window.removeEventListener(
        "resize",
        checkScreen
      );
  }, []);

  const navs = [
    {
      name: "首页",
      href: "/",
    },
    {
      name: "任务",
      href: "/tasks",
    },
    {
      name: "素材库",
      href: "/gallery",
    },
    {
      name: "留言墙",
      href: "/messages",
    },
    {
      name: "排行",
      href: "/ranking",
    },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 12,
        zIndex: 99999,
        padding: "0 16px",
      }}
    >
      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",

          height: 72,

          display: "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          padding:
            "0 20px",

          borderRadius: 999,

          background:
            "rgba(255,255,255,.72)",

          backdropFilter:
            "blur(24px)",

          border:
            "1px solid rgba(255,255,255,.4)",

          boxShadow:
            "0 10px 40px rgba(0,0,0,.08)",
        }}
      >
        {/* Logo */}

        <Link
          href="/"
          style={{
            textDecoration:
              "none",
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
                width: 44,
                height: 44,

                borderRadius:
                  "50%",

                background:
                  "linear-gradient(135deg,#FF8A00,#FFB347)",

                display: "flex",

                justifyContent:
                  "center",

                alignItems:
                  "center",

                color: "#fff",

                fontWeight: 900,
              }}
            >
              D
            </div>

            <div>
              <div
                style={{
                  color:
                    "#FF8A00",

                  fontWeight: 900,

                  fontSize: 22,
                }}
              >
                DOMIHOOD
              </div>

              {!mobile && (
                <div
                  style={{
                    color:
                      "#999",
                    fontSize: 11,
                  }}
                >
                  张奕然粉丝社区
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* 电脑端导航 */}

        {!mobile && (
          <nav
            style={{
              display:
                "flex",
              gap: 8,
            }}
          >
            {navs.map(
              (item) => (
                <Link
                  key={item.href}
                  href={
                    item.href
                  }
                  style={{
                    textDecoration:
                      "none",

                    color:
                      pathname ===
                      item.href
                        ? "#fff"
                        : "#444",

                    background:
                      pathname ===
                      item.href
                        ? "linear-gradient(135deg,#FF8A00,#FFB347)"
                        : "transparent",

                    padding:
                      "10px 18px",

                    borderRadius:
                      999,

                    fontWeight: 700,
                  }}
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>
        )}

        {/* 用户 */}

        <Link
          href={
            user
              ? "/profile"
              : "/login"
          }
          style={{
            textDecoration:
              "none",
          }}
        >
          <div
            style={{
              width: mobile
                ? 42
                : "auto",

              height: 42,

              borderRadius:
                999,

              background:
                "#fff",

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              padding:
                mobile
                  ? 0
                  : "0 16px",

              boxShadow:
                "0 4px 16px rgba(0,0,0,.06)",
            }}
          >
            {mobile
              ? "👤"
              : user
              ? user.nickname
              : "登录"}
          </div>
        </Link>
      </div>
    </header>
  );
}