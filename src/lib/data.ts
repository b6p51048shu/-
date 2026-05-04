import wardDataRaw from "../../public/data/ward-data.json";

export type AreaSchedule = {
  area: string;
  burnable: string;
  unburnable: string;
  recyclable: string;
  plastic: string;
  pet?: string;
  oversized?: string;
  office?: string;
  /** 区独自の表示名（デフォルトラベルを上書きする） */
  labels?: {
    burnable?: string;
    unburnable?: string;
    recyclable?: string;
    plastic?: string;
    pet?: string;
  };
};

export type WardInfo = {
  code: string;
  areas: AreaSchedule[];
};

export type AllWardData = Record<string, WardInfo>;

export const wardData = wardDataRaw as AllWardData;

export const wardNames = Object.keys(wardData);

export function getWard(wardName: string): WardInfo | null {
  return wardData[decodeURIComponent(wardName)] ?? null;
}

export function getAreaByIndex(wardName: string, index: number): AreaSchedule | null {
  const ward = getWard(wardName);
  if (!ward) return null;
  return ward.areas[index] ?? null;
}

export function getAreaIndex(wardName: string, areaName: string): number {
  const ward = getWard(wardName);
  if (!ward) return -1;
  return ward.areas.findIndex((a) => a.area === areaName);
}

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
  if (normDay(schedule.unburnable).includes(today)) result.push("燃やさないごみ");
  if (normDay(schedule.recyclable).includes(today)) result.push("資源ごみ");
  if (normDay(schedule.plastic).includes(today)) result.push("プラスチック");
  if (normDay(schedule.pet ?? "").includes(today)) result.push("ペットボトル");
  return result;
}

/** 明日収集があるごみ種別を返す */
export function getTomorrowGarbage(schedule: AreaSchedule): string[] {
  const dayChars = ["日", "月", "火", "水", "木", "金", "土"];
  const tomorrow = dayChars[(new Date().getDay() + 1) % 7];
  const result: string[] = [];
  if (normDay(schedule.burnable).includes(tomorrow)) result.push("燃やすごみ");
  if (normDay(schedule.unburnable).includes(tomorrow)) result.push("燃やさないごみ");
  if (normDay(schedule.recyclable).includes(tomorrow)) result.push("資源ごみ");
  if (normDay(schedule.plastic).includes(tomorrow)) result.push("プラスチック");
  if (normDay(schedule.pet ?? "").includes(tomorrow)) result.push("ペットボトル");
  return result;
}
