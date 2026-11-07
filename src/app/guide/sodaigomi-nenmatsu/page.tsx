import type { Metadata } from "next";
import type { ReactNode } from "react";
import RecommerceAd from "@/components/RecommerceAd";
import { getItemBySlug } from "@/data/items";
import { guideContent } from "@/lib/articleContent";

const PAGE_PATH = "/guide/sodaigomi-nenmatsu/";
const TITLE = "年末に粗大ごみの収集が間に合わないとき｜持ち込み・年明け・業者の選び方";
const DESCRIPTION =
  "12月は粗大ごみの申込が集中し、年内の収集枠が早く埋まります。間に合わないときの4つの選択肢（持ち込み・年明けの収集・買取・許可業者）と、年末年始の受付休止期間、申込の締め切りの目安を整理しました。";
const H1 = "年末に粗大ごみの収集が間に合わないとき";
const BREADCRUMB = "年末の粗大ごみ";
const DATE_PUBLISHED = "2026-11-07";
const UPDATED = "2026年11月7日";

const RELATED_ITEMS = ["sofa", "mattress", "futon", "desk", "chair", "shelf", "kotatsu", "heater", "bicycle", "tv", "refrigerator", "washing-machine"];
const RELATED_GUIDES = ["sodaigomi-seal", "funyohin-hiyo", "gyousha-erabikata", "osouji-gomi"];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: `${H1} | ゴミの日.com`,
    description: DESCRIPTION,
  },
};

const FAQ: { q: string; a: string; body: ReactNode }[] = [
  {
    q: "粗大ごみシールを買ったのに、年内に収集してもらえません",
    a: "シールは有効期限がないので、年明けの収集で使えます。申込を取り消して再申込するときは、品目と点数を同じにすると手続きが簡単です。買い方は粗大ごみシールの買い方・値段一覧。",
    body: <>シールは有効期限がないので、年明けの収集で使えます。申込を取り消して再申込するときは、品目と点数を同じにすると手続きが簡単です。買い方は<a href="/guide/sodaigomi-seal/">粗大ごみシールの買い方・値段一覧</a>。</>,
  },
  {
    q: "粗大ごみを解体して、燃やすごみで出せますか",
    a: "木製の家具などを指定サイズ以下（例：一辺30cm）に解体すれば、燃やすごみや不燃ごみで出せる自治体があります。ただし金属や布を分ける手間がかかり、1回に出せる量にも上限があります。ベッドのマットレス（スプリング入り）など、解体が危険なものは粗大ごみとして出してください。",
    body: <>木製の家具などを指定サイズ以下（例：一辺30cm）に解体すれば、燃やすごみや不燃ごみで出せる自治体があります。ただし金属や布を分ける手間がかかり、1回に出せる量にも上限があります。ベッドのマットレス（スプリング入り）など、解体が危険なものは粗大ごみとして出してください。</>,
  },
  {
    q: "引っ越しの退去日に間に合いません",
    a: "管理会社や大家に相談し、退去後の数日だけ置かせてもらえるか確認する人もいますが、断られるのが普通です。退去日が動かせないなら、業者（選択肢4）か、新居に一度運んで新居の自治体で処分する方法になります。引っ越しで出た大量のごみの処分方法。",
    body: <>管理会社や大家に相談し、退去後の数日だけ置かせてもらえるか確認する人もいますが、断られるのが普通です。退去日が動かせないなら、業者（選択肢4）か、新居に一度運んで新居の自治体で処分する方法になります。<a href="/guide/hikkoshi-gomi/">引っ越しで出た大量のごみの処分方法</a>。</>,
  },
];

