import type { Metadata } from "next";
import type { ReactNode } from "react";
import RecommerceAd from "@/components/RecommerceAd";
import { getItemBySlug } from "@/data/items";
import { guideContent } from "@/lib/articleContent";

const PAGE_PATH = "/guide/gomi-zenjitsu/";
const TITLE = "ごみは前日の夜に出していい？｜「当日朝8時まで」のルールと、出し忘れたときの対処";
const DESCRIPTION =
  "多くの自治体は「収集日の当日、朝8時まで」に出すルールで、前日の夜に出すのは禁止です。理由（カラス・放火・近隣）、夜間収集の自治体の例外、朝が早い人の工夫、出し忘れたときの対処法を整理しました。";
const H1 = "ごみは前日の夜に出していい？";
const BREADCRUMB = "前日の夜のごみ出し";
const DATE_PUBLISHED = "2026-11-10";
const UPDATED = "2026年11月10日";

const RELATED_ITEMS = ["cat-litter", "diaper", "cardboard", "spray-can"];
const RELATED_GUIDES = ["hikkoshi-gomi", "osouji-gomi"];

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
    q: "前日の夜に出すと罰則はありますか",
    a: "多くの自治体では条例で「決められた日時・場所に出す」と定めていますが、個人への罰金が科される例はほとんどありません。ただし、集積所の廃止や近隣トラブルにつながるので、ルールどおりに出してください。",
    body: <>多くの自治体では条例で「決められた日時・場所に出す」と定めていますが、個人への罰金が科される例はほとんどありません。ただし、集積所の廃止や近隣トラブルにつながるので、ルールどおりに出してください。</>,
  },
  {
    q: "朝8時を少し過ぎても回収されますか",
    a: "収集車がまだ来ていなければ回収されることが多いですが、ルール上は出し遅れです。回収後に出すと残ります。常態化すると苦情の原因になるので、前夜に準備して朝出す形に変えるのが確実です。",
    body: <>収集車がまだ来ていなければ回収されることが多いですが、ルール上は出し遅れです。回収後に出すと残ります。常態化すると苦情の原因になるので、前夜に準備して朝出す形に変えるのが確実です。</>,
  },
  {
    q: "深夜勤務で朝に出せません。前夜に出すのは仕方ないですか",
    a: "自治体に事情を伝えても、個別の例外は認められないのが普通です。集合住宅なら24時間出せる置き場の有無を管理会社に、戸建てなら町会に集積所の使い方を相談してください。収集日を把握して、出勤前（深夜）ではなく帰宅時（朝）に出す形にできる場合もあります。",
    body: <>自治体に事情を伝えても、個別の例外は認められないのが普通です。集合住宅なら24時間出せる置き場の有無を管理会社に、戸建てなら町会に集積所の使い方を相談してください。収集日を把握して、出勤前（深夜）ではなく帰宅時（朝）に出す形にできる場合もあります。</>,
  },
  {
    q: "今日が何ごみの日か、すぐ知りたい",
    a: "当サイトのトップから区市と町名を選ぶと、今日・明日のごみの種類と週間カレンダーが表示されます。",
    body: <>当サイトのトップから区市と町名を選ぶと、今日・明日のごみの種類と週間カレンダーが表示されます。</>,
  },
];

