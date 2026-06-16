import type { Metadata } from "next";
import { privacyContent, siteChrome, isValidLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const c = privacyContent[locale];
  return {
    title: c.title,
    description: c.sections[0]?.p.slice(0, 120),
    alternates: {
      canonical: `/${locale}/privacy/`,
      languages: {
        ja: "/privacy/",
        en: "/en/privacy/",
        ko: "/ko/privacy/",
        zh: "/zh/privacy/",
      },
    },
  };
}

export default async function LocalePrivacyPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const c = privacyContent[locale];
  const chrome = siteChrome[locale];

  return (
    <div className="container-narrow">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href={`/${locale}/`}>{chrome.navTop}</a>
        <span>{c.title}</span>
      </nav>

      <h1 className="section-title">{c.title}</h1>
      <p style={{ color: "var(--gray-400)", fontSize: ".85rem", marginBottom: "2rem" }}>{c.updated}</p>

      {c.sections.map((s, i) => (
        <section key={i} style={{ marginBottom: "1.75rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".5rem", color: "var(--gray-800)" }}>{s.h}</h2>
          <p style={{ lineHeight: 1.8, color: "var(--gray-700)" }}>{s.p}</p>
        </section>
      ))}

      <div style={{ marginTop: "2.5rem" }}>
        <a href={`/${locale}/`} className="btn btn-outline">{c.backHome}</a>
      </div>
    </div>
  );
}
