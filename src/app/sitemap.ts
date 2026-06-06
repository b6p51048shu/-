import type { MetadataRoute } from "next";
import { loadWardData } from "@/lib/data";
import { LOCALES } from "@/lib/i18n";

// ビルド時の事前生成を無効化（APP_ORIGIN はビルド時には未設定のため fetch が失敗する）
// リクエスト時に動的生成する
export const dynamic = "force-dynamic";

const BASE = "https://gominohi.com";

/**
 * 指定パス（日本語の正準パス）に対する全言語版の hreflang マップを生成する。
 * 例: path="/Tokyo/Chiyoda/" → { ja: ..., en: ..., ko: ..., zh: ..., "x-default": ... }
 */
function buildAlternates(path: string): { languages: Record<string, string> } {
  const languages: Record<string, string> = {
    ja: `${BASE}${path}`,
    "x-default": `${BASE}${path}`,
  };
  for (const locale of LOCALES) {
    languages[locale] = `${BASE}/${locale}${path}`;
  }
  return { languages };
}

/** 1つの正準パスにつき、全言語版の sitemap エントリを生成する */
function entriesForPath(
  path: string,
  priority: number,
  changeFrequency: "monthly",
): MetadataRoute.Sitemap {
  const alternates = buildAlternates(path);
  const lastModified = new Date();
  const result: MetadataRoute.Sitemap = [
    { url: `${BASE}${path}`, lastModified, priority, changeFrequency, alternates },
  ];
  for (const locale of LOCALES) {
    result.push({
      url: `${BASE}/${locale}${path}`,
      lastModified,
      priority,
      changeFrequency,
      alternates,
    });
  }
  return result;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const wardData = await loadWardData();
  const wardNames = Object.keys(wardData);

  const urls: MetadataRoute.Sitemap = [
    ...entriesForPath("/", 1.0, "monthly"),
    ...entriesForPath("/disclaimer/", 0.3, "monthly"),
    ...entriesForPath("/privacy/", 0.3, "monthly"),
  ];

  for (const wardName of wardNames) {
    const info = wardData[wardName];
    if (!info) continue;
    const ws = info.ward_slug;

    // 区ページ
    urls.push(...entriesForPath(`/Tokyo/${ws}/`, 0.8, "monthly"));

    // 地域ページ
    for (const a of info.areas) {
      urls.push(...entriesForPath(`/Tokyo/${ws}/${a.slug}/`, 0.6, "monthly"));
    }
  }

  return urls;
}
