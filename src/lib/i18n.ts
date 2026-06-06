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

// ── サイト共通UI（ヘッダー/フッター, ja含む4言語）─────────────
export const siteChrome: Record<BagsUILocale, {
  navTop: string;
  navDisclaimer: string;
  navPrivacy: string;
  footerCopy: string;
  footerNote: string;
}> = {
  ja: {
    navTop: "トップ",
    navDisclaimer: "免責事項",
    navPrivacy: "プライバシーポリシー",
    footerCopy: "© 2026 ゴミの日.com — 東京都ごみ収集日カレンダー",
    footerNote: "掲載情報は各自治体の公式データに基づきますが、変更される場合があります。必ず公式サイトでご確認ください。",
  },
  en: {
    navTop: "Top",
    navDisclaimer: "Disclaimer",
    navPrivacy: "Privacy Policy",
    footerCopy: "© 2026 Gominohi.com — Tokyo Garbage Collection Calendar",
    footerNote: "Information is based on official municipal data but may change. Always confirm with the official website.",
  },
  ko: {
    navTop: "홈",
    navDisclaimer: "면책 조항",
    navPrivacy: "개인정보 처리방침",
    footerCopy: "© 2026 Gominohi.com — 도쿄 쓰레기 수거일 달력",
    footerNote: "정보는 각 자치체의 공식 데이터를 기반으로 하지만 변경될 수 있습니다. 반드시 공식 사이트에서 확인하세요.",
  },
  zh: {
    navTop: "首页",
    navDisclaimer: "免责声明",
    navPrivacy: "隐私政策",
    footerCopy: "© 2026 Gominohi.com — 东京垃圾收集日历",
    footerNote: "信息基于各自治体官方数据，可能有所变动。请务必在官方网站上确认。",
  },
};

