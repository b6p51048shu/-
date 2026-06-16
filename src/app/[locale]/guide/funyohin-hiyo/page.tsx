import type { Metadata } from "next";
import { funyohinContent } from "@/lib/articleContent";
import { isValidLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import FunyohinArticle from "@/components/FunyohinArticle";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const c = funyohinContent[locale];
  return {
    title: c.metaTitle,
    description: c.metaDesc,
    alternates: {
      canonical: `/${locale}/guide/funyohin-hiyo/`,
      languages: {
        ja: "/guide/funyohin-hiyo/",
        en: "/en/guide/funyohin-hiyo/",
        ko: "/ko/guide/funyohin-hiyo/",
        zh: "/zh/guide/funyohin-hiyo/",
      },
    },
    openGraph: {
      title: c.ogTitle,
      description: c.ogDesc,
    },
  };
}

export default async function LocaleFunyohinHiyoPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  return <FunyohinArticle locale={locale} />;
}
