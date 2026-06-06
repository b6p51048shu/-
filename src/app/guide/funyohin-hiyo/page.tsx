import type { Metadata } from "next";
import InlineAd from "@/components/InlineAd";
import BottomAdBanner from "@/components/BottomAdBanner";

const PAGE_PATH = "/guide/funyohin-hiyo";
const UPDATED = "2026年6月7日";

export const metadata: Metadata = {
  title: "不用品回収の費用相場【2026年版】料金の目安・トラック積み放題・安く抑えるコツ",
  description:
    "不用品回収の費用相場を品目別・トラック積み放題プラン別にわかりやすく解説。自治体の粗大ごみ回収との違い、料金を安く抑える5つのコツ、悪質業者を避ける注意点まで、初めての方向けにまとめました。",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: "不用品回収の費用相場【2026年版】 | ゴミの日.com",
    description:
      "品目別・トラック積み放題の料金目安、自治体回収との違い、安く抑えるコツ、悪質業者の見分け方を解説。",
  },
};

// 品目別の費用目安（円）。家電は別途リサイクル料金がかかる旨を本文で補足。
const SINGLE_ITEMS: { item: string; price: string; note: string }[] = [
  { item: "冷蔵庫（小型）", price: "5,000〜10,000円", note: "別途リサイクル料金 約3,740円〜" },
  { item: "冷蔵庫（大型）", price: "8,000〜15,000円", note: "別途リサイクル料金 約4,730円〜" },
  { item: "洗濯機・乾燥機", price: "4,000〜8,000円", note: "別途リサイクル料金 約2,530円〜" },
  { item: "エアコン", price: "6,000〜12,000円", note: "取り外し工事費を含む場合あり" },
  { item: "テレビ（液晶・小）", price: "4,000〜8,000円", note: "別途リサイクル料金 約1,870円〜" },
  { item: "ソファ（2人掛け）", price: "4,000〜8,000円", note: "" },
  { item: "ソファ（3人掛け）", price: "6,000〜12,000円", note: "大型・本革は割増" },
  { item: "ベッド（シングル）", price: "5,000〜10,000円", note: "マットレス別の場合あり" },
  { item: "マットレス", price: "4,000〜8,000円", note: "" },
  { item: "ダイニングテーブル", price: "3,000〜8,000円", note: "サイズ・素材で変動" },
  { item: "タンス・食器棚（大）", price: "5,000〜12,000円", note: "" },
  { item: "電子レンジ", price: "1,500〜3,000円", note: "" },
  { item: "自転車", price: "2,000〜4,000円", note: "" },
  { item: "布団（1組）", price: "1,000〜3,000円", note: "" },
];

const TRUCK_PLANS: { plan: string; capacity: string; price: string; example: string }[] = [
  {
    plan: "軽トラック積み放題",
    capacity: "約1〜1.5畳分",
    price: "10,000〜30,000円",
    example: "一人暮らしの片付け・少量の不用品",
  },
  {
    plan: "1.5tトラック積み放題",
    capacity: "約2〜3畳分",
    price: "30,000〜60,000円",
    example: "1〜2部屋分・カップル世帯の引越し残置物",
  },
  {
    plan: "2tトラック積み放題",
    capacity: "約3〜4畳分",
    price: "50,000〜90,000円",
    example: "ファミリー世帯・一軒家の大量処分",
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "不用品回収の費用相場はどれくらいですか？",
    a: "単品なら1点あたり2,000〜15,000円程度、量が多い場合はトラック積み放題プランで軽トラック10,000〜30,000円、2tトラック50,000〜90,000円程度が目安です。基本料金・出張費・階段料金などが加算される場合があります。",
  },
  {
    q: "自治体の粗大ごみ回収と不用品回収業者、どちらが安いですか？",
    a: "1〜2点だけなら自治体の粗大ごみ回収（1点数百円〜2,000円程度）の方が安いことが多いです。一方、量が多い・すぐに処分したい・運び出しが大変・家電や家具が混在する場合は、まとめて運び出してくれる不用品回収業者の方が手間とトータルコストで有利になることがあります。",
  },
  {
    q: "見積もりは無料ですか？",
    a: "多くの優良業者は出張見積もり・電話見積もりを無料で行っています。複数社から相見積もりを取り、料金の内訳（基本料金・作業費・処分費など）を明確に提示してくれる業者を選ぶのが安心です。",
  },
  {
    q: "「無料回収」をうたうトラックに頼んでも大丈夫ですか？",
    a: "注意が必要です。「無料」と言いながら積み込み後に高額請求するトラブルや、回収物の不法投棄が問題になっています。一般家庭の不用品回収には自治体の「一般廃棄物収集運搬業」の許可が必要です。許可の有無や所在地・連絡先が明確な業者を選びましょう。",
  },
  {
    q: "不用品回収を安くするコツはありますか？",
    a: "①複数社で相見積もりを取る、②売れるものはリサイクルショップやフリマアプリで先に売る、③自分で運べるものは自治体回収を併用する、④トラック積み放題プランにまとめる、⑤平日や閑散期を狙う、といった方法で費用を抑えられます。",
  },
];

