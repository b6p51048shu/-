import type { NextConfig } from "next";

// 静的エクスポート（output: "export"）に移行済み（2026-09 static-export移行）。
// SSR時代の headers() 設定は export では未対応のため削除し、public/_headers に移した
// （キャッシュ対象・値は同一。Cloudflare Workers 静的アセットが public/_headers を解釈する）。
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
