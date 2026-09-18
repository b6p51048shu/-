// ごみ収集データは「区ごとに分割した JSON」を必要な1区分だけ読み込む。
//
// 静的エクスポート移行（2026-09）: ページは `next build` 時にすべてHTML化されるため、
// 区データは Node.js の fs でビルド時に直接読む（SSR時代の Workers ASSETS バインディング
// 直読み・APP_ORIGIN 経由fetchは不要になった）。公開API（getWardBySlug 等）は
// async署名のまま変えていない（呼び出し側の改修を避けるため）。
//
// ward-slug-index.json（約2KB）は slug→{区市名, 県} の逆引き用。極小なので静的importで問題ない。

import { readFileSync } from "node:fs";
import { join } from "node:path";
import regionIndexRaw from "../../public/data/region-index.json";
import wardSlugIndexRaw from "../../public/data/ward-slug-index.json";

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

/**
 * 指定 ward_slug の WardInfo を読み込む（ビルド時に public/data/wards/{slug}.json を fs で読む）。
 * 初回のみ読み込み、以降は区別キャッシュを返す。存在しない区は null。
 */
async function loadWard(wardSlug: string): Promise<WardInfo | null> {
  const cached = _wardCache.get(wardSlug);
  if (cached) return cached;

  // slug-index に無い slug は存在しない区（不正URL）→ 即 null（読み込みしない）
  if (!wardSlugIndex[wardSlug]) return null;

  const filePath = join(process.cwd(), "public", "data", "wards", `${wardSlug}.json`);
  let raw: string;
  try {
    raw = readFileSync(filePath, "utf-8");
  } catch {
    // ファイルが存在しない等は「該当区なし」として扱う
    return null;
  }

  const info = JSON.parse(raw) as WardInfo;
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
// 実体は src/lib/garbageSchedule.ts に分離している（クライアントコンポーネント
// TodayTomorrow.tsx から node:fs を含まずに直接importできるようにするため）。
// 呼び出し側の import 元（"@/lib/data"）は変えていない。
// ─────────────────────────────────────────────
export {
  GARBAGE_KEYS,
  GARBAGE_DEFAULT_LABELS,
  garbageLabel,
  getTodayGarbageKeys,
  getTomorrowGarbageKeys,
  getTodayGarbage,
  getTomorrowGarbage,
} from "./garbageSchedule";
export type { GarbageKey } from "./garbageSchedule";
