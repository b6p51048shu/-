import type { BagsUILocale } from "@/lib/i18n";
import { funyohinContent } from "@/lib/articleContent";
import InlineAd from "@/components/InlineAd";

type Props = { locale: BagsUILocale };

// 目次・見出しのアンカーID（全言語共通）
const IDS = ["souba", "uchiwake", "tanpin", "truck", "jichitai", "yasuku", "chui", "faq"] as const;

/** 不用品回収の費用相場記事（ja / en / ko / zh 共通） */
export default function FunyohinArticle({ locale }: Props) {
  const c = funyohinContent[locale];
  const prefix = locale === "ja" ? "" : `/${locale}`;
  const pagePath = `${prefix}/guide/funyohin-hiyo`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: c.metaTitle,
        description: c.metaDesc,
        datePublished: "2026-06-07",
        dateModified: "2026-06-07",
        author: { "@type": "Organization", name: "ゴミの日.com" },
        publisher: { "@type": "Organization", name: "ゴミの日.com" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: c.bcHome, item: `https://gominohi.com${prefix}/` },
          { "@type": "ListItem", position: 2, name: c.bcGuide, item: `https://gominohi.com${prefix}/guide` },
          { "@type": "ListItem", position: 3, name: c.bcCurrent, item: `https://gominohi.com${pagePath}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: c.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-narrow">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href={`${prefix}/`}>{c.bcHome}</a>
          <span><a href={`${prefix}/guide/`}>{c.bcGuide}</a></span>
          <span>{c.bcCurrent}</span>
        </nav>

        <h1 className="section-title">{c.h1}</h1>
        <p className="article-updated">{c.updated}</p>

        <article className="article">
          <p className="article-lead" dangerouslySetInnerHTML={{ __html: c.leadHtml }} />

          <nav className="article-toc" aria-label={c.tocTitle}>
            <div className="article-toc-title">{c.tocTitle}</div>
            <ol>
              {c.toc.map((t, i) => (
                <li key={IDS[i]}><a href={`#${IDS[i]}`}>{t}</a></li>
              ))}
            </ol>
          </nav>

          {/* 1. 早見表 */}
          <h2 id={IDS[0]}>{c.s1H}</h2>
          <p dangerouslySetInnerHTML={{ __html: c.s1PHtml }} />
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>{c.s1Heads.map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {c.s1Rows.map((r) => (
                  <tr key={r[0]}>
                    <td>{r[0]}</td>
                    <td className="price">{r[1]}</td>
                    <td>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="article-callout" dangerouslySetInnerHTML={{ __html: c.s1CalloutHtml }} />

          {/* 2. 内訳 */}
          <h2 id={IDS[1]}>{c.s2H}</h2>
          <p>{c.s2P}</p>
          <ul>
            {c.s2ListHtml.map((li, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: li }} />
            ))}
          </ul>

          {/* 3. 品目別 */}
          <h2 id={IDS[2]}>{c.s3H}</h2>
          <p>{c.s3P}</p>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>{c.s3Heads.map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {c.s3Items.map((s) => (
                  <tr key={s[0]}>
                    <td>{s[0]}</td>
                    <td className="price">{s[1]}</td>
                    <td style={{ fontSize: ".82rem", color: "var(--gray-600)" }}>{s[2] || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="article-callout" dangerouslySetInnerHTML={{ __html: c.s3CalloutHtml }} />

          {/* 4. トラック */}
          <h2 id={IDS[3]}>{c.s4H}</h2>
          <p>{c.s4P}</p>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>{c.s4Heads.map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {c.s4Plans.map((p) => (
                  <tr key={p[0]}>
                    <td>{p[0]}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-600)" }}>{p[1]}</td>
                    <td className="price">{p[2]}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-600)" }}>{p[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p dangerouslySetInnerHTML={{ __html: c.s4P2Html }} />

          {/* アフィリエイト広告（不用品回収） */}
          <InlineAd locale={locale} />

          {/* 5. 自治体との違い */}
          <h2 id={IDS[4]}>{c.s5H}</h2>
          <p>{c.s5P}</p>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>{c.s5Heads.map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {c.s5Rows.map((r) => (
                  <tr key={r[0]}>
                    <td>{r[0]}</td>
                    <td>{r[1]}</td>
                    <td>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p dangerouslySetInnerHTML={{ __html: c.s5P2Html }} />
          <p className="article-callout">
            {c.s5CalloutPre}
            {" "}<a href={`${prefix}/`} style={{ color: "#b45309", fontWeight: 600, textDecoration: "underline" }}>{c.s5CalloutLink}</a>{" "}
            {c.s5CalloutPost}
          </p>

          {/* 6. 安く抑えるコツ */}
          <h2 id={IDS[5]}>{c.s6H}</h2>
          <ol>
            {c.s6ListHtml.map((li, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: li }} />
            ))}
          </ol>

          {/* 7. 注意点 */}
          <h2 id={IDS[6]}>{c.s7H}</h2>
          <p>{c.s7P}</p>
          <ul>
            {c.s7ListHtml.map((li, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: li }} />
            ))}
          </ul>

          {/* FAQ */}
          <h2 id={IDS[7]}>{c.faqH}</h2>
          <div className="faq-section" style={{ marginTop: "1rem" }}>
            {c.faq.map((f) => (
              <div key={f.q} className="faq-item">
                <p className="faq-q">Q. {f.q}</p>
                <p className="faq-a">{f.a}</p>
              </div>
            ))}
          </div>

          <div className="article-callout" style={{ marginTop: "2rem" }}>{c.disclaimer}</div>

          <div className="article-related">
            <strong>{c.relatedTitle}</strong>
            <div className="article-related-links">
              <a href={`${prefix}/guide/`} className="btn btn-outline">{c.relatedGuide}</a>
              <a href={`${prefix}/`} className="btn btn-outline">{c.relatedCalendar}</a>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
