import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n";
// sitemap は slug と area slug、粗大ごみページ有無しか必要としないため、
// 全区一括データ(約1MB)ではなく軽量な ward-index.json(約140KB)を静的importで使う。
import wardIndexRaw from "../../public/data/ward-index.json";

type WardIndexEntry = {
  slug: string;
  areas: Array<{ slug: string }>;
  has_oversized: boolean;
};
const wardIndex = wardIndexRaw as unknown as Record<string, WardIndexEntry>;

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

export default function sitemap(): MetadataRoute.Sitemap {
  const wardNames = Object.keys(wardIndex);

  const urls: MetadataRoute.Sitemap = [
    ...entriesForPath("/", 1.0, "monthly"),
    ...entriesForPath("/disclaimer/", 0.3, "monthly"),
    ...entriesForPath("/privacy/", 0.3, "monthly"),
    // お役立ちガイド（4言語: ja/en/ko/zh）
    ...entriesForPath("/guide/", 0.6, "monthly"),
    ...entriesForPath("/guide/funyohin-hiyo/", 0.7, "monthly"),
    // 引越しゴミ記事（日本語のみ）
    {
      url: `${BASE}/guide/hikkoshi-gomi/`,
      lastModified: new Date(),
      priority: 0.7,
      changeFrequency: "monthly",
    },
  ];

  for (const wardName of wardNames) {
    const info = wardIndex[wardName];
    if (!info) continue;
    const ws = info.slug;

    // 区ページ
    urls.push(...entriesForPath(`/Tokyo/${ws}/`, 0.8, "monthly"));

    // 粗大ごみの出し方ページ（4言語、詳細データがある自治体のみ公開）
    if (info.has_oversized) {
      urls.push(...entriesForPath(`/Tokyo/${ws}/sodaigomi/`, 0.7, "monthly"));
    }

    // 地域ページ
    for (const a of info.areas) {
      urls.push(...entriesForPath(`/Tokyo/${ws}/${a.slug}/`, 0.6, "monthly"));
    }
  }

  return urls;
}
