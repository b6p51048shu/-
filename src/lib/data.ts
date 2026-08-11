// ごみ収集データは「区ごとに分割した JSON」を必要な1区分だけ読み込む。
// 旧実装は全区一括の ward-data.json（約1MB）を毎リクエストで JSON.parse していたため、
// Cloudflare Workers のコールドスタート時に CPU 時間・メモリ制限を超えて 5xx(error 1102)を
// 起こしていた。区別ファイル（数十KB）にすることで1リクエストあたりの負荷を大幅に削減する。
//
// 本番(Cloudflare Workers): ASSETS バインディング直読み（プロセス内直結、外部fetch無し）。
// ローカル開発(next dev): APP_ORIGIN 経由の通常fetch（.env.local に APP_ORIGIN=http://localhost:3000）。
// 読み込んだ区は Worker インスタンス内でキャッシュする。
//
// ward-slug-index.json（約2KB）は slug→{区市名, 県} の逆引き用。極小なので静的importで問題ない。

import regionIndexRaw from "../../public/data/region-index.json";
import wardSlugIndexRaw from "../../public/data/ward-slug-index.json";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getCurrentDayOfWeekJST } from "./date";

/** 構造化スケジュールデータ（generate_data.py が生成） */
export type ParsedSchedule =
  | { type: "weekly"; days: number[] }                    // 毎週（火・金 等）
  | { type: "nth"; days: number[]; weeks: number[] }      // 第N週（第2・4土 等）
  // 隔週。anchor(ISO日付)があれば真の14日周期、なければ weeks による近似（後方互換）
  | { type: "biweekly"; days: number[]; weeks?: number[]; anchor?: string }
  | { type: "unknown"; raw: string };                     // パース失敗

export type AreaSchedule = {
  area: string;
  slug: string;
  burnable: string;
  unburnable?: string;
  recyclable?: string;
  plastic?: string;
  pet?: string;
  oversized?: string;
  office?: string;
  /** 構造化スケジュール（カレンダー描画用） */
  burnable_parsed?: ParsedSchedule;
  unburnable_parsed?: ParsedSchedule;
  recyclable_parsed?: ParsedSchedule;
  plastic_parsed?: ParsedSchedule;
  pet_parsed?: ParsedSchedule;
  oversized_parsed?: ParsedSchedule;
  /** 収集ルールの補足注記（「ごみ出しの基本」の定型文を上書きする自治体固有の一文。例: 船橋市の昼間/夜間収集） */
  collection_note?: string;
  /** 区独自の表示名（デフォルトラベルを上書きする） */
  labels?: {
    burnable?: string;
    unburnable?: string;
    recyclable?: string;
    plastic?: string;
    pet?: string;
  };
};

export type BagSize = {
  size: string;
  capacity: string;
  price_per_10: number | null;
  price_per_bag: number | null;
};

export type BagType = {
  category: "burnable" | "unburnable" | "plastic" | "pet" | "recyclable";
  label: string;
  color: string;
  sizes: BagSize[];
};

export type DesignatedBags = {
  required: boolean;
  note?: string;
  types: BagType[];
  where_to_buy: string;
  info_url: string;
};

/** 自治体ごとの粗大ごみ詳細情報（自治体別ページ用） */
export type OversizedDetail = {
  /** 粗大ごみの定義（例: おおむね一辺30cm以上） */
  definition?: string;
  /** 申し込み方法（例: ["インターネット", "電話", "FAX"]） */
  methods?: string[];
  /** 受付電話番号 */
  tel?: string;
  /** 電話受付時間 */
  tel_hours?: string;
  /** インターネット受付ページのURL */
  online_url?: string;
  /** 手数料の仕組み・料金例 */
  fee?: string;
  /** 持ち込み（自己搬入）の可否・施設名 */
  dropoff?: string;
  /** その他の注意点 */
  note?: string;
};

