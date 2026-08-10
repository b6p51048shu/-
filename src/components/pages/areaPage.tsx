// 地域ページ（日本語）の共有実装。
// 各県ディレクトリ（src/app/{Pref}/[ward]/[area]/page.tsx）から createAreaPage(pref) で生成する。
// 東京のみのデータ状態でも従来の /Tokyo/... と同一出力になること（P0受け入れ条件）。

import type { Metadata } from "next";
import { getWardBySlug, getAreaBySlug, getTodayGarbage, getTomorrowGarbage } from "@/lib/data";
import type { AreaSchedule } from "@/lib/data";
import { getCurrentDayOfWeekJST } from "@/lib/date";
import IcsButton from "@/components/IcsButton";
import GarbageCalendar from "@/components/GarbageCalendar";
import BagsPanel from "@/components/BagsPanel";
import RakutenAdCard from "@/components/RakutenAdCard";
import { breadcrumbJsonLd, nearbyAreas } from "@/lib/jsonld";
import { notFound } from "next/navigation";
import type { PrefSlug } from "@/lib/prefs";

type Props = { params: Promise<{ ward: string; area: string }> };

/** 「火曜日・金曜日」→「火・金」のように曜日文字だけ抽出して短縮する */
function shortDays(s: string): string {
  // 「曜日」「曜」を先に除去してから1文字マッチ（「火曜日」の"日"を誤検出しない）
  const normalized = s.replace(/曜日/g, "").replace(/曜/g, "");
  const matches = normalized.match(/[月火水木金土日]/g);
  return matches ? [...new Set(matches)].join("・") : s;
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

export function createAreaPage(pref: PrefSlug) {
  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { ward: wardSlug, area: areaSlug } = await params;
    const found = await getAreaBySlug(wardSlug, areaSlug);
    if (!found || found.pref !== pref) return {};

    const { wardName, schedule } = found;
    const burnable = schedule.burnable ? shortDays(schedule.burnable) : "";
    // 種別名は labels 優先（千葉市の plastic=古紙・布類 等）。labels 無しの区市は従来と同一文字列
    const titleSuffix = burnable ? `（${schedule.labels?.burnable ?? "燃やすごみ"}: ${burnable}）` : "";

    const parts = [
      schedule.burnable && `${schedule.labels?.burnable ?? "燃やすごみ"}: ${schedule.burnable}`,
      schedule.unburnable && `${schedule.labels?.unburnable ?? "燃やさないごみ"}: ${schedule.unburnable}`,
      schedule.recyclable && `${schedule.labels?.recyclable ?? "資源"}: ${schedule.recyclable}`,
      schedule.plastic && `${schedule.labels?.plastic ?? "プラスチック"}: ${schedule.plastic}`,
    ].filter(Boolean);

    return {
      title: `${wardName} ${schedule.area}のごみ収集日カレンダー${titleSuffix}`,
      description: `${wardName} ${schedule.area}のごみ収集スケジュール。${parts.join("、")}。`,
      alternates: {
        canonical: `/${pref}/${wardSlug}/${areaSlug}/`,
        languages: {
          ja: `/${pref}/${wardSlug}/${areaSlug}/`,
          "x-default": `/${pref}/${wardSlug}/${areaSlug}/`,
          en: `/en/${pref}/${wardSlug}/${areaSlug}/`,
          ko: `/ko/${pref}/${wardSlug}/${areaSlug}/`,
          zh: `/zh/${pref}/${wardSlug}/${areaSlug}/`,
        },
      },
      openGraph: {
        title: `${wardName} ${schedule.area}のごみ収集日カレンダー${titleSuffix} | ゴミの日.com`,
        description: `${parts.join("、")}`,
      },
    };
  }

  async function Page({ params }: Props) {
    const { ward: wardSlug, area: areaSlug } = await params;
    const found = await getAreaBySlug(wardSlug, areaSlug);

    if (!found || found.pref !== pref) notFound();

    const { wardName, schedule } = found;
    const wardInfo = (await getWardBySlug(wardSlug))?.info;
    const areaName = schedule.area;
    const todayItems = getTodayGarbage(schedule);
    const tomorrowItems = getTomorrowGarbage(schedule);
    const dayNames = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
    const currentDayJST = getCurrentDayOfWeekJST();
    const todayName = dayNames[currentDayJST];
    const tomorrowName = dayNames[(currentDayJST + 1) % 7];

    const areas = wardInfo?.areas ?? [];
    const currentIdx = areas.findIndex((a) => a.slug === areaSlug);
    const prevArea = currentIdx > 0 ? areas[currentIdx - 1] : null;
    const nextArea = currentIdx < areas.length - 1 ? areas[currentIdx + 1] : null;
    const nearby = nearbyAreas(areas, areaSlug);

    const scheduleItems = getScheduleItems(schedule);

    // 収集曜日データが1つも無い地域（地区番号制などで固定曜日を持たない自治体）
    // この場合はカレンダーを描画せず、公式の収集日案内ページへ誘導する
    const hasAnySchedule = (["burnable","unburnable","recyclable","plastic","pet","oversized"] as const).some(
      (k) => typeof schedule[k] === "string" && (schedule[k] as string).trim() !== ""
    );

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

    const breadcrumbLd = breadcrumbJsonLd([
      { name: "ホーム", path: "/" },
      { name: wardName, path: `/${pref}/${wardSlug}/` },
      { name: areaName, path: `/${pref}/${wardSlug}/${areaSlug}/` },
    ]);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <div className="container-narrow">
          <nav className="breadcrumb" aria-label="パンくず">
            <a href="/">ホーム</a>
            <span><a href={`/${pref}/${wardSlug}/`}>{wardName}</a></span>
            <span>{areaName}</span>
          </nav>

          <h1 className="area-page-title">
            {areaName}のごみ収集日カレンダー
            <span className="area-page-ward">{wardName}</span>
          </h1>

          {/* 収集日データが無い地域：公式の収集日案内へ誘導 */}
          {!hasAnySchedule && (
            <div className="noschedule-notice">
              <span className="noschedule-notice-icon" aria-hidden="true">🗑️</span>
              <div className="noschedule-notice-body">
                <p className="noschedule-notice-title">この地域の収集日はカレンダー未対応です</p>
                <p className="noschedule-notice-text">
                  {wardName}は収集地区ごとに収集曜日が分かれており、当サイトのカレンダーには未収録です。
                  お住まいの地区の正確な収集日は、{wardName}公式の収集日案内でご確認ください。
                </p>
                {wardInfo?.info_url && (
                  <a href={wardInfo.info_url} target="_blank" rel="noopener noreferrer" className="noschedule-notice-link">
                    {wardName}の収集日カレンダー（公式）→
                  </a>
                )}
              </div>
            </div>
          )}

          {/* 今日・明日のごみ（収集日データがある場合のみ） */}
          {hasAnySchedule && (
          <>
          <div className="today-section">
            <h2>📅 今日（{todayName}）のごみ</h2>
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
            <h2>📅 明日（{tomorrowName}）のごみ</h2>
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
          </>
          )}

          {/* 指定ごみ袋情報（あれば表示） */}
          {wardInfo?.bags && <BagsPanel bags={wardInfo.bags} />}

          {/* 粗大ごみ案内（詳細ページがあれば内部リンク、なければ公式リンク） */}
          {(wardInfo?.oversized_detail || wardInfo?.oversized_url) && (
            <div className="oversized-notice">
              <span className="oversized-notice-icon" aria-hidden="true">🪑</span>
              <div className="oversized-notice-body">
                <p className="oversized-notice-title">粗大ごみの出し方</p>
                <p className="oversized-notice-text">
                  {wardName}の粗大ごみは事前の申し込みが必要な場合が多く、収集日カレンダーには表示されません。申し込み方法・手数料・注意点をまとめています。
                </p>
                {wardInfo?.oversized_detail ? (
                  <a href={`/${pref}/${wardSlug}/sodaigomi/`} className="oversized-notice-link">
                    {wardName}の粗大ごみの出し方を見る →
                  </a>
                ) : (
                  <a href={wardInfo!.oversized_url} target="_blank" rel="noopener noreferrer" className="oversized-notice-link">
                    {wardName}の粗大ごみ申し込み（公式）→
                  </a>
                )}
              </div>
            </div>
          )}

          {/* インライン広告（粗大ごみ・不用品回収） */}
          <RakutenAdCard locale="ja" order="drain-first" />

          {/* FAQ テキスト (SEO) — 収集日データがある場合のみ */}
          {hasAnySchedule && (
          <section className="faq-section">
            <h2 className="section-title">よくある質問</h2>
            {scheduleItems.filter(({ key }) => schedule[key]).map(({ key, label }) => (
              <div key={key} className="faq-item">
                <p className="faq-q">Q. {wardName} {areaName}の{label}は何曜日ですか？</p>
                <p className="faq-a">{wardName} {areaName}の{label}は<strong>{schedule[key]}</strong>です。</p>
              </div>
            ))}
          </section>
          )}

          {/* ごみ出しの基本（エリア固有テキスト） */}
          {hasAnySchedule && (
            <section style={{ margin: "2rem 0" }}>
              <h2 className="section-title">{areaName}（{wardName}）のごみ出しの基本</h2>
              <p style={{ lineHeight: 1.9, marginBottom: "1rem" }}>
                {wardName}{areaName}のごみ収集は、
                {scheduleItems
                  .filter(({ key }) => schedule[key])
                  .map(({ label, key }) => `${label}が${schedule[key]}`)
                  .join("、")}
                です。
                {schedule.collection_note
                  ? `${schedule.collection_note}出す時間・場所の詳細は市の公式案内をご確認ください。`
                  : "収集日の朝、決められた時間まで（多くの自治体で朝8時まで）に所定の場所へ出してください。"}
                祝日の収集有無や年末年始の特別スケジュールは自治体により異なるため、
                時期によっては{wardName}の公式案内もあわせてご確認ください。
              </p>
              <ul style={{ paddingLeft: "1.4rem", lineHeight: 2 }}>
                <li>
                  {wardInfo?.bags
                    ? `${wardName}では指定収集袋を使用します。袋の種類・購入場所は上記の指定袋情報をご覧ください。`
                    : `${wardName}では中身の見える透明・半透明の袋で出せます（指定袋はありません）。`}
                </li>
                <li>
                  おおむね一辺30cmを超える大型のごみは「粗大ごみ」となり、事前の申し込みが必要です
                  {wardInfo?.oversized_detail ? (
                    <>（<a href={`/${pref}/${wardSlug}/sodaigomi/`}>{wardName}の粗大ごみの出し方</a>）</>
                  ) : null}
                  。
                </li>
                <li>
                  テレビ・冷蔵庫・洗濯機・エアコンの家電4品目とパソコンは、法律により自治体では収集されません。
                  処分方法は<a href="/items/">品目別の捨て方</a>で確認できます。
                </li>
              </ul>
              {wardInfo?.info_url && (
                <p style={{ fontSize: ".8rem", color: "var(--gray-600)", marginTop: ".75rem" }}>
                  出典・最新情報:{" "}
                  <a href={wardInfo.info_url} target="_blank" rel="noopener noreferrer">
                    {wardName}公式サイト
                  </a>
                </p>
              )}
            </section>
          )}

          {/* 同じ区の近隣エリア（内部リンク） */}
          {nearby.length > 0 && (
            <section style={{ marginTop: "2rem" }}>
              <h2 className="section-title">{wardName}の他のエリア</h2>
              <div className="area-list">
                {nearby.map((a) => (
                  <a key={a.slug} href={`/${pref}/${wardSlug}/${a.slug}/`} className="area-link">
                    {a.area}
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* 前後ナビゲーション */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
            {prevArea && (
              <a href={`/${pref}/${wardSlug}/${prevArea.slug}/`} className="btn btn-outline">
                ← {prevArea.area}
              </a>
            )}
            <a href={`/${pref}/${wardSlug}/`} className="btn btn-outline">
              {wardName}一覧
            </a>
            {nextArea && (
              <a href={`/${pref}/${wardSlug}/${nextArea.slug}/`} className="btn btn-outline">
                {nextArea.area} →
              </a>
            )}
          </div>
        </div>
      </>
    );
  }

  return { generateMetadata, Page };
}
