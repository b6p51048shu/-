import type { Metadata } from "next";
import RakutenAdCard from "@/components/RakutenAdCard";

const PAGE_PATH = "/guide/jikka-katazuke/";
const UPDATED = "2026年6月29日";

export const metadata: Metadata = {
  title: "実家の片付け（生前整理）の進め方｜親と揉めないコツと費用の目安",
  description:
    "実家の片付け・生前整理は「親との合意」が9割。揉めずに進める声かけのコツ、優先順位の付け方、自治体と業者の使い分け、費用の目安、売れる物の見極めまで実践的に解説します。",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: "実家の片付け（生前整理）の進め方 | ゴミの日.com",
    description: "親と揉めない進め方、費用の目安、自治体と業者の使い分けを解説。",
  },
};

const PRIORITY: { area: string; reason: string }[] = [
  { area: "① 廊下・階段・玄関（動線）", reason: "転倒事故の防止が最優先。物を減らすだけで安全性が大きく上がる" },
  { area: "② 浴室・キッチン（水回り）", reason: "衛生と防火。古い電化製品・使わない調理器具から着手しやすい" },
  { area: "③ 押入れ・物置・ベランダ", reason: "「開かずの間」は大物が多く、粗大ごみ申込の計画が必要" },
  { area: "④ 思い出の品（写真・手紙）", reason: "最後に回す。最初に手を付けると時間が溶けて挫折のもと" },
];

const OPTIONS: { how: string; cost: string; fit: string }[] = [
  { how: "自治体の収集＋粗大ごみで少しずつ", cost: "数百〜数千円/回", fit: "時間をかけられる・帰省のたびに進める" },
  { how: "売れる物を買取・フリマへ", cost: "±0〜プラス", fit: "骨董・貴金属・カメラ・着物・ブランド品がある" },
  { how: "不用品回収業者に一括依頼", cost: "数万〜数十万円", fit: "大量・期限あり・大型家具家電が多い" },
  { how: "生前整理・遺品整理業者（仕分けから）", cost: "間取り・物量による", fit: "仕分け自体を手伝ってほしい・遠方で通えない" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "親が「捨てたくない」と言って片付けが進みません。どうすれば？",
    a: "「捨てる」を目的にせず、「安全に暮らすために通り道だけ空けよう」「使う物を取り出しやすくしよう」と目的を置き換えるのが有効です。本人の物を勝手に処分するのは信頼関係を壊す最大のNG。まず自分（子ども側）の荷物から手を付けて見せるのも効果的です。",
  },
  {
    q: "実家の片付けはいつ始めるべきですか？",
    a: "親が元気で判断できるうちが最適です。本人と一緒に「残す物・譲る物・処分する物」を決められるため、後の遺品整理の負担とトラブルが大幅に減ります。介護や施設入居のタイミングで一気にやるケースも多いですが、時間の余裕があるほど費用も安く済みます。",
  },
  {
    q: "実家の片付けの費用はどのくらいかかりますか？",
    a: "自治体の粗大ごみ中心で進めれば1回数百〜数千円で済みますが、時間がかかります。業者に一括依頼する場合は物量次第で、2LDK〜一軒家なら数万〜数十万円が目安です。買取対応の業者なら骨董・貴金属・着物などの査定額で費用を相殺できることがあります。",
  },
  {
    q: "遠方に住んでいて頻繁に帰省できません。",
    a: "①帰省時は「仕分けと貴重品確認」に集中する、②粗大ごみの申込は帰省日に合わせて事前予約しておく、③搬出・処分は立ち会い可能な日に業者へまとめて依頼する、の組み合わせが効率的です。鍵を預けての作業に対応する業者もありますが、貴重品の確認は必ず家族で先に済ませましょう。",
  },
  {
    q: "片付けで出た大量の食器や本はどう処分すればいいですか？",
    a: "食器は不燃ごみ（陶器・ガラス）、本は資源回収が基本ですが、量が多い場合は一度に出せない自治体もあります。状態の良い食器セットや本は、寄付・リサイクルショップ・宅配買取に回すと処分の手間が減ります。",
  },
];

