"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    {
      href: "/",
      icon: "",
      label: "首页",
    },
    {
      href: "/checkin",
      icon: "",
      label: "签到",
    },
    {
      href: "/gallery",
      icon: "",
      label: "素材",
    },
    {
      href: "/messages",
      icon: "",
      label: "留言",
    },
    {
      href: "/profile",
      icon: "",
      label: "我的",
    },
  ];

  return (
    <>
      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;

          height: 74px;

          background: rgba(255,255,255,.95);

          backdrop-filter: blur(30px);

          border-top:
            1px solid #eee;

          display: flex;

          justify-content: space-around;

          align-items: center;

          z-index: 9999;
        }

        .item {
          flex: 1;

          height: 100%;

          display: flex;

          flex-direction: column;

          justify-content: center;

          align-items: center;

          text-decoration: none;

          transition: .2s;
        }

        .icon {
          font-size: 22px;
        }

        .text {
          margin-top: 4px;

          font-size: 12px;

          font-weight: 700;
        }

        .active {
          color: #FF8A00;
        }

        .inactive {
          color: #777;
        }

        @media (min-width: 768px) {
          .bottom-nav {
            display: none;
          }
        }
      `}</style>

      <div className="bottom-nav">
        {items.map((item) => {
          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`item ${
                active
                  ? "active"
                  : "inactive"
              }`}
            >
              <div className="icon">
                {item.icon}
              </div>

              <div className="text">
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}