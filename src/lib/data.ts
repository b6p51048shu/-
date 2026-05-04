import wardDataRaw from "../../public/data/ward-data.json";

export type AreaSchedule = {
  area: string;
  slug: string;
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
  ward_slug: string;
  areas: AreaSchedule[];
};

export type AllWardData = Record<string, WardInfo>;

export const wardData = wardDataRaw as AllWardData;

export const wardNames = Object.keys(wardData);

/** 区コード → 区名 の逆引きマップ */
export const wardByCode: Record<string, string> = Object.fromEntries(
  Object.entries(wardData).map(([name, info]) => [info.code, name])
);

/** 英語スラッグ → 区名 の逆引きマップ */
export const wardBySlug: Record<string, string> = Object.fromEntries(
  Object.entries(wardData).map(([name, info]) => [info.ward_slug, name])
);

export function getWardByCode(code: string): { name: string; info: WardInfo } | null {
  const name = wardByCode[code];
  if (!name) return null;
  return { name, info: wardData[name] };
}

export function getWardBySlug(wardSlug: string): { name: string; info: WardInfo } | null {
  const name = wardBySlug[wardSlug];
  if (!name) return null;
  return { name, info: wardData[name] };
}

export function getWard(wardName: string): WardInfo | null {
  return wardData[wardName] ?? null;
}

export function getAreaByIndex(wardName: string, index: number): AreaSchedule | null {
  const ward = getWard(wardName);
  if (!ward) return null;
  return ward.areas[index] ?? null;
}

export function getAreaBySlug(wardSlug: string, areaSlug: string): { wardName: string; schedule: AreaSchedule } | null {
  const wardResult = getWardBySlug(wardSlug);
  if (!wardResult) return null;
  const schedule = wardResult.info.areas.find((a) => a.slug === areaSlug);
  if (!schedule) return null;
  return { wardName: wardResult.name, schedule };
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