// ── 免責事項ページ本文（ja含む4言語）────────────────────────
export const disclaimerContent: Record<BagsUILocale, {
  title: string;
  updated: string;
  sections: { h: string; p: string }[];
  backHome: string;
}> = {
  ja: {
    title: "免責事項",
    updated: "最終更新日: 2026年5月29日",
    sections: [
      {
        h: "情報の正確性について",
        p: "当サイト（ゴミの日.com、以下「当サイト」）に掲載しているごみ収集日・分別区分・指定ごみ袋等の情報は、各自治体が公開している情報をもとに作成しています。正確な情報の提供に努めていますが、その内容の正確性・完全性・最新性を保証するものではありません。実際の収集日や分別ルールは予告なく変更される場合があります。",
      },
      {
        h: "免責",
        p: "当サイトの情報を利用したことによって生じたいかなる損害（ごみの出し忘れ・収集されなかった等を含む）についても、当サイトは一切の責任を負いません。ごみの収集日・分別方法等は、必ずお住まいの自治体の公式サイトまたは窓口でご確認ください。特に祝日・年末年始は通常と異なるスケジュールになる場合があります。",
      },
      {
        h: "外部リンクについて",
        p: "当サイトから他のウェブサイト（各自治体の公式サイト等）へのリンクを掲載している場合がありますが、リンク先サイトの内容・運営について当サイトは責任を負いません。",
      },
      {
        h: "著作権について",
        p: "当サイトに掲載されているコンテンツの著作権は、当サイトまたは正当な権利者に帰属します。無断での複製・転載・再配布を禁じます。",
      },
      {
        h: "内容の変更・中断",
        p: "当サイトは、予告なくサイトの内容を変更・中断・終了する場合があります。あらかじめご了承ください。",
      },
    ],
    backHome: "← トップに戻る",
  },
  en: {
    title: "Disclaimer",
    updated: "Last updated: May 29, 2026",
    sections: [
      {
        h: "Accuracy of Information",
        p: "The garbage collection dates, sorting categories, and designated bag information on Gominohi.com (\"this site\") are compiled from information published by each municipality. While we strive to provide accurate information, we do not guarantee its accuracy, completeness, or timeliness. Actual collection days and sorting rules may change without notice.",
      },
      {
        h: "Limitation of Liability",
        p: "This site assumes no responsibility for any damages (including missed collections) arising from the use of information on this site. Always confirm collection days and sorting methods on your municipality's official website or office. Schedules may differ from the norm, especially on public holidays and around the New Year.",
      },
      {
        h: "External Links",
        p: "This site may contain links to other websites (such as official municipal sites). We are not responsible for the content or operation of linked sites.",
      },
      {
        h: "Copyright",
        p: "Copyright of the content on this site belongs to this site or its rightful owners. Unauthorized reproduction, reprinting, or redistribution is prohibited.",
      },
      {
        h: "Changes and Suspension",
        p: "This site may change, suspend, or discontinue its content without prior notice. Thank you for your understanding.",
      },
    ],
    backHome: "← Back to top",
  },
  ko: {
    title: "면책 조항",
    updated: "최종 업데이트: 2026년 5월 29일",
    sections: [
      {
        h: "정보의 정확성에 대하여",
        p: "본 사이트(Gominohi.com, 이하 \"본 사이트\")에 게재된 쓰레기 수거일·분리 구분·지정 쓰레기 봉투 등의 정보는 각 자치체가 공개한 정보를 바탕으로 작성되었습니다. 정확한 정보 제공을 위해 노력하고 있으나, 그 내용의 정확성·완전성·최신성을 보장하지 않습니다. 실제 수거일이나 분리 규칙은 예고 없이 변경될 수 있습니다.",
      },
      {
        h: "면책",
        p: "본 사이트의 정보를 이용함으로써 발생한 어떠한 손해(쓰레기 미배출·미수거 등 포함)에 대해서도 본 사이트는 일체의 책임을 지지 않습니다. 쓰레기 수거일·분리 방법 등은 반드시 거주하시는 자치체의 공식 사이트 또는 창구에서 확인하시기 바랍니다. 특히 공휴일·연말연시에는 평소와 다른 일정이 될 수 있습니다.",
      },
      {
        h: "외부 링크에 대하여",
        p: "본 사이트에서 다른 웹사이트(각 자치체 공식 사이트 등)로의 링크를 게재하는 경우가 있으나, 링크 대상 사이트의 내용·운영에 대해 본 사이트는 책임을 지지 않습니다.",
      },
      {
        h: "저작권에 대하여",
        p: "본 사이트에 게재된 콘텐츠의 저작권은 본 사이트 또는 정당한 권리자에게 귀속됩니다. 무단 복제·전재·재배포를 금합니다.",
      },
      {
        h: "내용의 변경·중단",
        p: "본 사이트는 예고 없이 사이트의 내용을 변경·중단·종료할 수 있습니다. 미리 양해 부탁드립니다.",
      },
    ],
    backHome: "← 홈으로 돌아가기",
  },
  zh: {
    title: "免责声明",
    updated: "最后更新: 2026年5月29日",
    sections: [
      {
        h: "关于信息的准确性",
        p: "本网站（垃圾日.com，以下简称\"本网站\"）所刊载的垃圾收集日、分类区分、指定垃圾袋等信息，是基于各自治体公开的信息编写的。我们努力提供准确的信息，但不保证其准确性、完整性和时效性。实际的收集日和分类规则可能会未经通知而变更。",
      },
      {
        h: "免责",
        p: "对于因使用本网站信息而产生的任何损害（包括未投放、未收集垃圾等），本网站概不负责。垃圾收集日、分类方法等请务必在您所在自治体的官方网站或窗口确认。特别是节假日和年末年初，日程可能与平时不同。",
      },
      {
        h: "关于外部链接",
        p: "本网站可能刊载指向其他网站（如各自治体官方网站等）的链接，但本网站对链接目标网站的内容和运营不承担责任。",
      },
      {
        h: "关于著作权",
        p: "本网站刊载内容的著作权归本网站或合法权利人所有。禁止擅自复制、转载、再分发。",
      },
      {
        h: "内容的变更与中断",
        p: "本网站可能未经通知变更、中断或终止网站内容，敬请谅解。",
      },
    ],
    backHome: "← 返回首页",
  },
};

