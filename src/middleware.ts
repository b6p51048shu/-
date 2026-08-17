// ⚠️ Next.js 16 では middleware は非推奨で proxy.ts が推奨（ビルド時に deprecation 警告が出る）。
// しかし本番は OpenNext(Cloudflare Workers) でビルドしており、OpenNext は
// 「Node.js ランタイムの proxy」を未対応（`ERROR Node.js middleware is not currently supported.
// Consider switching to Edge Middleware.` でビルドが落ちる）。
// proxy.ts は Node ランタイム固定で Edge にできない（docs: proxy の Runtime 節
// 「The `runtime` config option is not available in Proxy files. Setting the `runtime`
//  config option in Proxy will throw an error.」）。
// 一方 middleware.ts は暗黙 Edge ランタイムで動作し OpenNext 対応（今日まで本番稼働の実績あり）。
// よって OpenNext が Node ランタイムの proxy に対応するまでは、非推奨警告を承知の上で
// middleware.ts を維持する。
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// 🔴 ここに重いデータを import しないこと（2026-08-17 の本番障害の原因）
//
// 経緯: 以前は ward-index.json を読んでエリアslugの大文字小文字も吸収していた。
// しかしエリア拡大でこのファイルは 140KB → 322KB に膨張し、さらに全105自治体・
// 約5,400エリア分の Map をモジュール初期化時に構築していた。middleware は
// 全リクエストで動くため、このコストが Worker の起動時CPU上限に当たり、
// **全ページ種別の約4%が 503 (Cloudflare error code 1102 = Worker exceeded
// resource limits) を返す**状態になっていた（Googlebot もこれを踏んでいた）。
//
// 対策: middleware が読むのは区市slugの逆引きに必要な最小限だけにする。
// ward-slug-index.json は約5.7KB・105件で、初期化コストは無視できる。
// エリアslugの大文字小文字吸収は廃止した（正準URL以外は素直に404）。
// 廃止の根拠: GSCの上位1,000ページに小文字URLは1件も無く、検索流入はゼロだった。
// 存在しないエリアslugは areaPage.tsx の notFound() が従来どおり404にする。
import wardSlugIndexRaw from "../public/data/ward-slug-index.json";
import { PREFS } from "./lib/prefs";
import { secondsUntilJstMidnight } from "./lib/date";

// 小文字化した県slug → 正準県slug（例: tokyo → Tokyo）
const prefByLower = new Map<string, string>(
  Object.keys(PREFS).map((p) => [p.toLowerCase(), p])
);

// 小文字化したward_slug → 正準ward_slug（105件。小文字化しても衝突しないことを確認済み）
const wardSlugByLower = new Map<string, string>(
  Object.keys(wardSlugIndexRaw as Record<string, unknown>).map((slug) => [
    slug.toLowerCase(),
    slug,
  ])
);

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
 * 県slug・区市slugの大文字小文字を吸収し、キャッシュ可能なページに適切な Cache-Control を
 * 付与する Middleware。
 * 例: /tokyo/SHIBUYA/Shibuya-1~-3/ → /Tokyo/Shibuya/Shibuya-1~-3/ へ内部 rewrite。
 * ※ エリアslug（第3セグメント）の大文字小文字は吸収しない（上記の障害対策）。
 *   エリア部分は正準表記のみ有効で、それ以外は404になる。
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

  const wardCanonical = wardSlugByLower.get(wardSlugInUrl.toLowerCase());
  if (!wardCanonical) return passThrough(); // 該当区なし→自然に404へ

  // 正準パスを構築。
  // 第3セグメント（エリアslug / "sodaigomi"）は検証せずそのまま通す。
  // 存在しないエリアなら areaPage.tsx の notFound() が404を返す。
  let canonicalPath = `${localePrefix}/${prefCanonical}/${wardCanonical}`;
  if (areaSlugInUrl) canonicalPath += `/${areaSlugInUrl}`;
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
