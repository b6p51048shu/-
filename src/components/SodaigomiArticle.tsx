import type { WardInfo } from "@/lib/data";
import type { BagsUILocale } from "@/lib/i18n";
import { sodaigomiContent, fillTemplate } from "@/lib/articleContent";
import InlineAd from "@/components/InlineAd";
import BottomAdBanner from "@/components/BottomAdBanner";

type Props = {
  locale: BagsUILocale;
  wardName: string;
  wardSlug: string;
  info: WardInfo;
};

/**
 * 粗大ごみの出し方記事（ja / en / ko / zh 共通）。
 * テンプレート文は locale ごとに翻訳し、自治体データ値（定義・手数料・電話・注意点等）は
 * 日本語のまま埋め込む。
 */
export default function SodaigomiArticle({ locale, wardName, wardSlug, info }: Props) {
  const c = sodaigomiContent[locale];
  const d = info.oversized_detail;
  const officialUrl = info.oversized_url;
  // ja はプレフィックス無し、他言語は /{locale}
  const prefix = locale === "ja" ? "" : `/${locale}`;
  const f = (tpl: string, vars: Record<string, string> = {}) =>
    fillTemplate(tpl, { ward: wardName, ...vars });

  // 手順（申し込み→処理券購入→排出）
  const steps = [
    {
      name: c.step1Name,
      text: (d?.definition ? f(c.step1WithDef, { definition: d.definition }) : c.step1NoDef).trim(),
    },
    {
      name: c.step2Name,
      text: (d?.methods?.length
        ? f(c.step2WithMethods, { methods: d.methods.join("・") }) +
          (d.tel ? f(c.step2TelSuffix, { tel: d.tel, telHours: d.tel_hours ?? c.telHoursFallback }) : "")
        : c.step2NoMethods
      ).trim(),
    },
    {
      name: c.step3Name,
      text: (d?.fee ? f(c.step3WithFee, { fee: d.fee }) : c.step3NoFee).trim(),
    },
    {
      name: c.step4Name,
      text: f(c.step4, { dropoff: d?.dropoff ?? "" }).trim(),
    },
  ];

  // FAQ
  const faq: { q: string; a: string }[] = [];
  if (d?.tel) {
    faq.push({
      q: f(c.faqTelQ),
      a: (
        f(c.faqTelA1, { tel: d.tel }) +
        (d.tel_hours ? f(c.faqTelAHours, { telHours: d.tel_hours }) : "") +
        (d.online_url ? c.faqTelAOnline : "")
      ).trim(),
    });
  }
  if (d?.fee) {
    faq.push({ q: f(c.faqFeeQ), a: d.fee });
  }
  if (d?.definition) {
    faq.push({ q: f(c.faqDefQ), a: f(c.faqDefA, { definition: d.definition }) });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        name: f(c.howtoName),
        description: f(c.howtoDesc),
        step: steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: c.bcHome, item: `https://gominohi.com${prefix}/` },
          { "@type": "ListItem", position: 2, name: wardName, item: `https://gominohi.com${prefix}/Tokyo/${wardSlug}/` },
          { "@type": "ListItem", position: 3, name: c.bcCurrent, item: `https://gominohi.com${prefix}/Tokyo/${wardSlug}/sodaigomi/` },
        ],
      },
      ...(faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faq.map((fq) => ({
                "@type": "Question",
                name: fq.q,
                acceptedAnswer: { "@type": "Answer", text: fq.a },
              })),
            },
          ]
        : []),
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
          <span><a href={`${prefix}/Tokyo/${wardSlug}/`}>{wardName}</a></span>
          <span>{c.bcCurrent}</span>
        </nav>

        <article className="article">
          <h1 className="section-title">{f(c.h1)}</h1>
          <p className="article-lead">{f(c.lead)}</p>

          {/* 概要テーブル */}
          <div className="price-table-wrap">
            <table className="price-table">
              <tbody>
                {d?.definition && (
                  <tr><th>{c.tDefinition}</th><td>{d.definition}</td></tr>
                )}
                {d?.methods?.length && (
                  <tr><th>{c.tMethods}</th><td>{d.methods.join("・")}</td></tr>
                )}
                {d?.tel && (
                  <tr><th>{c.tTel}</th><td>{d.tel}{d.tel_hours ? `（${d.tel_hours}）` : ""}</td></tr>
                )}
                {d?.fee && (
                  <tr><th>{c.tFee}</th><td>{d.fee}</td></tr>
                )}
                {d?.dropoff && (
                  <tr><th>{c.tDropoff}</th><td>{d.dropoff}</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 申し込み手順 */}
          <h2>{f(c.stepsTitle)}</h2>
          <ol>
            {steps.map((s) => (
              <li key={s.name}>
                <strong>{s.name}</strong><br />
                {s.text}
              </li>
            ))}
          </ol>

          {/* インターネット受付 */}
          {d?.online_url && (
            <div className="article-callout">
              {f(c.onlinePre)}
              {" "}
              <a href={d.online_url} target="_blank" rel="noopener noreferrer" style={{ color: "#b45309", fontWeight: 600, textDecoration: "underline" }}>
                {c.onlineLink}
              </a>
              {" "}
              {c.onlinePost}
            </div>
          )}

          {/* 注意点（自治体データ・日本語のまま） */}
          {d?.note && (
            <>
              <h2>{c.noteH}</h2>
              <p>{d.note}</p>
            </>
          )}

          {/* 運び出しの負担と選択肢（自然な導線） */}
          <h2>{c.carryH}</h2>
          <p>{f(c.carryP1)}</p>
          <p>{f(c.carryP2)}</p>

          {/* インライン広告（不用品回収） */}
          <InlineAd locale={locale} />

          {/* 公式リンク */}
          {officialUrl && (
            <div className="oversized-notice" style={{ marginTop: "1.5rem" }}>
              <span className="oversized-notice-icon" aria-hidden="true">🪑</span>
              <div className="oversized-notice-body">
                <p className="oversized-notice-title">{f(c.officialTitle)}</p>
                <p className="oversized-notice-text">{c.officialText}</p>
                <a href={officialUrl} target="_blank" rel="noopener noreferrer" className="oversized-notice-link">
                  {f(c.officialLink)}
                </a>
              </div>
            </div>
          )}

          {/* FAQ */}
          {faq.length > 0 && (
            <>
              <h2 id="faq">{c.faqSectionH}</h2>
              <div className="faq-section" style={{ marginTop: "1rem" }}>
                {faq.map((fq) => (
                  <div key={fq.q} className="faq-item">
                    <p className="faq-q">Q. {fq.q}</p>
                    <p className="faq-a">{fq.a}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 関連リンク */}
          <div className="article-related">
            <strong>{c.relatedTitle}</strong>
            <div className="article-related-links">
              <a href={`${prefix}/Tokyo/${wardSlug}/`} className="btn btn-outline">{f(c.relatedSchedule)}</a>
              <a href={`${prefix}/guide/funyohin-hiyo/`} className="btn btn-outline">{c.relatedFunyohin}</a>
              <a href={`${prefix}/`} className="btn btn-outline">{c.relatedCalendar}</a>
            </div>
          </div>
        </article>
      </div>
      {/* ボトム固定広告バナー */}
      <BottomAdBanner locale={locale} />
    </>
  );
}
