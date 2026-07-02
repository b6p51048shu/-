import type { Metadata } from "next";
import InlineAd from "@/components/InlineAd";
import BottomAdBanner from "@/components/BottomAdBanner";

const PAGE_PATH = "/guide/sodaigomi-seal/";
const UPDATED = "2026年6月29日";

export const metadata: Metadata = {
  title: "粗大ごみシール（処理券）の買い方・値段【東京23区】コンビニで買える？",
  description:
    "東京23区の粗大ごみシール（有料粗大ごみ処理券）はA券200円・B券300円の2種類。コンビニ・スーパーでの買い方、値段の決まり方、貼り方、区ごとの注意点までわかりやすく解説します。",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: "粗大ごみシールの買い方・値段【東京23区】 | ゴミの日.com",
    description:
      "A券200円・B券300円の組み合わせ方、コンビニでの買い方、記入・貼り方、注意点を解説。",
  },
};

// 23区の粗大ごみページへの内部リンク一覧
const WARDS_23: { name: string; slug: string }[] = [
  { name: "千代田区", slug: "Chiyoda" },
  { name: "中央区", slug: "Chuo" },
  { name: "港区", slug: "Minato" },
  { name: "新宿区", slug: "Shinjuku" },
  { name: "文京区", slug: "Bunkyo" },
  { name: "台東区", slug: "Taito" },
  { name: "墨田区", slug: "Sumida" },
  { name: "江東区", slug: "Koto" },
  { name: "品川区", slug: "Shinagawa" },
  { name: "目黒区", slug: "Meguro" },
  { name: "大田区", slug: "Ota" },
  { name: "世田谷区", slug: "Setagaya" },
  { name: "渋谷区", slug: "Shibuya" },
  { name: "中野区", slug: "Nakano" },
  { name: "杉並区", slug: "Suginami" },
  { name: "豊島区", slug: "Toshima" },
  { name: "北区", slug: "Kita" },
  { name: "荒川区", slug: "Arakawa" },
  { name: "板橋区", slug: "Itabashi" },
  { name: "練馬区", slug: "Nerima" },
  { name: "足立区", slug: "Adachi" },
  { name: "葛飾区", slug: "Katsushika" },
  { name: "江戸川区", slug: "Edogawa" },
];

// 手数料の目安（多くの区に共通する代表例。正確な金額は区ページ・公式で確認する前提の目安表）
const FEE_EXAMPLES: { item: string; fee: string; combo: string }[] = [
  { item: "布団", fee: "400円", combo: "A券×2枚" },
  { item: "椅子・掃除機・扇風機など小型のもの", fee: "400円", combo: "A券×2枚" },
  { item: "自転車（16インチ以上）", fee: "800円", combo: "A券×1枚＋B券×2枚" },
  { item: "電子レンジ", fee: "400〜800円", combo: "区・サイズによる" },
  { item: "シングルベッド（フレーム）", fee: "1,200円", combo: "B券×4枚" },
  { item: "2人掛けソファ", fee: "1,200〜2,000円", combo: "区・サイズによる" },
  { item: "大型のタンス・食器棚", fee: "2,000〜2,800円", combo: "区・サイズによる" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "粗大ごみシールはどこで買えますか？",
    a: "「有料粗大ごみ処理券取扱所」のステッカーがあるコンビニ（セブンイレブン・ローソン・ファミリーマート・ミニストップ・デイリーヤマザキなど）、スーパー、商店、区の清掃事務所などで購入できます。レジで「〇〇区の粗大ごみ処理券をA券〇枚、B券〇枚ください」と伝えれば買えます。",
  },
  {
    q: "粗大ごみシールの値段はいくらですか？",
    a: "東京23区の有料粗大ごみ処理券はA券200円・B券300円の2種類です。品目ごとに区が定めた手数料（例：布団400円ならA券2枚）になるよう、2種類を組み合わせて購入します。手数料は品目とサイズ、区によって異なります。",
  },
  {
    q: "隣の区で買ったシールは使えますか？",
    a: "使えません。処理券は区ごとに別のもので、他の区では使用できず、原則返金もできません。必ずお住まいの区の処理券であることを確認してから購入してください。",
  },
  {
    q: "シールには何を書けばいいですか？",
    a: "収集日（受付時に案内された日付）と、氏名または受付番号を記入します。集合住宅で名前を書きたくない場合は受付番号の記入でOKです。記入後、品物の見やすい場所に貼って、収集日の朝（多くの区で8時まで）に指定場所へ出します。",
  },
  {
    q: "シールを買ったのに粗大ごみの予約が取れません。急いでいる場合は？",
    a: "自治体の粗大ごみ収集は申込制で、混雑期は数週間待ちになることもあります。引っ越しなどで期限がある場合は、即日対応の不用品回収業者に依頼するのが現実的です。複数社で見積もりを取り、許可の有無と料金の内訳を確認して選びましょう。",
  },
];

