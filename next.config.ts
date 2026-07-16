import type { NextConfig } from "next";

// 静的アセット（サイトマップ・データJSON）は、ビルド時にしか変わらないため長期キャッシュしてよい
// （日付依存の「今日/明日」表示を持つのはページ本体のCache-Control側であり、こちらの対象外）。
// 参照: node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/headers.md
//   「Headers are checked before the filesystem which includes pages and /public files.」
const STATIC_ASSET_CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=604800";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE_CONTROL }],
      },
      {
        source: "/sitemaps/:path*",
        headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE_CONTROL }],
      },
      {
        source: "/data/:path*",
        headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE_CONTROL }],
      },
    ];
  },
};

export default nextConfig;
