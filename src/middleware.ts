import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import wardDataRaw from "../public/data/ward-data.json";

type WardLite = { ward_slug: string; areas: Array<{ slug: string }> };
const wardData = wardDataRaw as unknown as Record<string, WardLite>;

// 小文字化したward_slug → 正準（データに格納されている）ward_slug
const wardSlugByLower = new Map<string, string>();
// ward_slug(小文字) → 小文字化したarea slug → 正準area slug
const areaSlugByLowerByWard = new Map<string, Map<string, string>>();

for (const info of Object.values(wardData)) {
  const wardLower = info.ward_slug.toLowerCase();
  wardSlugByLower.set(wardLower, info.ward_slug);
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
 * 対応ロケール: なし（日本語）、en、ko、zh
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // /(en|ko|zh)/tokyo/{ward}/[area]/ または /tokyo/{ward}/[area]/ を大文字小文字無視でマッチ
  const match = pathname.match(/^(\/(en|ko|zh))?\/tokyo\/([^/]+)(?:\/([^/]+))?\/?$/i);
  if (!match) return NextResponse.next();

  const localePrefix = match[1] ?? "";   // "/en", "/ko", "/zh", or ""
  const wardSlugInUrl = match[3];
  const areaSlugInUrl = match[4];
  const hasTrailingSlash = pathname.endsWith("/");

  const wardLower = wardSlugInUrl.toLowerCase();
  const wardCanonical = wardSlugByLower.get(wardLower);
  if (!wardCanonical) return NextResponse.next(); // 該当区なし→自然に404へ

  let areaCanonical: string | undefined;
  if (areaSlugInUrl) {
    const areaLower = areaSlugInUrl.toLowerCase();
    areaCanonical = areaSlugByLowerByWard.get(wardLower)?.get(areaLower);
    if (!areaCanonical) return NextResponse.next(); // 該当エリアなし→自然に404へ
  }

  // 正準パスを構築
  let canonicalPath = `${localePrefix}/Tokyo/${wardCanonical}`;
  if (areaCanonical) canonicalPath += `/${areaCanonical}`;
  if (hasTrailingSlash) canonicalPath += "/";

  // 既に正準ならスルー
  if (canonicalPath === pathname) {
    return NextResponse.next();
  }

  // 内部 rewrite（アドレスバーは変わらず、内部で正準ルートにマッチ）
  url.pathname = canonicalPath;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon|raccoon|.*\\.(?:ico|png|jpg|jpeg|svg|css|js|json|xml|txt)$).*)"],
};
