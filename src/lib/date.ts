/**
 * JST（日本標準時）での「現在の年」を返す。
 * サーバー（Cloudflare Workers）はUTCで動作するため、+9時間して年を取り出す。
 * 日本語ページのtitle・descriptionに「【2026年】」のように年を含める用途で使う。
 */
export function getCurrentYearJST(): number {
  return new Date(Date.now() + 9 * 3600 * 1000).getUTCFullYear();
}
