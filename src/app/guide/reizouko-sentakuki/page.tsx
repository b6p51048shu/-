import type { Metadata } from "next";
import RakutenAdCard from "@/components/RakutenAdCard";

const PAGE_PATH = "/guide/reizouko-sentakuki/";
const UPDATED = "2026年6月29日";

export const metadata: Metadata = {
  title: "冷蔵庫・洗濯機の処分方法5つ【家電リサイクル法】料金と手順をわかりやすく",
  description:
    "冷蔵庫・洗濯機は粗大ごみに出せません。家電リサイクル法にもとづく5つの処分方法（購入店引取・指定引取場所への持ち込み・回収業者・買取など）と、リサイクル料金の目安、水抜き等の事前準備を解説します。",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: "冷蔵庫・洗濯機の処分方法5つ【家電リサイクル法】 | ゴミの日.com",
    description: "粗大ごみに出せない冷蔵庫・洗濯機の正しい処分ルートと料金の目安を解説。",
  },
};

const ROUTES: { route: string; cost: string; fit: string }[] = [
  { route: "① 買い替える店に引き取ってもらう", cost: "リサイクル料金＋収集運搬料金", fit: "買い替えと同時。最も手軽で確実" },
  { route: "② 過去に買った店に引き取ってもらう", cost: "リサイクル料金＋収集運搬料金", fit: "処分のみ。購入店に引取義務がある" },
  { route: "③ 指定引取場所へ自分で持ち込む", cost: "リサイクル料金のみ（最安）", fit: "車があり自分で運べる人" },
  { route: "④ 自治体案内の収集運搬業者に依頼", cost: "リサイクル料金＋運搬費", fit: "購入店が不明・遠方・閉店した場合" },
  { route: "⑤ 買取・不用品回収業者にまとめて依頼", cost: "±0〜業者料金", fit: "製造年が新しい／引っ越し等で他の不用品も一緒に片付けたい" },
];

const FEES: { item: string; fee: string; note: string }[] = [
  { item: "冷蔵庫・冷凍庫（170L以下）", fee: "約3,740円〜", note: "小型・単身向けサイズ" },
  { item: "冷蔵庫・冷凍庫（171L以上）", fee: "約4,730円〜", note: "ファミリーサイズ" },
  { item: "洗濯機・衣類乾燥機", fee: "約2,530円〜", note: "縦型・ドラム式とも同額" },
  { item: "（参考）テレビ 16型以上", fee: "約2,970円〜", note: "液晶・有機EL" },
  { item: "（参考）エアコン", fee: "約990円〜", note: "別途取り外し工事費" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "冷蔵庫や洗濯機は粗大ごみに出せないのですか？",
    a: "出せません。エアコン・テレビ・冷蔵庫/冷凍庫・洗濯機/衣類乾燥機の「家電4品目」は家電リサイクル法の対象で、自治体の粗大ごみ収集の対象外です。購入店・指定引取場所・許可を受けた回収ルートで処分する必要があります。",
  },
  {
    q: "一番安く処分する方法は？",
    a: "指定引取場所への自己搬入です。郵便局でリサイクル料金を振り込んで「家電リサイクル券」を作り、最寄りの指定引取場所へ持ち込めば、収集運搬料金がかからずリサイクル料金だけで済みます。ただし車と人手が必要です。",
  },
  {
    q: "リサイクル料金は事前に何を確認すればいいですか？",
    a: "「メーカー名」と「冷蔵庫なら容量（リットル数）」です。料金はメーカーと容量区分で決まっており、家電リサイクル券センターのサイトで正確な金額を調べられます。本体前面や内側のラベルで確認できます。",
  },
  {
    q: "処分前の準備はありますか？",
    a: "冷蔵庫は前日までに中身を空にし電源を抜いて霜取り・水抜きを、洗濯機は給水・排水ホースの水抜きをしておきます。水が残っていると運搬時の水漏れトラブルになります。",
  },
  {
    q: "まだ使える冷蔵庫・洗濯機はどうするのが得ですか？",
    a: "製造から5〜10年以内で動作品なら、リサイクルショップや出張買取の査定を先に受けるのがおすすめです。買取が成立すれば処分費用がゼロどころかプラスになります。引っ越しなどで他の不用品も一緒に片付けたい場合は、買取対応の不用品回収業者にまとめて依頼する方法もあります。",
  },
];

