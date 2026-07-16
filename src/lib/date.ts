/**
 * JST（日本標準時）での「現在の年」を返す。
 * サーバー（Cloudflare Workers）はUTCで動作するため、+9時間して年を取り出す。
 * 日本語ページのtitle・descriptionに「【2026年】」のように年を含める用途で使う。
 */
export function getCurrentYearJST(): number {
  return new Date(Date.now() + 9 * 3600 * 1000).getUTCFullYear();
}

/**
 * JST（日本標準時）での「現在の曜日インデックス」を返す（0=日曜日 … 6=土曜日）。
 * サーバー（Cloudflare Workers）はUTCで動作するため、素の `new Date().getDay()` を使うと
 * JST 0:00〜8:59（＝UTCでは前日15:00〜23:59）の間だけ実際のJSTの日付と1日ズレて、
 * 誤った曜日（＝誤った「今日/明日は何ゴミの日」）を返してしまう。
 * getTodayGarbage/getTomorrowGarbage 等、「今日/明日」表示の根幹となる曜日取得は
 * 必ずこの関数を経由すること（素の new Date().getDay() を直接使わない）。
 */
export function getCurrentDayOfWeekJST(): number {
  return new Date(Date.now() + 9 * 3600 * 1000).getUTCDay();
}

/** 1日のミリ秒数 */
const MS_PER_DAY = 24 * 3600 * 1000;
/** JSTはUTC+9時間 */
const JST_OFFSET_MS = 9 * 3600 * 1000;

/**
 * 現在時刻から「JSTの当日23:59:59（=翌日0:00:00の直前）」までの残り秒数を返す。
 *
 * エリアページには「今日/明日は何ゴミの日」表示があり（getTodayGarbage/getTomorrowGarbage が
 * new Date() を使用）、日付が変わる瞬間に表示内容も変わる。この関数が返す秒数を
 * Cache-Control の s-maxage にそのまま使うことで、キャッシュは必ずJSTの日付境界で失効し、
 * 「昨日の“今日”」が住民に配信され続ける事故を防ぐ。
 *
 * 例: JST 23:50 → 約600秒／JST 0:10 → 約86,000秒（固定の86400秒ではなく、
 * 呼び出し時刻に応じて残り時間が変動する点が重要）。
 *
 * @param now テスト用に現在時刻を注入できる（省略時は new Date()）
 */
export function secondsUntilJstMidnight(now: Date = new Date()): number {
  const jstNowMs = now.getTime() + JST_OFFSET_MS;
  const msIntoJstDay = jstNowMs % MS_PER_DAY;
  const msRemaining = MS_PER_DAY - msIntoJstDay;
  return Math.max(0, Math.floor(msRemaining / 1000));
}
