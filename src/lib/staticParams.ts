// 静的エクスポート用の generateStaticParams 共通実装。
// 4県（Tokyo/Kanagawa/Saitama/Chiba）で同じロジックのため、ここに集約し
// 各 src/app/{Pref}/[ward]/... の page.tsx は薄いラッパー（1〜3行）にする。
//
// データソース:
//   - public/data/ward-slug-index.json … ward_slug → {name, pref} の逆引き（105件・極小）
//   - public/data/ward-index.json      … 区市名 → {slug, areas[], has_oversized, ...}（区一覧・地域一覧）
//
// いずれもビルド時にNode.jsのfsで直接読む（next.config.ts の output:"export" 実行時は
// generateStaticParams もビルドプロセス内で動くため、src/lib/data.ts と同様 fs 読みでよい）。

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { PrefSlug } from "./prefs";

type WardSlugIndexEntry = { name: string; pref: string };
type WardIndexAreaEntry = { slug: string };
type WardIndexEntry = {
  slug: string;
  areas: WardIndexAreaEntry[];
  has_bags?: boolean;
  has_oversized?: boolean;
};

function readJson<T>(relPath: string): T {
  const filePath = join(process.cwd(), "public", "data", relPath);
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

let _wardSlugIndex: Record<string, WardSlugIndexEntry> | null = null;
function wardSlugIndex(): Record<string, WardSlugIndexEntry> {
  if (!_wardSlugIndex) {
    _wardSlugIndex = readJson<Record<string, WardSlugIndexEntry>>("ward-slug-index.json");
  }
  return _wardSlugIndex;
}

let _wardIndex: Record<string, WardIndexEntry> | null = null;
function wardIndex(): Record<string, WardIndexEntry> {
  if (!_wardIndex) {
    _wardIndex = readJson<Record<string, WardIndexEntry>>("ward-index.json");
  }
  return _wardIndex;
}

/** 指定県に属する ward_slug 一覧（区市名は問わない） */
function wardSlugsForPref(pref: PrefSlug): string[] {
  const idx = wardSlugIndex();
  return Object.keys(idx).filter((slug) => idx[slug].pref === pref);
}

/** /{pref}/[ward]/page.tsx 用: 当該県の全区市 */
export function wardParamsFor(pref: PrefSlug): { ward: string }[] {
  return wardSlugsForPref(pref).map((ward) => ({ ward }));
}

/** /{pref}/[ward]/sodaigomi/page.tsx 用: 当該県のうち粗大ごみ詳細データがある区市のみ */
export function sodaigomiParamsFor(pref: PrefSlug): { ward: string }[] {
  const slugs = new Set(wardSlugsForPref(pref));
  const wIndex = wardIndex();
  return Object.values(wIndex)
    .filter((info) => slugs.has(info.slug) && info.has_oversized)
    .map((info) => ({ ward: info.slug }));
}

/** /{pref}/[ward]/[area]/page.tsx 用: 当該県の全区市 × 全地域 */
export function areaParamsFor(pref: PrefSlug): { ward: string; area: string }[] {
  const slugs = new Set(wardSlugsForPref(pref));
  const wIndex = wardIndex();
  const params: { ward: string; area: string }[] = [];
  for (const info of Object.values(wIndex)) {
    if (!slugs.has(info.slug)) continue;
    for (const a of info.areas) {
      params.push({ ward: info.slug, area: a.slug });
    }
  }
  return params;
}
