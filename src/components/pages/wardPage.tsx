// 区・市ページ（日本語）の共有実装。
// 各県ディレクトリ（src/app/{Pref}/[ward]/page.tsx）から createWardPage(pref) で生成する。
// 東京のみのデータ状態でも従来の /Tokyo/... と同一出力になること（P0受け入れ条件）。

import type { Metadata } from "next";
import { getWardBySlug } from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { getCurrentYearJST } from "@/lib/date";
import { notFound } from "next/navigation";
import WardPageClient from "@/components/WardPageClient";
import type { PrefSlug } from "@/lib/prefs";

type Props = { params: Promise<{ ward: string }> };

export function createWardPage(pref: PrefSlug) {
  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { ward: wardSlug } = await params;
    const result = await getWardBySlug(wardSlug);
    if (!result || result.pref !== pref) return {};
    const { name: wardName, info } = result;
    const year = getCurrentYearJST();
    return {
      title: `${wardName}のごみ収集日カレンダー【${year}年】地域別一覧`,
      description: `${wardName}の全${info.areas.length}地域のごみ収集日カレンダー【${year}年】。燃やすごみ・資源・プラスチックの収集曜日を地域別に一覧表示。地域を選ぶと収集曜日をすぐに確認できます。`,
      alternates: {
        canonical: `/${pref}/${wardSlug}/`,
        languages: {
          ja: `/${pref}/${wardSlug}/`,
          "x-default": `/${pref}/${wardSlug}/`,
          en: `/en/${pref}/${wardSlug}/`,
          ko: `/ko/${pref}/${wardSlug}/`,
          zh: `/zh/${pref}/${wardSlug}/`,
        },
      },
      openGraph: {
        title: `${wardName}のごみ収集日カレンダー【${year}年】 | ゴミの日.com`,
        description: `${wardName}全${info.areas.length}地域のごみ収集スケジュール。`,
      },
    };
  }

  async function Page({ params }: Props) {
    const { ward: wardSlug } = await params;
    const result = await getWardBySlug(wardSlug);

    if (!result || result.pref !== pref) notFound();

    const { name: wardName, info } = result;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${wardName}のごみ収集日一覧`,
      description: `${wardName}の全地域のごみ収集スケジュール`,
      numberOfItems: info.areas.length,
    };

    const breadcrumbLd = breadcrumbJsonLd([
      { name: "ホーム", path: "/" },
      { name: wardName, path: `/${pref}/${wardSlug}/` },
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
        <WardPageClient pref={pref} wardName={wardName} wardInfo={info} wardSlug={wardSlug} />
      </>
    );
  }

  return { generateMetadata, Page };
}
