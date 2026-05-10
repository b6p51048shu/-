/** 多言語対応ユーティリティ */

// ── 日→英 曜日マップ ─────────────────────────────────────
const DAY_EN: Record<string, string> = {
  月: "Monday", 火: "Tuesday", 水: "Wednesday",
  木: "Thursday", 金: "Friday", 土: "Saturday", 日: "Sunday",
};
const DAY_SHORT_EN: Record<string, string> = {
  月: "Mon", 火: "Tue", 水: "Wed",
  木: "Thu", 金: "Fri", 土: "Sat", 日: "Sun",
};
const NTH_EN = ["", "1st", "2nd", "3rd", "4th", "5th"];
const FULL_TO_HALF: Record<string, string> = {
  "１":"1","２":"2","３":"3","４":"4","５":"5",
};

function toHalf(s: string): string {
  return s.replace(/[１２３４５]/g, c => FULL_TO_HALF[c] ?? c);
}

/** スケジュール文字列を英語に変換
 * 例: 「第1・3月曜日」→ "1st & 3rd Monday"
 *     「月曜日・木曜日」→ "Every Monday & Thursday"
 *     「第2火曜日・第4火曜日」→ "2nd & 4th Tuesday"
 */
export function scheduleToEn(text: string): string {
  if (!text) return "";

  const norm = text
    .replace(/同日|翌日|当日|祝日|休日|平日|毎日|前日|本日|昨日|収集日|回収日/g, "")
    .replace(/([月火水木金土日])曜日/g, "$1")
    .replace(/([月火水木金土日])曜/g, "$1")
    .replace(/毎週/g, "");

  const segments = norm.split(/[、,，\s]+/).filter(Boolean);
  const results: string[] = [];

  for (const seg of segments) {
    const dayMatch = seg.match(/([月火水木金土日])$/);
    if (!dayMatch) continue;
    const dayEn = DAY_EN[dayMatch[1]];

    // 週番号を収集（2形式対応）
    const nths = new Set<number>();
    for (const m of seg.matchAll(/第([１２３４５1-5])/g)) {
      nths.add(parseInt(toHalf(m[1]), 10));
    }
    for (const m of seg.matchAll(/第[１２３４５1-5]((?:[・、,，][１２３４５1-5])+)/g)) {
      for (const n of m[1].matchAll(/[・、,，]([１２３４５1-5])/g)) {
        nths.add(parseInt(toHalf(n[1]), 10));
      }
    }

    if (nths.size > 0) {
      const sorted = [...nths].sort((a, b) => a - b);
      const nthStr = sorted.map(n => NTH_EN[n] ?? `${n}th`).join(" & ");
      results.push(`${nthStr} ${dayEn}`);
    } else {
      results.push(`Every ${dayEn}`);
    }
  }

  if (results.length === 0) {
    // 「月・木」のような単純な曜日パターン
    const days = (["月","火","水","木","金","土","日"] as const)
      .filter(c => norm.includes(c))
      .map(c => DAY_EN[c]);
    if (days.length > 0) {
      return `Every ${days.join(" & ")}`;
    }
    return text;
  }

  return results.join(" / ");
}

// ── 英語UIテキスト ──────────────────────────────────────────
export const en = {
  site: {
    title: "Gominohi.com",
    tagline: "Tokyo garbage collection schedule by neighborhood",
    nav: { top: "Top" },
    footer: {
      copy: "© 2026 Gominohi.com — Tokyo Garbage Collection Calendar",
      note: "Information is based on official ward data but may change. Always confirm with your ward's official website.",
    },
  },
  search: {
    heading: "🔍 Search by Area",
    gpsBtn: "📍 Auto-detect my location",
    gpsDetecting: "Detecting your location...",
    gpsFound: (ward: string, area: string) => `📍 Detected: ${ward} — ${area}`,
    gpsFoundWard: (ward: string) => `📍 Detected: ${ward}`,
    gpsOutOfArea: (city: string) => `Location: ${city || "Unknown"} — not yet supported`,
    gpsDenied: "Location access was denied",
    gpsError: "Failed to determine location",
    gpsUnsupported: "Your browser does not support GPS",
    wardLabel: "Select Ward",
    wardPlaceholder: "-- Select Ward --",
    areaLabel: "Select Area / Town",
    areaPlaceholder: "-- Select Area --",
    searchBtn: "Check Collection Days →",
  },
  ward: {
    gridTitle: "Browse by Ward (23 Wards)",
    areas: (n: number) => `${n} areas`,
    listTitle: (ward: string) => `Garbage Collection in ${ward}`,
    listDesc: (n: number) => `Showing ${n} areas. Click an area to see its schedule.`,
    filterPlaceholder: "Filter by area name",
    noResults: "No matching areas found",
  },
  area: {
    pageTitle: (area: string) => `${area} — Garbage Collection`,
    todayTitle: (day: string) => `📅 Today (${day})`,
    tomorrowTitle: (day: string) => `📅 Tomorrow (${day})`,
    noCollection: "No collection today",
    calendarSync: "📅 Add to Calendar (.ics)",
    faqHeading: "FAQ",
    faqQ: (ward: string, area: string, type: string) =>
      `When is ${type} collected in ${area}, ${ward}?`,
    faqA: (ward: string, area: string, type: string, schedule: string) =>
      `In ${area}, ${ward}, ${type} is collected on: ${schedule}`,
    backToList: (ward: string) => `${ward} list`,
    notFound: "Area not found",
  },
  schedule: {
    burnable: "Burnable Waste",
    unburnable: "Non-burnable Waste",
    recyclable: "Recyclables",
    plastic: "Plastic",
    pet: "PET Bottles",
    oversized: "Oversized Waste",
  },
  days: {
    long: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    short: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
  },
  faq: [
    {
      q: "What is Gominohi.com?",
      a: "Gominohi.com is a free service to look up garbage collection schedules across Tokyo (23 wards + 29 Tama cities, 52 municipalities total) by neighborhood. It shows collection days for burnable waste, non-burnable waste, recyclables, and plastics.",
    },
    {
      q: "How do I use the GPS feature?",
      a: 'Press the "Auto-detect my location" button to automatically identify your ward using your browser\'s location. Allow the location permission dialog when prompted.',
    },
    {
      q: "How often is the data updated?",
      a: "Data is updated based on official ward websites. For holidays and year-end special schedules, please check your ward's official website.",
    },
    {
      q: "What areas are supported?",
      a: "Currently all 52 municipalities in Tokyo (23 wards + 29 Tama cities/towns) are supported. We plan to expand to Kanagawa, Saitama, Chiba, and other major cities.",
    },
  ],
} as const;

export type En = typeof en;

// 曜日の短縮形（カレンダーヘッダー用）
export const CAL_DAY_SHORT_EN = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