// ── プライバシーポリシーページ本文（ja含む4言語）──────────────
export const privacyContent: Record<BagsUILocale, {
  title: string;
  updated: string;
  sections: { h: string; p: string }[];
  backHome: string;
}> = {
  ja: {
    title: "プライバシーポリシー",
    updated: "最終更新日: 2026年6月6日",
    sections: [
      {
        h: "基本方針",
        p: "当サイト（ゴミの日.com、以下「当サイト」）は、利用者のプライバシーを尊重し、個人情報の保護に努めます。本ポリシーは、当サイトが取得する情報とその利用目的、第三者への提供等について定めるものです。",
      },
      {
        h: "取得する情報",
        p: "当サイトは、原則として氏名・住所・電話番号等の個人を直接特定できる情報を収集しません。ただし、アクセス解析および広告配信のため、Cookie・端末情報・閲覧履歴・IPアドレス・おおよその地域情報等を自動的に取得する場合があります。お問い合わせをいただいた場合は、ご返信のためにメールアドレス及び本文に含まれる情報をお預かりします。",
      },
      {
        h: "アクセス解析ツールについて",
        p: "当サイトは、サイトの利用状況を把握するためにGoogleが提供するアクセス解析ツール「Googleアナリティクス（GA4）」を利用しています。Googleアナリティクスはトラフィックデータの収集のためにCookieを使用します。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。詳細は「Googleのサービスを使用するサイトやアプリから収集した情報のGoogleによる使用」をご確認ください。Cookieはブラウザの設定により無効化することができます。",
      },
      {
        h: "広告配信について",
        p: "当サイトは、第三者配信の広告サービス「Google AdSense」を利用する場合があります。広告配信事業者は、利用者の興味に応じた広告を表示するためにCookie（Cookieにより収集された当サイトや他サイトへのアクセス情報）を使用することがあります。Googleを含む第三者配信事業者によるCookieの使用、パーソナライズ広告の無効化については、Googleの「広告設定」（https://adssettings.google.com）でオプトアウトできます。また、aboutads.info（https://optout.aboutads.info）にアクセスすることで、第三者配信事業者のCookieを無効にすることも可能です。",
      },
      {
        h: "アフィリエイトプログラムについて",
        p: "当サイトは、A8.net等のアフィリエイトプログラムに参加しており、不用品回収・引越し等のサービスを紹介する場合があります。これらのリンクを経由してサービスが利用された場合、当サイトが提携先より報酬を受け取ることがあります。アフィリエイトプログラムにおいても、広告配信のためにCookieが使用される場合があります。",
      },
      {
        h: "個人情報の第三者提供",
        p: "当サイトは、法令に基づく場合等の正当な理由がある場合を除き、取得した個人情報を本人の同意なく第三者に提供することはありません。",
      },
      {
        h: "免責事項",
        p: "当サイトの掲載情報の正確性、利用により生じた損害等に関する免責については、別途「免責事項」のページに定めるとおりです。",
      },
      {
        h: "運営者情報",
        p: "運営者: ゴミの日ドットコム中の人（不動産会社管理職）。当サイトは個人により運営されています。",
      },
      {
        h: "お問い合わせ",
        p: "当サイトおよび本ポリシーに関するお問い合わせは、以下のメールアドレスまでご連絡ください。 gominohi.araiguma@gmail.com",
      },
      {
        h: "本ポリシーの変更",
        p: "当サイトは、必要に応じて本ポリシーを予告なく変更することがあります。変更後の内容は当ページに掲載した時点で効力を生じるものとします。",
      },
    ],
    backHome: "← トップに戻る",
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: June 6, 2026",
    sections: [
      {
        h: "Our Policy",
        p: "Gominohi.com (\"this site\") respects the privacy of its users and strives to protect personal information. This policy describes the information we collect, how we use it, and how it may be shared with third parties.",
      },
      {
        h: "Information We Collect",
        p: "This site does not, as a rule, collect personally identifiable information such as your name, address, or phone number. However, for analytics and advertising, we may automatically collect Cookies, device information, browsing history, IP address, and approximate location. If you contact us, we retain your email address and the contents of your message in order to respond.",
      },
      {
        h: "Analytics",
        p: "This site uses Google Analytics (GA4), provided by Google, to understand how the site is used. Google Analytics uses Cookies to collect traffic data. This data is collected anonymously and does not identify individuals. You can disable Cookies through your browser settings.",
      },
      {
        h: "Advertising",
        p: "This site may use the third-party advertising service Google AdSense. Advertising vendors may use Cookies to serve ads based on a user's interests. You can opt out of personalized advertising and the use of Cookies by Google and other third-party vendors via Google's Ad Settings (https://adssettings.google.com) or at aboutads.info (https://optout.aboutads.info).",
      },
      {
        h: "Affiliate Programs",
        p: "This site participates in affiliate programs such as A8.net and may introduce services such as bulky-waste collection and moving services. If a service is used via these links, this site may receive compensation from the partner. Cookies may also be used for advertising within these affiliate programs.",
      },
      {
        h: "Sharing with Third Parties",
        p: "Except where required by law or otherwise legitimately justified, this site will not provide collected personal information to third parties without the individual's consent.",
      },
      {
        h: "Disclaimer",
        p: "Matters concerning the accuracy of information on this site and the limitation of liability for any resulting damages are set out separately on the Disclaimer page.",
      },
      {
        h: "Site Operator",
        p: "Operator: The person behind Gominohi.com (a real-estate company manager). This site is operated by an individual.",
      },
      {
        h: "Contact",
        p: "For inquiries about this site or this policy, please contact: gominohi.araiguma@gmail.com",
      },
      {
        h: "Changes to This Policy",
        p: "This site may change this policy without prior notice as needed. Any revised policy takes effect when posted on this page.",
      },
    ],
    backHome: "← Back to top",
  },
  ko: {
    title: "개인정보 처리방침",
    updated: "최종 업데이트: 2026년 6월 6일",
    sections: [
      {
        h: "기본 방침",
        p: "본 사이트(Gominohi.com, 이하 \"본 사이트\")는 이용자의 개인정보를 존중하며 그 보호에 힘쓰고 있습니다. 본 방침은 본 사이트가 취득하는 정보와 그 이용 목적, 제3자 제공 등에 대해 정합니다.",
      },
      {
        h: "취득하는 정보",
        p: "본 사이트는 원칙적으로 이름·주소·전화번호 등 개인을 직접 특정할 수 있는 정보를 수집하지 않습니다. 다만 액세스 분석 및 광고 게재를 위해 Cookie·단말 정보·열람 이력·IP 주소·대략적인 지역 정보 등을 자동으로 취득하는 경우가 있습니다. 문의를 주신 경우 회신을 위해 이메일 주소 및 본문에 포함된 정보를 보관합니다.",
      },
      {
        h: "액세스 분석 도구에 대하여",
        p: "본 사이트는 사이트 이용 상황을 파악하기 위해 Google이 제공하는 액세스 분석 도구 'Google 애널리틱스(GA4)'를 이용합니다. Google 애널리틱스는 트래픽 데이터 수집을 위해 Cookie를 사용합니다. 이 데이터는 익명으로 수집되며 개인을 특정하지 않습니다. Cookie는 브라우저 설정으로 비활성화할 수 있습니다.",
      },
      {
        h: "광고 게재에 대하여",
        p: "본 사이트는 제3자 게재 광고 서비스 'Google AdSense'를 이용하는 경우가 있습니다. 광고 게재 사업자는 이용자의 관심에 맞는 광고를 표시하기 위해 Cookie를 사용할 수 있습니다. Google을 포함한 제3자 사업자의 Cookie 사용 및 맞춤 광고 비활성화는 Google '광고 설정'(https://adssettings.google.com) 또는 aboutads.info(https://optout.aboutads.info)에서 옵트아웃할 수 있습니다.",
      },
      {
        h: "제휴 프로그램에 대하여",
        p: "본 사이트는 A8.net 등의 제휴(어필리에이트) 프로그램에 참가하고 있으며, 폐기물 수거·이사 등의 서비스를 소개하는 경우가 있습니다. 이러한 링크를 경유하여 서비스가 이용된 경우 본 사이트가 제휴처로부터 보수를 받을 수 있습니다.",
      },
      {
        h: "개인정보의 제3자 제공",
        p: "본 사이트는 법령에 근거한 경우 등 정당한 이유가 있는 경우를 제외하고, 취득한 개인정보를 본인의 동의 없이 제3자에게 제공하지 않습니다.",
      },
      {
        h: "면책 사항",
        p: "본 사이트 게재 정보의 정확성 및 이용으로 인해 발생한 손해 등에 관한 면책은 별도 '면책 조항' 페이지에 정한 바와 같습니다.",
      },
      {
        h: "운영자 정보",
        p: "운영자: Gominohi.com 운영자(부동산 회사 관리직). 본 사이트는 개인이 운영합니다.",
      },
      {
        h: "문의",
        p: "본 사이트 및 본 방침에 관한 문의는 다음 이메일 주소로 연락해 주십시오. gominohi.araiguma@gmail.com",
      },
      {
        h: "본 방침의 변경",
        p: "본 사이트는 필요에 따라 본 방침을 예고 없이 변경할 수 있습니다. 변경된 내용은 본 페이지에 게재된 시점에 효력이 발생합니다.",
      },
    ],
    backHome: "← 홈으로 돌아가기",
  },
  zh: {
    title: "隐私政策",
    updated: "最后更新: 2026年6月6日",
    sections: [
      {
        h: "基本方针",
        p: "本网站（垃圾日.com，以下简称\"本网站\"）尊重用户的隐私，并致力于保护个人信息。本政策规定本网站所获取的信息及其使用目的、向第三方提供等事项。",
      },
      {
        h: "获取的信息",
        p: "本网站原则上不收集姓名、地址、电话号码等可直接识别个人的信息。但为进行访问分析及广告投放，可能会自动获取Cookie、设备信息、浏览记录、IP地址、大致地区信息等。当您来信咨询时，我们会保管您的电子邮箱地址及正文所含信息以便回复。",
      },
      {
        h: "关于访问分析工具",
        p: "本网站使用Google提供的访问分析工具\"Google Analytics（GA4）\"以了解网站的使用情况。Google Analytics使用Cookie来收集流量数据。该数据以匿名方式收集，不会识别个人。您可以通过浏览器设置停用Cookie。",
      },
      {
        h: "关于广告投放",
        p: "本网站可能使用第三方广告服务\"Google AdSense\"。广告投放商可能会使用Cookie以根据用户兴趣展示广告。对于包括Google在内的第三方投放商使用Cookie以及停用个性化广告，您可通过Google\"广告设置\"（https://adssettings.google.com）或aboutads.info（https://optout.aboutads.info）进行选择退出。",
      },
      {
        h: "关于联盟营销计划",
        p: "本网站参与A8.net等联盟营销（Affiliate）计划，可能会介绍废品回收、搬家等服务。若通过这些链接使用了服务，本网站可能会从合作方获得报酬。",
      },
      {
        h: "个人信息向第三方提供",
        p: "除依据法令等正当理由外，本网站不会在未经本人同意的情况下将所获取的个人信息提供给第三方。",
      },
      {
        h: "免责声明",
        p: "关于本网站刊载信息的准确性以及因使用而产生的损害等免责事项，另行在\"免责声明\"页面中规定。",
      },
      {
        h: "运营者信息",
        p: "运营者: 垃圾日.com的运营者（房地产公司管理人员）。本网站由个人运营。",
      },
      {
        h: "联系我们",
        p: "有关本网站及本政策的咨询，请通过以下电子邮箱联系: gominohi.araiguma@gmail.com",
      },
      {
        h: "本政策的变更",
        p: "本网站可根据需要在不另行通知的情况下变更本政策。变更后的内容自刊载于本页面之时起生效。",
      },
    ],
    backHome: "← 返回首页",
  },
};

