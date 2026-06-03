import type { Metadata } from "next";
import { getWardBySlug, getAreaBySlug, getTodayGarbage, getTomorrowGarbage } from "@/lib/data";
import type { AreaSchedule } from "@/lib/data";
import { getT, scheduleToLocale, isValidLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import LocaleGarbageCalendar from "./GarbageCalendar";
import IcsButton from "@/app/Tokyo/[ward]/[area]/IcsButton";
import BagsPanel from "@/app/Tokyo/[ward]/[area]/BagsPanel";
import InlineAd from "@/components/InlineAd";
import BottomAdBanner from "@/components/BottomAdBanner";

type Props = { params: Promise<{ locale: string; ward: string; area: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, ward: wardSlug, area: areaSlug } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getT(locale);
  const found = await getAreaBySlug(wardSlug, areaSlug);
  if (!found) return {};
  const { schedule } = found;
  return {
    title: t.area.pageTitle(schedule.area),
    description: `${wardSlug} ${schedule.area}: ${scheduleToLocale(schedule.burnable, locale)}`,
    alternates: {
      canonical: `/${locale}/Tokyo/${wardSlug}/${areaSlug}`,
      languages: {
        ja: `/Tokyo/${wardSlug}/${areaSlug}`,
        en: `/en/Tokyo/${wardSlug}/${areaSlug}`,
        ko: `/ko/Tokyo/${wardSlug}/${areaSlug}`,
        zh: `/zh/Tokyo/${wardSlug}/${areaSlug}`,
      },
    },
  };
}

const SCHEDULE_KEYS = ["burnable","unburnable","recyclable","plastic","pet","oversized"] as const;

function getScheduleItems(schedule: AreaSchedule, locale: Locale) {
  const t = getT(locale);
  return [
    { key: "burnable" as const,   label: t.schedule.burnable,   icon: "🔥", color: "#ef4444" },
    { key: "unburnable" as const, label: t.schedule.unburnable, icon: "🧊", color: "#3b82f6" },
    { key: "recyclable" as const, label: t.schedule.recyclable, icon: "♻️", color: "#10b981" },
    { key: "plastic" as const,    label: t.schedule.plastic,    icon: "🛍️", color: "#8b5cf6" },
    { key: "pet" as const,        label: t.schedule.pet,        icon: "🍾", color: "#f59e0b" },
    { key: "oversized" as const,  label: t.schedule.oversized,  icon: "🪑", color: "#6b7280" },
  ].map((def) => {
    const customLabel = def.key !== "oversized"
      ? schedule.labels?.[def.key as keyof NonNullable<AreaSchedule["labels"]>]
      : undefined;
    return customLabel ? { ...def, label: customLabel } : def;
  });
}

export default async function LocaleAreaPage({ params }: Props) {
  const { locale, ward: wardSlug, area: areaSlug } = await params;
  if (!isValidLocale(locale)) notFound();

  const t = getT(locale as Locale);
  const found = await getAreaBySlug(wardSlug, areaSlug);

  if (!found) notFound();

  const { wardName, schedule } = found;
  const wardInfo = (await getWardBySlug(wardSlug))?.info;
  const areaName = schedule.area;

  const todayItems = getTodayGarbage(schedule).map(ja => {
    const map: Record<string,string> = {
      "燃やすごみ": t.schedule.burnable,
      "燃やさないごみ": t.schedule.unburnable,
      "資源ごみ": t.schedule.recyclable,
      "プラスチック": t.schedule.plastic,
      "ペットボトル": t.schedule.pet,
    };
    return map[ja] ?? ja;
  });
  const tomorrowItems = getTomorrowGarbage(schedule).map(ja => {
    const map: Record<string,string> = {
      "燃やすごみ": t.schedule.burnable,
      "燃やさないごみ": t.schedule.unburnable,
      "資源ごみ": t.schedule.recyclable,
      "プラスチック": t.schedule.plastic,
      "ペットボトル": t.schedule.pet,
    };
    return map[ja] ?? ja;
  });

  const todayName = t.days.long[new Date().getDay()];
  const tomorrowName = t.days.long[(new Date().getDay() + 1) % 7];

  const areas = wardInfo?.areas ?? [];
  const currentIdx = areas.findIndex((a) => a.slug === areaSlug);
  const prevArea = currentIdx > 0 ? areas[currentIdx - 1] : null;
  const nextArea = currentIdx < areas.length - 1 ? areas[currentIdx + 1] : null;

  const scheduleItems = getScheduleItems(schedule, locale as Locale);

  const hasUnknown = (["burnable","unburnable","recyclable","plastic","pet"] as const).some(
    (k) => (schedule[`${k}_parsed` as keyof AreaSchedule] as { type?: string } | undefined)?.type === "unknown"
  );

  return (
    <>
    <div className="container-narrow">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href={`/${locale}`}>{t.site.nav.top}</a>
        <span><a href={`/${locale}/Tokyo/${wardSlug}`}>{wardSlug} Ward</a></span>
        <span>{areaName}</span>
      </nav>

      <h1 className="area-page-title">
        {t.area.pageTitle(areaName)}
        <span className="area-page-ward">{wardSlug} Ward</span>
      </h1>

      {/* 今日・明日 */}
      <div className="today-section">
        <h3>{t.area.todayTitle(todayName)}</h3>
        <div className="today-items">
          {todayItems.length > 0
            ? todayItems.map((item) => <span key={item} className="today-badge">✅ {item}</span>)
            : <span className="today-none">{t.area.noCollection}</span>}
        </div>
      </div>
      <div className="today-section" style={{ borderLeftColor: "#f59e0b" }}>
        <h3>{t.area.tomorrowTitle(tomorrowName)}</h3>
        <div className="today-items">
          {tomorrowItems.length > 0
            ? tomorrowItems.map((item) => (
                <span key={item} className="today-badge" style={{ background: "#fffbeb", color: "#92400e" }}>
                  ⚠️ {item}
                </span>
              ))
            : <span className="today-none">{t.area.noCollection}</span>}
        </div>
      </div>

      {hasUnknown && wardInfo?.info_url && (
        <div className="unknown-notice">
          <span>📋 </span>
          <span>Some collection days for this area are not on a fixed schedule.</span>
          <a href={wardInfo.info_url} target="_blank" rel="noopener noreferrer" className="unknown-notice-link">
            {wardSlug} Ward official site →
          </a>
        </div>
      )}

      {/* カレンダー */}
      <LocaleGarbageCalendar schedule={schedule} locale={locale as Locale} />

      {/* ICS */}
      <IcsButton wardName={wardName} areaName={areaName} schedule={schedule} />

      {/* 指定袋 */}
      {wardInfo?.bags && <BagsPanel bags={wardInfo.bags} locale={locale as Locale} />}

      {/* インライン広告（粗大ごみ・不用品回収） */}
      <InlineAd locale={locale as Locale} />

      {/* スケジュール一覧 */}
      <section style={{ margin: "2rem 0" }}>
        <h2 className="section-title">
          {locale === "ko" ? "수거 일정" : locale === "zh" ? "收集时间表" : "Collection Schedule"}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          {scheduleItems.map(({ key, label, icon, color }) => schedule[key] && (
            <div key={key} style={{ display: "flex", alignItems: "baseline", gap: ".75rem" }}>
              <span style={{ fontSize: "1.1rem" }}>{icon}</span>
              <span style={{ fontWeight: 600, color, minWidth: "160px" }}>{label}</span>
              <span style={{ color: "var(--gray-700)" }}>{scheduleToLocale(schedule[key] ?? "", locale as Locale)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <h2 className="section-title">{t.area.faqHeading}</h2>
        {scheduleItems.filter(({ key }) => schedule[key]).map(({ key, label }) => (
          <div key={key} className="faq-item">
            <p className="faq-q">Q. {t.area.faqQ(`${wardSlug} Ward`, areaName, label)}</p>
            <p className="faq-a">{t.area.faqA(`${wardSlug} Ward`, areaName, label, scheduleToLocale(schedule[key] ?? "", locale as Locale))}</p>
          </div>
        ))}
      </section>

      {/* ナビゲーション */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
        {prevArea && (
          <a href={`/${locale}/Tokyo/${wardSlug}/${prevArea.slug}`} className="btn btn-outline">
            ← {prevArea.area}
          </a>
        )}
        <a href={`/${locale}/Tokyo/${wardSlug}`} className="btn btn-outline">
          {t.area.backToList(`${wardSlug} Ward`)}
        </a>
        {nextArea && (
          <a href={`/${locale}/Tokyo/${wardSlug}/${nextArea.slug}`} className="btn btn-outline">
            {nextArea.area} →
          </a>
        )}
      </div>
    </div>
    {/* ボトム固定広告バナー（×で7日間非表示） */}
    <BottomAdBanner locale={locale as Locale} />
    </>
  );
}
