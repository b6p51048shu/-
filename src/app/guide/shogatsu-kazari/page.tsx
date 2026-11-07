import type { Metadata } from "next";
import type { ReactNode } from "react";
import RecommerceAd from "@/components/RecommerceAd";
import { getItemBySlug } from "@/data/items";
import { guideContent } from "@/lib/articleContent";

const PAGE_PATH = "/guide/shogatsu-kazari/";
const TITLE = "正月飾り・しめ縄・門松・鏡餅・だるまの捨て方｜どんど焼きに出せないときは";
const DESCRIPTION =
  "しめ縄や門松などの正月飾りは、1月15日ごろのどんど焼き（左義長）か神社の古札納所に。出せないときは自治体のごみに出せます。分別のポイント、鏡餅・だるま・破魔矢の扱い、プラスチック製の飾りの注意をまとめました。";
const H1 = "正月飾り・しめ縄・門松・鏡餅・だるまの捨て方";
const BREADCRUMB = "正月飾りの捨て方";
const DATE_PUBLISHED = "2026-11-10";
const UPDATED = "2026年11月10日";

const RELATED_ITEMS = ["kadomatsu", "christmas-tree", "kamidana", "calendar", "cardboard"];
const RELATED_GUIDES = ["osouji-gomi", "sodaigomi-nenmatsu"];

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
    q: "正月飾りを普通のごみに出すのは失礼ですか",
    a: "失礼ではありません。自治体の多くが燃やすごみとして案内しています。気になる人は、別の袋に入れて塩を少量振る作法があります。",
    body: <>失礼ではありません。自治体の多くが燃やすごみとして案内しています。気になる人は、別の袋に入れて塩を少量振る作法があります。</>,
  },
  {
    q: "どんど焼きの日を過ぎてしまいました",
    a: "神社の古札納所は年中受け付けるところが多いです。それも難しければ燃やすごみへ。来年の目安として、松の内が明けたらすぐ外し、どんど焼きの日程を正月中に確認しておくと間に合います。",
    body: <>神社の古札納所は年中受け付けるところが多いです。それも難しければ燃やすごみへ。来年の目安として、松の内が明けたらすぐ外し、どんど焼きの日程を正月中に確認しておくと間に合います。</>,
  },
  {
    q: "プラスチック製のしめ飾りは、どんど焼きに出せますか",
    a: "受け付けない会場が多いです。プラスチック部分を外して藁と紙だけを持ち込むか、自治体のごみに出してください。",
    body: <>受け付けない会場が多いです。プラスチック部分を外して藁と紙だけを持ち込むか、自治体のごみに出してください。</>,
  },
  {
    q: "門松が大きくて袋に入りません",
    a: "のこぎりで切って指定袋に入れれば燃やすごみで出せる自治体が多いです。切らずに出すなら粗大ごみとして申し込みます。年始は粗大ごみの受付が1月4日ごろから再開するので、申込は年明けになります。",
    body: <>のこぎりで切って指定袋に入れれば燃やすごみで出せる自治体が多いです。切らずに出すなら粗大ごみとして申し込みます。年始は粗大ごみの受付が1月4日ごろから再開するので、申込は年明けになります。</>,
  },
];

