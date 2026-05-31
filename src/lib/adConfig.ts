// ─────────────────────────────────────────────────────────
// A8.net アフィリエイト広告設定
// 不用品回収プログラム (株式会社FireWorks / s00000022947004)
// ─────────────────────────────────────────────────────────
//
// 設定方法:
// 1. A8の管理画面で「広告リンク作成」→「テキストリンク」を選択
// 2. 生成された <a href="..."> から URL を抜き出して AD_HREF に貼る
// 3. <img src="..."> のインプレッション計測ピクセルがあれば AD_IMP_PIXEL に貼る
//
// URL 未設定（REPLACE_ME のまま）の場合、広告は自動的に非表示になります。
// ─────────────────────────────────────────────────────────

/** アフィリエイトリンク先URL（A8から取得） */
export const AD_HREF = "https://example.com/REPLACE_ME";

/** インプレッション計測ピクセル URL（A8から取得、なければ null） */
export const AD_IMP_PIXEL: string | null = null;

/** URLが未設定かを判定（広告表示制御用） */
export function isAdConfigured(): boolean {
  return !AD_HREF.includes("REPLACE_ME") && AD_HREF.startsWith("http");
}
