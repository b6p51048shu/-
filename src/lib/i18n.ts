/** 多言語対応ユーティリティ */

export const LOCALES = ["en", "ko", "zh"] as const;
export type Locale = typeof LOCALES[number];

export function isValidLocale(s: string): s is Locale {
  return LOCALES.includes(s as Locale);
}

// ── 日→英 曜日マップ ─────────────────────────────────────
const DAY_EN: Record<string, string> = {
  月: "Monday", 火: "Tuesday", 水: "Wednesday",
  木: "Thursday", 金: "Friday", 土: "Saturday", 日: "Sunday",
};
const NTH_EN = ["", "1st", "2nd", "3rd", "4th", "5th"];

// ── 日→韓国語 曜日マップ ─────────────────────────────────
const DAY_KO: Record<string, string> = {
  月: "월요일", 火: "화요일", 水: "수요일",
  木: "목요일", 金: "금요일", 土: "토요일", 日: "일요일",
};
const NTH_KO = ["", "첫째", "둘째", "셋째", "넷째", "다섯째"];

// ── 日→中国語 曜日マップ ─────────────────────────────────
const DAY_ZH: Record<string, string> = {
  月: "周一", 火: "周二", 水: "周三",
  木: "周四", 金: "周五", 土: "周六", 日: "周日",
};
const NTH_ZH = ["", "第1个", "第2个", "第3个", "第4个", "第5个"];

const FULL_TO_HALF: Record<string, string> = {
  "１":"1","２":"2","３":"3","４":"4","５":"5",
};

function toHalf(s: string): string {
  return s.replace(/[１２３４５]/g, c => FULL_TO_HALF[c] ?? c);
}

function normalizeSchedule(text: string): string {
  return text
    .replace(/同日|翌日|当日|祝日|休日|平日|毎日|前日|本日|昨日|収集日|回収日/g, "")
    .replace(/([月火水木金土日])曜日/g, "$1")
    .replace(/([月火水木金土日])曜/g, "$1")
    .replace(/毎週/g, "");
}

function convertSchedule(
  text: string,
  dayMap: Record<string, string>,
  nthArr: string[],
  everyPrefix: string,
  separator: string,
): string {
  if (!text) return "";

  const norm = normalizeSchedule(text);
  const segments = norm.split(/[、,，\s]+/).filter(Boolean);
  const results: string[] = [];

  for (const seg of segments) {
    const dayMatch = seg.match(/([月火水木金土日])$/);
    if (!dayMatch) continue;
    const dayLocal = dayMap[dayMatch[1]];

    const nths = new Set<number>();
    for (const m of seg.matchAll(/第([１２３４５1-5])/g)) {
      nths.add(parseInt(toHalf(m[1]), 10));
    }

    if (nths.size > 0) {
      const sorted = [...nths].sort((a, b) => a - b);
      const nthStr = sorted.map(n => nthArr[n] ?? `${n}`).join(separator);
      results.push(`${nthStr} ${dayLocal}`);
    } else {
      results.push(`${everyPrefix}${dayLocal}`);
    }
  }

  if (results.length === 0) {
    const days = (["月","火","水","木","金","土","日"] as const)
      .filter(c => norm.includes(c))
      .map(c => dayMap[c]);
    if (days.length > 0) return `${everyPrefix}${days.join(separator)}`;
    return text;
  }

  return results.join(" / ");
}

/** スケジュール文字列を英語に変換 */
export function scheduleToEn(text: string): string {
  return convertSchedule(text, DAY_EN, NTH_EN, "Every ", " & ");
}

/** スケジュール文字列を韓国語に変換 */
export function scheduleToKo(text: string): string {
  return convertSchedule(text, DAY_KO, NTH_KO, "매주 ", "·");
}

/** スケジュール文字列を中国語に変換 */
export function scheduleToZh(text: string): string {
  return convertSchedule(text, DAY_ZH, NTH_ZH, "每周", "、");
}

/** ロケールに応じてスケジュールを変換 */
export function scheduleToLocale(text: string, locale: Locale): string {
  if (locale === "ko") return scheduleToKo(text);
  if (locale === "zh") return scheduleToZh(text);
  return scheduleToEn(text);
}