export type WardInfo = {
  code: string;
  ward_slug: string;
  areas: AreaSchedule[];
  bags?: DesignatedBags;
  /** 収集スケジュールに問い合わせ必要な地域がある場合の公式URL */
  info_url?: string;
  /** 粗大ごみの申し込み・出し方を案内する自治体公式ページのURL */
  oversized_url?: string;
  /** 粗大ごみの詳細情報（自治体別ページ用） */
  oversized_detail?: OversizedDetail;
  /** データ整備・最終確認時期（E-E-A-T表示用。例: "2026年7月"） */
  data_checked?: string;
};

/** 県スラッグ → { 地域グループ名 → 区市名リスト }（例: Tokyo → { "23区": [...], "多摩地区": [...] }） */
export const regionIndex = regionIndexRaw as Record<string, Record<string, string[]>>;

/** ward_slug → { 区市名, 県スラッグ } の逆引き（極小・静的import） */
type WardSlugEntry = { name: string; pref: string };
const wardSlugIndex = wardSlugIndexRaw as unknown as Record<string, WardSlugEntry>;

/** ward_slug → 所属県スラッグ（存在しない slug は null） */
export function prefOfWardSlug(wardSlug: string): string | null {
  return wardSlugIndex[wardSlug]?.pref ?? null;
}

export type AllWardData = Record<string, WardInfo>;

// ─────────────────────────────────────────────
// 区別キャッシュ（Worker インスタンス内で共有）
// 各区を初回アクセス時に1回だけ読み込み、以降はキャッシュを返す。
// ─────────────────────────────────────────────

/** ward_slug → WardInfo。読み込み済みの区のみ保持。 */
const _wardCache = new Map<string, WardInfo>();

/** ASSETS バインディングの最小型 */
type AssetsFetcher = { fetch: (input: Request | string | URL) => Promise<Response> };

/**
 * 区別 JSON（/data/wards/{slug}.json）の Response を取得する。
 * 本番(Cloudflare): ASSETS バインディング直読み（外部fetchを避け 5xx を防ぐ）。
 * 失敗時/ローカル開発: APP_ORIGIN 経由の通常fetch にフォールバック。
 */
async function fetchWardFile(wardSlug: string): Promise<Response> {
  const path = `/data/wards/${wardSlug}.json`;

  // 本番: ASSETS バインディング直読み（プロセス内直結・サブリクエスト制限なし）
  try {
    const { env } = await getCloudflareContext({ async: true });
    const assets = (env as unknown as { ASSETS?: AssetsFetcher }).ASSETS;
    if (assets) {
      const res = await assets.fetch(new URL(path, "https://assets.local"));
      if (res.ok) return res;
    }
  } catch {
    // Cloudflare コンテキストが無い環境（next dev 等）はフォールバックへ
  }

  // フォールバック: APP_ORIGIN 経由の通常fetch（ローカル開発用）
  const origin = process.env.APP_ORIGIN ?? "http://localhost:3000";
  return fetch(`${origin}${path}`);
}

/**
 * 指定 ward_slug の WardInfo を読み込む。
 * 初回のみ読み込み、以降は区別キャッシュを返す。存在しない区は null。
 */
async function loadWard(wardSlug: string): Promise<WardInfo | null> {
  const cached = _wardCache.get(wardSlug);
  if (cached) return cached;

  // slug-index に無い slug は存在しない区（不正URL）→ 即 null（fetchしない）
  if (!wardSlugIndex[wardSlug]) return null;

  const res = await fetchWardFile(wardSlug);
  if (!res.ok) {
    // 404 等は「該当区なし」として扱う（throw すると 5xx になるため）
    if (res.status === 404) return null;
    throw new Error(`区データの取得に失敗しました(${wardSlug}): ${res.status} ${res.statusText}`);
  }

  const info = (await res.json()) as WardInfo;
  _wardCache.set(wardSlug, info);
  return info;
}

// ─────────────────────────────────────────────
// 公開 API（すべて async）
// ─────────────────────────────────────────────

export async function getWardBySlug(
  wardSlug: string
): Promise<{ name: string; pref: string; info: WardInfo } | null> {
  const entry = wardSlugIndex[wardSlug];
  if (!entry) return null;
  const info = await loadWard(wardSlug);
  if (!info) return null;
  return { name: entry.name, pref: entry.pref, info };
}

