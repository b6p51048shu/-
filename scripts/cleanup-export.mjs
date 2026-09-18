// 静的エクスポート(out/)から、クライアントサイド遷移用の RSC プリフェッチペイロードを削除する。
//
// なぜ必要か（2026-09 static-export移行で判明した Next.js 16 の仕様）:
//   Next.js 16 の `output: "export"` は、App Router の各ルートについて
//   `index.html` だけでなく、クライアントルーター（<Link>の自動プリフェッチ・
//   Segment Cache）が使う RSC ペイロードも必ず書き出す:
//     - index.txt                … ページ全体のRSCペイロード
//     - __next.<segment>.txt 等  … セグメント単位のプリフェッチペイロード
//                                    （__next._tree.txt / __next._head.txt /
//                                      __next._index.txt / __next.__PAGE__.txt 等）
//     - __next.<Segment>/        … 上記を子セグメントごとに格納するディレクトリ
//   これは next.config.ts のオプションで無効化できない（Next.js側に該当フラグが存在しない。
//   node_modules/next/dist/export/index.js の書き出しロジックを確認済み）。
//
//   本サイトは全ページで next/link の <Link> を使わず素の <a href> でナビゲートしている
//   （`grep -r "from \"next/link\"" src` が0件）。つまりこれらのRSCペイロードは
//   ブラウザ側のクライアントルーターから一度も参照されない死重ファイルであり、
//   削除してもページの表示・機能に影響しない。
//
//   実測: 5,964ルートに対しHTML 5,964件に対しこの種のtxtファイルが約53,000件生成され、
//   out/ 直下の総ファイル数が Cloudflare Workers 静的アセットの上限(20,000件未満)を
//   大幅に超えてしまう。このスクリプトで削除することで対応する。
//
// 削除対象の見分け方（Next.js側の命名規則。詳細は node_modules/next/dist/export/index.js の
// RSC_SUFFIX('.rsc'→export時に.txtへリネーム)・RSC_SEGMENTS_DIR_SUFFIX('.segments')・
// RSC_SEGMENT_SUFFIX('.segment.rsc') とセグメントファイル名変換ロジックを参照）:
//   - ベース名が `index.txt` のファイル（`index.html` と同じディレクトリにあるRSCペイロード）
//   - ベース名が `__next.` で始まるファイル・ディレクトリ（セグメントプリフェッチペイロード）
// これ以外の .txt（public/robots.txt, public/ads.txt 等）やその他の静的アセットは一切触らない。

import { readdirSync, statSync, unlinkSync, rmdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "out");

let deletedFiles = 0;
let deletedDirs = 0;

function isSegmentCacheDir(name) {
  return name.startsWith("__next.") && !name.endsWith(".txt");
}

function isSegmentOrRscPayloadFile(name) {
  return name === "index.txt" || (name.startsWith("__next.") && name.endsWith(".txt"));
}

// 手動の再帰削除（readdir→unlink→rmdir）を使う。
// fs.rmSync(dir, { recursive: true, force: true }) は、このプロジェクトの環境
// （Windows / Node v24）で __next.<segment> ディレクトリ配下の `$d$` を含む
// ファイル名に対して実行すると、エラーもスタックトレースも出さずプロセスが
// 即終了する現象を実測で確認した（原因不明・Node側の問題の可能性が高い）ため、
// 確実に動作するこの手動実装を使う。
function removeDirRecursive(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      removeDirRecursive(full);
    } else {
      unlinkSync(full);
    }
  }
  rmdirSync(dir);
}

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const full = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (isSegmentCacheDir(entry.name)) {
        removeDirRecursive(full);
        deletedDirs++;
        continue;
      }
      walk(full);
      continue;
    }

    if (entry.isFile() && isSegmentOrRscPayloadFile(entry.name)) {
      unlinkSync(full);
      deletedFiles++;
    }
  }
}

let exists = true;
try {
  statSync(OUT_DIR);
} catch {
  exists = false;
}

if (!exists) {
  console.log(`[cleanup-export] ${OUT_DIR} が見つからないためスキップします`);
  process.exit(0);
}

walk(OUT_DIR);

console.log(
  `[cleanup-export] 未使用のRSCプリフェッチペイロードを削除しました: ファイル${deletedFiles}件・ディレクトリ${deletedDirs}件`
);
