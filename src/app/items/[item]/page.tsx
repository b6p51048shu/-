import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ITEM_CATEGORIES, getItemBySlug } from "@/data/items";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import RakutenAdCard from "@/components/RakutenAdCard";

type Props = { params: Promise<{ item: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { item: slug } = await params;
  const item = getItemBySlug(slug);
  if (!item) return {};
  const cat = ITEM_CATEGORIES[item.category];
  return {
    title: `${item.name}の捨て方・何ゴミ？【${cat.label}】分別と出し方の注意点`,
    description: item.summary,
    alternates: { canonical: `/items/${item.slug}/` },
    openGraph: {
      title: `${item.name}の捨て方・何ゴミ？ | ゴミの日.com`,
      description: item.summary,
    },
  };
}

export default async function ItemPage({ params }: Props) {
  const { item: slug } = await params;
  const item = getItemBySlug(slug);
  if (!item) notFound();

  const cat = ITEM_CATEGORIES[item.category];
  const related = item.related
    .map((s) => getItemBySlug(s))
    .filter((i): i is NonNullable<typeof i> => Boolean(i));

  const faqs = [
    { q: `${item.name}は何ゴミですか？`, a: item.summary },
    { q: `${item.name}を出すときの注意点は？`, a: item.points.join(" ") },
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "ホーム", path: "/" },
    { name: "品目別の捨て方", path: "/items/" },
    { name: item.name, path: `/items/${item.slug}/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="container-narrow">
        <nav className="breadcrumb" aria-label="パンくず">
          <a href="/">ホーム</a>
          <span><a href="/items/">品目別の捨て方</a></span>
          <span>{item.name}</span>
        </nav>

        <h1 className="area-page-title">
          {item.emoji} {item.name}の捨て方・何ゴミ？
        </h1>

        {/* 結論ファースト */}
        <div className="today-section" style={{ borderLeftColor: cat.color }}>
          <h2>
            結論:{" "}
            <span
              style={{
                display: "inline-block",
                background: cat.color,
                color: "#fff",
                borderRadius: "6px",
                padding: ".1rem .6rem",
                fontSize: ".95rem",
              }}
            >
              {cat.label}
            </span>
          </h2>
          <p style={{ margin: ".5rem 0 0", lineHeight: 1.8 }}>{item.summary}</p>
        </div>

        {/* 出し方のポイント */}
        <section style={{ margin: "2rem 0" }}>
          <h2 className="section-title">出し方のポイント</h2>
          <ul style={{ paddingLeft: "1.4rem", lineHeight: 2 }}>
            {item.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        {/* よくある間違い */}
        <section style={{ margin: "2rem 0" }}>
          <h2 className="section-title">よくある間違い・NG</h2>
          <ul style={{ paddingLeft: "1.4rem", lineHeight: 2 }}>
            {item.mistakes.map((m) => (
              <li key={m}>⚠️ {m}</li>
            ))}
          </ul>
        </section>

        {/* 自治体差の注意＋エリア検索導線 */}
        <div className="oversized-notice">
          <span className="oversized-notice-icon" aria-hidden="true">📍</span>
          <div className="oversized-notice-body">
            <p className="oversized-notice-title">分別ルールは自治体ごとに異なります</p>
            <p className="oversized-notice-text">
              このページは東京23区を中心とした一般的な出し方の解説です。正確な分別区分と収集曜日は、お住まいの地域のページでご確認ください。
            </p>
            <a href="/" className="oversized-notice-link">
              お住まいの地域のごみ収集日を調べる →
            </a>
          </div>
        </div>

        {/* 粗大ごみ・処分困難系はアフィリエイト枠 */}
        {(item.sodai || item.category === "hazard" || item.category === "kaden") && (
          <RakutenAdCard locale="ja" order="dispenser-first" />
        )}

        {/* FAQ（SEOテキスト） */}
        <section className="faq-section">
          <h2 className="section-title">よくある質問</h2>
          {faqs.map((f) => (
            <div key={f.q} className="faq-item">
              <p className="faq-q">Q. {f.q}</p>
              <p className="faq-a">{f.a}</p>
            </div>
          ))}
        </section>

        {/* 関連品目 */}
        {related.length > 0 && (
          <section style={{ marginTop: "2rem" }}>
            <h2 className="section-title">関連する品目</h2>
            <div className="area-list">
              {related.map((r) => (
                <a key={r.slug} href={`/items/${r.slug}/`} className="area-link">
                  {r.emoji} {r.name}
                </a>
              ))}
            </div>
          </section>
        )}

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
          <a href="/items/" className="btn btn-outline">
            品目一覧に戻る
          </a>
          <a href="/" className="btn btn-outline">
            地域から収集日を調べる
          </a>
        </div>
      </div>
    </>
  );
}
