/**
 * Next.js 16 が生成する __next.* RSC ペイロードファイルを削除する。
 * Cloudflare Pages の 20,000 ファイル制限に対応するため。
 * これらのファイルがなくても HTML は正常に表示される。
 * クライアントサイドナビゲーションは通常の遷移にフォールバックする。
 */
const fs = require("fs");
const path = require("path");

function clean(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.") || entry.name === "index.txt") {
      fs.rmSync(p, { recursive: true, force: true });
    } else if (entry.isDirectory()) {
      clean(p);
    }
  }
}

const outDir = path.join(__dirname, "..", "out");
if (!fs.existsSync(outDir)) {
  console.log("out/ ディレクトリが存在しません。スキップします。");
  process.exit(0);
}

console.log("🧹 __next.* ファイルを削除中...");
clean(outDir);

// 残りのファイル数をカウント
let count = 0;
function countFiles(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) countFiles(path.join(d, e.name));
    else count++;
  }
}
countFiles(outDir);
console.log(`✅ 削除完了。残りファイル数: ${count} (制限: 20,000)`);
if (count > 20000) {
  console.error(`❌ まだ ${count} ファイルあります。制限を超えています！`);
  process.exit(1);
}