export default function JikkaKatazukePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "実家の片付け（生前整理）の進め方｜親と揉めないコツと費用の目安",
        description:
          "実家の片付け・生前整理を揉めずに進めるコツ、優先順位、自治体と業者の使い分け、費用の目安を解説。",
        datePublished: "2026-06-29",
        dateModified: "2026-06-29",
        author: { "@type": "Organization", name: "ゴミの日.com" },
        publisher: { "@type": "Organization", name: "ゴミの日.com" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: "https://gominohi.com/" },
          { "@type": "ListItem", position: 2, name: "お役立ちガイド", item: "https://gominohi.com/guide" },
          { "@type": "ListItem", position: 3, name: "実家の片付けの進め方", item: `https://gominohi.com${PAGE_PATH}` },
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
          <span>実家の片付けの進め方</span>
        </nav>

        <h1 className="section-title">実家の片付け（生前整理）の進め方</h1>
        <p className="article-updated">最終更新日: {UPDATED}</p>

        <article className="article">
          <p className="article-lead">
            実家の片付けが挫折する原因のほとんどは、ゴミ出しの手間ではなく<strong>「親と揉めること」</strong>です。
            この記事では、<strong>親と合意しながら進める声かけのコツ・優先順位の付け方・
            自治体と業者の使い分け・費用の目安</strong>を、実践的な順番で解説します。
          </p>

          <nav className="article-toc" aria-label="目次">
            <div className="article-toc-title">この記事の内容</div>
            <ol>
              <li><a href="#kokoroe">最初に決めること：目的は「捨てる」ではない</a></li>
              <li><a href="#junban">片付ける場所の優先順位</a></li>
              <li><a href="#susumekata">進め方の基本サイクル</a></li>
              <li><a href="#hiyo">処分手段4つと費用の目安</a></li>
              <li><a href="#ureru">売れる物・寄付できる物の見極め</a></li>
              <li><a href="#faq">よくある質問</a></li>
            </ol>
          </nav>

          <h2 id="kokoroe">最初に決めること：目的は「捨てる」ではない</h2>
          <p>
            親世代にとって物は「もったいない」だけでなく<strong>思い出と安心の象徴</strong>です。
            「全部捨てよう」というアプローチはほぼ確実に失敗します。うまくいく家庭の共通点は、目的の置き換えです。
          </p>
          <ul>
            <li><strong>「安全のため」</strong>：転倒防止に通路と階段だけ空ける → 反対されにくい</li>
            <li><strong>「使いやすくするため」</strong>：よく使う物を取り出しやすくする整理から始める</li>
            <li><strong>「勝手に捨てない」</strong>：本人の物の処分判断は必ず本人に。信頼を失うと以後一切進まなくなります</li>
            <li><strong>「自分の荷物から」</strong>：実家に残した自分の私物を先に片付けて見せると、親も動きやすくなります</li>
          </ul>

          <h2 id="junban">片付ける場所の優先順位</h2>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>優先順位</th>
                  <th>理由</th>
                </tr>
              </thead>
              <tbody>
                {PRIORITY.map((p) => (
                  <tr key={p.area}>
                    <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{p.area}</td>
                    <td style={{ fontSize: ".9rem" }}>{p.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="article-callout">
            <strong>写真・手紙などの思い出の品は最後。</strong>最初に開けると1日がそれで終わります。
            迷う物は「保留箱」に入れて先送りしてOK。進むことが最優先です。
          </p>

          <h2 id="susumekata">進め方の基本サイクル</h2>
          <ol>
            <li><strong>1回2〜3時間・1か所だけ</strong>：帰省のたびに1エリアずつ。長時間やると親子とも疲れて険悪になりがちです。</li>
            <li><strong>「使う・売る/譲る・捨てる・保留」の4分類</strong>：判断は親、運搬・手配は子、と役割を分ける。</li>
            <li><strong>粗大ごみは帰省日に合わせて事前予約</strong>：申込から収集まで日数がかかるため、帰省が決まったらすぐ申込（<a href="/guide/sodaigomi-seal/">粗大ごみシールの買い方</a>参照）。</li>
            <li><strong>大物・大量になったら業者を検討</strong>：タンス・ベッド・大型家電が複数あるなら、1回まとめて依頼する方が結果的に安く早いことも。</li>
          </ol>

          <h2 id="hiyo">処分手段4つと費用の目安</h2>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>手段</th>
                  <th>費用</th>
                  <th>向いているケース</th>
                </tr>
              </thead>
              <tbody>
                {OPTIONS.map((o) => (
                  <tr key={o.how}>
                    <td style={{ fontWeight: 600 }}>{o.how}</td>
                    <td className="price">{o.cost}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-600)" }}>{o.fit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* アフィリエイト（不用品回収）— 業者検討の文脈 */}
          <RakutenAdCard locale="ja" order="dispenser-first" />

          <h2 id="ureru">売れる物・寄付できる物の見極め</h2>
          <p>実家には<strong>「実は売れる物」</strong>が眠っていることが多く、処分費用の相殺に直結します。</p>
          <ul>
            <li><strong>買取が狙える物</strong>：貴金属・腕時計・カメラ・切手・古銭・骨董・着物・レコード・昔のゲーム機やおもちゃ（未開封は特に）</li>
            <li><strong>宅配買取が便利な物</strong>：本・CD/DVD・ブランド食器。箱に詰めて送るだけで、実家が遠くても進められます</li>
            <li><strong>寄付できる物</strong>：状態の良い衣類・ぬいぐるみ・食器。自治体や NPO の回収窓口へ</li>
            <li><strong>注意</strong>：価値が分からない骨董・美術品は捨てる前に査定へ。「古いだけのガラクタ」に見えて数万円になる例があります</li>
          </ul>

          <h2 id="faq">よくある質問</h2>
          <div className="faq-section" style={{ marginTop: "1rem" }}>
            {FAQ.map((f) => (
              <div key={f.q} className="faq-item">
                <p className="faq-q">Q. {f.q}</p>
                <p className="faq-a">{f.a}</p>
              </div>
            ))}
          </div>

          <div className="article-callout" style={{ marginTop: "2rem" }}>
            本記事の費用はいずれも一般的な目安です。自治体の粗大ごみの料金・出し方はお住まいの地域のページでご確認ください。
          </div>

          <div className="article-related">
            <strong>関連リンク</strong>
            <div className="article-related-links">
              <a href="/guide/ihin-seiri/" className="btn btn-outline">遺品整理の進め方と費用相場</a>
              <a href="/guide/sodaigomi-seal/" className="btn btn-outline">粗大ごみシールの買い方</a>
              <a href="/guide/gyousha-erabikata/" className="btn btn-outline">不用品回収業者の選び方</a>
              <a href="/items/" className="btn btn-outline">品目別の捨て方一覧</a>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
