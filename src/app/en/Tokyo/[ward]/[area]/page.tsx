import type { Metadata } from "next";
import { getWardBySlug, getAreaBySlug } from "@/lib/data";
import type { AreaSchedule } from "@/lib/data";
import { en, scheduleToEn } from "@/lib/i18n";
import EnGarbageCalendar from "./GarbageCalendar";
import IcsButton from "@/app/Tokyo/[ward]/[area]/IcsButton";

type Props = { params: Promise<{ ward: string; area: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ward: wardSlug, area: areaSlug } = await params;
  const found = await getAreaBySlug(wardSlug, areaSlug);
  if (!found) return {};
  const { wardName, schedule } = found;
  return {
    title: `${schedule.area} (${wardSlug} Ward) Garbage Collection | Gominohi.com`,
    description: `Garbage collection schedule for ${schedule.area}, ${wardSlug} Ward, Tokyo. Burnable: ${scheduleToEn(schedule.burnable)}.`,
    alternates: { canonical: `/en/Tokyo/${wardSlug}/${areaSlug}` },
  };
}

const SCHEDULE_DEFAULTS = [
  { key: "burnable" as const,   label: en.schedule.burnable,   icon: "🔥", color: "#ef4444" },
  { key: "unburnable" as const, label: en.schedule.unburnable, icon: "🧊", color: "#3b82f6" },
  { key: "recyclable" as const, label: en.schedule.recyclable, icon: "♻️", color: "#10b981" },
  { key: "plastic" as const,    label: en.schedule.plastic,    icon: "🛍️", color: "#8b5cf6" },
  { key: "pet" as const,        label: en.schedule.pet,        icon: "🍾", color: "#f59e0b" },
  { key: "oversized" as const,  label: en.schedule.oversized,  icon: "🪑", color: "#6b7280" },
];

function getScheduleItems(schedule: AreaSchedule) {
  return SCHEDULE_DEFAULTS.filter(({ key }) => schedule[key]);
}

function getTodayEn(schedule: AreaSchedule): string[] {
  const dayChars = ["日","月","火","水","木","金","土"];
  const today = dayChars[new Date().getDay()];
  const items: string[] = [];
  if (schedule.burnable?.includes(today)) items.push(en.schedule.burnable);
  if (schedule.unburnable?.includes(today)) items.push(en.schedule.unburnable);
  if (schedule.recyclable?.includes(today)) items.push(en.schedule.recyclable);
  if (schedule.plastic?.includes(today)) items.push(en.schedule.plastic);
  if (schedule.pet?.includes(today)) items.push(en.schedule.pet);
  return items;
}

function getTomorrowEn(schedule: AreaSchedule): string[] {
  const dayChars = ["日","月","火","水","木","金","土"];
  const tomorrow = dayChars[(new Date().getDay() + 1) % 7];
  const items: string[] = [];
  if (schedule.burnable?.includes(tomorrow)) items.push(en.schedule.burnable);
  if (schedule.unburnable?.includes(tomorrow)) items.push(en.schedule.unburnable);
  if (schedule.recyclable?.includes(tomorrow)) items.push(en.schedule.recyclable);
  if (schedule.plastic?.includes(tomorrow)) items.push(en.schedule.plastic);
  if (schedule.pet?.includes(tomorrow)) items.push(en.schedule.pet);
  return items;
}

