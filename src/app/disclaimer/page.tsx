import type { Metadata } from "next";
import { disclaimerContent } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "免責事項",
  description: "ゴミの日.com の免責事項。掲載情報の正確性、損害賠償の免責、外部リンク、著作権について。",
  alternates: {
    canonical: "/disclaimer/",
    languages: {
      ja: "/disclaimer/",
      "x-default": "/disclaimer/",
      en: "/en/disclaimer/",
      ko: "/ko/disclaimer/",
      zh: "/zh/disclaimer/",
    },
  },
};

export default function DisclaimerPage() {
  const c = disclaimerContent.ja;

  return (
    <div className="container-narrow">
      <nav className="breadcrumb" aria-label="パンくず">
        <a href="/">ホーム</a>
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
        <a href="/" className="btn btn-outline">{c.backHome}</a>
      </div>
    </div>
  );
}