// ── 広告テキスト（4言語）── 不用品回収アフィリエイト用 ──────
export const adContent: Record<BagsUILocale, {
  label: string;
  closeAria: string;
  inline: { title: string; features: string[]; body: string; cta: string; burstLabel: string };
  banner: { title: string };
}> = {
  ja: {
    label: "広告",
    closeAria: "閉じる",
    inline: {
      title: "粗大ごみ・不用品でお困りですか？",
      features: ["基本料金 0円", "見積もり無料", "出張費 0円"],
      body: "ゴミ屋敷・遺品整理・引越し時のゴミ回収まで対応。業界最安値に挑戦中。",
      cta: "無料で見積もりを取る →",
      burstLabel: "あらゆる費用",
    },
    banner: { title: "粗大ごみ・不用品回収" },
  },
  en: {
    label: "Ad",
    closeAria: "Close",
    inline: {
      title: "Need help with bulky waste or unwanted items?",
      features: ["Base fee ¥0", "Free quote", "Travel fee ¥0"],
      body: "Bulky waste, estate cleanup, and moving cleanup — all covered. (Service area: Japan)",
      cta: "Get a free quote →",
      burstLabel: "ALL FEES",
    },
    banner: { title: "Bulky waste pickup" },
  },
  ko: {
    label: "광고",
    closeAria: "닫기",
    inline: {
      title: "대형 쓰레기·불용품 처분으로 고민이신가요?",
      features: ["기본료 0엔", "무료 견적", "출장비 0엔"],
      body: "쓰레기 집·유품 정리·이사 시 쓰레기 회수까지 대응. (서비스 지역: 일본)",
      cta: "무료로 견적 받기 →",
      burstLabel: "모든 비용",
    },
    banner: { title: "대형 쓰레기 회수" },
  },
  zh: {
    label: "广告",
    closeAria: "关闭",
    inline: {
      title: "大型垃圾·不用品的处理有困扰吗？",
      features: ["基本费 0日元", "免费报价", "出差费 0日元"],
      body: "垃圾屋·遗品整理·搬家时的垃圾回收均可对应。(服务地区：日本)",
      cta: "免费报价 →",
      burstLabel: "全部费用",
    },
    banner: { title: "大型垃圾回收" },
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
