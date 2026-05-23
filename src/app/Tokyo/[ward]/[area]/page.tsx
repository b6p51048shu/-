import type { Metadata } from "next";
import { wardData, wardNames, getWardBySlug, getAreaBySlug, getTodayGarbage, getTomorrowGarbage } from "@/lib/data";
import type { AreaSchedule } from "@/lib/data";
import IcsButton from "./IcsButton";
import GarbageCalendar from "./GarbageCalendar";
import BagsPanel from "./BagsPanel";

type Props = { params: Promise<{ ward: string; area: string }> };

export async function generateStaticParams() {
  const result: { ward: string; area: string }[] = [];
  for (const wardName of wardNames) {
    const info = wardData[wardName];
    if (!info) continue;
    for (const a of info.areas) {
      result.push({ ward: info.ward_slug, area: a.slug });
    }
  }
  return result;
}

/** 「火曜日・金曜日」→「火・金」のように曜日文字だけ抽出して短縮する */
function shortDays(s: string): string {
  // 「曜日」「曜」を先に除去してから1文字マッチ（「火曜日」の"日"を誤検出しない）
  const normalized = s.replace(/曜日/g, "").replace(/曜/g, "");
  const matches = normalized.match(/[月火水木金土日]/g);
  return matches ? [...new Set(matches)].join("・") : s;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ward: wardSlug, area: areaSlug } = await params;
  const found = getAreaBySlug(wardSlug, areaSlug);
  if (!found) return {};

  const { wardName, schedule } = found;
  const burnable = schedule.burnable ? shortDays(schedule.burnable) : "";
  const titleSuffix = burnable ? `（燃やすごみ: ${burnable}）` : "";

  const parts = [
    schedule.burnable && `燃やすごみ: ${schedule.burnable}`,
    schedule.unburnable && `燃やさないごみ: ${schedule.unburnable}`,
    schedule.recyclable && `資源: ${schedule.recyclable}`,
    schedule.plastic && `プラスチック: ${schedule.plastic}`,
  ].filter(Boolean);

  return {
    title: `${wardName} ${schedule.area}のごみ収集日${titleSuffix}`,
    description: `${wardName} ${schedule.area}のごみ収集スケジュール。${parts.join("、")}。`,
    openGraph: {
      title: `${wardName} ${schedule.area}のごみ収集日${titleSuffix} | ゴミの日.com`,
      description: `${parts.join("、")}`,
    },
  };
}

const SCHEDULE_DEFAULTS = [
  { key: "burnable" as const, label: "燃やすごみ", icon: "🔥", color: "#ef4444" },
  { key: "unburnable" as const, label: "燃やさないごみ", icon: "🧊", color: "#3b82f6" },
  { key: "recyclable" as const, label: "資源ごみ", icon: "♻️", color: "#10b981" },
  { key: "plastic" as const, label: "プラスチック", icon: "🛍️", color: "#8b5cf6" },
  { key: "pet" as const, label: "ペットボトル", icon: "🍾", color: "#f59e0b" },
  { key: "oversized" as const, label: "粗大ごみ", icon: "🪑", color: "#6b7280" },
];

function getScheduleItems(schedule: AreaSchedule) {
  return SCHEDULE_DEFAULTS.map((def) => {
    const customLabel = def.key !== "oversized"
      ? schedule.labels?.[def.key as keyof NonNullable<AreaSchedule["labels"]>]
      : undefined;
    return customLabel ? { ...def, label: customLabel } : def;
  });
}

