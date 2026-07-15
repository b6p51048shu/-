// sitemap をビルド時に静的ファイルとして生成するスクリプト。
//
// 背景: 旧 src/app/sitemap.ts は毎リクエスト Worker 上で動的生成しており、
//       約16,000 URL・XML 16.5MB に達した現在、Cloudflare Workers の CPU/メモリ制限に
//       断続的に到達して sitemap.xml が 503 を返す事故が発生していた（GSC「取得できませんでした」）。
// 対策: ビルド時に public/sitemap.xml（サイトマップインデックス）と
//       public/sitemaps/sitemap-<n>.xml（実体チャンク、1ファイル5,000URL以下）を静的生成する。
//       これにより本番配信は静的アセットになり Worker CPU 消費ゼロになる。
//
// 出力URL集合・priority・changeFrequency・hreflang alternates は、
// 旧 src/app/sitemap.ts と完全一致させること（増減があってはならない）。
// データソースは旧実装と同じ:
//   - public/data/ward-index.json
//   - public/data/ward-slug-index.json
//   - src/data/items.ts の GOMI_ITEMS
//   - src/lib/i18n.ts の LOCALES
//
// 使い方: node scripts/generate-sitemaps.mjs
// package.json の build / build:cloudflare の前段で自動実行される。

import { readFileSync, writeFileSync, mkdirSync, unlinkSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import * as esbuild from "esbuild";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(__dirname, "..");
const DATA_DIR = join(APP_DIR, "public", "data");
const PUBLIC_DIR = join(APP_DIR, "public");
const SITEMAPS_DIR = join(PUBLIC_DIR, "sitemaps");

const BASE = "https://gominohi.com";
const CHUNK_SIZE = 5000; // Google推奨上限50,000より十分小さく、5MB制限にも余裕を持たせる

// ── LOCALES / GOMI_ITEMS を実ソース(TS)から取得 ─────────────────────
// items.ts / i18n.ts を esbuild で一時バンドルして require する。
// (JSONの静的importだけでは items.ts の中身は取れないため。旧 sitemap.ts と
//  完全に同じデータソースを使うことで URL 集合のズレを防ぐ。)
function loadTsExports(entryFile) {
  const result = esbuild.buildSync({
    entryPoints: [entryFile],
    bundle: true,
    platform: "node",
    format: "cjs",
    write: false,
    absWorkingDir: APP_DIR,
    alias: { "@": join(APP_DIR, "src") },
  });
  const code = result.outputFiles[0].text;
  const mod = { exports: {} };
  const req = createRequire(import.meta.url);
  const fn = new Function("module", "exports", "require", code);
  fn(mod, mod.exports, req);
  return mod.exports;
}

const { GOMI_ITEMS } = loadTsExports(join(APP_DIR, "src", "data", "items.ts"));
const { LOCALES } = loadTsExports(join(APP_DIR, "src", "lib", "i18n.ts"));

// ── データ読み込み ──────────────────────────────────────────
const wardIndex = JSON.parse(readFileSync(join(DATA_DIR, "ward-index.json"), "utf-8"));
const wardSlugIndex = JSON.parse(readFileSync(join(DATA_DIR, "ward-slug-index.json"), "utf-8"));

// ── 旧 sitemap.ts と同じロジックで entries を組み立てる ─────────────
const buildDate = new Date();

function buildAlternates(path) {
  const languages = {
    ja: `${BASE}${path}`,
    "x-default": `${BASE}${path}`,
  };
  for (const locale of LOCALES) {
    languages[locale] = `${BASE}/${locale}${path}`;
  }
  return { languages };
}

function entriesForPath(path, priority, changeFrequency) {
  const alternates = buildAlternates(path);
  const result = [
    { url: `${BASE}${path}`, lastModified: buildDate, priority, changeFrequency, alternates },
  ];
  for (const locale of LOCALES) {
    result.push({
      url: `${BASE}/${locale}${path}`,
      lastModified: buildDate,
      priority,
      changeFrequency,
      alternates,
    });
  }
  return result;
}

function buildEntries() {
  const wardNames = Object.keys(wardIndex);

  const urls = [
    ...entriesForPath("/", 1.0, "monthly"),
    ...entriesForPath("/disclaimer/", 0.3, "monthly"),
    ...entriesForPath("/privacy/", 0.3, "monthly"),
    // お役立ちガイド（4言語: ja/en/ko/zh）
    ...entriesForPath("/guide/", 0.6, "monthly"),
    ...entriesForPath("/guide/funyohin-hiyo/", 0.7, "monthly"),
    // 引越しゴミ記事（日本語のみ）
    {
      url: `${BASE}/guide/hikkoshi-gomi/`,
      lastModified: buildDate,
      priority: 0.7,
      changeFrequency: "monthly",
    },
    // 粗大ごみシール記事（日本語のみ）
    {
      url: `${BASE}/guide/sodaigomi-seal/`,
      lastModified: buildDate,
      priority: 0.7,
      changeFrequency: "monthly",
    },
    // 日本語のみのguide記事
    ...[
      "gyousha-erabikata",
      "reizouko-sentakuki",
      "ihin-seiri",
      "jikka-katazuke",
      "gomi-yashiki",
      "aircon-cleaning",
    ].map((slug) => ({
      url: `${BASE}/guide/${slug}/`,
      lastModified: buildDate,
      priority: 0.7,
      changeFrequency: "monthly",
    })),
    // 運営者情報（日本語のみ）
    {
      url: `${BASE}/about/`,
      lastModified: buildDate,
      priority: 0.3,
      changeFrequency: "monthly",
    },
    // 品目辞典（日本語のみ）
    {
      url: `${BASE}/items/`,
      lastModified: buildDate,
      priority: 0.8,
      changeFrequency: "monthly",
    },
    ...GOMI_ITEMS.map((item) => ({
      url: `${BASE}/items/${item.slug}/`,
      lastModified: buildDate,
      priority: 0.7,
      changeFrequency: "monthly",
    })),
  ];

  // 県トップページ（日本語のみ・データのある県だけ掲載）
  const prefsWithData = new Set();
  for (const wardName of wardNames) {
    const pref = wardSlugIndex[wardIndex[wardName]?.slug]?.pref;
    if (pref) prefsWithData.add(pref);
  }
  for (const pref of prefsWithData) {
    urls.push({
      url: `${BASE}/${pref}/`,
      lastModified: buildDate,
      priority: 0.8,
      changeFrequency: "monthly",
    });
  }

  for (const wardName of wardNames) {
    const info = wardIndex[wardName];
    if (!info) continue;
    const ws = info.slug;
    const pref = wardSlugIndex[ws]?.pref;
    if (!pref) continue;

    // 区ページ
    urls.push(...entriesForPath(`/${pref}/${ws}/`, 0.8, "monthly"));

    // 粗大ごみの出し方ページ（4言語、詳細データがある自治体のみ公開）
    if (info.has_oversized) {
      urls.push(...entriesForPath(`/${pref}/${ws}/sodaigomi/`, 0.7, "monthly"));
    }

    // 地域ページ
    for (const a of info.areas) {
      urls.push(...entriesForPath(`/${pref}/${ws}/${a.slug}/`, 0.6, "monthly"));
    }
  }

  return urls;
}

// ── XML シリアライズ（Next.js の sitemap.ts 出力形式に完全準拠） ────
function escapeXml(s) {
  // loc は要素テキスト、href は "..." 属性値なので、どちらも ' はエスケープ不要
  // (Next.js の sitemap.ts が出力する実際のXMLもエスケープしていないため、それに合わせる)
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function serializeUrlEntry(e) {
  let xml = `<url>\n<loc>${escapeXml(e.url)}</loc>\n`;
  if (e.alternates?.languages) {
    for (const [hreflang, href] of Object.entries(e.alternates.languages)) {
      xml += `<xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}" />\n`;
    }
  }
  xml += `<lastmod>${e.lastModified.toISOString()}</lastmod>\n`;
  xml += `<changefreq>${e.changeFrequency}</changefreq>\n`;
  xml += `<priority>${e.priority}</priority>\n`;
  xml += `</url>\n`;
  return xml;
}

function serializeUrlset(entries) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
  for (const e of entries) xml += serializeUrlEntry(e);
  xml += `</urlset>\n`;
  return xml;
}

function serializeSitemapIndex(chunkFiles) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const file of chunkFiles) {
    xml += `<sitemap>\n<loc>${BASE}/sitemaps/${file}</loc>\n<lastmod>${buildDate.toISOString()}</lastmod>\n</sitemap>\n`;
  }
  xml += `</sitemapindex>\n`;
  return xml;
}