// ── 英語UIテキスト ──────────────────────────────────────────
export const en = {
  lang: "en" as const,
  htmlLang: "en",
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
    tamaGridTitle: "Tama Area (Cities & Towns)",
    bagsBadge: "Designated bags available",
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
    calHeader: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
  },
  faq: [
    {
      q: "What is Gominohi.com?",
      a: "Gominohi.com is a free service to look up garbage collection schedules across Tokyo (23 wards + 29 Tama cities, 52 municipalities total) by neighborhood.",
    },
    {
      q: "How do I use the GPS feature?",
      a: 'Press the "Auto-detect my location" button to automatically identify your ward using your browser\'s location.',
    },
    {
      q: "What are designated garbage bags?",
      a: "In many Tama-area cities, you must use municipality-designated paid bags to dispose of garbage. Bag colors and prices vary by city. Check the size, price, and where to buy on each supported city's page.",
    },
    {
      q: "How often is the data updated?",
      a: "Data is updated based on official ward websites. For holidays and year-end special schedules, please check your ward's official website.",
    },
    {
      q: "What areas are supported?",
      a: "Currently all 52 municipalities in Tokyo (23 wards + 29 Tama cities/towns) are supported.",
    },
  ],
} as const;

// ── 韓国語UIテキスト ──────────────────────────────────────────
export const ko = {
  lang: "ko" as const,
  htmlLang: "ko",
  site: {
    title: "고미노히.com",
    tagline: "도쿄 지역별 쓰레기 수거일 안내",
    nav: { top: "홈" },
    footer: {
      copy: "© 2026 Gominohi.com — 도쿄 쓰레기 수거일 달력",
      note: "정보는 각 구의 공식 데이터를 기반으로 하지만 변경될 수 있습니다. 반드시 각 구의 공식 사이트에서 확인하세요.",
    },
  },
  search: {
    heading: "🔍 지역으로 검색",
    gpsBtn: "📍 현재 위치로 자동 검색",
    gpsDetecting: "현재 위치를 가져오는 중...",
    gpsFound: (ward: string, area: string) => `📍 감지됨: ${ward} — ${area}`,
    gpsFoundWard: (ward: string) => `📍 감지됨: ${ward}`,
    gpsOutOfArea: (city: string) => `위치: ${city || "알 수 없음"} — 아직 지원되지 않는 지역입니다`,
    gpsDenied: "위치 정보 접근이 거부되었습니다",
    gpsError: "위치 정보를 가져오지 못했습니다",
    gpsUnsupported: "이 브라우저는 GPS를 지원하지 않습니다",
    wardLabel: "구·시 선택",
    wardPlaceholder: "-- 구·시를 선택하세요 --",
    areaLabel: "지역·동 선택",
    areaPlaceholder: "-- 지역을 선택하세요 --",
    searchBtn: "수거일 확인 →",
  },
  ward: {
    gridTitle: "23구에서 선택",
    tamaGridTitle: "다마 지역에서 선택",
    bagsBadge: "지정 봉투 정보 있음",
    areas: (n: number) => `${n}개 지역`,
    listTitle: (ward: string) => `${ward} 쓰레기 수거일`,
    listDesc: (n: number) => `총 ${n}개 지역입니다. 지역을 클릭하면 수거 요일을 확인할 수 있습니다.`,
    filterPlaceholder: "지역명으로 검색",
    noResults: "해당하는 지역이 없습니다",
  },
  area: {
    pageTitle: (area: string) => `${area} — 쓰레기 수거일`,
    todayTitle: (day: string) => `📅 오늘 (${day})`,
    tomorrowTitle: (day: string) => `📅 내일 (${day})`,
    noCollection: "오늘은 수거 없음",
    calendarSync: "📅 캘린더에 추가 (.ics)",
    faqHeading: "자주 묻는 질문",
    faqQ: (ward: string, area: string, type: string) =>
      `${ward} ${area}의 ${type} 수거일은 언제인가요?`,
    faqA: (ward: string, area: string, type: string, schedule: string) =>
      `${ward} ${area}의 ${type}은(는) ${schedule}에 수거됩니다.`,
    backToList: (ward: string) => `${ward} 목록`,
    notFound: "해당 지역을 찾을 수 없습니다",
  },
  schedule: {
    burnable: "가연성 쓰레기",
    unburnable: "불연성 쓰레기",
    recyclable: "재활용품",
    plastic: "플라스틱",
    pet: "페트병",
    oversized: "대형 폐기물",
  },
  days: {
    long: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
    short: ["일","월","화","수","목","금","토"],
    calHeader: ["월","화","수","목","금","토","일"],
  },
  faq: [
    {
      q: "고미노히.com이란?",
      a: "도쿄도 (23구 + 다마 지역 29시·정, 총 52개 자치체)의 쓰레기 수거일을 지역별로 검색할 수 있는 무료 서비스입니다.",
    },
    {
      q: "GPS 기능은 어떻게 사용하나요?",
      a: "\"현재 위치로 자동 검색\" 버튼을 누르면 브라우저의 위치 정보를 사용하여 구·시를 자동으로 감지합니다.",
    },
    {
      q: "지정 쓰레기 봉투란 무엇인가요?",
      a: "다마 지역의 많은 시에서는 쓰레기를 버릴 때 자치체가 지정한 전용 유료 봉투를 사용해야 합니다. 봉투 색상과 가격은 시마다 다릅니다. 지원 시 페이지에서 크기·가격·판매처를 확인할 수 있습니다.",
    },
    {
      q: "데이터는 얼마나 자주 업데이트되나요?",
      a: "각 구·시의 공식 사이트를 기반으로 수시 업데이트합니다. 공휴일이나 연말연시 특별 일정은 각 자치체 공식 사이트를 확인하세요.",
    },
    {
      q: "어떤 지역을 지원하나요?",
      a: "현재 도쿄도 23구 및 다마 지역 29개 시·정·촌, 총 52개 자치체를 지원합니다.",
    },
  ],
} as const;

