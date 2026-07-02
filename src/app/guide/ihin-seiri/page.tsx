import type { Metadata } from "next";
import InlineAd from "@/components/InlineAd";
import BottomAdBanner from "@/components/BottomAdBanner";

const PAGE_PATH = "/guide/ihin-seiri/";
const UPDATED = "2026年6月29日";

export const metadata: Metadata = {
  title: "遺品整理の進め方と費用相場【間取り別】自分でやる・業者に頼むの判断基準",
  description:
    "遺品整理の進め方を5ステップで解説。自分でやるか業者に頼むかの判断基準、間取り別の費用相場、遺品整理業者の選び方、貴重品・形見分け・買取のポイントまでまとめました。",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: "遺品整理の進め方と費用相場【間取り別】 | ゴミの日.com",
    description: "5ステップの進め方、間取り別の費用相場、業者選びのポイントを解説。",
  },
};

const COSTS: { layout: string; cost: string; note: string }[] = [
  { layout: "1R・1K", cost: "3万〜10万円", note: "作業員1〜2名・半日程度" },
  { layout: "1DK・1LDK", cost: "7万〜25万円", note: "作業員2〜3名・半日〜1日" },
  { layout: "2DK・2LDK", cost: "12万〜35万円", note: "作業員3〜5名・1日" },
  { layout: "3DK・3LDK", cost: "17万〜50万円", note: "作業員4〜6名・1〜2日" },
  { layout: "4LDK以上・一軒家", cost: "25万〜70万円以上", note: "物量により大きく変動" },
];

const STEPS: { step: string; detail: string }[] = [
  { step: "① 重要書類・貴重品を最優先で確保", detail: "遺言書・通帳・印鑑・保険証券・権利証・鍵・スマホ。相続手続きに必要なものを先に分けておく" },
  { step: "② 形見分け・残す物を決める", detail: "写真・手紙・思い出の品。判断に迷う物は「保留箱」を作って先送りしてよい" },
  { step: "③ 処分する物を仕分ける", detail: "自治体で出せる物（可燃・不燃・粗大）と、家電4品目などの別ルート品を分ける" },
  { step: "④ 売れる物は買取へ", detail: "貴金属・骨董・切手・カメラ・家電など。買取額で処分費用を相殺できることも" },
  { step: "⑤ 残りを処分する", detail: "少量なら自治体の収集＋粗大ごみ、大量なら遺品整理業者・不用品回収業者へ" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "遺品整理は自分でやるのと業者に頼むの、どちらがいいですか？",
    a: "物量・距離・時間の3つで判断します。近距離で物が少なく時間をかけられるなら自分で進めるのが安く済みます。遠方の実家、物量が多い、賃貸で退去期限がある、体力的に難しい——こうした場合は業者依頼が現実的です。貴重品の捜索だけ自分で行い、残りを業者に任せる併用も一般的です。",
  },
  {
    q: "遺品整理の費用はなぜ幅があるのですか？",
    a: "料金は主に「物量（トラック台数）×作業員数×作業時間」で決まるためです。同じ間取りでも物の量で倍以上変わります。エレベーターの有無・駐車スペース・買取品の有無でも増減します。正確な金額は訪問見積もりで確認しましょう。",
  },
  {
    q: "遺品整理業者はどう選べばいいですか？",
    a: "①訪問見積もりで書面の内訳を出す、②一般廃棄物収集運搬の許可（または許可業者との提携）がある、③買取も対応できる（古物商許可）、④遺品整理士が在籍している、の4点が目安です。複数社の相見積もりで、料金と対応の丁寧さを比べるのが確実です。",
  },
  {
    q: "亡くなった直後、いつから遺品整理を始めるべきですか？",
    a: "決まりはありませんが、賃貸は家賃が発生し続けるため退去期限から逆算して早めに、持ち家は四十九日後など気持ちの区切りがついてからでも問題ありません。ただし相続放棄を検討している場合は、遺品の処分が相続の承認とみなされるおそれがあるため、処分前に専門家（弁護士等）に相談してください。",
  },
  {
    q: "遺品の中の仏壇や人形はどう処分すればいいですか？",
    a: "そのまま粗大ごみに出すことに抵抗がある場合は、寺院・神社での供養、仏壇店の引き取り、供養サービス付きの遺品整理業者を利用する方法があります。供養後に証明書を発行してくれる業者もあります。",
  },
];