export default async function EnAreaPage({ params }: Props) {
  const { ward: wardSlug, area: areaSlug } = await params;
  const found = await getAreaBySlug(wardSlug, areaSlug);

  if (!found) {
    return <div className="container"><p>{en.area.notFound}</p></div>;
  }

  const { wardName, schedule } = found;
  const wardInfo = (await getWardBySlug(wardSlug))?.info;
  const areaName = schedule.area;
  const todayItems = getTodayEn(schedule);
  const tomorrowItems = getTomorrowEn(schedule);
  const todayName = en.days.long[new Date().getDay()];
  const tomorrowName = en.days.long[(new Date().getDay() + 1) % 7];

  const areas = wardInfo?.areas ?? [];
  const currentIdx = areas.findIndex((a) => a.slug === areaSlug);
  const prevArea = currentIdx > 0 ? areas[currentIdx - 1] : null;
  const nextArea = currentIdx < areas.length - 1 ? areas[currentIdx + 1] : null;

  const scheduleItems = getScheduleItems(schedule);

  // unknown_parsed があれば公式URLリンクを表示するか判定
  const hasUnknown = (["burnable","unburnable","recyclable","plastic","pet"] as const).some(
    (k) => (schedule[`${k}_parsed` as keyof AreaSchedule] as { type?: string } | undefined)?.type === "unknown"
  );

  return (
    <div className="container-narrow">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="/en">Home</a>
        <span><a href={`/en/Tokyo/${wardSlug}`}>{wardSlug} Ward</a></span>
        <span>{areaName}</span>
      </nav>

      <h1 className="area-page-title">
        {en.area.pageTitle(areaName)}
        <span className="area-page-ward">{wardSlug} Ward</span>
      </h1>

      {/* 今日・明日 */}
      <div className="today-section">
        <h3>{en.area.todayTitle(todayName)}</h3>
        <div className="today-items">
          {todayItems.length > 0
            ? todayItems.map((item) => <span key={item} className="today-badge">✅ {item}</span>)
            : <span className="today-none">{en.area.noCollection}</span>}
        </div>
      </div>
      <div className="today-section" style={{ borderLeftColor: "#f59e0b" }}>
        <h3>{en.area.tomorrowTitle(tomorrowName)}</h3>
        <div className="today-items">
          {tomorrowItems.length > 0
            ? tomorrowItems.map((item) => (
                <span key={item} className="today-badge" style={{ background: "#fffbeb", color: "#92400e" }}>
                  ⚠️ {item}
                </span>
              ))
            : <span className="today-none">{en.area.noCollection}</span>}
        </div>
      </div>

      {/* Collection schedule notice for unknown areas */}
      {hasUnknown && wardInfo?.info_url && (
        <div className="unknown-notice">
          <span>📋 </span>
          <span>Some collection days for this area are not on a fixed schedule and cannot be shown in the calendar.</span>
          <a href={wardInfo.info_url} target="_blank" rel="noopener noreferrer" className="unknown-notice-link">
            Check {wardSlug} Ward official site →
          </a>
        </div>
      )}

      {/* カレンダー（英語版） */}
      <EnGarbageCalendar schedule={schedule} />

      {/* ICS */}
      <IcsButton wardName={wardName} areaName={areaName} schedule={schedule} />

      {/* スケジュール一覧 */}
      <section style={{ margin: "2rem 0" }}>
        <h2 className="section-title">Collection Schedule</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          {scheduleItems.map(({ key, label, icon, color }) => (
            <div key={key} style={{ display: "flex", alignItems: "baseline", gap: ".75rem" }}>
              <span style={{ fontSize: "1.1rem" }}>{icon}</span>
              <span style={{ fontWeight: 600, color, minWidth: "160px" }}>{label}</span>
              <span style={{ color: "var(--gray-700)" }}>{scheduleToEn(schedule[key] ?? "")}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <h2 className="section-title">{en.area.faqHeading}</h2>
        {scheduleItems.map(({ key, label }) => (
          <div key={key} className="faq-item">
            <p className="faq-q">Q. {en.area.faqQ(wardSlug + " Ward", areaName, label)}</p>
            <p className="faq-a">
              {en.area.faqA(wardSlug + " Ward", areaName, label, scheduleToEn(schedule[key] ?? ""))}
            </p>
          </div>
        ))}
      </section>

      {/* ナビゲーション */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
        {prevArea && (
          <a href={`/en/Tokyo/${wardSlug}/${prevArea.slug}`} className="btn btn-outline">
            ← {prevArea.area}
          </a>
        )}
        <a href={`/en/Tokyo/${wardSlug}`} className="btn btn-outline">
          {en.area.backToList(wardSlug + " Ward")}
        </a>
        {nextArea && (
          <a href={`/en/Tokyo/${wardSlug}/${nextArea.slug}`} className="btn btn-outline">
            {nextArea.area} →
          </a>
        )}
      </div>
    </div>
  );
}
