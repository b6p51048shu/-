// ごみ種別・今日/明日判定に関する純粋関数（ファイルI/Oに依存しない）。
//
// src/lib/data.ts から分離している理由（静的エクスポート移行 2026-09）:
// data.ts は node:fs でビルド時にデータを読むため、data.ts を import すると
// クライアントバンドルに node:fs が巻き込まれてビルドが壊れる。
// src/components/TodayTomorrow.tsx（"use client"）はこのファイルを直接importすることで、
// fsを含まない純粋関数だけをブラウザ側で使う。
// data.ts 側は後方互換のためこのファイルの export を re-export している（呼び出し側は無変更）。
import type { AreaSchedule } from "./data";
import { getCurrentDayOfWeekJST } from "./date";

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
