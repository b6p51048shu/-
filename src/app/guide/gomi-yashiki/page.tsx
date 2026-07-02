import type { Metadata } from "next";
import InlineAd from "@/components/InlineAd";
import BottomAdBanner from "@/components/BottomAdBanner";

const PAGE_PATH = "/guide/gomi-yashiki/";
const UPDATED = "2026年6月29日";

export const metadata: Metadata = {
  title: "ゴミ屋敷の片付け費用と手順｜自力でできるレベルの見極めと業者の選び方",
  description:
    "ゴミ屋敷の片付けは「自力でできるレベルか」の見極めが最初の一歩。レベル別の判断基準、間取り別の費用相場、業者の選び方、自治体の支援制度、再発を防ぐコツまで解説します。",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: "ゴミ屋敷の片付け費用と手順 | ゴミの日.com",
    description: "レベル別の判断基準、費用相場、業者の選び方、再発防止まで解説。",
  },
};

const LEVELS: { level: string; state: string; judge: string }[] = [
  { level: "レベル1", state: "床は見えるが物が散乱。ごみ袋数個〜十数個分", judge: "自力でOK。自治体の収集日に合わせて計画的に出す" },
  { level: "レベル2", state: "床の大半が物で覆われ、腰の高さまで堆積した場所がある", judge: "家族・友人の応援＋自治体収集で可能。粗大ごみの申込も併用" },
  { level: "レベル3", state: "天井近くまで堆積・異臭・害虫が発生・水回りが使えない", judge: "業者推奨。分別・搬出・清掃をまとめて任せる方が安全で早い" },
  { level: "レベル4以上", state: "腐敗物・害虫害獣の大量発生・近隣から苦情", judge: "特殊清掃対応の業者一択。消毒・消臭まで必要" },
];

const COSTS: { layout: string; cost: string; note: string }[] = [
  { layout: "1R・1K", cost: "5万〜20万円", note: "堆積量・搬出条件で変動" },
  { layout: "1DK〜2DK", cost: "12万〜40万円", note: "作業員3〜5名・1日程度" },
  { layout: "2LDK〜3LDK", cost: "20万〜60万円", note: "1〜2日。清掃込みかで差が出る" },
  { layout: "一軒家", cost: "30万〜100万円以上", note: "物量次第。トラック複数台の規模" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "ゴミ屋敷の片付けはどこから手を付ければいいですか？",
    a: "①貴重品（財布・通帳・書類）の確保、②玄関から奥への「通路」の確保、③明らかなごみ（ペットボトル・弁当容器・袋物）の袋詰め、の順です。通路ができると搬出効率が一気に上がります。分別に迷う物は後回しにして、まず量を減らすことを優先しましょう。",
  },
  {
    q: "自力で片付けられるか業者に頼むべきか、どう判断しますか？",
    a: "「床が見えるか」「腰より高い堆積があるか」「異臭・害虫があるか」の3点が目安です。床の大半が見えないレベルになると、自力では数週間〜数ヶ月かかり挫折しやすくなります。異臭・害虫・腐敗物がある場合は衛生リスクがあるため業者をおすすめします。",
  },
  {
    q: "費用を少しでも安くする方法はありますか？",
    a: "①事前に自分でごみ袋詰めできる分を進めて物量を減らす、②複数社で相見積もりを取る、③買取対応の業者を選び家電・貴金属を査定してもらう、④自治体の粗大ごみ・通常収集を併用する、が効果的です。ただし無理は禁物で、体調と相談しながら進めてください。",
  },
  {
    q: "近所に知られずに片付けたいのですが可能ですか？",
    a: "多くの業者が配慮に対応しています。社名の入っていないトラックでの作業、夜間・早朝の作業、養生による目隠しなどを見積もり時に相談できます。対応可否と追加料金の有無を事前に確認しましょう。",
  },
  {
    q: "自治体はゴミ屋敷を手伝ってくれますか？",
    a: "自治体によっては、ごみ屋敷対策条例にもとづく相談窓口や、高齢・障害などの事情がある方向けのごみ出し支援制度があります。また通常の収集・粗大ごみは費用が最も安い処分手段です。まずお住まいの自治体の清掃窓口・福祉窓口に相談してみる価値があります。",
  },
];

