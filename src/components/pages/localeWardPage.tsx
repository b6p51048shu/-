// 区・市ページ（多言語）の共有実装。
// src/app/[locale]/{Pref}/[ward]/page.tsx から createLocaleWardPage(pref) で生成する。

import type { Metadata } from "next";
import { getWardBySlug } from "@/lib/data";
import { getT, isValidLocale } from "@/lib/i18n";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { notFound } from "next/navigation";
import LocaleWardPageClient from "@/components/LocaleWardPageClient";
import type { PrefSlug } from "@/lib/prefs";

type Props = { params: Promise<{ locale: string; ward: string }> };

export function createLocaleWardPage(pref: PrefSlug) {
  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, ward: wardSlug } = await params;
    if (!isValidLocale(locale)) return {};
    const t = getT(locale);
    const result = await getWardBySlug(wardSlug);
    if (!result || result.pref !== pref) return {};
    const { name: wardName, info } = result;
    return {
      title: t.ward.listTitle(`${wardSlug} Ward`),
      description: `${t.ward.listDesc(info.areas.length)} (${wardName})`,
      alternates: {
        canonical: `/${locale}/${pref}/${wardSlug}/`,
        languages: {
          ja: `/${pref}/${wardSlug}/`,
          "x-default": `/${pref}/${wardSlug}/`,
          en: `/en/${pref}/${wardSlug}/`,
          ko: `/ko/${pref}/${wardSlug}/`,
          zh: `/zh/${pref}/${wardSlug}/`,
        },
      },
    };
  }

  async function Page({ params }: Props) {
    const { locale, ward: wardSlug } = await params;
    if (!isValidLocale(locale)) notFound();

    const result = await getWardBySlug(wardSlug);
    if (!result || result.pref !== pref) notFound();

    const { name: wardName, info } = result;

    const t = getT(locale);
    const breadcrumbLd = breadcrumbJsonLd([
      { name: t.site.nav.top, path: `/${locale}/` },
      { name: `${wardSlug} Ward`, path: `/${locale}/${pref}/${wardSlug}/` },
    ]);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <LocaleWardPageClient
          locale={locale}
          pref={pref}
          wardName={wardName}
          wardInfo={info}
          wardSlug={wardSlug}
        />
      </>
    );
  }

  return { generateMetadata, Page };
}