export default function GomiZenjitsuPage() {
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
              <li><a href="#s1">結論：原則は「当日の朝、収集時間まで」。前夜はNGの自治体がほとんど</a></li>
              <li><a href="#s2">前日の夜に出してはいけない理由</a></li>
              <li><a href="#s3">朝が早くて8時までに出せない人の工夫</a></li>
              <li><a href="#s4">出し忘れたとき・回収されなかったとき</a></li>
              <li><a href="#s5">集積所のルール：見落としやすい点</a></li>
              <li><a href="#faq">よくある質問</a></li>
            </ol>
          </nav>

          <h2 id="s1">結論：原則は「当日の朝、収集時間まで」。前夜はNGの自治体がほとんど</h2>
          <p>東京23区をはじめ、多くの自治体はごみを<strong>収集日当日の朝8時まで</strong>（自治体により7時や8時半）に出すよう定めています。「前日の夜に出すのは、ごみの散乱や火災の原因になるのでやめてください」と明記している自治体が大半です。</p>
          <p>ただし、例外があります。</p>
          <ul>
            <li><strong>夜間収集の自治体</strong>：福岡市のように、夜に収集する自治体では「当日の日没後〜収集まで」に出します。この場合は「夜に出す」のが正解です。</li>
            <li><strong>戸別収集で容器を使う地域</strong>：ふた付きの容器に入れる方式なら、前夜に出してよいとする自治体があります。</li>
            <li><strong>集合住宅のごみ置き場</strong>：建物内の24時間出せるごみ置き場なら、管理規約に従います。</li>
          </ul>
          <p>お住まいの区市のルールは、当サイトの区市ページ、または自治体の公式サイトで確認してください。</p>

          <h2 id="s2">前日の夜に出してはいけない理由</h2>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>理由</th>
                  <th>何が起きるか</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>カラス・猫・ネズミ</td>
                  <td>一晩で袋を破られ、翌朝は道路に生ごみが散乱。回収されずに残る</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>風・雨</td>
                  <td>袋が飛ぶ、濡れた紙が回収されない</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>放火</td>
                  <td>夜間の集積所のごみは放火の対象になりやすい。消防も注意喚起している</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>近隣トラブル</td>
                  <td>夜のうちから臭いや見た目の苦情が出る。集積所の廃止につながることも</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>不法投棄の誘発</td>
                  <td>既に出ていると、他の人も「まだ出せる」と思って量が増える</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>収集車は朝8時ちょうどに来るわけではなく、地域によって昼過ぎになることもあります。だから「8時までに出す」のは「8時に回収される」という意味ではなく、「それ以降は出さない」という締め切りです。</p>

          <h2 id="s3">朝が早くて8時までに出せない人の工夫</h2>
          <ul>
            <li><strong>前夜に玄関まで準備する</strong>：袋を縛って玄関に置き、出るときに集積所へ。所要10秒です。</li>
            <li><strong>収集時間が遅い地域なら、少し遅れても間に合うことがある</strong>：ただし自治体のルール上は8時までが原則で、回収後に出したごみは「出し忘れ」扱いで残ります。</li>
            <li><strong>ごみの種類ごとの収集日を把握する</strong>：当サイトのエリアページの「今日・明日は何ごみ」で確認できます。カレンダー連携（ICS）を使うと、前夜に通知が来ます。</li>
            <li><strong>生ごみを減らす</strong>：冷凍しておいて収集日の朝に出す、水を切る、新聞に包む。袋が小さければ出す手間も減ります。</li>
            <li><strong>集合住宅なら管理会社に相談</strong>：24時間出せるごみ置き場があるか、設置の予定があるか。</li>
          </ul>

          <h2 id="s4">出し忘れたとき・回収されなかったとき</h2>
          <h3>出し忘れた</h3>
          <p>次の収集日まで家で保管します。燃やすごみは週2回の自治体が多いので、数日です。生ごみは冷凍するか、密閉容器に入れて臭いを抑えます。</p>
          <p><strong>集積所に置いたままにしない</strong>：収集日以外に出されたごみは回収されず、カラスに荒らされます。自治体によっては不法投棄として扱われます。</p>
          <h3>出したのに回収されなかった</h3>
          <p>袋に「分別違反」などのシールが貼られていたら、理由を読んで分け直し、次の収集日に出します。シールがなく残っている場合は、収集が遅れている可能性があるので、昼過ぎまで待ってから自治体の清掃事務所に問い合わせます。</p>
          <h3>旅行・出張で長く出せない</h3>
          <p>生ごみは出発前に全部出すか、冷凍します。紙おむつや猫砂など臭いの強いものは、二重袋と消臭剤で保管します。<a href="/items/diaper/">紙おむつの捨て方</a>、<a href="/items/cat-litter/">猫砂の捨て方</a>。</p>

          <h2 id="s5">集積所のルール：見落としやすい点</h2>
          <ul>
            <li><strong>指定の場所以外に出さない</strong>：隣の集積所に出すと、その地域の住民とトラブルになります。</li>
            <li><strong>指定袋・指定の出し方を守る</strong>：透明・半透明の袋、段ボールはたたんでひもで縛る、びん缶は中をすすぐ。</li>
            <li><strong>ネット・ボックスは元に戻す</strong>：カラス対策のネットは、袋を全部覆い、おもりを乗せます。</li>
            <li><strong>集積所の掃除は当番制のことが多い</strong>：町会や管理組合の決まりに従います。</li>
          </ul>

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
