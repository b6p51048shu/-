import type { Metadata } from "next";
import { guideContent } from "@/lib/articleContent";

const c = guideContent.ja;

export const metadata: Metadata = {
  title: c.metaTitle,
  description: c.metaDesc,
  alternates: {
    canonical: "/guide",
    languages: {
      ja: "/guide",
      en: "/en/guide",
      ko: "/ko/guide",
      zh: "/zh/guide",
    },
  },
};

export default function GuideIndexPage() {
  return (
    <div className="container-narrow">
      <nav className="breadcrumb" aria-label="パンくず">
        <a href="/">{c.bcHome}</a>
        <span>{c.bcCurrent}</span>
      </nav>

      <h1 className="section-title">{c.h1}</h1>
      <p style={{ color: "var(--gray-600)", fontSize: ".95rem" }}>{c.lead}</p>

      <div className="guide-list">
        {c.articles.map((a) => (
          <a key={a.slug} href={`/guide/${a.slug}/`} className="guide-card">
            <div className="guide-card-title">{a.title}</div>
            <div className="guide-card-desc">{a.desc}</div>
          </a>
        ))}
      </div>

      <div style={{ marginTop: "2.5rem" }}>
        <a href="/" className="btn btn-outline">{c.backHome}</a>
      </div>
    </div>
  );
}
