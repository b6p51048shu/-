import type { Metadata } from "next";
import { getWardBySlug } from "@/lib/data";
import { getT, isValidLocale } from "@/lib/i18n";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { notFound } from "next/navigation";
import LocaleWardPageClient from "./WardPageClient";

type Props = { params: Promise<{ locale: string; ward: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, ward: wardSlug } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getT(locale);
  const result = await getWardBySlug(wardSlug);
  if (!result) return {};
  const { name: wardName, info } = result;
  return {
    title: t.ward.listTitle(`${wardSlug} Ward`),
    description: `${t.ward.listDesc(info.areas.length)} (${wardName})`,
    alternates: {
      canonical: `/${locale}/Tokyo/${wardSlug}/`,
      languages: {
        ja: `/Tokyo/${wardSlug}/`,
        "x-default": `/Tokyo/${wardSlug}/`,
        en: `/en/Tokyo/${wardSlug}/`,
        ko: `/ko/Tokyo/${wardSlug}/`,
        zh: `/zh/Tokyo/${wardSlug}/`,
      },
    },
  };
}

export default async function LocaleWardPage({ params }: Props) {
  const { locale, ward: wardSlug } = await params;
  if (!isValidLocale(locale)) notFound();

  const result = await getWardBySlug(wardSlug);
  if (!result) notFound();

  const { name: wardName, info } = result;

  const t = getT(locale);
  const breadcrumbLd = breadcrumbJsonLd([
    { name: t.site.nav.top, path: `/${locale}/` },
    { name: `${wardSlug} Ward`, path: `/${locale}/Tokyo/${wardSlug}/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <LocaleWardPageClient
        locale={locale}
        wardName={wardName}
        wardInfo={info}
        wardSlug={wardSlug}
      />
    </>
  );
}
