// middleware（エッジ）バンドルの肥大化を検知してビルドを止めるガード。
//
// なぜ必要か（2026-08-17の本番障害）:
//   middleware.ts が 322KB の ward-index.json を import し、全105自治体・約5,400エリア分の
//   Map をモジュール初期化時に構築していた。middleware は全リクエストで動くため、この
//   初期化コストが Workers 無料プランの起動時CPU上限に当たり、**全ページ種別の約4%が
//   503 (Cloudflare error code 1102)** を返す状態になった。Googlebot も6日間これを踏み、
//   検索順位が落ちた。
//
// 設計方針:
//   「静かに壊れて数%が503」より「ビルドが失敗して本番が前の正常版のまま」の方が安全。
//   よってビルドを非ゼロ終了させる。閾値を超えたら middleware.ts の import を疑うこと。
//
// 実測値の目安: 修正後のエッジバンドル合計 = 約145KB（2026-08-17時点）
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const EDGE_DIR = ".next/server/edge";
const LIMIT_KB = 250; // 実測145KBに対して余裕を持たせた閾値

function walk(dir) {
  let files = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return files; // エッジバンドルが無い構成ならスキップ
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) files = files.concat(walk(p));
    else if (e.name.endsWith(".js")) files.push(p);
  }
  return files;
}

const files = walk(EDGE_DIR);
if (files.length === 0) {
  console.log(`[edge-guard] ${EDGE_DIR} が見つからないためスキップします`);
  process.exit(0);
}

const sized = files
  .map((f) => ({ f, kb: statSync(f).size / 1024 }))
  .sort((a, b) => b.kb - a.kb);
const totalKb = sized.reduce((s, x) => s + x.kb, 0);

console.log(`[edge-guard] エッジバンドル合計: ${totalKb.toFixed(1)}KB / 上限 ${LIMIT_KB}KB`);
for (const { f, kb } of sized.slice(0, 3)) {
  console.log(`[edge-guard]   ${kb.toFixed(1)}KB  ${f}`);
}

if (totalKb > LIMIT_KB) {
  console.error(
    `\n[edge-guard] ❌ エッジバンドルが上限を超えました（${totalKb.toFixed(1)}KB > ${LIMIT_KB}KB）。\n` +
      `middleware.ts に重いデータを import していませんか？\n` +
      `middleware は全リクエストで動くため、大きなJSONのimportやモジュール初期化時の\n` +
      `大量Map構築は Workers の起動時CPU上限に当たり、本番の数%が503(error 1102)になります。\n` +
      `→ 2026-08-17の障害と同じ原因です。src/middleware.ts 冒頭のコメントを読んでください。\n`
  );
  process.exit(1);
}
console.log("[edge-guard] ✅ OK");
