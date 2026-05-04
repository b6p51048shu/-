import type { MetadataRoute } from "next";
import { wardData, wardNames } from "@/lib/data";

export const dynamic = "force-static";

const BASE_URL = "https://gomicale.jp";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0, changeFrequency: "monthly" },
  ];

  for (const wardName of wardNames) {
    const info = wardData[wardName];
    if (!info) continue;
    urls.push({
      url: `${BASE_URL}/Tokyo/${info.ward_slug}`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "monthly",
    });
    for (const a of info.areas) {
      urls.push({
        url: `${BASE_URL}/Tokyo/${info.ward_slug}/${a.slug}`,
        lastModified: new Date(),
        priority: 0.7,
        changeFrequency: "monthly",
      });
    }
  }

  return urls;
}
