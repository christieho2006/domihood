import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DOMIHOOD · 浮空小岛",
  description: "把喜欢的日子，安放在一座小岛上。一个可以慢慢长大的童话世界。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
