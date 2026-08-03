import type { Metadata } from "next";
import InlineAd from "@/components/InlineAd";

const PAGE_PATH = "/guide/aircon-cleaning/";
const UPDATED = "2026年6月29日";

export const metadata: Metadata = {
  title: "エアコン分解洗浄で冷えが復活・電気代の節約に｜効果と料金相場、自分でできる範囲",
  description:
    "「エアコンの効きが悪い」の原因の多くは内部の汚れ。分解洗浄（エアコンクリーニング）で冷えが復活し、電気代の節約につながる理由、料金相場、自分でできる掃除との違い、頼みどきを解説します。",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: "エアコン分解洗浄で冷えが復活・電気代の節約に | ゴミの日.com",
    description: "冷えが悪い原因は内部の汚れ。分解洗浄の効果・料金相場・頼みどきを解説。",
  },
};

const PRICES: { type: string; price: string; note: string }[] = [
  { type: "壁掛けエアコン（通常タイプ）", price: "8,000〜14,000円", note: "所要1.5〜2時間程度" },
  { type: "壁掛けエアコン（お掃除機能付き）", price: "13,000〜22,000円", note: "分解に手間がかかるため割高" },
  { type: "室外機の洗浄（オプション）", price: "3,000〜6,000円", note: "吹出し口や裏面の汚れがひどい場合に" },
  { type: "防カビ・抗菌コート（オプション）", price: "1,000〜3,000円", note: "洗浄後のカビ再発を遅らせる" },
  { type: "複数台まとめて依頼", price: "2台目以降 割引あり", note: "1台あたり数千円安くなる業者が多い" },
];

const SELF_VS_PRO: { part: string; self: string; pro: string }[] = [
  { part: "フィルター", self: "◎ 2週間に1回の水洗いでOK", pro: "（依頼不要）" },
  { part: "吹出口・ルーバーの拭き掃除", self: "○ 電源を切って固く絞った布で", pro: "（依頼不要）" },
  { part: "熱交換器（アルミフィン）", self: "✕ 市販スプレーは故障・火災の原因になり得る", pro: "◎ 高圧洗浄で汚れを根こそぎ除去" },
  { part: "送風ファン（内部の筒）", self: "✕ 手が届かず、カビの最大の温床", pro: "◎ 分解して洗浄。臭いの原因はほぼここ" },
  { part: "ドレンパン・排水経路", self: "✕ 分解が必要", pro: "◎ 水漏れ予防にも効果" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "エアコンの分解洗浄をすると本当に電気代は安くなりますか？",
    a: "内部の熱交換器やファンにホコリ・カビが溜まると、空気の通りが悪くなり、同じ設定温度でも余計な電力を使って運転します。汚れを落とせば本来の熱交換効率に戻るため、効きが良くなり消費電力のムダが減ります。節約幅は汚れ具合によりますが、「設定温度を1〜2度緩められるようになった」という体感変化が出やすく、環境省もフィルター清掃だけでも冷房で年間数百円〜の節電効果を示しています。内部洗浄はその上位版と考えると分かりやすいです。",
  },
  {
    q: "市販の洗浄スプレーで自分でやってはだめですか？",
    a: "おすすめしません。市販スプレーは奥のファンやドレンパンまで洗い流せず、洗剤成分が内部に残ってカビの栄養になったり、電装部にかかって故障・発火の原因になった事例が報告されています。自分でやるのはフィルター掃除と吹出口の拭き掃除まで、内部は分解洗浄のプロに任せるのが安全です。",
  },
  {
    q: "エアコンクリーニングはどのくらいの頻度で頼むべきですか？",
    a: "使用頻度によりますが、1〜2年に1回が目安です。「吹出口に黒い点々（カビ）が見える」「酸っぱい臭い・カビ臭がする」「風量が落ちた」「効きが悪くなった」のどれかがあれば頼みどきです。",
  },
  {
    q: "料金を安く抑えるコツはありますか？",
    a: "①繁忙期（6〜8月）を避ける：真夏は予約が取りにくく割引も少なめです。春（4〜5月）や秋の閑散期はキャンペーンが出やすく、夏前に済ませれば一番暑い時期を万全の状態で迎えられます。②複数台まとめて依頼する：2台目以降の割引がある業者が多いです。③相見積もりで比較する：同じ作業内容でも業者間で数千円の差があります。",
  },
  {
    q: "掃除しても効きが悪い・古いエアコンは買い替えるべき？",
    a: "製造から10年を超えたエアコンは、洗浄しても省エネ性能自体が最新機種に劣るため、電気代の観点では買い替えが得になるケースがあります。買い替え時の古いエアコンは家電リサイクル法の対象で、取り外しを含めて販売店に依頼するのが確実です。処分方法はエアコンの捨て方ページを参照してください。",
  },
];

