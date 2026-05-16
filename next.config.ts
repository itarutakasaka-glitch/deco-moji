import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 全静的書き出し（Vercelでも他ホストでも動く形）
  // output: "export", // 必要なら有効化（その場合は動的rewriteなど制限あり）
  poweredByHeader: false,
};

export default nextConfig;