// ── 実行 ────────────────────────────────────────────────
const entries = buildEntries();

mkdirSync(SITEMAPS_DIR, { recursive: true });

const chunkFiles = [];
const report = [];
for (let i = 0; i * CHUNK_SIZE < entries.length; i++) {
  const chunk = entries.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
  const fileName = `sitemap-${i}.xml`;
  const xml = serializeUrlset(chunk);
  writeFileSync(join(SITEMAPS_DIR, fileName), xml, "utf-8");
  chunkFiles.push(fileName);
  report.push({ file: fileName, urls: chunk.length, bytes: Buffer.byteLength(xml, "utf-8") });
}

// 前回より枚数が減った場合に備え、チャンク数を超える古い sitemap-<n>.xml を個別削除する
// (ディレクトリごと rmSync すると Windows 環境で稀に不安定になったため、ファイル単位で削除する)
const staleFilePattern = /^sitemap-(\d+)\.xml$/;
for (const f of readdirSync(SITEMAPS_DIR)) {
  const m = f.match(staleFilePattern);
  if (m && Number(m[1]) >= chunkFiles.length) {
    unlinkSync(join(SITEMAPS_DIR, f));
  }
}

writeFileSync(join(PUBLIC_DIR, "sitemap.xml"), serializeSitemapIndex(chunkFiles), "utf-8");

console.log(`sitemap生成完了: 合計 ${entries.length} URL / ${chunkFiles.length} チャンク`);
for (const r of report) {
  console.log(`  ${r.file}: ${r.urls} URL, ${(r.bytes / 1024 / 1024).toFixed(2)} MB`);
}
console.log(`public/sitemap.xml (サイトマップインデックス) を生成しました`);