export default function ReizoukoSentakukiPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "冷蔵庫・洗濯機の処分方法5つ【家電リサイクル法】料金と手順",
        description:
          "粗大ごみに出せない冷蔵庫・洗濯機の5つの処分ルート、リサイクル料金の目安、家電リサイクル券の手順、事前準備を解説。",
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
          { "@type": "ListItem", position: 3, name: "冷蔵庫・洗濯機の処分方法", item: `https://gominohi.com${PAGE_PATH}` },
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
          <span>冷蔵庫・洗濯機の処分方法</span>
        </nav>

        <h1 className="section-title">冷蔵庫・洗濯機の処分方法5つ【家電リサイクル法】</h1>
        <p className="article-updated">最終更新日: {UPDATED}</p>

        <article className="article">
          <p className="article-lead">
            冷蔵庫・洗濯機は<strong>粗大ごみに出せません</strong>。家電リサイクル法の対象（家電4品目）のため、
            専用のルートで処分する必要があります。この記事では、<strong>5つの処分方法と費用の比較・
            リサイクル料金の目安・手続きの手順・処分前の準備</strong>を、初めての方向けに解説します。
          </p>

          <nav className="article-toc" aria-label="目次">
            <div className="article-toc-title">この記事の内容</div>
            <ol>
              <li><a href="#law">なぜ粗大ごみに出せないのか（家電リサイクル法）</a></li>
              <li><a href="#routes">処分方法5つの比較</a></li>
              <li><a href="#fee">リサイクル料金の目安</a></li>
              <li><a href="#ticket">家電リサイクル券の手順（自分で持ち込む場合）</a></li>
              <li><a href="#prep">処分前の準備（水抜き・霜取り）</a></li>
              <li><a href="#chuui">「無料回収」に出してはいけない理由</a></li>
              <li><a href="#faq">よくある質問</a></li>
            </ol>
          </nav>

          <h2 id="law">なぜ粗大ごみに出せないのか（家電リサイクル法）</h2>
          <p>
            <strong>エアコン・テレビ・冷蔵庫/冷凍庫・洗濯機/衣類乾燥機</strong>の「家電4品目」は、
            金属などの資源を回収し、冷媒フロンを適正処理するため、家電リサイクル法でメーカーによる
            リサイクルが義務付けられています。そのため自治体の粗大ごみでは収集されず、
            <strong>排出者がリサイクル料金を負担する</strong>しくみです。
          </p>

          <h2 id="routes">処分方法5つの比較</h2>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>方法</th>
                  <th>費用</th>
                  <th>向いているケース</th>
                </tr>
              </thead>
              <tbody>
                {ROUTES.map((r) => (
                  <tr key={r.route}>
                    <td style={{ fontWeight: 600 }}>{r.route}</td>
                    <td className="price">{r.cost}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-600)" }}>{r.fit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="article-callout">
            <strong>買い替えなら①一択。</strong>配送と同時に引き取ってくれるため、運び出しの心配がありません。
            処分だけなら、車があれば③自己搬入が最安、なければ④か⑤が現実的です。
          </p>

          <h2 id="fee">リサイクル料金の目安</h2>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>品目</th>
                  <th>リサイクル料金</th>
                  <th>備考</th>
                </tr>
              </thead>
              <tbody>
                {FEES.map((f) => (
                  <tr key={f.item}>
                    <td>{f.item}</td>
                    <td className="price">{f.fee}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-600)" }}>{f.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            料金はメーカーにより異なります（上記は大手メーカーの目安）。加えて、店や業者に運んでもらう場合は
            <strong>収集運搬料金（1,500〜3,000円程度）</strong>がかかります。
          </p>

          {/* アフィリエイト（不用品回収）— 「運べない・まとめて処分」の文脈 */}
          <RakutenAdCard locale="ja" order="dispenser-first" />

          <h2 id="ticket">家電リサイクル券の手順（自分で持ち込む場合）</h2>
          <ol>
            <li><strong>メーカー名と容量を確認する</strong>：本体ラベルでメーカーと冷蔵庫の容量（L）をチェック。</li>
            <li><strong>郵便局でリサイクル料金を振り込む</strong>：郵便局の「家電リサイクル券」に記入して料金を支払い。</li>
            <li><strong>指定引取場所を調べる</strong>：家電リサイクル券センターのサイトで最寄りの引取場所を確認。</li>
            <li><strong>リサイクル券を貼って持ち込む</strong>：営業日・時間内に搬入すれば完了。収集運搬費ゼロで済みます。</li>
          </ol>

          <h2 id="prep">処分前の準備（水抜き・霜取り）</h2>
          <ul>
            <li><strong>冷蔵庫</strong>：前日までに中身を空に → 電源を抜く → 霜取り → 蒸発皿の水を捨てる。ドアはテープで固定。</li>
            <li><strong>洗濯機</strong>：給水ホースの水を抜く → 脱水を数十秒回して槽内の水を切る → 排水ホースの水を抜く。</li>
            <li><strong>中身の入れ忘れに注意</strong>：ポケットや洗濯槽の中の忘れ物は回収後には戻りません。</li>
          </ul>

          <h2 id="chuui">「無料回収」に出してはいけない理由</h2>
          <p>
            冷蔵庫・洗濯機の処分には本来リサイクル料金がかかります。それを「無料」で引き取る業者は、
            <strong>後からの高額請求</strong>や、フロン・鉛などの<strong>不適正処理・不法投棄</strong>につながる
            おそれがあり、環境省も注意を呼びかけています。業者に頼む場合は、
            <a href="/guide/gyousha-erabikata/">許可の有無と見積もりを確認</a>してから依頼しましょう。
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
            リサイクル料金・収集運搬料金は変更されることがあります。正確な金額は家電リサイクル券センター
            （RKC）の公式サイト、またはお住まいの自治体の案内でご確認ください。
          </div>

          <div className="article-related">
            <strong>関連リンク</strong>
            <div className="article-related-links">
              <a href="/items/refrigerator/" className="btn btn-outline">冷蔵庫の捨て方（品目ページ）</a>
              <a href="/items/washing-machine/" className="btn btn-outline">洗濯機の捨て方（品目ページ）</a>
              <a href="/guide/gyousha-erabikata/" className="btn btn-outline">不用品回収業者の選び方</a>
              <a href="/guide/hikkoshi-gomi/" className="btn btn-outline">引越しゴミの処分方法</a>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
