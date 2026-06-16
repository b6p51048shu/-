import type { Metadata } from "next";
import { guideContent } from "@/lib/articleContent";
import { isValidLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const c = guideContent[locale];
  return {
    title: c.metaTitle,
    description: c.metaDesc,
    alternates: {
      canonical: `/${locale}/guide/`,
      languages: {
        ja: "/guide/",
        en: "/en/guide/",
        ko: "/ko/guide/",
        zh: "/zh/guide/",
      },
    },
  };
}

export default async function LocaleGuideIndexPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const c = guideContent[locale];

  return (
    <div className="container-narrow">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href={`/${locale}/`}>{c.bcHome}</a>
        <span>{c.bcCurrent}</span>
      </nav>

      <h1 className="section-title">{c.h1}</h1>
      <p style={{ color: "var(--gray-600)", fontSize: ".95rem" }}>{c.lead}</p>

      <div className="guide-list">
        {c.articles.map((a) => (
          <a key={a.slug} href={`/${locale}/guide/${a.slug}/`} className="guide-card">
            <div className="guide-card-title">{a.title}</div>
            <div className="guide-card-desc">{a.desc}</div>
          </a>
        ))}
      </div>

      <div style={{ marginTop: "2.5rem" }}>
        <a href={`/${locale}/`} className="btn btn-outline">{c.backHome}</a>
      </div>
    </div>
  );
}
