import type { MetadataRoute } from "next";
import { loadWardData } from "@/lib/data";
import { LOCALES } from "@/lib/i18n";

const BASE = "https://gominohi.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const wardData = await loadWardData();
  const wardNames = Object.keys(wardData);

  const urls: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,    lastModified: new Date(), priority: 1.0, changeFrequency: "monthly" },
    ...LOCALES.map(locale => ({
      url: `${BASE}/${locale}/`,
      lastModified: new Date(),
      priority: 1.0,
      changeFrequency: "monthly" as const,
    })),
  ];

  for (const wardName of wardNames) {
    const info = wardData[wardName];
    if (!info) continue;
    const ws = info.ward_slug;

    // 区ページ（JA + 全ロケール）
    urls.push({ url: `${BASE}/Tokyo/${ws}/`,    lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" });
    for (const locale of LOCALES) {
      urls.push({ url: `${BASE}/${locale}/Tokyo/${ws}/`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" });
    }

    // 地域ページ（JA + 全ロケール）
    for (const a of info.areas) {
      urls.push({ url: `${BASE}/Tokyo/${ws}/${a.slug}/`,    lastModified: new Date(), priority: 0.6, changeFrequency: "monthly" });
      for (const locale of LOCALES) {
        urls.push({ url: `${BASE}/${locale}/Tokyo/${ws}/${a.slug}/`, lastModified: new Date(), priority: 0.6, changeFrequency: "monthly" });
      }
    }
  }

  return urls;
}