// ── 中国語（简体）UIテキスト ──────────────────────────────────
export const zh = {
  lang: "zh" as const,
  htmlLang: "zh-Hans",
  site: {
    title: "垃圾日.com",
    tagline: "东京各地区垃圾收集日查询",
    nav: { top: "首页" },
    footer: {
      copy: "© 2026 Gominohi.com — 东京垃圾收集日历",
      note: "信息基于各区官方数据，可能有所变动。请务必在各区官方网站上确认。",
    },
  },
  search: {
    heading: "🔍 按地区查询",
    gpsBtn: "📍 自动检测当前位置",
    gpsDetecting: "正在获取当前位置...",
    gpsFound: (ward: string, area: string) => `📍 已检测到: ${ward} — ${area}`,
    gpsFoundWard: (ward: string) => `📍 已检测到: ${ward}`,
    gpsOutOfArea: (city: string) => `位置: ${city || "未知"} — 暂不支持该地区`,
    gpsDenied: "位置信息访问被拒绝",
    gpsError: "无法获取位置信息",
    gpsUnsupported: "您的浏览器不支持GPS",
    wardLabel: "选择区·市",
    wardPlaceholder: "-- 请选择区·市 --",
    areaLabel: "选择地区·町名",
    areaPlaceholder: "-- 请选择地区 --",
    searchBtn: "查询收集日 →",
  },
  ward: {
    gridTitle: "从23区选择",
    tamaGridTitle: "从多摩地区选择",
    bagsBadge: "有指定垃圾袋信息",
    areas: (n: number) => `${n}个地区`,
    listTitle: (ward: string) => `${ward}垃圾收集日`,
    listDesc: (n: number) => `共${n}个地区，点击地区查看收集时间表。`,
    filterPlaceholder: "按地区名搜索",
    noResults: "未找到匹配地区",
  },
  area: {
    pageTitle: (area: string) => `${area} — 垃圾收集日`,
    todayTitle: (day: string) => `📅 今天（${day}）`,
    tomorrowTitle: (day: string) => `📅 明天（${day}）`,
    noCollection: "今天无收集",
    calendarSync: "📅 添加到日历 (.ics)",
    faqHeading: "常见问题",
    faqQ: (ward: string, area: string, type: string) =>
      `${ward}${area}的${type}收集日是哪天？`,
    faqA: (ward: string, area: string, type: string, schedule: string) =>
      `${ward}${area}的${type}收集日为${schedule}。`,
    backToList: (ward: string) => `${ward}列表`,
    notFound: "未找到该地区",
  },
  schedule: {
    burnable: "可燃垃圾",
    unburnable: "不可燃垃圾",
    recyclable: "可回收物",
    plastic: "塑料垃圾",
    pet: "塑料瓶",
    oversized: "大型废弃物",
  },
  days: {
    long: ["周日","周一","周二","周三","周四","周五","周六"],
    short: ["日","一","二","三","四","五","六"],
    calHeader: ["周一","周二","周三","周四","周五","周六","周日"],
  },
  faq: [
    {
      q: "垃圾日.com是什么？",
      a: "这是一项免费服务，可按地区查询东京都（23区+多摩地区29个市町，共52个自治体）的垃圾收集日。",
    },
    {
      q: "如何使用GPS功能？",
      a: "点击\"自动检测当前位置\"按钮，将使用浏览器的位置信息自动判断您所在的区·市。",
    },
    {
      q: "什么是指定垃圾袋？",
      a: "在多摩地区的许多市，丢弃垃圾时必须使用自治体指定的专用收费垃圾袋。袋子的颜色和价格因市而异。可在各支持城市的页面查看尺寸、价格和销售地点。",
    },
    {
      q: "数据多久更新一次？",
      a: "数据基于各区·市官方网站随时更新。节假日及年末年初的特别日程请在各自治体官方网站确认。",
    },
    {
      q: "支持哪些地区？",
      a: "目前支持东京都23区及多摩地区29个市町村，共52个自治体。",
    },
  ],
} as const;

