import type { Metadata } from "next";
import { wardData, wardNames, getWard, getAreaByIndex, getTodayGarbage, getTomorrowGarbage } from "@/lib/data";
import type { AreaSchedule } from "@/lib/data";
import IcsButton from "./IcsButton";
import GarbageCalendar from "./GarbageCalendar";

type Props = { params: Promise<{ ward: string; area: string }> };

export async function generateStaticParams() {
  const result: { ward: string; area: string }[] = [];
  for (const ward of wardNames) {
    const info = wardData[ward];
    if (!info) continue;
    for (let i = 0; i < info.areas.length; i++) {
      result.push({ ward, area: String(i) });
    }
  }
  return result;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ward: wardParam, area: areaParam } = await params;
  const wardName = decodeURIComponent(wardParam);
  const schedule = getAreaByIndex(wardName, parseInt(areaParam, 10));
  if (!schedule) return {};

  const areaName = schedule.area;
  const parts = [
    schedule.burnable && `燃やすごみ: ${schedule.burnable}`,
    schedule.unburnable && `燃やさないごみ: ${schedule.unburnable}`,
    schedule.recyclable && `資源: ${schedule.recyclable}`,
    schedule.plastic && `プラスチック: ${schedule.plastic}`,
  ].filter(Boolean);

  return {
    title: `${wardName} ${areaName}のごみ収集日`,
    description: `${wardName} ${areaName}のごみ収集スケジュール。${parts.join("、")}。`,
    openGraph: {
      title: `${wardName} ${areaName}のごみ収集日 | ゴミカレ`,
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
  const { ward: wardParam, area: areaParam } = await params;
  const wardName = decodeURIComponent(wardParam);
  const areaIdx = parseInt(areaParam, 10);
  const schedule = getAreaByIndex(wardName, areaIdx);

  if (!schedule) {
    return (
      <div className="container">
        <p>地域が見つかりません</p>
      </div>
    );
  }

  const areaName = schedule.area;
  const todayItems = getTodayGarbage(schedule);
  const tomorrowItems = getTomorrowGarbage(schedule);
  const dayNames = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
  const todayName = dayNames[new Date().getDay()];
  const tomorrowName = dayNames[(new Date().getDay() + 1) % 7];

  const wardInfo = getWard(wardName);
  const prevIdx = areaIdx > 0 ? areaIdx - 1 : null;
  const nextIdx = wardInfo && areaIdx < wardInfo.areas.length - 1 ? areaIdx + 1 : null;

  const scheduleItems = getScheduleItems(schedule);

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
          <span><a href={`/ku/${wardParam}`}>{wardName}</a></span>
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

        {/* カレンダービュー */}
        <GarbageCalendar wardName={wardName} areaName={areaName} schedule={schedule} />

        {/* カレンダー同期 */}
        <IcsButton wardName={wardName} areaName={areaName} schedule={schedule} />

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
          {prevIdx !== null && wardInfo && (
            <a href={`/ku/${wardParam}/${prevIdx}`} className="btn btn-outline">
              ← {wardInfo.areas[prevIdx].area}
            </a>
          )}
          <a href={`/ku/${wardParam}`} className="btn btn-outline">
            {wardName}一覧
          </a>
          {nextIdx !== null && wardInfo && (
            <a href={`/ku/${wardParam}/${nextIdx}`} className="btn btn-outline">
              {wardInfo.areas[nextIdx].area} →
            </a>
          )}
        </div>
      </div>
    </>
  );
}
