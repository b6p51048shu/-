// ward-data.json は静的importせず、ロード時に読み込む（bundle size削減）。
// 本番(Cloudflare Workers): ASSETS バインディング直読み（プロセス内直結、外部fetch無し）。
// ローカル開発(next dev): APP_ORIGIN 経由の通常fetch（.env.local に APP_ORIGIN=http://localhost:3000）。
// モジュールレベルでキャッシュするため、Worker インスタンスあたり1回だけ読み込む。

import regionIndexRaw from "../../public/data/region-index.json";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/** 構造化スケジュールデータ（generate_data.py が生成） */
export type ParsedSchedule =
  | { type: "weekly"; days: number[] }                    // 毎週（火・金 等）
  | { type: "nth"; days: number[]; weeks: number[] }      // 第N週（第2・4土 等）
  | { type: "biweekly"; days: number[]; weeks: number[] } // 隔週（近似で第1・3週）
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

export type WardInfo = {
  code: string;
  ward_slug: string;
  areas: AreaSchedule[];
  bags?: DesignatedBags;
  /** 収集スケジュールに問い合わせ必要な地域がある場合の公式URL */
  info_url?: string;
};

export const regionIndex = regionIndexRaw as Record<string, string[]>;

export type AllWardData = Record<string, WardInfo>;

// ─────────────────────────────────────────────
// モジュールレベルキャッシュ（Worker インスタンス内で共有）
// ─────────────────────────────────────────────

let _wardData: AllWardData | null = null;
let _wardBySlug: Record<string, string> | null = null;
let _wardByCode: Record<string, string> | null = null;

/** ASSETS バインディングの最小型 */
type AssetsFetcher = { fetch: (input: Request | string | URL) => Promise<Response> };

/**
 * ward-data.json の Response を取得する。
 * 本番(Cloudflare): ASSETS バインディング直読み（外部fetchを避け 5xx を防ぐ）。
 * 失敗時/ローカル開発: APP_ORIGIN 経由の通常fetch にフォールバック。
 */
async function fetchWardJson(): Promise<Response> {
  // 本番: ASSETS バインディング直読み（プロセス内直結・サブリクエスト制限なし）
  try {
    const { env } = await getCloudflareContext({ async: true });
    const assets = (env as unknown as { ASSETS?: AssetsFetcher }).ASSETS;
    if (assets) {
      const res = await assets.fetch(new URL("/data/ward-data.json", "https://assets.local"));
      if (res.ok) return res;
    }
  } catch {
    // Cloudflare コンテキストが無い環境（next dev 等）はフォールバックへ
  }

  // フォールバック: APP_ORIGIN 経由の通常fetch（ローカル開発用）
  const origin = process.env.APP_ORIGIN ?? "http://localhost:3000";
  return fetch(`${origin}/data/ward-data.json`);
}

/**
 * ward-data.json を読み込む。
 * 初回のみ読み込み、以降はモジュールレベルキャッシュを返す。
 */
export async function loadWardData(): Promise<AllWardData> {
  if (_wardData) return _wardData;

  const res = await fetchWardJson();
  if (!res.ok) {
    throw new Error(`ward-data.json の取得に失敗しました: ${res.status} ${res.statusText}`);
  }

  _wardData = (await res.json()) as AllWardData;

  // 逆引きマップも同時に構築
  _wardBySlug = Object.fromEntries(
    Object.entries(_wardData).map(([name, info]) => [info.ward_slug, name])
  );
  _wardByCode = Object.fromEntries(
    Object.entries(_wardData).map(([name, info]) => [info.code, name])
  );

  return _wardData;
}

// ─────────────────────────────────────────────
// 公開 API（すべて async）
// ─────────────────────────────────────────────

export async function getWardNames(): Promise<string[]> {
  const data = await loadWardData();
  return Object.keys(data);
}

export async function getWardByCode(code: string): Promise<{ name: string; info: WardInfo } | null> {
  await loadWardData();
  const name = _wardByCode![code];
  if (!name) return null;
  return { name, info: _wardData![name] };
}

export async function getWardBySlug(wardSlug: string): Promise<{ name: string; info: WardInfo } | null> {
  await loadWardData();
  const name = _wardBySlug![wardSlug];
  if (!name) return null;
  return { name, info: _wardData![name] };
}

export async function getWard(wardName: string): Promise<WardInfo | null> {
  const data = await loadWardData();
  return data[wardName] ?? null;
}

export async function getAreaByIndex(wardName: string, index: number): Promise<AreaSchedule | null> {
  const ward = await getWard(wardName);
  if (!ward) return null;
  return ward.areas[index] ?? null;
}

export async function getAreaBySlug(
  wardSlug: string,
  areaSlug: string
): Promise<{ wardName: string; schedule: AreaSchedule } | null> {
  const wardResult = await getWardBySlug(wardSlug);
  if (!wardResult) return null;
  const schedule = wardResult.info.areas.find((a) => a.slug === areaSlug);
  if (!schedule) return null;
  return { wardName: wardResult.name, schedule };
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

/** 今日収集があるごみ種別を返す */
export function getTodayGarbage(schedule: AreaSchedule): string[] {
  const dayChars = ["日", "月", "火", "水", "木", "金", "土"];
  const today = dayChars[new Date().getDay()];
  const result: string[] = [];
  if (normDay(schedule.burnable).includes(today)) result.push("燃やすごみ");
  if (normDay(schedule.unburnable ?? "").includes(today)) result.push("燃やさないごみ");
  if (normDay(schedule.recyclable ?? "").includes(today)) result.push("資源ごみ");
  if (normDay(schedule.plastic ?? "").includes(today)) result.push("プラスチック");
  if (normDay(schedule.pet ?? "").includes(today)) result.push("ペットボトル");
  return result;
}

/** 明日収集があるごみ種別を返す */
export function getTomorrowGarbage(schedule: AreaSchedule): string[] {
  const dayChars = ["日", "月", "火", "水", "木", "金", "土"];
  const tomorrow = dayChars[(new Date().getDay() + 1) % 7];
  const result: string[] = [];
  if (normDay(schedule.burnable).includes(tomorrow)) result.push("燃やすごみ");
  if (normDay(schedule.unburnable ?? "").includes(tomorrow)) result.push("燃やさないごみ");
  if (normDay(schedule.recyclable ?? "").includes(tomorrow)) result.push("資源ごみ");
  if (normDay(schedule.plastic ?? "").includes(tomorrow)) result.push("プラスチック");
  if (normDay(schedule.pet ?? "").includes(tomorrow)) result.push("ペットボトル");
  return result;
}
