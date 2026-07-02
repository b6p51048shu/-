const SITE_URL = "https://gominohi.com";

/** BreadcrumbList 構造化データを生成する。path は先頭スラッシュ始まりの相対パス */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

/**
 * 同じ区内の近隣エリアを返す（内部リンク用）。
 * 一覧順で現在エリアの前後から count 件を取り、現在エリア自身は除く。
 */
export function nearbyAreas<T extends { slug: string }>(
  areas: T[],
  currentSlug: string,
  count = 10
): T[] {
  const idx = areas.findIndex((a) => a.slug === currentSlug);
  if (idx === -1) return [];
  const half = Math.floor(count / 2);
  const start = Math.max(0, Math.min(idx - half, areas.length - count - 1));
  return areas.slice(start, start + count + 1).filter((a) => a.slug !== currentSlug);
}
