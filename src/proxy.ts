import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// 大文字小文字の吸収に必要なのは slug 情報だけなので、全区一括の ward-data.json(約1MB)では
// なく軽量な ward-index.json(約140KB)を読む。proxy は全リクエストで動くため、
// バンドルサイズ・初期化コストの削減が Worker の負荷軽減に直結する。
import wardIndexRaw from "../public/data/ward-index.json";
import { PREFS } from "./lib/prefs";
import { secondsUntilJstMidnight } from "./lib/date";

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

// ─────────────────────────────────────────────
// キャッシュ制御（Cache-Control）
//
// 背景: エリアページは「今日/明日は何ゴミの日」を表示する（getTodayGarbage/getTomorrowGarbage
// が new Date() を使用）。単純に長時間キャッシュすると日付が変わっても「昨日の“今日”」が
// 表示され続け、住民に誤情報を配ることになる。そのため s-maxage は
// 「JSTの当日23:59:59まで」の残り秒数（secondsUntilJstMidnight）を使い、日付境界で必ず失効させる。
//
// 区ページ・県トップ・粗大ごみページ・品目ページは実装を確認した結果、
// いずれも new Date() 等の日付依存表示を持たない（区/県トップ・粗大ごみ・品目ページの
// generateMetadata/Page 実装を精査済み。getCurrentYearJST() による年表示のみで、
// 年が変わるのは年1回・数時間のズレ許容は無害）。よって数時間の固定TTLでキャッシュしてよい。
// ─────────────────────────────────────────────

type CacheableKind = "area" | "ward" | "prefTop" | "sodaigomi" | "items";

/** 区・県トップ・粗大ごみ・品目ページの固定TTL（秒）。日付依存表示が無いため数時間キャッシュしてよい。 */
const LONG_TTL_SECONDS = 6 * 60 * 60; // 6時間

/**
 * pathname からページ種別を判定する（キャッシュ方針の決定用）。
 * ロケールプレフィックス（/en /ko /zh）は無視して判定する。
 */
function classifyForCache(pathname: string): CacheableKind | null {
  const localeMatch = pathname.match(/^\/(en|ko|zh)(\/.*)?$/i);
  const rest = localeMatch ? (localeMatch[2] ?? "/") : pathname;

  // /items/ ・ /items/{item}/ （ロケール非対応の独立ルート）
  if (/^\/items\/?$/.test(rest)) return "items";
  if (/^\/items\/[^/]+\/?$/.test(rest)) return "items";

  const segments = rest.split("/").filter(Boolean);
  if (segments.length === 0 || segments.length > 3) return null;

  const prefCanonical = prefByLower.get(segments[0].toLowerCase());
  if (!prefCanonical) return null;

  if (segments.length === 1) return "prefTop";
  if (segments.length === 2) return "ward";
  // segments.length === 3
  return segments[2].toLowerCase() === "sodaigomi" ? "sodaigomi" : "area";
}

/** ページ種別ごとの Cache-Control 値を返す（対象外なら null＝変更しない） */
function cacheControlFor(kind: CacheableKind | null): string | null {
  switch (kind) {
    case "area":
      // 「今日/明日」表示があるため JST日付境界で必ず失効させる。
      // stale-while-revalidate は日付境界をまたいで古い「今日」を配布するリスクがあるため付けない。
      return `public, s-maxage=${secondsUntilJstMidnight()}, must-revalidate`;
    case "ward":
    case "prefTop":
    case "sodaigomi":
    case "items":
      // 日付依存表示なし → 固定TTL＋SWRで長めにキャッシュ可能
      return `public, s-maxage=${LONG_TTL_SECONDS}, stale-while-revalidate=${LONG_TTL_SECONDS}`;
    default:
      return null;
  }
}

/** レスポンスに、パス種別に応じた Cache-Control を付与する（対象外パスは何もしない） */
function withCacheControl(response: NextResponse, pathname: string): NextResponse {
  const kind = classifyForCache(pathname);
  const value = cacheControlFor(kind);
  if (value) response.headers.set("Cache-Control", value);
  return response;
}

/**
 * 大文字小文字を吸収し、キャッシュ可能なページに適切な Cache-Control を付与する Proxy。
 * 例: /tokyo/shibuya/shibuya-1~-3/ や /Tokyo/SHIBUYA/Shibuya-1~-3/ など、
 * 大文字小文字が違うURLでも、内部的に正準URLに rewrite してページを表示する。
 * （ブラウザのアドレスバーは変更されない＝ユーザーが入力したURLが保たれる）
 *
 * 対応県: PREFS の許可リスト（Tokyo/Kanagawa/Saitama/Chiba）
 * 対応ロケール: なし（日本語）、en、ko、zh
 * ※ 県トップ（/tokyo/ 等・区セグメント無し）は従来どおり rewrite しない
 *   （/Tokyo/ のみ正準。現行の大文字小文字挙動を変えないため）。
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // layout.tsx で <html lang> を動的に設定するため、pathname をヘッダーに乗せる
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  const passThrough = () =>
    withCacheControl(NextResponse.next({ request: { headers: requestHeaders } }), pathname);

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
  return withCacheControl(
    NextResponse.rewrite(url, { request: { headers: requestHeaders } }),
    pathname
  );
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon|raccoon|.*\\.(?:ico|png|jpg|jpeg|svg|css|js|json|xml|txt)$).*)"],
};