// ── 指定ごみ袋パネル用UI（ja含む4言語）──────────────────────
export type BagsUILocale = "ja" | Locale;

export const bagsUI: Record<BagsUILocale, {
  title: string;
  size: string;
  capacity: string;
  perBag: string;
  per10: string;
  price: (n: number) => string;
  whereToBuy: string;
  detailLink: string;
  empty: string;
}> = {
  ja: {
    title: "🛍️ 指定ごみ袋",
    size: "サイズ", capacity: "容量", perBag: "1枚あたり", per10: "10枚セット",
    price: (n) => `${n}円`,
    whereToBuy: "🏪 販売場所：",
    detailLink: "詳細・取扱店一覧 →",
    empty: "—",
  },
  en: {
    title: "🛍️ Designated Garbage Bags",
    size: "Size", capacity: "Capacity", perBag: "Per bag", per10: "Pack of 10",
    price: (n) => `¥${n}`,
    whereToBuy: "🏪 Where to buy:",
    detailLink: "Details / store list →",
    empty: "—",
  },
  ko: {
    title: "🛍️ 지정 쓰레기 봉투",
    size: "크기", capacity: "용량", perBag: "1장당", per10: "10장 세트",
    price: (n) => `${n}엔`,
    whereToBuy: "🏪 판매처:",
    detailLink: "자세히 / 취급점 목록 →",
    empty: "—",
  },
  zh: {
    title: "🛍️ 指定垃圾袋",
    size: "尺寸", capacity: "容量", perBag: "每张", per10: "10张装",
    price: (n) => `${n}日元`,
    whereToBuy: "🏪 销售地点：",
    detailLink: "详情 / 销售店列表 →",
    empty: "—",
  },
};

export type LocaleStrings = typeof en;

/** ロケールに応じた翻訳オブジェクトを返す */
export function getT(locale: Locale): LocaleStrings {
  if (locale === "ko") return ko as unknown as LocaleStrings;
  if (locale === "zh") return zh as unknown as LocaleStrings;
  return en;
}

// 後方互換（既存の en export はそのまま）
export type En = typeof en;

// 曜日の短縮形（カレンダーヘッダー用）
export const CAL_DAY_SHORT_EN = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
