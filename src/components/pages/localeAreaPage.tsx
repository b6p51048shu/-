// 地域ページ（多言語）の共有実装。
// src/app/[locale]/{Pref}/[ward]/[area]/page.tsx から createLocaleAreaPage(pref) で生成する。

import type { Metadata } from "next";
import { getWardBySlug, getAreaBySlug, getTodayGarbageKeys, getTomorrowGarbageKeys } from "@/lib/data";
import type { GarbageKey } from "@/lib/data";
import type { AreaSchedule } from "@/lib/data";
import { getT, scheduleToLocale, isValidLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import LocaleGarbageCalendar from "@/components/LocaleGarbageCalendar";
import IcsButton from "@/components/IcsButton";
import BagsPanel from "@/components/BagsPanel";
import InlineAd from "@/components/InlineAd";
import BottomAdBanner from "@/components/BottomAdBanner";
import { breadcrumbJsonLd, nearbyAreas } from "@/lib/jsonld";
import type { PrefSlug } from "@/lib/prefs";

type Props = { params: Promise<{ locale: string; ward: string; area: string }> };

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

export function createLocaleAreaPage(pref: PrefSlug) {
  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, ward: wardSlug, area: areaSlug } = await params;
    if (!isValidLocale(locale)) return {};
    const t = getT(locale);
    const found = await getAreaBySlug(wardSlug, areaSlug);
    if (!found || found.pref !== pref) return {};
    const { schedule } = found;
    return {
      title: t.area.pageTitle(schedule.area),
      description: `${wardSlug} ${schedule.area}: ${scheduleToLocale(schedule.burnable, locale)}`,
      alternates: {
        canonical: `/${locale}/${pref}/${wardSlug}/${areaSlug}/`,
        languages: {
          ja: `/${pref}/${wardSlug}/${areaSlug}/`,
          "x-default": `/${pref}/${wardSlug}/${areaSlug}/`,
          en: `/en/${pref}/${wardSlug}/${areaSlug}/`,
          ko: `/ko/${pref}/${wardSlug}/${areaSlug}/`,
          zh: `/zh/${pref}/${wardSlug}/${areaSlug}/`,
        },
      },
    };
  }

  async function Page({ params }: Props) {
    const { locale, ward: wardSlug, area: areaSlug } = await params;
    if (!isValidLocale(locale)) notFound();

    const t = getT(locale as Locale);
    const found = await getAreaBySlug(wardSlug, areaSlug);

    if (!found || found.pref !== pref) notFound();

    const { wardName, schedule } = found;
    const wardInfo = (await getWardBySlug(wardSlug))?.info;
    const areaName = schedule.area;

    // 表示名: labels（区市独自の日本語区分名）があればそれを優先、なければ翻訳名。
    // カレンダー・スケジュールカード（getScheduleItems / LocaleGarbageCalendar）と同じ優先順位。
    const localeGarbageLabel = (key: GarbageKey): string =>
      schedule.labels?.[key] ?? t.schedule[key];
    const todayItems = getTodayGarbageKeys(schedule).map(localeGarbageLabel);
    const tomorrowItems = getTomorrowGarbageKeys(schedule).map(localeGarbageLabel);

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

    const nearby = nearbyAreas(areas, areaSlug);
    const nearbyTitle =
      locale === "ko" ? `${wardSlug}구의 다른 지역` :
      locale === "zh" ? `${wardSlug}区的其他区域` :
      `Other areas in ${wardSlug} Ward`;

    const breadcrumbLd = breadcrumbJsonLd([
      { name: t.site.nav.top, path: `/${locale}/` },
      { name: `${wardSlug} Ward`, path: `/${locale}/${pref}/${wardSlug}/` },
      { name: areaName, path: `/${locale}/${pref}/${wardSlug}/${areaSlug}/` },
    ]);

    return (
      <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="container-narrow">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href={`/${locale}/`}>{t.site.nav.top}</a>
          <span><a href={`/${locale}/${pref}/${wardSlug}/`}>{wardSlug} Ward</a></span>
          <span>{areaName}</span>
        </nav>

        <h1 className="area-page-title">
          {t.area.pageTitle(areaName)}
          <span className="area-page-ward">{wardSlug} Ward</span>
        </h1>

        {/* 今日・明日 */}
        <div className="today-section">
          <h2>{t.area.todayTitle(todayName)}</h2>
          <div className="today-items">
            {todayItems.length > 0
              ? todayItems.map((item) => <span key={item} className="today-badge">✅ {item}</span>)
              : <span className="today-none">{t.area.noCollection}</span>}
          </div>
        </div>
        <div className="today-section" style={{ borderLeftColor: "#f59e0b" }}>
          <h2>{t.area.tomorrowTitle(tomorrowName)}</h2>
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

        {/* 粗大ごみ案内（自治体公式ページへのリンク） */}
        {wardInfo?.oversized_url && (() => {
          const ov = {
            en: {
              title: "How to dispose of oversized waste",
              text: `Oversized (bulky) waste usually requires an advance request and is not shown on the calendar. Please check the official page for pickup dates, fees and how to apply.`,
              link: `${wardSlug} Ward oversized waste (official) →`,
            },
            ko: {
              title: "대형 쓰레기 배출 방법",
              text: `대형(조대) 쓰레기는 대부분 사전 신청이 필요하며 달력에는 표시되지 않습니다. 수거일·수수료·신청 방법은 공식 페이지에서 확인하세요.`,
              link: `${wardSlug}구 대형 쓰레기 신청 (공식) →`,
            },
            zh: {
              title: "大件垃圾的丢弃方法",
              text: `大件（粗大）垃圾大多需要事先申请，且不会显示在日历上。收集日、手续费和申请方法请查看官方页面。`,
              link: `${wardSlug}区大件垃圾申请（官方）→`,
            },
          }[locale as "en" | "ko" | "zh"];
          if (!ov) return null;
          return (
            <div className="oversized-notice">
              <span className="oversized-notice-icon" aria-hidden="true">🪑</span>
              <div className="oversized-notice-body">
                <p className="oversized-notice-title">{ov.title}</p>
                <p className="oversized-notice-text">{ov.text}</p>
                <a
                  href={wardInfo.oversized_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="oversized-notice-link"
                >
                  {ov.link}
                </a>
              </div>
            </div>
          );
        })()}

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

        {/* 同じ区の近隣エリア（内部リンク） */}
        {nearby.length > 0 && (
          <section style={{ marginTop: "2rem" }}>
            <h2 className="section-title">{nearbyTitle}</h2>
            <div className="area-list">
              {nearby.map((a) => (
                <a key={a.slug} href={`/${locale}/${pref}/${wardSlug}/${a.slug}/`} className="area-link">
                  {a.area}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ナビゲーション */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
          {prevArea && (
            <a href={`/${locale}/${pref}/${wardSlug}/${prevArea.slug}/`} className="btn btn-outline">
              ← {prevArea.area}
            </a>
          )}
          <a href={`/${locale}/${pref}/${wardSlug}/`} className="btn btn-outline">
            {t.area.backToList(`${wardSlug} Ward`)}
          </a>
          {nextArea && (
            <a href={`/${locale}/${pref}/${wardSlug}/${nextArea.slug}/`} className="btn btn-outline">
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

  return { generateMetadata, Page };
}
