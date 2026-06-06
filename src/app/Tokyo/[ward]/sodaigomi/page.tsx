import type { Metadata } from "next";
import { getWardBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import InlineAd from "@/components/InlineAd";
import BottomAdBanner from "@/components/BottomAdBanner";

type Props = { params: Promise<{ ward: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ward: wardSlug } = await params;
  const result = await getWardBySlug(wardSlug);
  if (!result) return {};
  const { name: wardName } = result;
  return {
    title: `${wardName}の粗大ごみの出し方・申し込み方法・手数料【2026年版】`,
    description: `${wardName}で粗大ごみを出す手順をわかりやすく解説。申し込み方法（電話・インターネット）、受付電話番号、手数料の目安、注意点、公式申し込みページへのリンクをまとめています。`,
    alternates: { canonical: `/Tokyo/${wardSlug}/sodaigomi` },
    openGraph: {
      title: `${wardName}の粗大ごみの出し方・申し込み方法 | ゴミの日.com`,
      description: `${wardName}の粗大ごみの申し込み方法・手数料・注意点をまとめて解説。`,
    },
  };
}

export default async function OversizedPage({ params }: Props) {
  const { ward: wardSlug } = await params;
  const result = await getWardBySlug(wardSlug);

  // 詳細データが揃っている自治体のみ公開（薄いコンテンツ防止）
  if (!result || !result.info.oversized_detail) notFound();

  const { name: wardName, info } = result;
  const d = info.oversized_detail;
  const officialUrl = info.oversized_url;

  // 手順（申し込み→処理券購入→排出）
  const steps = [
    {
      name: "粗大ごみの大きさ・品目を確認する",
      text: d?.definition
        ? `${wardName}の粗大ごみは${d.definition}が対象です。申し込み前に品目と大きさを確認します。`
        : `捨てたい品目が粗大ごみに該当するか、大きさを確認します。`,
    },
    {
      name: "受付センターに申し込む",
      text: d?.methods?.length
        ? `${d.methods.join("・")}のいずれかで申し込みます。${d.tel ? `電話の場合は ${d.tel}（${d.tel_hours ?? "受付時間は公式ページを確認"}）。` : ""}`
        : `電話またはインターネットで申し込みます。`,
    },
    {
      name: "粗大ごみ処理券を購入して貼る",
      text: d?.fee
        ? `案内された金額分の処理券を購入します。${d.fee}`
        : `案内された金額分の有料粗大ごみ処理券をコンビニ等で購入し、品目に貼ります。`,
    },
    {
      name: "収集日に出す",
      text: `指定された収集日の朝、決められた場所に出します。${d?.dropoff ? `${d.dropoff}` : ""}`,
    },
  ];

  // FAQ
  const faq: { q: string; a: string }[] = [];
  if (d?.tel) {
    faq.push({
      q: `${wardName}の粗大ごみの申し込み先（電話番号）は？`,
      a: `${wardName}粗大ごみ受付センターの電話番号は ${d.tel} です。${d.tel_hours ? `受付時間は ${d.tel_hours}。` : ""}${d.online_url ? "インターネットでの申し込みも可能です。" : ""}`,
    });
  }
  if (d?.fee) {
    faq.push({
      q: `${wardName}の粗大ごみの手数料はいくら？`,
      a: d.fee,
    });
  }
  if (d?.definition) {
    faq.push({
      q: `${wardName}で粗大ごみになるのはどんなもの？`,
      a: `${wardName}では、${d.definition}が粗大ごみの対象です。`,
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        name: `${wardName}の粗大ごみの出し方`,
        description: `${wardName}で粗大ごみを申し込んで出すまでの手順`,
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
          { "@type": "ListItem", position: 1, name: "ホーム", item: "https://gominohi.com/" },
          { "@type": "ListItem", position: 2, name: wardName, item: `https://gominohi.com/Tokyo/${wardSlug}/` },
          { "@type": "ListItem", position: 3, name: "粗大ごみの出し方", item: `https://gominohi.com/Tokyo/${wardSlug}/sodaigomi/` },
        ],
      },
      ...(faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
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
        <nav className="breadcrumb" aria-label="パンくず">
          <a href="/">ホーム</a>
          <span><a href={`/Tokyo/${wardSlug}`}>{wardName}</a></span>
          <span>粗大ごみの出し方</span>
        </nav>

        <article className="article">
          <h1 className="section-title">{wardName}の粗大ごみの出し方・申し込み方法</h1>
          <p className="article-lead">
            {wardName}で粗大ごみを処分する手順を、申し込み方法・受付先・手数料・注意点に分けて解説します。
            粗大ごみは多くの場合、事前の申し込みが必要で、収集日カレンダーには表示されません。
          </p>

          {/* 概要テーブル */}
          <div className="price-table-wrap">
            <table className="price-table">
              <tbody>
                {d?.definition && (
                  <tr><th>粗大ごみの定義</th><td>{d.definition}</td></tr>
                )}
                {d?.methods?.length && (
                  <tr><th>申し込み方法</th><td>{d.methods.join("・")}</td></tr>
                )}
                {d?.tel && (
                  <tr><th>受付電話</th><td>{d.tel}{d.tel_hours ? `（${d.tel_hours}）` : ""}</td></tr>
                )}
                {d?.fee && (
                  <tr><th>手数料</th><td>{d.fee}</td></tr>
                )}
                {d?.dropoff && (
                  <tr><th>持ち込み</th><td>{d.dropoff}</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 申し込み手順 */}
          <h2>{wardName}の粗大ごみを出す手順</h2>
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
              インターネットでの申し込みは24時間受け付けている自治体が多く便利です。{wardName}の
              {" "}
              <a href={d.online_url} target="_blank" rel="noopener noreferrer" style={{ color: "#b45309", fontWeight: 600, textDecoration: "underline" }}>
                粗大ごみインターネット受付
              </a>
              {" "}
              から申し込めます。
            </div>
          )}

          {/* 注意点 */}
          {d?.note && (
            <>
              <h2>申し込み時の注意点</h2>
              <p>{d.note}</p>
            </>
          )}

          {/* 運び出しの負担と選択肢（自然な導線） */}
          <h2>粗大ごみは「運び出し」が必要です</h2>
          <p>
            {wardName}の戸別収集では、原則として申込者が、建物の前や敷地内の決められた場所まで粗大ごみを自分で運び出しておく必要があります。
            収集スタッフが部屋の中まで取りに来てくれるわけではないため、タンスやベッド、ソファ、大型の家電などは、階段の上げ下ろしや搬出が思いのほか大きな負担になりがちです。
            とくにエレベーターのない集合住宅の上層階や、一人暮らし・ご高齢の方だけで運び出すのが難しいケースもあります。
          </p>
          <p>
            どうしても自分で運び出せない場合や、収集日を待たずにまとめて早く片付けたい場合は、
            部屋の中からの搬出・運搬まで対応してくれる不用品回収業者を利用するという選択肢もあります。
            料金やサービス内容は業者によって幅があるため、いくつかの業者で見積もりを比べてから決めると安心です。
          </p>

          {/* インライン広告（不用品回収）— 運び出しの解説直後に置き、自然な導線にする */}
          <InlineAd locale="ja" />

          {/* 公式リンク */}
          {officialUrl && (
            <div className="oversized-notice" style={{ marginTop: "1.5rem" }}>
              <span className="oversized-notice-icon" aria-hidden="true">🪑</span>
              <div className="oversized-notice-body">
                <p className="oversized-notice-title">最新情報は{wardName}公式ページで確認</p>
                <p className="oversized-notice-text">
                  料金・受付時間・申し込み方法は変更される場合があります。お申し込み前に必ず公式ページをご確認ください。
                </p>
                <a href={officialUrl} target="_blank" rel="noopener noreferrer" className="oversized-notice-link">
                  {wardName}の粗大ごみ案内（公式）→
                </a>
              </div>
            </div>
          )}

          {/* FAQ */}
          {faq.length > 0 && (
            <>
              <h2 id="faq">よくある質問</h2>
              <div className="faq-section" style={{ marginTop: "1rem" }}>
                {faq.map((f) => (
                  <div key={f.q} className="faq-item">
                    <p className="faq-q">Q. {f.q}</p>
                    <p className="faq-a">{f.a}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 関連リンク */}
          <div className="article-related">
            <strong>関連リンク</strong>
            <div className="article-related-links">
              <a href={`/Tokyo/${wardSlug}`} className="btn btn-outline">{wardName}のごみ収集日一覧</a>
              <a href="/guide/funyohin-hiyo" className="btn btn-outline">不用品回収の費用相場を見る</a>
              <a href="/" className="btn btn-outline">ごみ収集日カレンダーで調べる</a>
            </div>
          </div>
        </article>
      </div>
      {/* ボトム固定広告バナー */}
      <BottomAdBanner locale="ja" />
    </>
  );
}