export default function SodaigomiSealPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "粗大ごみシール（処理券）の買い方・値段【東京23区】コンビニで買える？",
        description:
          "東京23区の粗大ごみシール（有料粗大ごみ処理券）の値段のしくみ（A券200円・B券300円）、コンビニでの買い方、記入・貼り方、注意点を解説。",
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
          { "@type": "ListItem", position: 3, name: "粗大ごみシールの買い方・値段", item: `https://gominohi.com${PAGE_PATH}` },
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
          <span>粗大ごみシールの買い方・値段</span>
        </nav>

        <h1 className="section-title">粗大ごみシール（処理券）の買い方・値段【東京23区】</h1>
        <p className="article-updated">最終更新日: {UPDATED}</p>

        <article className="article">
          <p className="article-lead">
            東京23区で粗大ごみを出すには、<strong>「有料粗大ごみ処理券」（通称：粗大ごみシール）</strong>を
            コンビニなどで買って品物に貼る必要があります。この記事では、
            <strong>シールの値段のしくみ・どこで買えるか・買い方と貼り方・つまずきやすい注意点</strong>を、
            初めての方にもわかるように解説します。
          </p>

          <nav className="article-toc" aria-label="目次">
            <div className="article-toc-title">この記事の内容</div>
            <ol>
              <li><a href="#nedan">シールの値段は2種類だけ（A券200円・B券300円）</a></li>
              <li><a href="#souba">品目別の手数料の目安</a></li>
              <li><a href="#doko">どこで買える？（コンビニ・スーパー・清掃事務所）</a></li>
              <li><a href="#kaikata">買い方〜貼り方の5ステップ</a></li>
              <li><a href="#chuui">つまずきやすい注意点5つ</a></li>
              <li><a href="#kubetsu">【23区別】粗大ごみの出し方ページ</a></li>
              <li><a href="#faq">よくある質問</a></li>
            </ol>
          </nav>

          <h2 id="nedan">シールの値段は2種類だけ（A券200円・B券300円）</h2>
          <p>
            東京23区の粗大ごみシールは、<strong>A券200円とB券300円の2種類だけ</strong>です。
            品物ごとに区が決めた手数料になるよう、この2種類を組み合わせて購入します。
          </p>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>券の種類</th>
                  <th>値段</th>
                  <th>組み合わせの例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>A券</td>
                  <td className="price">200円</td>
                  <td>手数料400円 → A券×2枚</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>B券</td>
                  <td className="price">300円</td>
                  <td>手数料900円 → B券×3枚</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="article-callout">
            <strong>手数料の金額は、粗大ごみの申込時に案内されます。</strong>先にシールを買うのではなく、
            「申込 → 金額を確認 → その金額分のシールを購入」の順番が正解です。
          </p>

          <h2 id="souba">品目別の手数料の目安</h2>
          <p>
            手数料は品目とサイズごとに各区が定めています。<strong>多くの区に共通する代表的な目安</strong>がこちらです
            （正確な金額はお住まいの区の粗大ごみ受付センターで確認してください）。
          </p>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>品目の例</th>
                  <th>手数料の目安</th>
                  <th>シールの組み合わせ例</th>
                </tr>
              </thead>
              <tbody>
                {FEE_EXAMPLES.map((f) => (
                  <tr key={f.item}>
                    <td>{f.item}</td>
                    <td className="price">{f.fee}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-600)" }}>{f.combo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            品目ごとの詳しい捨て方は{" "}
            <a href="/items/" style={{ color: "#b45309", fontWeight: 600, textDecoration: "underline" }}>品目別の捨て方一覧</a>
            {" "}にまとめています（<a href="/items/futon/">布団</a>・<a href="/items/mattress/">マットレス</a>・
            <a href="/items/bicycle/">自転車</a>・<a href="/items/sofa/">ソファ</a> など）。
          </p>

          <h2 id="doko">どこで買える？（コンビニ・スーパー・清掃事務所）</h2>
          <p>
            シールは<strong>「有料粗大ごみ処理券取扱所」のステッカーが貼ってあるお店</strong>で買えます。
            主な購入場所はこちらです。
          </p>
          <ul>
            <li><strong>コンビニ</strong>：セブンイレブン・ローソン・ファミリーマート・ミニストップ・デイリーヤマザキなど（店舗による）</li>
            <li><strong>スーパー・商店</strong>：取扱所ステッカーのある店舗</li>
            <li><strong>区の清掃事務所</strong>：確実に買いたい場合はこちら</li>
          </ul>
          <p className="article-callout">
            レジで<strong>「〇〇区の有料粗大ごみ処理券を、A券〇枚・B券〇枚ください」</strong>と伝えればOK。
            シールは商品棚には並んでおらず、レジで店員さんから受け取る方式です。
          </p>

          <h2 id="kaikata">買い方〜貼り方の5ステップ</h2>
          <ol>
            <li><strong>粗大ごみ受付センターに申し込む</strong>：インターネット・電話（区によってはLINE・チャット）で受付。品目を伝えると手数料と収集日が案内されます。</li>
            <li><strong>案内された金額分のシールを買う</strong>：A券・B券を組み合わせて、コンビニ等で購入。</li>
            <li><strong>シールに記入する</strong>：収集日と、氏名または受付番号を書きます（名前を出したくない場合は受付番号でOK）。</li>
            <li><strong>品物の見やすい場所に貼る</strong>：はがれないようしっかり貼付。雨に濡れても大丈夫です。</li>
            <li><strong>収集日の朝に指定場所へ出す</strong>：多くの区で朝8時まで。玄関先・集積所など、申込時に案内された場所へ。</li>
          </ol>

          {/* アフィリエイト広告（不用品回収）— 「予約待ち・急ぎ」を意識するタイミング */}
          <InlineAd locale="ja" />

          <h2 id="chuui">つまずきやすい注意点5つ</h2>
          <ul>
            <li><strong>シールは区ごとに別物</strong>：他の区の券は使えず、<strong>原則返金不可</strong>。職場近くのコンビニではなく、お住まいの区内で買うのが安全です。</li>
            <li><strong>先にシールを買わない</strong>：手数料は申込時に確定します。買いすぎても返金できないため、必ず申込→購入の順で。</li>
            <li><strong>予約は数日〜数週間待ち</strong>：特に3〜4月の引っ越しシーズンは混雑します。引っ越し予定がある方は早めの申込を（<a href="/guide/hikkoshi-gomi/">引越しゴミの処分方法</a>参照）。</li>
            <li><strong>家電4品目はシールでは出せない</strong>：エアコン・テレビ・冷蔵庫・洗濯機は家電リサイクル法の対象で、粗大ごみとして出せません（<a href="/items/tv/">テレビの捨て方</a>参照）。</li>
            <li><strong>スプリングマットレスなど収集不可の品目がある</strong>：区によっては処理困難物として受け付けていません。申込時に必ず確認を（<a href="/items/mattress/">マットレスの捨て方</a>参照）。</li>
          </ul>

          <h2 id="kubetsu">【23区別】粗大ごみの出し方ページ</h2>
          <p>
            お住まいの区の申込方法・手数料・注意点は、区別ページにまとめています。
          </p>
          <div className="area-list">
            {WARDS_23.map((w) => (
              <a key={w.slug} href={`/Tokyo/${w.slug}/sodaigomi/`} className="area-link">
                {w.name}
              </a>
            ))}
          </div>

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
            本記事の手数料はいずれも一般的な目安です。券の種類・金額・申込方法は変更されることがあります。
            最新の情報は各区の粗大ごみ受付センター・公式サイトをご確認ください。
          </div>

          <div className="article-related">
            <strong>関連リンク</strong>
            <div className="article-related-links">
              <a href="/items/" className="btn btn-outline">品目別の捨て方一覧</a>
              <a href="/guide/hikkoshi-gomi/" className="btn btn-outline">引越しゴミの処分方法</a>
              <a href="/guide/funyohin-hiyo/" className="btn btn-outline">不用品回収の費用相場</a>
              <a href="/" className="btn btn-outline">ごみ収集日カレンダーで調べる</a>
            </div>
          </div>
        </article>
      </div>
      <BottomAdBanner locale="ja" />
    </>
  );
}
