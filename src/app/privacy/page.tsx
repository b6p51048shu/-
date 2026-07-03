import type { Metadata } from "next";
import { privacyContent } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "ゴミの日.com のプライバシーポリシー。Cookie・アクセス解析（GA4）・広告配信（Google AdSense）・アフィリエイト・運営者情報・お問い合わせについて。",
  alternates: {
    canonical: "/privacy/",
    languages: {
      ja: "/privacy/",
      "x-default": "/privacy/",
      en: "/en/privacy/",
      ko: "/ko/privacy/",
      zh: "/zh/privacy/",
    },
  },
};

export default function PrivacyPage() {
  const c = privacyContent.ja;

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
