import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// 大文字小文字の吸収に必要なのは slug 情報だけなので、全区一括の ward-data.json(約1MB)では
// なく軽量な ward-index.json(約140KB)を読む。middleware は全リクエストで動くため、
// バンドルサイズ・初期化コストの削減が Worker の負荷軽減に直結する。
import wardIndexRaw from "../public/data/ward-index.json";
import { PREFS } from "./lib/prefs";

type WardLite = { slug: string; areas: Array<{ slug: string }> };
const wardIndex = wardIndexRaw as unknown as Record<string, WardLite>;

// 小文字化した県slug → 正準県slug（例: tokyo → Tokyo）
const prefByLower = new Map<string, string>(
  Object.keys(PREFS).map((p) => [p.toLowerCase(), p])
);

// 小文字化したward_slug → 正準（データに格納されている）ward_slug
const wardSlugByLower = new Map<string, string>();
// ward_slug(小文字) → 小文字化したarea slug → 正準area slug
const areaSlugByLowerByWard = new Map<string, Map<string, string>>();

for (const info of Object.values(wardIndex)) {
  const wardLower = info.slug.toLowerCase();
  wardSlugByLower.set(wardLower, info.slug);
  const areaMap = new Map<string, string>();
  for (const area of info.areas) {
    areaMap.set(area.slug.toLowerCase(), area.slug);
  }
  areaSlugByLowerByWard.set(wardLower, areaMap);
}

/**
 * 大文字小文字を吸収するミドルウェア。
 * 例: /tokyo/shibuya/shibuya-1~-3/ や /Tokyo/SHIBUYA/Shibuya-1~-3/ など、
 * 大文字小文字が違うURLでも、内部的に正準URLに rewrite してページを表示する。
 * （ブラウザのアドレスバーは変更されない＝ユーザーが入力したURLが保たれる）
 *
 * 対応県: PREFS の許可リスト（Tokyo/Kanagawa/Saitama/Chiba）
 * 対応ロケール: なし（日本語）、en、ko、zh
 * ※ 県トップ（/tokyo/ 等・区セグメント無し）は従来どおり rewrite しない
 *   （/Tokyo/ のみ正準。現行の大文字小文字挙動を変えないため）。
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // layout.tsx で <html lang> を動的に設定するため、pathname をヘッダーに乗せる
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  const passThrough = () => NextResponse.next({ request: { headers: requestHeaders } });

  // /(en|ko|zh)/{pref}/{ward}/[area]/ または /{pref}/{ward}/[area]/ を大文字小文字無視でマッチ
  const match = pathname.match(/^(\/(en|ko|zh))?\/([^/]+)\/([^/]+)(?:\/([^/]+))?\/?$/i);
  if (!match) return passThrough();

  const localePrefix = match[1] ?? "";   // "/en", "/ko", "/zh", or ""
  const prefInUrl = match[3];
  const wardSlugInUrl = match[4];
  const areaSlugInUrl = match[5];
  const hasTrailingSlash = pathname.endsWith("/");

  // 許可リスト外の先頭セグメント（/guide/... /items/... 等）はそのまま通す
  const prefCanonical = prefByLower.get(prefInUrl.toLowerCase());
  if (!prefCanonical) return passThrough();

  const wardLower = wardSlugInUrl.toLowerCase();
  const wardCanonical = wardSlugByLower.get(wardLower);
  if (!wardCanonical) return passThrough(); // 該当区なし→自然に404へ

  let areaCanonical: string | undefined;
  if (areaSlugInUrl) {
    const areaLower = areaSlugInUrl.toLowerCase();
    areaCanonical = areaSlugByLowerByWard.get(wardLower)?.get(areaLower);
    if (!areaCanonical) return passThrough(); // 該当エリアなし→自然に404へ
  }

  // 正準パスを構築
  let canonicalPath = `${localePrefix}/${prefCanonical}/${wardCanonical}`;
  if (areaCanonical) canonicalPath += `/${areaCanonical}`;
  if (hasTrailingSlash) canonicalPath += "/";

  // 既に正準ならスルー
  if (canonicalPath === pathname) {
    return passThrough();
  }

  // 内部 rewrite（アドレスバーは変わらず、内部で正準ルートにマッチ）
  url.pathname = canonicalPath;
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon|raccoon|.*\\.(?:ico|png|jpg|jpeg|svg|css|js|json|xml|txt)$).*)"],
};