export default function GomiYashikiPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "ゴミ屋敷の片付け費用と手順｜自力でできるレベルの見極めと業者の選び方",
        description:
          "ゴミ屋敷片付けのレベル別判断基準、間取り別費用相場、業者の選び方、自治体の支援制度、再発防止のコツを解説。",
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
          { "@type": "ListItem", position: 3, name: "ゴミ屋敷の片付け費用と手順", item: `https://gominohi.com${PAGE_PATH}` },
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
          <span>ゴミ屋敷の片付け費用と手順</span>
        </nav>

        <h1 className="section-title">ゴミ屋敷の片付け費用と手順</h1>
        <p className="article-updated">最終更新日: {UPDATED}</p>

        <article className="article">
          <p className="article-lead">
            ゴミ屋敷状態の片付けで最初に考えるべきは、<strong>「自力でできるレベルか、業者に頼むべきレベルか」</strong>の見極めです。
            無理な自力挑戦は挫折と悪化のもと、一方で軽度なら数万円で済むものを業者に丸投げする必要もありません。
            この記事では<strong>レベル別の判断基準・費用相場・手順・業者選び・再発防止</strong>まで順に解説します。
            責めるためではなく、解決するための記事です。
          </p>

          <nav className="article-toc" aria-label="目次">
            <div className="article-toc-title">この記事の内容</div>
            <ol>
              <li><a href="#level">自力か業者か：レベル別の判断基準</a></li>
              <li><a href="#jiriki">自力で片付ける手順（レベル1〜2）</a></li>
              <li><a href="#cost">業者に頼む場合の費用相場</a></li>
              <li><a href="#gyousha">業者の選び方と近所への配慮</a></li>
              <li><a href="#shien">自治体の支援制度も確認する</a></li>
              <li><a href="#saihatsu">再発を防ぐ3つのしくみ</a></li>
              <li><a href="#faq">よくある質問</a></li>
            </ol>
          </nav>

          <h2 id="level">自力か業者か：レベル別の判断基準</h2>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>レベル</th>
                  <th>状態</th>
                  <th>判断</th>
                </tr>
              </thead>
              <tbody>
                {LEVELS.map((l) => (
                  <tr key={l.level}>
                    <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{l.level}</td>
                    <td style={{ fontSize: ".9rem" }}>{l.state}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-600)" }}>{l.judge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="article-callout">
            目安は<strong>「床が見えるか」「腰より高い堆積」「異臭・害虫」</strong>の3点。
            異臭・害虫・腐敗物が出ている段階では、衛生リスクがあるため無理せず業者を検討してください。
          </p>

          <h2 id="jiriki">自力で片付ける手順（レベル1〜2）</h2>
          <ol>
            <li><strong>貴重品を確保する</strong>：財布・通帳・印鑑・書類・鍵。ごみに紛れやすいので最初に。</li>
            <li><strong>玄関からの「通路」を作る</strong>：搬出動線ができると効率が数倍になります。</li>
            <li><strong>明らかなごみから袋詰め</strong>：ペットボトル・容器・袋類。分別に迷う物は保留にして量を減らすのが先。</li>
            <li><strong>収集日に合わせて計画的に出す</strong>：一度に大量に出せない自治体もあるため、収集日ごとに数袋ずつ。お住まいの収集曜日は<a href="/">ごみ収集日カレンダー</a>で確認できます。</li>
            <li><strong>大物は粗大ごみを申込</strong>：家具・布団などは事前申込制です（<a href="/guide/sodaigomi-seal/">粗大ごみシールの買い方</a>参照）。</li>
          </ol>

          <h2 id="cost">業者に頼む場合の費用相場</h2>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>間取り</th>
                  <th>費用の目安</th>
                  <th>備考</th>
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
            料金は「物量（トラック台数）×作業員×時間」で決まり、<strong>清掃・消臭・害虫駆除まで含むかで大きく変わります</strong>。
            見積もり時に作業範囲を必ず確認しましょう。
          </p>

          {/* アフィリエイト（不用品回収）— 費用検討の直後 */}
          <InlineAd locale="ja" />

          <h2 id="gyousha">業者の選び方と近所への配慮</h2>
          <ul>
            <li><strong>訪問見積もりで書面の内訳</strong>：ゴミ屋敷は電話概算と実額の差が出やすい分野。写真だけでなく現地見積もりが確実です。</li>
            <li><strong>一般廃棄物収集運搬の許可（または提携）</strong>：無許可の格安業者は不法投棄リスクがあります（<a href="/guide/gyousha-erabikata/">悪質業者の見分け方</a>参照）。</li>
            <li><strong>特殊清掃・消毒に対応できるか</strong>：レベル4以上は分別搬出だけでは解決しません。</li>
            <li><strong>プライバシー配慮</strong>：社名なしトラック・夜間早朝作業・養生など、近所に知られたくない場合は事前に相談を。</li>
          </ul>

          <h2 id="shien">自治体の支援制度も確認する</h2>
          <ul>
            <li><strong>ごみ屋敷対策条例の相談窓口</strong>：東京23区でも複数の区が条例を制定し、相談・支援につなげています。</li>
            <li><strong>高齢者・障害者向けのごみ出し支援</strong>：戸別収集や声かけ収集を行う自治体があります。</li>
            <li><strong>福祉窓口との連携</strong>：本人や家族だけで抱え込まず、地域包括支援センター等に相談できるケースも。</li>
          </ul>

          <h2 id="saihatsu">再発を防ぐ3つのしくみ</h2>
          <ol>
            <li><strong>収集日をカレンダーに固定する</strong>：「いつ出すか考える」こと自体をなくす。当サイトのICS機能でスマホのカレンダーに毎週の収集日を登録できます。</li>
            <li><strong>物の入口を絞る</strong>：買い置き・もらい物・通販の段ボールなど、入ってくる量を減らす。</li>
            <li><strong>定期的な見守り</strong>：家族の定期訪問や、自治体・福祉サービスとのつながりを保つ。孤立が再発の最大要因です。</li>
          </ol>

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
            本記事の費用はいずれも一般的な目安です。健康や安全に関わる状況では、無理をせず自治体・専門業者にご相談ください。
          </div>

          <div className="article-related">
            <strong>関連リンク</strong>
            <div className="article-related-links">
              <a href="/guide/gyousha-erabikata/" className="btn btn-outline">不用品回収業者の選び方</a>
              <a href="/guide/funyohin-hiyo/" className="btn btn-outline">不用品回収の費用相場</a>
              <a href="/guide/sodaigomi-seal/" className="btn btn-outline">粗大ごみシールの買い方</a>
              <a href="/" className="btn btn-outline">ごみ収集日カレンダーで調べる</a>
            </div>
          </div>
        </article>
      </div>
      <BottomAdBanner locale="ja" />
    </>
  );
}