export default function IhinSeiriPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "遺品整理の進め方と費用相場【間取り別】自分でやる・業者に頼むの判断基準",
        description:
          "遺品整理の5ステップ、間取り別費用相場、業者の選び方、貴重品・形見分け・買取のポイントを解説。",
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
          { "@type": "ListItem", position: 3, name: "遺品整理の進め方と費用相場", item: `https://gominohi.com${PAGE_PATH}` },
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
          <span>遺品整理の進め方と費用相場</span>
        </nav>

        <h1 className="section-title">遺品整理の進め方と費用相場【間取り別】</h1>
        <p className="article-updated">最終更新日: {UPDATED}</p>

        <article className="article">
          <p className="article-lead">
            遺品整理は、気持ちの整理がつかないまま<strong>「何から手を付ければいいのか」</strong>で止まってしまいがちです。
            この記事では、<strong>進め方の5ステップ・自分でやるか業者に頼むかの判断基準・間取り別の費用相場・
            業者選びのポイント</strong>を、順を追って解説します。
          </p>

          <nav className="article-toc" aria-label="目次">
            <div className="article-toc-title">この記事の内容</div>
            <ol>
              <li><a href="#handan">自分でやる？業者に頼む？判断基準</a></li>
              <li><a href="#steps">遺品整理の進め方5ステップ</a></li>
              <li><a href="#cost">費用相場【間取り別】</a></li>
              <li><a href="#gyousha">遺品整理業者の選び方</a></li>
              <li><a href="#chuui">相続・供養にかかわる注意点</a></li>
              <li><a href="#faq">よくある質問</a></li>
            </ol>
          </nav>

          <h2 id="handan">自分でやる？業者に頼む？判断基準</h2>
          <p>最初に決めるのはここです。<strong>物量・距離・期限</strong>の3つで考えます。</p>
          <ul>
            <li><strong>自分で進めやすいケース</strong>：近距離／物が少ない（1R〜1DK程度）／退去期限がない／家族で人手がある</li>
            <li><strong>業者が現実的なケース</strong>：遠方の実家／物量が多い／賃貸で退去期限がある／大型家具・家電が多い／体力的・精神的に負担が大きい</li>
            <li><strong>併用（おすすめ）</strong>：貴重品・形見の捜索は自分で行い、仕分け後の搬出・処分だけ業者に任せる。費用を抑えつつ後悔も残りにくい方法です。</li>
          </ul>

          <h2 id="steps">遺品整理の進め方5ステップ</h2>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>ステップ</th>
                  <th>ポイント</th>
                </tr>
              </thead>
              <tbody>
                {STEPS.map((s) => (
                  <tr key={s.step}>
                    <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{s.step}</td>
                    <td style={{ fontSize: ".9rem" }}>{s.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="article-callout">
            <strong>最優先は①の貴重品確保。</strong>遺言書・通帳・権利証などは相続手続きに直結します。
            業者に依頼する場合も、この工程だけは家族の手で行うことを強くおすすめします。
          </p>

          <h2 id="cost">費用相場【間取り別】</h2>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>間取り</th>
                  <th>費用の目安</th>
                  <th>作業規模の目安</th>
                </tr>
              </thead>
              <tbody>
                {COSTS.map((c) => (
                  <tr key={c.layout}>
                    <td style={{ fontWeight: 600 }}>{c.layout}</td>
                    <td className="price">{c.cost}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-600)" }}>{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            費用は「物量×人手×時間」で決まるため、同じ間取りでも大きく変わります。
            <strong>貴金属・骨董・家電などの買取が成立すると、その分が差し引かれて安くなる</strong>ケースも多いので、
            見積もり時に買取対応の有無を確認しましょう。
          </p>

          {/* アフィリエイト（不用品回収・遺品整理）— 費用検討の直後 */}
          <InlineAd locale="ja" />

          <h2 id="gyousha">遺品整理業者の選び方</h2>
          <ul>
            <li><strong>訪問見積もりで書面の内訳を出す業者</strong>：電話だけの概算で契約しない。</li>
            <li><strong>一般廃棄物収集運搬の許可（または許可業者と提携）</strong>：家庭ごみの運搬に必要です。</li>
            <li><strong>古物商許可があり買取もできる</strong>：処分と買取を同時に進められ、費用を圧縮できます。</li>
            <li><strong>遺品整理士の在籍</strong>：資格が全てではありませんが、対応品質の目安になります。</li>
            <li><strong>2〜3社の相見積もり</strong>：料金差が大きい業界です。対応の丁寧さも比較材料に。</li>
          </ul>
          <p>
            悪質業者の見分け方は{" "}
            <a href="/guide/gyousha-erabikata/" style={{ color: "#b45309", fontWeight: 600, textDecoration: "underline" }}>不用品回収業者の選び方</a>{" "}
            で詳しく解説しています。
          </p>

          <h2 id="chuui">相続・供養にかかわる注意点</h2>
          <ul>
            <li><strong>相続放棄を検討中なら処分前に専門家へ相談</strong>：遺品の処分・売却が「相続の承認」とみなされるおそれがあります。</li>
            <li><strong>賃貸の退去期限を確認</strong>：家賃・管理費は発生し続けます。大家・管理会社に事情を伝えると期限を相談できる場合もあります。</li>
            <li><strong>仏壇・遺影・人形は供養という選択肢</strong>：寺院や供養サービス付き業者を利用できます。</li>
            <li><strong>デジタル遺品も忘れずに</strong>：スマホ・PCは解約やデータ確認が終わるまで処分しない（<a href="/items/smartphone/">スマートフォンの捨て方</a>参照）。</li>
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
            本記事の費用はいずれも一般的な目安です。相続に関する判断は弁護士・司法書士等の専門家にご相談ください。
          </div>

          <div className="article-related">
            <strong>関連リンク</strong>
            <div className="article-related-links">
              <a href="/guide/jikka-katazuke/" className="btn btn-outline">実家の片付け・生前整理</a>
              <a href="/guide/gyousha-erabikata/" className="btn btn-outline">不用品回収業者の選び方</a>
              <a href="/guide/funyohin-hiyo/" className="btn btn-outline">不用品回収の費用相場</a>
              <a href="/items/" className="btn btn-outline">品目別の捨て方一覧</a>
            </div>
          </div>
        </article>
      </div>
      <BottomAdBanner locale="ja" />
    </>
  );
}
