/**
 * 都道府県の許可リスト（多県対応の基盤）。
 *
 * URL 上の県スラッグ（/Tokyo/... /Kanagawa/...）はこのリストにあるものだけを公開する。
 * 新しい県を追加するときは、ここに追加した上で
 * src/app/{Pref}/ と src/app/[locale]/{Pref}/ に薄いラッパーページ一式を作る
 * （既存の Kanagawa 等のディレクトリをコピーするだけでよい。実装は共有コンポーネント側にある）。
 *
 * ※ Next.js は同一構造のルートで異なる動的セグメント名を許さないため
 *   （app/[locale] と app/[pref] が衝突・E912）、[pref] 動的セグメントではなく
 *   「許可リスト＋県ごとの静的ディレクトリ」方式を採用している。
 *   許可外の県（/Osaka/ 等）はルートが存在しないため自然に 404 になる。
 */
export const PREFS = {
  Tokyo: "東京都",
  Kanagawa: "神奈川県",
  Saitama: "埼玉県",
  Chiba: "千葉県",
} as const;

export type PrefSlug = keyof typeof PREFS;

export const PREF_SLUGS = Object.keys(PREFS) as PrefSlug[];

export function isValidPref(s: string): s is PrefSlug {
  return Object.prototype.hasOwnProperty.call(PREFS, s);
}

/** 県スラッグ → 表示名（例: Tokyo → 東京都）。許可外は null */
export function prefName(slug: string): string | null {
  return isValidPref(slug) ? PREFS[slug] : null;
}
