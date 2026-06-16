import type { Metadata } from "next";
import { getT, isValidLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getT(locale);
  return {
    title: { absolute: `${t.site.title} | ${t.site.tagline}` },
    description: t.site.tagline,
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        ja: "/",
        en: "/en/",
        ko: "/ko/",
        zh: "/zh/",
        "x-default": "/",
      },
    },
  };
}

export default async function LocaleLayout({ children }: Props) {
  return children;
}