export default function AirconCleaningPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "エアコン分解洗浄で冷えが復活・電気代の節約に｜効果と料金相場",
        description:
          "エアコンの効きが悪い原因の多くは内部の汚れ。分解洗浄の節電効果、料金相場、自分でできる範囲との違い、頼みどきを解説。",
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
          { "@type": "ListItem", position: 3, name: "エアコン分解洗浄の効果と料金", item: `https://gominohi.com${PAGE_PATH}` },
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
          <span>エアコン分解洗浄の効果と料金</span>
        </nav>

        <h1 className="section-title">エアコン分解洗浄で冷えが復活・電気代の節約に</h1>
        <p className="article-updated">最終更新日: {UPDATED}</p>

        <article className="article">
          <p className="article-lead">
            「エアコンの効きが悪い」「風がカビ臭い」——その原因の多くは故障ではなく、
            <strong>内部の熱交換器とファンに溜まったホコリ・カビ</strong>です。
            分解洗浄（エアコンクリーニング）で汚れを落とすと<strong>冷えが復活し、
            ムダな電力を使わなくなるため電気代の節約</strong>につながります。
            この記事では、<strong>節電になる理由・料金相場・自分でできる範囲との違い・頼みどき</strong>を解説します。
          </p>

          <nav className="article-toc" aria-label="目次">
            <div className="article-toc-title">この記事の内容</div>
            <ol>
              <li><a href="#riyu">汚れたエアコンが電気代を食う理由</a></li>
              <li><a href="#sign">洗浄の頼みどきサイン4つ</a></li>
              <li><a href="#self">自分でできる掃除・プロに任せる部分</a></li>
              <li><a href="#price">分解洗浄の料金相場</a></li>
              <li><a href="#yasuku">安く頼むコツ（時期・まとめ割・相見積もり）</a></li>
              <li><a href="#kaikae">10年超なら買い替えも検討</a></li>
              <li><a href="#faq">よくある質問</a></li>
            </ol>
          </nav>

          <h2 id="riyu">汚れたエアコンが電気代を食う理由</h2>
          <p>
            エアコンは「熱交換器に空気を通して熱をやり取りする」機械です。ここに
            ホコリとカビが溜まると<strong>空気の通り道が塞がれ、熱交換の効率が落ちます</strong>。
            すると同じ温度に冷やすために、
          </p>
          <ul>
            <li>ファンがより強く長く回る → <strong>消費電力が増える</strong></li>
            <li>設定温度を余計に下げたくなる → <strong>さらに電気代がかさむ</strong></li>
            <li>風がカビの中を通って出てくる → <strong>臭い・アレルギーの原因に</strong></li>
          </ul>
          <p className="article-callout">
            つまり<strong>「効きが悪い→設定温度を下げる」は最も損なループ</strong>。
            洗浄で本来の性能に戻せば、同じ涼しさをより少ない電力で得られ、
            設定温度を1〜2度緩められる体感変化も出やすくなります。フィルター掃除だけでも
            節電効果があるとされており、内部の分解洗浄はその徹底版です。
          </p>

          <h2 id="sign">洗浄の頼みどきサイン4つ</h2>
          <ul>
            <li>✅ <strong>吹出口に黒い点々</strong>が見える（＝内部にカビ）</li>
            <li>✅ <strong>酸っぱい臭い・カビ臭</strong>がする</li>
            <li>✅ <strong>風量が落ちた／効きが悪くなった</strong></li>
            <li>✅ <strong>2年以上、内部洗浄をしていない</strong></li>
          </ul>
          <p>1つでも当てはまれば、夏本番の前に洗浄しておくと快適さと電気代の両方で効いてきます。</p>

          <h2 id="self">自分でできる掃除・プロに任せる部分</h2>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>部位</th>
                  <th>自分で</th>
                  <th>プロの分解洗浄</th>
                </tr>
              </thead>
              <tbody>
                {SELF_VS_PRO.map((s) => (
                  <tr key={s.part}>
                    <td style={{ fontWeight: 600 }}>{s.part}</td>
                    <td style={{ fontSize: ".85rem" }}>{s.self}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-600)" }}>{s.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="article-callout">
            <strong>市販の洗浄スプレーはNG。</strong>奥のファンまで届かず、残った洗剤がカビの栄養になるうえ、
            電装部にかかると故障・発火の原因になり得ます。フィルターまでは自分で、内部はプロで、が鉄則です。
          </p>

          <h2 id="price">分解洗浄の料金相場</h2>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>メニュー</th>
                  <th>料金の目安</th>
                  <th>備考</th>
                </tr>
              </thead>
              <tbody>
                {PRICES.map((p) => (
                  <tr key={p.type}>
                    <td style={{ fontWeight: 600 }}>{p.type}</td>
                    <td className="price">{p.price}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-600)" }}>{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* アフィリエイト枠 */}
          <InlineAd locale="ja" />

          <h2 id="yasuku">安く頼むコツ（時期・まとめ割・相見積もり）</h2>
          <ol>
            <li><strong>夏本番（6〜8月）を避けて早めに頼む</strong>：繁忙期は料金が高止まりし予約も取りにくい。<strong>春〜梅雨入り前に済ませるのが、料金・予約・快適さの三拍子で最も得</strong>です。</li>
            <li><strong>複数台まとめて依頼</strong>：2台目以降の割引を出す業者が多く、1台あたり数千円下がることも。</li>
            <li><strong>相見積もりで比較</strong>：同じ「壁掛け1台」でも業者間で数千円差があります。お掃除機能付きかどうかで料金が変わるため、機種名（室内機の型番）を伝えると正確です。</li>
            <li><strong>損害保険加入の業者を選ぶ</strong>：万一の故障・水濡れに補償があるかは料金以上に重要なチェックポイントです。</li>
          </ol>

          <h2 id="kaikae">10年超なら買い替えも検討</h2>
          <p>
            製造から10年を超えたエアコンは、洗浄しても省エネ性能そのものが最新機種に劣ります。
            電気代の差額を考えると買い替えが得になるケースもあり、その場合、古いエアコンは
            <strong>家電リサイクル法の対象</strong>のため粗大ごみには出せません。
            取り外し工事とセットで販売店に依頼するのが確実です。処分方法の詳細は
            {" "}<a href="/items/aircon/" style={{ color: "#b45309", fontWeight: 600, textDecoration: "underline" }}>エアコンの捨て方</a>{" "}
            にまとめています。
          </p>

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
            本記事の料金・節電効果はいずれも一般的な目安です。汚れ具合・機種・地域により異なります。
            正確な料金は各業者の見積もりでご確認ください。
          </div>

          <div className="article-related">
            <strong>関連リンク</strong>
            <div className="article-related-links">
              <a href="/items/aircon/" className="btn btn-outline">エアコンの捨て方（品目ページ）</a>
              <a href="/guide/reizouko-sentakuki/" className="btn btn-outline">冷蔵庫・洗濯機の処分方法</a>
              <a href="/guide/" className="btn btn-outline">お役立ちガイド一覧</a>
              <a href="/" className="btn btn-outline">ごみ収集日カレンダーで調べる</a>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