export default function ShogatsuKazariPage() {
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
              <li><a href="#s1">結論：どんど焼きか神社へ。出せなければ「燃やすごみ」でよい</a></li>
              <li><a href="#s2">どんど焼きに出すときの注意</a></li>
              <li><a href="#s3">自治体のごみに出すとき：品目別</a></li>
              <li><a href="#s4">「塩で清める」は必要？</a></li>
              <li><a href="#s5">クリスマスの飾りと一緒に片付ける場合</a></li>
              <li><a href="#faq">よくある質問</a></li>
            </ol>
          </nav>

          <h2 id="s1">結論：どんど焼きか神社へ。出せなければ「燃やすごみ」でよい</h2>
          <p>正月飾りの処分には、3つの方法があります。</p>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>方法</th>
                  <th>時期</th>
                  <th>向いているもの</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>どんど焼き（左義長・さいと焼き）</td>
                  <td>1月15日の小正月ごろ。地域により1月7日〜中旬</td>
                  <td>しめ縄・門松・書き初め・古いお札</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>神社の古札納所（お焚き上げ）</td>
                  <td>年中受け付ける神社が多い。年末年始は専用の箱が出る</td>
                  <td>しめ縄・破魔矢・お守り・お札</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>自治体のごみ</td>
                  <td>通常の収集日</td>
                  <td>上の2つに出せなかったもの、プラスチック製・金属付きの飾り</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>正月飾りは「年神様を迎える目印」で、松の内（関東は1月7日、関西は1月15日が多い）が終わったら外します。外した飾りをどんど焼きで焼くのが昔からの習わしですが、<strong>ごみとして出すこと自体に問題はありません</strong>。多くの自治体が「正月飾りは燃やすごみへ」と案内しています。</p>

          <h2 id="s2">どんど焼きに出すときの注意</h2>
          <ul>
            <li>開催日・場所は、地域の町会・神社・自治体の広報で1月初めに案内されます。当日は午前中で終わることが多いので、時間も確認してください。</li>
            <li><strong>燃やせないものは外して持っていく</strong>：針金、プラスチックの橙（だいだい）や扇、金属の留め具、ビニール袋。燃やすと有害なものは受け付けない会場が増えています。</li>
            <li>鏡餅のプラスチック容器、ガラス製の飾り、電飾付きの飾りは持ち込めません。</li>
            <li>近年は防火や煙の問題で、どんど焼きを中止・縮小した地域もあります。その場合は神社の古札納所か、ごみとして出します。</li>
          </ul>

          <h2 id="s3">自治体のごみに出すとき：品目別</h2>
          <h3>しめ縄・しめ飾り・門松</h3>
          <ul>
            <li>藁（わら）・紙・木の部分は<strong>燃やすごみ</strong>。</li>
            <li>針金、金属の輪、プラスチックの飾り（橙・扇・水引の一部）は外して<strong>不燃ごみ</strong>や<strong>プラスチック</strong>の区分へ。細かいものは自治体の分別表で確認します。</li>
            <li>本物の松や竹を使った門松は、長さを切って燃やすごみ。一定サイズ（例：50cm）を超える自治体では粗大ごみになることがあります。<a href="/items/kadomatsu/">門松・正月飾りの捨て方</a>。</li>
          </ul>
          <h3>鏡餅</h3>
          <ul>
            <li>本物の餅は食べるものです。1月11日の鏡開き（関西は15日や20日）で割って、雑煮やぜんざいにします。</li>
            <li>カビた餅は食べずに燃やすごみへ。</li>
            <li>プラスチック容器入りの鏡餅は、中の餅を取り出して食べ、容器はプラスチック（容器包装）か不燃ごみ。自治体の区分に従います。</li>
          </ul>
          <h3>だるま</h3>
          <ul>
            <li>紙と木でできているので、基本は<strong>燃やすごみ</strong>です。大きいものは粗大ごみになる自治体があります。</li>
            <li>「供養してから」と考える人は、だるま市を開く寺社や、年末年始の古札納所で「だるま納め」を受け付けるところがあります。受け付けの有無は寺社ごとに違うので、持ち込む前に確認してください。</li>
          </ul>
          <h3>破魔矢・お守り・お札・熊手</h3>
          <ul>
            <li>授かった神社・寺に返すのが基本です。遠方なら近くの神社の古札納所でも受け付けることが多いですが、他の宗教・宗派のものは断られることがあります。</li>
            <li>ごみに出す場合は、矢の羽や布は燃やすごみ、金属の先端は不燃ごみ。熊手は竹と紙なら燃やすごみ、飾りのプラスチックは外します。</li>
          </ul>
          <h3>神棚・仏壇</h3>
          <ul>
            <li>古い神棚は神社でお焚き上げを受け付けるところがあります。自治体のごみでは、木製なら燃やすごみ、サイズによっては粗大ごみです。<a href="/items/kamidana/">神棚の捨て方</a>。</li>
            <li>仏壇は粗大ごみで出せる自治体が多いですが、閉眼供養（魂抜き）をしてから処分する人が多いです。</li>
          </ul>

          <h2 id="s4">「塩で清める」は必要？</h2>
          <p>正月飾りをごみに出すとき、「塩を振って白い紙に包んでから出す」という習わしがあります。宗教的な決まりではなく、気持ちの区切りのための作法です。やらなくても構いませんし、やる場合は塩を少量にし、袋が破れないようにしてください。他のごみと分けて別の袋に入れるのが、気持ちの面でも実務の面でも無難です。</p>

          <h2 id="s5">クリスマスの飾りと一緒に片付ける場合</h2>
          <p>クリスマスツリー（プラスチック製）は不燃ごみか粗大ごみ、電飾（イルミネーション）は小型家電や不燃ごみ、オーナメントは素材ごとに分けます。本物のもみの木は切って燃やすごみ、大きければ粗大ごみです。<a href="/items/christmas-tree/">クリスマスツリーの捨て方</a>。</p>

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
