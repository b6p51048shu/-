// 粗大ごみの出し方ページ（多言語）の共有実装。
// src/app/[locale]/{Pref}/[ward]/sodaigomi/page.tsx から createLocaleSodaigomiPage(pref) で生成する。

import type { Metadata } from "next";
import { getWardBySlug } from "@/lib/data";
import { isValidLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { sodaigomiContent, fillTemplate } from "@/lib/articleContent";
import SodaigomiArticle from "@/components/SodaigomiArticle";
import type { PrefSlug } from "@/lib/prefs";

type Props = { params: Promise<{ locale: string; ward: string }> };

export function createLocaleSodaigomiPage(pref: PrefSlug) {
  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, ward: wardSlug } = await params;
    if (!isValidLocale(locale)) return {};
    const result = await getWardBySlug(wardSlug);
    if (!result || result.pref !== pref) return {};
    const { name: wardName } = result;
    const c = sodaigomiContent[locale];
    const f = (tpl: string) => fillTemplate(tpl, { ward: wardName });
    return {
      title: f(c.metaTitle),
      description: f(c.metaDesc),
      alternates: {
        canonical: `/${locale}/${pref}/${wardSlug}/sodaigomi/`,
        languages: {
          ja: `/${pref}/${wardSlug}/sodaigomi/`,
          "x-default": `/${pref}/${wardSlug}/sodaigomi/`,
          en: `/en/${pref}/${wardSlug}/sodaigomi/`,
          ko: `/ko/${pref}/${wardSlug}/sodaigomi/`,
          zh: `/zh/${pref}/${wardSlug}/sodaigomi/`,
        },
      },
      openGraph: {
        title: f(c.ogTitle),
        description: f(c.ogDesc),
      },
    };
  }

  async function Page({ params }: Props) {
    const { locale, ward: wardSlug } = await params;
    if (!isValidLocale(locale)) notFound();

    const result = await getWardBySlug(wardSlug);

    // 詳細データが揃っている自治体のみ公開（薄いコンテンツ防止）
    if (!result || result.pref !== pref || !result.info.oversized_detail) notFound();

    const { name: wardName, info } = result;

    return (
      <SodaigomiArticle locale={locale} pref={pref} wardName={wardName} wardSlug={wardSlug} info={info} />
    );
  }

  return { generateMetadata, Page };
}