export default function SodaigomiNenmatsuPage() {
  const relatedItems = RELATED_ITEMS.map((s) => getItemBySlug(s)).filter(
    (i): i is NonNullable<typeof i> => Boolean(i),
  );
  const relatedGuides = RELATED_GUIDES.map((s) =>
    guideContent.ja.articles.find((a) => a.slug === s),
  ).filter((a): a is NonNullable<typeof a> => Boolean(a));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: TITLE,
        description: DESCRIPTION,
        datePublished: DATE_PUBLISHED,
        dateModified: DATE_PUBLISHED,
        author: { "@type": "Organization", name: "ゴミの日.com" },
        publisher: { "@type": "Organization", name: "ゴミの日.com" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: "https://gominohi.com/" },
          { "@type": "ListItem", position: 2, name: "お役立ちガイド", item: "https://gominohi.com/guide/" },
          { "@type": "ListItem", position: 3, name: BREADCRUMB, item: `https://gominohi.com${PAGE_PATH}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
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
        <nav className="breadcrumb" aria-label="パンくず">
          <a href="/">ホーム</a>
          <span><a href="/guide/">お役立ちガイド</a></span>
          <span>{BREADCRUMB}</span>
        </nav>

        <h1 className="section-title">{H1}</h1>
        <p className="article-updated">最終更新日: {UPDATED}</p>

        <article className="article">
          <nav className="article-toc" aria-label="目次">
            <div className="article-toc-title">この記事の内容</div>
            <ol>
              <li><a href="#s1">まず：年内の収集枠は12月上旬〜中旬で埋まる</a></li>
              <li><a href="#s2">選択肢1：清掃事務所・処理施設に持ち込む（自己搬入）</a></li>
              <li><a href="#s3">選択肢2：年明けの収集を待つ</a></li>
              <li><a href="#s4">選択肢3：売る・譲る</a></li>
              <li><a href="#s5">選択肢4：不用品回収業者に頼む</a></li>
              <li><a href="#s6">家電4品目・パソコンは粗大ごみではない</a></li>
              <li><a href="#s7">年末の粗大ごみ：日程の目安</a></li>
              <li><a href="#faq">よくある質問</a></li>
            </ol>
          </nav>

          <h2 id="s1">まず：年内の収集枠は12月上旬〜中旬で埋まる</h2>
          <p>粗大ごみは申込制で、収集日は申込順に割り当てられます。12月は大掃除と引っ越しで申込が集中し、多くの自治体で<strong>年内の収集枠が12月上旬〜中旬に埋まります</strong>。「申し込んだら収集日が1月中旬になった」というのは、年末には普通に起こります。</p>
          <p>さらに、年末年始は受付自体が休みになります（例：12月29日〜1月3日。自治体により前後します）。この期間は電話もインターネットも申し込めません。</p>
          <p>年内に出したいなら、<strong>11月中か12月の第1週までに申し込む</strong>のが目安です。この記事は、それでも間に合わなかったときの選択肢を順に説明します。</p>

          <h2 id="s2">選択肢1：清掃事務所・処理施設に持ち込む（自己搬入）</h2>
          <p>多くの自治体は、自分で処理施設や清掃事務所に運ぶ「持ち込み（自己搬入）」を受け付けています。</p>
          <ul>
            <li><strong>収集より早く処分できる</strong>ことが多く、手数料も収集より安い自治体があります（重量制や収集の半額など）。</li>
            <li>予約が必要な自治体が増えています。年末は持ち込みも混むので、受付日と時間を先に確認してください。</li>
            <li>車で運べることが条件です。軽トラックのレンタルや、友人の車を借りる人もいます。</li>
            <li>持ち込めない品目（家電リサイクル法の4品目、パソコン、危険物など）は収集と同じです。</li>
            <li>年末の受付最終日は、収集の最終日より早いことがあります。</li>
          </ul>
          <p>お住まいの区市の粗大ごみページ（当サイトの「粗大ごみ」ページから公式サイトへ）で、持ち込みの可否と予約方法を確認してください。</p>

          <h2 id="s3">選択肢2：年明けの収集を待つ</h2>
          <p>急がないなら、これが一番安くて確実です。</p>
          <ul>
            <li>受付は1月4日ごろに再開します。年明けすぐも混むので、再開日に申し込むと1月中〜下旬の収集になるのが目安です。</li>
            <li>それまでの保管場所を確保します。集積所や共用部に「先に出しておく」のは不法投棄になり、近隣トラブルの原因です。</li>
            <li>引っ越しで退去日が決まっている場合は、この方法は使えません。選択肢3・4へ。</li>
          </ul>

          <h2 id="s4">選択肢3：売る・譲る</h2>
          <p>状態がよい家具・家電・自転車・楽器は、処分するより早く手放せることがあります。</p>
          <ul>
            <li>宅配買取・出張買取：申込から数日で引き取り。ブランド家具、家電（製造5年以内が目安）、ゲーム、本などが対象。</li>
            <li>フリマアプリ・ジモティーなどの譲渡：大型家具は「取りに来てくれる人」に譲ると、搬出の手間も減ります。日程が読めないのが難点です。</li>
            <li>リサイクルショップの出張引き取り：年末は予約が取りにくいので早めに。</li>
          </ul>
          <p>「売れないものはごみ」と割り切り、売れるものだけ先に出すと、粗大ごみの点数と手数料が減ります。</p>

          <h2 id="s5">選択肢4：不用品回収業者に頼む</h2>
          <p>退去日が迫っている、量が多い、搬出できない。この場合は業者です。費用は1点数千円〜、軽トラック1台分で1万5千〜3万円が目安です（<a href="/guide/funyohin-hiyo/">不用品回収の費用相場</a>）。</p>
          <p><strong>年末は悪質業者のトラブルが増える時期です。</strong> 次を確認してください。</p>
          <ul>
            <li>自治体の<strong>一般廃棄物収集運搬業の許可</strong>か、自治体からの委託があるか。「産業廃棄物」の許可や「古物商」だけでは、家庭ごみの収集運搬はできません。</li>
            <li>「無料回収」「無料で引き取ります」と拡声器で回るトラックは使わない。積み込み後に高額を請求される事例が各自治体・消費生活センターに報告されています。</li>
            <li>見積もりは<strong>作業前に書面</strong>で。追加料金の条件を聞く。</li>
            <li>回収したごみが不法投棄されると、依頼した側が責任を問われることがあります。</li>
          </ul>
          <p>見分け方の詳細は<a href="/guide/gyousha-erabikata/">不用品回収業者の選び方と悪質業者の見分け方</a>。</p>

          <h2 id="s6">家電4品目・パソコンは粗大ごみではない</h2>
          <p>テレビ・冷蔵庫・洗濯機（乾燥機）・エアコンは<strong>家電リサイクル法</strong>の対象で、自治体の粗大ごみには出せません。買い替えなら販売店、処分だけなら指定引取場所への持ち込みか、自治体が案内する収集業者に依頼します。年末は販売店の引き取りも混むので、買い替えと同時に申し込んでください。</p>
          <p>パソコンはメーカー回収か小型家電の回収ボックス（自治体による）です。</p>
          <p><a href="/items/tv/">テレビの捨て方</a>、<a href="/items/refrigerator/">冷蔵庫の捨て方</a>、<a href="/items/washing-machine/">洗濯機の捨て方</a>。</p>

          <h2 id="s7">年末の粗大ごみ：日程の目安</h2>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>項目</th>
                  <th>目安（自治体により異なる）</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>年内収集の申込期限</td>
                  <td>11月末〜12月中旬（枠が埋まり次第終了）</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>年末の受付休止</td>
                  <td>12月29日〜1月3日ごろ</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>持ち込みの年内最終</td>
                  <td>12月28日ごろ（収集より早い場合あり）</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>受付再開</td>
                  <td>1月4日ごろ</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>年明け最初の収集</td>
                  <td>1月中旬〜下旬</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>具体的な日付は、お住まいの区市の公式サイトの「年末年始のごみ収集」のお知らせで確認してください（11月下旬〜12月上旬に発表されます）。</p>

          <RecommerceAd variant="text" />

          <h2 id="faq">よくある質問</h2>
          <div className="faq-section" style={{ marginTop: "1rem" }}>
            {FAQ.map((f) => (
              <div key={f.q} className="faq-item">
                <p className="faq-q">Q. {f.q}</p>
                <p className="faq-a">{f.body}</p>
              </div>
            ))}
          </div>

          <div className="article-related">
            <strong>関連する品目</strong>
            <div className="area-list" style={{ marginTop: ".75rem" }}>
              {relatedItems.map((r) => (
                <a key={r.slug} href={`/items/${r.slug}/`} className="area-link">
                  {r.emoji} {r.name}
                </a>
              ))}
            </div>
          </div>

          <div className="article-related">
            <strong>関連ガイド</strong>
            <div className="article-related-links">
              {relatedGuides.map((g) => (
                <a key={g.slug} href={`/guide/${g.slug}/`} className="btn btn-outline">
                  {g.title}
                </a>
              ))}
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
