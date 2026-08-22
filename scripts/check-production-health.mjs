// 本番の 5xx（特に Cloudflare error 1102 = Worker のリソース超過）を検知する監視スクリプト。
// GitHub Actions から6時間ごとに実行され、異常を検知すると非ゼロ終了して
// ワークフローを失敗させる（= GitHub から自動でメール通知が飛ぶ）。
//
// なぜ必要か（2026-08-17の障害）:
//   本番の約4%がランダムに503を返す状態が6日間続き、Googlebot がそれを踏んで
//   検索順位が落ちた。当時もローカルPCのタスクスケジューラに週次監視はあったが、
//   PCの電源都合で実行されず、失敗しても誰にも通知されないまま4週間沈黙していた。
//   → 監視はPCに依存させない。異常は必ず通知する。
//
// 検知設計:
//   障害は「毎回落ちる」のではなく「一定確率で落ちる」ため、1ページ1回では見逃す。
//   多数のURLを1回ずつ叩いて全体の失敗率で判断する（120件・失敗率4%なら検知確率99%超）。
//   ネットワーク由来の単発失敗で誤報を出さないよう、失敗は1度リトライし、
//   確定失敗が FAIL_THRESHOLD 件以上のときだけ異常とみなす。
import { readFileSync } from "node:fs";

const SITE = "https://gominohi.com";
const CONCURRENCY = 6;
const FAIL_THRESHOLD = 2; // 確定失敗がこの件数以上で異常とみなす（単発の通信エラーを無視するため）

const slugIndex = JSON.parse(
  readFileSync("public/data/ward-slug-index.json", "utf-8")
);

// 監視対象: 固定の重要ページ ＋ 全105自治体の区市ページ
const urls = [
  "/",
  "/Tokyo/",
  "/items/",
  "/items/futon/",
  "/guide/hikkoshi-gomi/",
  "/sitemap.xml",
  "/robots.txt",
];
for (const [slug, info] of Object.entries(slugIndex)) {
  urls.push(`/${info.pref ?? "Tokyo"}/${slug}/`);
}

async function fetchStatus(path) {
  try {
    const res = await fetch(SITE + path, {
      headers: { "User-Agent": "gominohi-health-check/1.0" },
      redirect: "follow",
    });
    return res.status;
  } catch {
    return 0; // 接続不能
  }
}

async function run() {
  const failures = [];
  let checked = 0;
  const queue = [...urls];

  async function worker() {
    for (;;) {
      const path = queue.shift();
      if (path === undefined) return;
      let code = await fetchStatus(path);
      if (code !== 200) {
        // 単発の通信エラーを誤検知しないよう1度だけ再試行
        await new Promise((r) => setTimeout(r, 1000));
        code = await fetchStatus(path);
      }
      checked++;
      if (code !== 200) failures.push({ path, code });
    }
  }

  await Promise.all(
    Array.from({ length: CONCURRENCY }, () => worker())
  );

  const rate = ((failures.length / checked) * 100).toFixed(1);
  console.log(`検査: ${checked}件 / 失敗: ${failures.length}件 (${rate}%)`);
  for (const f of failures) console.log(`  [${f.code}] ${SITE}${f.path}`);

  if (failures.length >= FAIL_THRESHOLD) {
    const has5xx = failures.some((f) => f.code >= 500 || f.code === 0);
    console.error(
      `\n❌ 本番に異常があります（確定失敗 ${failures.length}件 / ${checked}件中 = ${rate}%）。\n` +
        (has5xx
          ? "5xx が出ています。Cloudflare error 1102（Worker のリソース超過）の疑いが濃厚です。\n" +
            "確認: middleware.ts に重いデータを import していないか／区ページの描画が重すぎないか。\n" +
            "2026-08-17と同じ障害なら、放置するとGooglebotが踏んで検索順位が落ちます。\n"
          : "4xx が出ています。ルーティングかデータの不整合を確認してください。\n")
    );
    process.exit(1);
  }
  console.log("✅ 正常");
}

run();