export async function getWard(wardName: string): Promise<WardInfo | null> {
  // 区市名 → slug を逆引きしてから区別ファイルを読む
  const slug = Object.keys(wardSlugIndex).find((s) => wardSlugIndex[s].name === wardName);
  if (!slug) return null;
  return loadWard(slug);
}

export async function getAreaBySlug(
  wardSlug: string,
  areaSlug: string
): Promise<{ wardName: string; pref: string; schedule: AreaSchedule } | null> {
  const wardResult = await getWardBySlug(wardSlug);
  if (!wardResult) return null;
  const schedule = wardResult.info.areas.find((a) => a.slug === areaSlug);
  if (!schedule) return null;
  return { wardName: wardResult.name, pref: wardResult.pref, schedule };
}

// ─────────────────────────────────────────────
// 純粋関数（データに依存しない）
// ─────────────────────────────────────────────

/** 「火曜日」→「火」に正規化し、同日・祝日等の複合語を除去 */
function normDay(s: string): string {
  return (s ?? "")
    .replace(/同日|翌日|当日|祝日|休日|平日|毎日|前日|本日|昨日|収集日|回収日/g, "")
    .replace(/([月火水木金土日])曜日/g, "$1")
    .replace(/([月火水木金土日])曜/g, "$1");
}

/** 収集スケジュールを持つごみ種別キー（表示順） */
export const GARBAGE_KEYS = ["burnable", "unburnable", "recyclable", "plastic", "pet"] as const;
export type GarbageKey = (typeof GARBAGE_KEYS)[number];

/** ごみ種別のデフォルト表示名（labels が無い区市で使用。従来のハードコード文字列と同一） */
export const GARBAGE_DEFAULT_LABELS: Record<GarbageKey, string> = {
  burnable: "燃やすごみ",
  unburnable: "燃やさないごみ",
  recyclable: "資源ごみ",
  plastic: "プラスチック",
  pet: "ペットボトル",
};

/**
 * ごみ種別の表示名を返す。schedule.labels があればそれを優先する。
 * 千葉市のように plastic=古紙・布類 等、フィールドと実区分が違う自治体で
 * 誤った種別名を表示しないための共通ヘルパー（カレンダー等と同じ優先順位）。
 */
export function garbageLabel(schedule: AreaSchedule, key: GarbageKey): string {
  return schedule.labels?.[key] ?? GARBAGE_DEFAULT_LABELS[key];
}

/** 指定曜日（"月"等）に収集があるごみ種別キーを返す */
function getGarbageKeysOnDay(schedule: AreaSchedule, dayChar: string): GarbageKey[] {
  return GARBAGE_KEYS.filter((key) => normDay(schedule[key] ?? "").includes(dayChar));
}

/** 今日収集があるごみ種別キーを返す（表示名は呼び出し側で garbageLabel か多言語辞書を使う） */
export function getTodayGarbageKeys(schedule: AreaSchedule): GarbageKey[] {
  const dayChars = ["日", "月", "火", "水", "木", "金", "土"];
  return getGarbageKeysOnDay(schedule, dayChars[getCurrentDayOfWeekJST()]);
}

/** 明日収集があるごみ種別キーを返す */
export function getTomorrowGarbageKeys(schedule: AreaSchedule): GarbageKey[] {
  const dayChars = ["日", "月", "火", "水", "木", "金", "土"];
  return getGarbageKeysOnDay(schedule, dayChars[(getCurrentDayOfWeekJST() + 1) % 7]);
}

/** 今日収集があるごみ種別の表示名を返す（labels優先。labels無しなら従来と同一出力） */
export function getTodayGarbage(schedule: AreaSchedule): string[] {
  return getTodayGarbageKeys(schedule).map((key) => garbageLabel(schedule, key));
}

/** 明日収集があるごみ種別の表示名を返す（labels優先。labels無しなら従来と同一出力） */
export function getTomorrowGarbage(schedule: AreaSchedule): string[] {
  return getTomorrowGarbageKeys(schedule).map((key) => garbageLabel(schedule, key));
}
