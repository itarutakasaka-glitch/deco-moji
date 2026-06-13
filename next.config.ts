import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 全静的書き出し（Vercelでも他ホストでも動く形）
  // output: "export", // 必要なら有効化（その場合は動的rewriteなど制限あり）
  poweredByHeader: false,
  async redirects() {
    return [
      // 旧URL（占い前面の初期版）→ ごみ収集日カレンダーへ恒久リダイレクト
      { source: "/trash-fortune", destination: "/trash-day", permanent: true },
      {
        source: "/trash-fortune/:path*",
        destination: "/trash-day/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
