import type { MetadataRoute } from "next";
import { wardData, wardNames } from "@/lib/data";

export const dynamic = "force-static";

const BASE = "https://gominohi.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,    lastModified: new Date(), priority: 1.0, changeFrequency: "monthly" },
    { url: `${BASE}/en/`, lastModified: new Date(), priority: 1.0, changeFrequency: "monthly" },
  ];

  for (const wardName of wardNames) {
    const info = wardData[wardName];
    if (!info) continue;
    const ws = info.ward_slug;

    // 区ページ（JP・EN）
    urls.push({ url: `${BASE}/Tokyo/${ws}/`,    lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" });
    urls.push({ url: `${BASE}/en/Tokyo/${ws}/`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" });

    // 地域ページ（JP・EN）
    for (const a of info.areas) {
      urls.push({ url: `${BASE}/Tokyo/${ws}/${a.slug}/`,    lastModified: new Date(), priority: 0.6, changeFrequency: "monthly" });
      urls.push({ url: `${BASE}/en/Tokyo/${ws}/${a.slug}/`, lastModified: new Date(), priority: 0.6, changeFrequency: "monthly" });
    }
  }

  return urls;
}