export default function FunyohinHiyoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "不用品回収の費用相場【2026年版】料金の目安・トラック積み放題・安く抑えるコツ",
        description:
          "不用品回収の費用相場を品目別・トラック積み放題プラン別に解説。自治体回収との違い、安く抑えるコツ、悪質業者を避ける注意点まで。",
        datePublished: "2026-06-07",
        dateModified: "2026-06-07",
        author: { "@type": "Organization", name: "ゴミの日.com" },
        publisher: { "@type": "Organization", name: "ゴミの日.com" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: "https://gominohi.com/" },
          { "@type": "ListItem", position: 2, name: "お役立ちガイド", item: "https://gominohi.com/guide" },
          { "@type": "ListItem", position: 3, name: "不用品回収の費用相場", item: `https://gominohi.com${PAGE_PATH}` },
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
          <span><a href="/guide">お役立ちガイド</a></span>
          <span>不用品回収の費用相場</span>
        </nav>

        <h1 className="section-title">不用品回収の費用相場【2026年版】</h1>
        <p className="article-updated">最終更新日: {UPDATED}</p>

        <article className="article">
          <p className="article-lead">
            引越しや大掃除、遺品整理などで出た不用品。「業者に頼むといくらかかるの？」という疑問に、
            <strong>品目別・トラック積み放題プラン別の費用相場</strong>をわかりやすくまとめました。
            自治体の粗大ごみ回収との使い分けや、料金を安く抑えるコツ、悪質業者を避ける注意点も解説します。
          </p>

          <nav className="article-toc" aria-label="目次">
            <div className="article-toc-title">この記事の内容</div>
            <ol>
              <li><a href="#souba">不用品回収の費用相場（早見表）</a></li>
              <li><a href="#uchiwake">料金の内訳 ― 何にお金がかかる？</a></li>
              <li><a href="#tanpin">品目別の費用相場</a></li>
              <li><a href="#truck">トラック積み放題プランの相場</a></li>
              <li><a href="#jichitai">自治体の粗大ごみ回収との違い</a></li>
              <li><a href="#yasuku">安く抑える5つのコツ</a></li>
              <li><a href="#chui">悪質業者を避ける注意点</a></li>
              <li><a href="#faq">よくある質問</a></li>
            </ol>
          </nav>

          <h2 id="souba">不用品回収の費用相場（早見表）</h2>
          <p>
            不用品回収の料金は、大きく分けて「<strong>単品（品目ごと）</strong>」と「<strong>トラック積み放題（量でまとめる）</strong>」の2つの料金体系があります。ざっくりした目安は次のとおりです。
          </p>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>頼み方</th>
                  <th>費用の目安</th>
                  <th>向いているケース</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>単品回収</td>
                  <td className="price">2,000〜15,000円/点</td>
                  <td>処分品が1〜3点と少ない</td>
                </tr>
                <tr>
                  <td>軽トラック積み放題</td>
                  <td className="price">10,000〜30,000円</td>
                  <td>一人暮らしの片付け</td>
                </tr>
                <tr>
                  <td>1.5tトラック積み放題</td>
                  <td className="price">30,000〜60,000円</td>
                  <td>1〜2部屋分</td>
                </tr>
                <tr>
                  <td>2tトラック積み放題</td>
                  <td className="price">50,000〜90,000円</td>
                  <td>一軒家・ファミリー世帯</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="article-callout">
            <strong>※ 金額はあくまで一般的な目安です。</strong>地域・業者・搬出条件（階段の有無、エレベーター、駐車スペースなど）によって変動します。正確な金額は必ず見積もりで確認してください。
          </p>

          <h2 id="uchiwake">料金の内訳 ― 何にお金がかかる？</h2>
          <p>不用品回収の料金は、主に次の要素の合計で決まります。</p>
          <ul>
            <li><strong>基本料金・出張費</strong>：3,000〜5,000円程度。業者の出張や手続きの費用です。</li>
            <li><strong>作業費（人件費）</strong>：搬出の人数・時間に応じて加算されます。</li>
            <li><strong>処分費・リサイクル費</strong>：品目ごとの処分にかかる費用。エアコン・テレビ・冷蔵庫・洗濯機の「家電4品目」は法律で<strong>リサイクル料金</strong>が別途必要です。</li>
            <li><strong>オプション料金</strong>：階段料金（エレベーターなしの高層階）、分解・取り外し、即日対応、深夜・早朝対応などで加算される場合があります。</li>
          </ul>

          <h2 id="tanpin">品目別の費用相場</h2>
          <p>代表的な品目の費用目安です（基本料金・出張費は別途かかる場合があります）。</p>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>品目</th>
                  <th>費用の目安</th>
                  <th>備考</th>
                </tr>
              </thead>
              <tbody>
                {SINGLE_ITEMS.map((s) => (
                  <tr key={s.item}>
                    <td>{s.item}</td>
                    <td className="price">{s.price}</td>
                    <td style={{ fontSize: ".82rem", color: "var(--gray-600)" }}>{s.note || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="article-callout">
            <strong>家電4品目（エアコン・テレビ・冷蔵庫/冷凍庫・洗濯機/乾燥機）</strong>は「家電リサイクル法」の対象で、回収費とは別に
            <strong>リサイクル料金</strong>がかかります。メーカー・サイズで金額が異なります。
          </p>

          <h2 id="truck">トラック積み放題プランの相場</h2>
          <p>
            処分品が多いときは、トラックに積める分だけ定額で回収する「<strong>積み放題プラン</strong>」がお得です。世帯規模の目安は次のとおりです。
          </p>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>プラン</th>
                  <th>積載量の目安</th>
                  <th>費用の目安</th>
                  <th>こんな人に</th>
                </tr>
              </thead>
              <tbody>
                {TRUCK_PLANS.map((p) => (
                  <tr key={p.plan}>
                    <td>{p.plan}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-600)" }}>{p.capacity}</td>
                    <td className="price">{p.price}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-600)" }}>{p.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            なお「積み放題」でも、家電リサイクル料金や、規定量を超えた分の追加料金が発生する場合があります。
            <strong>どこまでが定額に含まれるか</strong>を見積もり時に確認しておくと安心です。
          </p>

          {/* アフィリエイト広告（不用品回収） */}
          <InlineAd locale="ja" />

          <h2 id="jichitai">自治体の粗大ごみ回収との違い（どっちが得？）</h2>
          <p>
            「不用品回収業者」と「自治体の粗大ごみ回収」は、料金も使い勝手も異なります。状況に応じて使い分けましょう。
          </p>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>比較項目</th>
                  <th>自治体の粗大ごみ回収</th>
                  <th>不用品回収業者</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>料金</td>
                  <td>安い（1点 数百円〜2,000円程度）</td>
                  <td>やや高い（量・条件による）</td>
                </tr>
                <tr>
                  <td>運び出し</td>
                  <td>自分で集積所まで出す</td>
                  <td>部屋からそのまま搬出</td>
                </tr>
                <tr>
                  <td>対応スピード</td>
                  <td>予約制で数日〜数週間待ち</td>
                  <td>即日・当日対応も可能</td>
                </tr>
                <tr>
                  <td>まとめて処分</td>
                  <td>点数・サイズ制限あり</td>
                  <td>大量でもまとめてOK</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>1〜2点・自分で運べる</strong>なら自治体回収がお得。
            <strong>量が多い・急ぎ・運び出しが大変・家具家電が混在</strong>するなら、手間を含めたトータルで不用品回収業者が有利になりやすいです。
          </p>
          <p className="article-callout">
            お住まいの地域のごみ収集日は、当サイトの
            {" "}<a href="/" style={{ color: "#b45309", fontWeight: 600, textDecoration: "underline" }}>ごみ収集日カレンダー</a>{" "}
            で確認できます。なお粗大ごみは多くの自治体で事前申し込み制のため、収集日・手数料は各地域ページに掲載している自治体公式の粗大ごみ案内ページをご確認ください。
          </p>

          <h2 id="yasuku">不用品回収を安く抑える5つのコツ</h2>
          <ol>
            <li><strong>複数社で相見積もりを取る</strong>：同じ内容でも業者で料金差が大きいため、2〜3社を比較するのが基本です。</li>
            <li><strong>売れるものは先に売る</strong>：状態の良い家電・家具・ブランド品はリサイクルショップやフリマアプリで売れば、処分費が浮くどころかプラスになることも。</li>
            <li><strong>自分で運べるものは自治体回収を併用</strong>：小物や1〜2点の粗大ごみは自治体に出し、運び出しが大変なものだけ業者に頼むと節約できます。</li>
            <li><strong>トラック積み放題にまとめる</strong>：点数が多いなら単品より積み放題プランの方が割安になりやすいです。</li>
            <li><strong>平日・閑散期を狙う</strong>：引越しシーズン（3〜4月）や週末は混み合い割高になりがち。日程に余裕があれば平日がおすすめです。</li>
          </ol>

          <h2 id="chui">悪質業者を避けるための注意点</h2>
          <p>
            残念ながら、不用品回収にはトラブルもあります。安心して頼むために、次の点をチェックしましょう。
          </p>
          <ul>
            <li><strong>「無料回収」をうたうトラック・チラシに安易に頼まない</strong>：積み込み後に高額請求されたり、回収物が不法投棄されるケースがあります。</li>
            <li><strong>許可の有無を確認する</strong>：一般家庭の不用品回収には、自治体の「一般廃棄物収集運搬業」の許可（または委託）が必要です。</li>
            <li><strong>会社の所在地・連絡先が明確か</strong>：固定電話・住所・運営会社が確認できる業者を選びましょう。</li>
            <li><strong>見積もりが明朗か</strong>：基本料金・作業費・処分費などの内訳を書面で提示してくれる業者は信頼できます。「一式」だけの見積もりは要注意。</li>
            <li><strong>追加料金の条件を事前に確認</strong>：当日になって「階段料金」「分解費」などで大幅に上乗せされないよう、見積もり時に確認しておきます。</li>
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
            本記事の費用はいずれも一般的な目安であり、実際の料金を保証するものではありません。正確な金額・サービス内容は各業者の見積もり・公式情報をご確認ください。
          </div>

          <div className="article-related">
            <strong>関連リンク</strong>
            <div className="article-related-links">
              <a href="/guide" className="btn btn-outline">お役立ちガイド一覧</a>
              <a href="/" className="btn btn-outline">ごみ収集日カレンダーで調べる</a>
            </div>
          </div>
        </article>
      </div>
      {/* ボトム固定広告バナー（×でそのタブ中のみ非表示） */}
      <BottomAdBanner locale="ja" />
    </>
  );
}