export default async function AreaPage({ params }: Props) {
  const { ward: wardSlug, area: areaSlug } = await params;
  const found = getAreaBySlug(wardSlug, areaSlug);

  if (!found) {
    return (
      <div className="container">
        <p>地域が見つかりません</p>
      </div>
    );
  }

  const { wardName, schedule } = found;
  const wardInfo = getWardBySlug(wardSlug)?.info;
  const areaName = schedule.area;
  const todayItems = getTodayGarbage(schedule);
  const tomorrowItems = getTomorrowGarbage(schedule);
  const dayNames = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
  const todayName = dayNames[new Date().getDay()];
  const tomorrowName = dayNames[(new Date().getDay() + 1) % 7];

  const areas = wardInfo?.areas ?? [];
  const currentIdx = areas.findIndex((a) => a.slug === areaSlug);
  const prevArea = currentIdx > 0 ? areas[currentIdx - 1] : null;
  const nextArea = currentIdx < areas.length - 1 ? areas[currentIdx + 1] : null;

  const scheduleItems = getScheduleItems(schedule);

  // unknown_parsed があれば公式URLリンクを表示するか判定
  const hasUnknown = (["burnable","unburnable","recyclable","plastic","pet"] as const).some(
    (k) => (schedule[`${k}_parsed` as keyof AreaSchedule] as { type?: string } | undefined)?.type === "unknown"
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: scheduleItems
      .filter(({ key }) => schedule[key])
      .map(({ label, key }) => ({
        "@type": "Question",
        name: `${wardName} ${areaName}の${label}は何曜日ですか？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${wardName} ${areaName}の${label}は${schedule[key]}です。`,
        },
      })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-narrow">
        <nav className="breadcrumb" aria-label="パンくず">
          <a href="/">ホーム</a>
          <span><a href={`/Tokyo/${wardSlug}`}>{wardName}</a></span>
          <span>{areaName}</span>
        </nav>

        <h1 className="area-page-title">
          {areaName}のごみ収集日
          <span className="area-page-ward">{wardName}</span>
        </h1>

        {/* 今日・明日のごみ */}
        <div className="today-section">
          <h3>📅 今日（{todayName}）のごみ</h3>
          <div className="today-items">
            {todayItems.length > 0 ? (
              todayItems.map((item) => (
                <span key={item} className="today-badge">✅ {item}</span>
              ))
            ) : (
              <span className="today-none">収集なし</span>
            )}
          </div>
        </div>
        <div className="today-section" style={{ borderLeftColor: "#f59e0b" }}>
          <h3>📅 明日（{tomorrowName}）のごみ</h3>
          <div className="today-items">
            {tomorrowItems.length > 0 ? (
              tomorrowItems.map((item) => (
                <span key={item} className="today-badge" style={{ background: "#fffbeb", color: "#92400e" }}>
                  ⚠️ {item}
                </span>
              ))
            ) : (
              <span className="today-none">収集なし</span>
            )}
          </div>
        </div>

        {/* 収集日要問い合わせ通知 */}
        {hasUnknown && wardInfo?.info_url && (
          <div className="unknown-notice">
            <span>📋 </span>
            <span>このエリアの一部収集スケジュールは固定曜日がなく、カレンダーに表示されません。</span>
            <a href={wardInfo.info_url} target="_blank" rel="noopener noreferrer" className="unknown-notice-link">
              {wardName}公式サイトで確認 →
            </a>
          </div>
        )}

        {/* カレンダービュー */}
        <GarbageCalendar wardName={wardName} areaName={areaName} schedule={schedule} />

        {/* カレンダー同期 */}
        <IcsButton wardName={wardName} areaName={areaName} schedule={schedule} />

        {/* 指定ごみ袋情報（あれば表示） */}
        {wardInfo?.bags && <BagsPanel bags={wardInfo.bags} />}

        {/* FAQ テキスト (SEO) */}
        <section className="faq-section">
          <h2 className="section-title">よくある質問</h2>
          {scheduleItems.filter(({ key }) => schedule[key]).map(({ key, label }) => (
            <div key={key} className="faq-item">
              <p className="faq-q">Q. {wardName} {areaName}の{label}は何曜日ですか？</p>
              <p className="faq-a">{wardName} {areaName}の{label}は<strong>{schedule[key]}</strong>です。</p>
            </div>
          ))}
        </section>

        {/* 前後ナビゲーション */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
          {prevArea && (
            <a href={`/Tokyo/${wardSlug}/${prevArea.slug}`} className="btn btn-outline">
              ← {prevArea.area}
            </a>
          )}
          <a href={`/Tokyo/${wardSlug}`} className="btn btn-outline">
            {wardName}一覧
          </a>
          {nextArea && (
            <a href={`/Tokyo/${wardSlug}/${nextArea.slug}`} className="btn btn-outline">
              {nextArea.area} →
            </a>
          )}
        </div>
      </div>
    </>
  );
}
