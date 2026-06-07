import type { Metadata } from "next";
import { getWardBySlug } from "@/lib/data";
import { isValidLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { sodaigomiContent, fillTemplate } from "@/lib/articleContent";
import SodaigomiArticle from "@/components/SodaigomiArticle";

type Props = { params: Promise<{ locale: string; ward: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, ward: wardSlug } = await params;
  if (!isValidLocale(locale)) return {};
  const result = await getWardBySlug(wardSlug);
  if (!result) return {};
  const { name: wardName } = result;
  const c = sodaigomiContent[locale];
  const f = (tpl: string) => fillTemplate(tpl, { ward: wardName });
  return {
    title: f(c.metaTitle),
    description: f(c.metaDesc),
    alternates: {
      canonical: `/${locale}/Tokyo/${wardSlug}/sodaigomi`,
      languages: {
        ja: `/Tokyo/${wardSlug}/sodaigomi`,
        en: `/en/Tokyo/${wardSlug}/sodaigomi`,
        ko: `/ko/Tokyo/${wardSlug}/sodaigomi`,
        zh: `/zh/Tokyo/${wardSlug}/sodaigomi`,
      },
    },
    openGraph: {
      title: f(c.ogTitle),
      description: f(c.ogDesc),
    },
  };
}

export default async function LocaleOversizedPage({ params }: Props) {
  const { locale, ward: wardSlug } = await params;
  if (!isValidLocale(locale)) notFound();

  const result = await getWardBySlug(wardSlug);

  // 詳細データが揃っている自治体のみ公開（薄いコンテンツ防止）
  if (!result || !result.info.oversized_detail) notFound();

  const { name: wardName, info } = result;

  return <SodaigomiArticle locale={locale} wardName={wardName} wardSlug={wardSlug} info={info} />;
}
