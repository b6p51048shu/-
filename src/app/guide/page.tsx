import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お役立ちガイド | ゴミの日.com",
  description: "不用品回収の費用相場、粗大ごみの捨て方、引越し時のゴミ処分など、ごみ・不用品の処分に役立つ情報をまとめています。",
  alternates: { canonical: "/guide" },
};

const ARTICLES: { href: string; title: string; desc: string }[] = [
  {
    href: "/guide/funyohin-hiyo",
    title: "不用品回収の費用相場【2026年版】",
    desc: "単品・トラック積み放題の料金目安、自治体回収との違い、安く抑えるコツ、悪質業者の見分け方まで解説。",
  },
];

export default function GuideIndexPage() {
  return (
    <div className="container-narrow">
      <nav className="breadcrumb" aria-label="パンくず">
        <a href="/">ホーム</a>
        <span>お役立ちガイド</span>
      </nav>

      <h1 className="section-title">お役立ちガイド</h1>
      <p style={{ color: "var(--gray-600)", fontSize: ".95rem" }}>
        ごみの分別・処分や、不用品・粗大ごみの片付けに役立つ情報をまとめています。
      </p>

      <div className="guide-list">
        {ARTICLES.map((a) => (
          <a key={a.href} href={a.href} className="guide-card">
            <div className="guide-card-title">{a.title}</div>
            <div className="guide-card-desc">{a.desc}</div>
          </a>
        ))}
      </div>

      <div style={{ marginTop: "2.5rem" }}>
        <a href="/" className="btn btn-outline">← トップに戻る</a>
      </div>
    </div>
  );
}
