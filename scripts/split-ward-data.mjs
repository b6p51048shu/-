// ward-data.json（全区一括・約1MB）を区ごとのファイルに分割する。
// 目的: Cloudflare Workers が毎リクエストで 1MB を JSON.parse するのを避け、
//       必要な 1 区分（数十KB）だけ読む構成にして CPU/メモリ消費を削減する。
//
// 出力:
//   public/data/wards/{ward_slug}.json   … 1区分の WardInfo（ページ描画用）
//   public/data/ward-slug-index.json     … { [ward_slug]: 区市名 }（slug→名称の逆引き、極小）
//   public/data/ward-index.json          … 区市名 → { slug, areas, has_bags, has_oversized }（middleware/sitemap用）
//
// 使い方: node scripts/split-ward-data.mjs
// （generate_data.py からも同等の出力を行うため、データ再生成時は Python 側で自動生成される）

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "public", "data");
const WARDS_DIR = join(DATA_DIR, "wards");

const wardData = JSON.parse(readFileSync(join(DATA_DIR, "ward-data.json"), "utf-8"));

mkdirSync(WARDS_DIR, { recursive: true });

const slugIndex = {};   // ward_slug → 区市名
const index = {};       // 区市名 → { slug, areas, has_bags, has_oversized }

for (const [name, info] of Object.entries(wardData)) {
  const slug = info.ward_slug;

  // 区別ファイル（フル WardInfo）
  writeFileSync(
    join(WARDS_DIR, `${slug}.json`),
    JSON.stringify(info),
    "utf-8"
  );

  slugIndex[slug] = name;

  index[name] = {
    slug,
    areas: info.areas.map((a) => ({ name: a.area, slug: a.slug })),
    has_bags: Boolean(info.bags),
    has_oversized: Boolean(info.oversized_detail),
  };
}

writeFileSync(join(DATA_DIR, "ward-slug-index.json"), JSON.stringify(slugIndex), "utf-8");
writeFileSync(join(DATA_DIR, "ward-index.json"), JSON.stringify(index), "utf-8");

console.log(`✅ ${Object.keys(wardData).length} 区を分割しました`);
console.log(`   wards/*.json, ward-slug-index.json, ward-index.json を更新`);
