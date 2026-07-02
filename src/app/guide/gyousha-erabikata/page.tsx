import type { Metadata } from "next";
import InlineAd from "@/components/InlineAd";
import BottomAdBanner from "@/components/BottomAdBanner";

const PAGE_PATH = "/guide/gyousha-erabikata/";
const UPDATED = "2026年6月29日";

export const metadata: Metadata = {
  title: "不用品回収業者の選び方と悪質業者の見分け方【チェックリスト付き】",
  description:
    "不用品回収業者選びで失敗しないためのチェックリストと、「無料回収」トラックなど悪質業者の典型的な手口・見分け方を解説。相見積もりのコツ、トラブル時の相談先までまとめました。",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: "不用品回収業者の選び方と悪質業者の見分け方 | ゴミの日.com",
    description: "優良業者のチェックリスト、悪質業者の手口、相見積もりのコツを解説。",
  },
};

const CHECKLIST: { point: string; why: string }[] = [
  { point: "「一般廃棄物収集運搬業」の許可（または自治体の委託）があるか", why: "家庭の不用品回収に必要な許可。「産業廃棄物」や「古物商」の許可だけでは家庭ごみは運べない" },
  { point: "会社の所在地・固定電話が明記されているか", why: "携帯番号だけ・住所非公開の業者はトラブル時に連絡が取れなくなりやすい" },
  { point: "見積もりが書面（メール）で、内訳が明確か", why: "「基本料金・作業費・処分費・車両費」が分かれていれば後からの上乗せを防ぎやすい" },
  { point: "追加料金の条件を事前に説明してくれるか", why: "階段作業・解体・当日の量の増加など、何にいくらかかるかを先に確認" },
  { point: "口コミ・実績が確認できるか", why: "極端に安い料金広告と悪い口コミの組み合わせは要警戒" },
];

const TROUBLE_SIGNS: { sign: string; risk: string }[] = [
  { sign: "「無料回収」を拡声器で流しながら巡回するトラック", risk: "積み込み後に高額請求される事例が多発。環境省・消費者庁も注意喚起している典型パターン" },
  { sign: "チラシ・ネット広告が「無料」「格安」を強調", risk: "現場で「これは対象外」と追加請求される手口" },
  { sign: "見積もりを出さず「載せてみないと分からない」", risk: "積み込み後に言い値を請求され、断りにくくなる" },
  { sign: "会社名・許可番号を名乗らない", risk: "無許可営業の可能性。回収品の不法投棄は排出者も責任を問われ得る" },
  { sign: "その場で契約を急かす・キャンセル料が高額", risk: "冷静に比較させないための典型的な圧力" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "不用品回収業者と自治体の粗大ごみ、どちらを使うべきですか？",
    a: "1〜数点で自分で運び出せるなら自治体の粗大ごみが最安です。量が多い、急いでいる、部屋からの運び出しが必要、家電4品目が混ざっている——こうした場合は不用品回収業者が現実的です。費用と手間のトレードオフで選びましょう。",
  },
  {
    q: "「無料回収」のトラックに出してはいけないのですか？",
    a: "おすすめしません。積み込み後の高額請求や、回収品の不法投棄・不適正処理のトラブルが多数報告されており、環境省や消費者庁も注意喚起しています。無料をうたう業者ほど、後から名目を付けて請求してくる傾向があります。",
  },
  {
    q: "見積もりは何社くらい取ればいいですか？",
    a: "2〜3社が目安です。同じ内容でも業者によって数万円の差が出ることは珍しくありません。その際、品目と量を写真で伝えると見積もり精度が上がり、当日の追加請求も防ぎやすくなります。",
  },
  {
    q: "悪質業者とトラブルになってしまったら？",
    a: "その場で支払いを迫られても、納得できなければ支払わず、消費生活センター（電話188「いやや」）に相談してください。クーリングオフが適用できる場合もあります。支払ってしまった後でも、領収書や見積もりの記録があれば交渉の余地があります。",
  },
  {
    q: "優良な業者を手早く探す方法はありますか？",
    a: "お住まいの自治体のサイトで「一般廃棄物収集運搬業の許可業者一覧」を確認するのが確実です。また、複数社への一括見積もりサービスを使うと、相場感をつかみながら比較できます。",
  },
];

export default function GyoushaErabikataPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "不用品回収業者の選び方と悪質業者の見分け方【チェックリスト付き】",
        description:
          "不用品回収業者選びのチェックリスト、悪質業者の典型的な手口と見分け方、相見積もりのコツ、トラブル時の相談先を解説。",
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
          { "@type": "ListItem", position: 3, name: "不用品回収業者の選び方", item: `https://gominohi.com${PAGE_PATH}` },
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
          <span>不用品回収業者の選び方</span>
        </nav>

        <h1 className="section-title">不用品回収業者の選び方と悪質業者の見分け方</h1>
        <p className="article-updated">最終更新日: {UPDATED}</p>

        <article className="article">
          <p className="article-lead">
            不用品回収業者は「急ぎ・大量・運び出し」に強い便利な選択肢ですが、
            <strong>業者選びを間違えると高額請求や不法投棄のトラブル</strong>に巻き込まれることがあります。
            この記事では、<strong>優良業者を見極めるチェックリスト</strong>と
            <strong>悪質業者の典型的な手口</strong>を、実際の注意喚起事例に基づいて解説します。
          </p>

          <nav className="article-toc" aria-label="目次">
            <div className="article-toc-title">この記事の内容</div>
            <ol>
              <li><a href="#itsu">業者に頼むべきケース・自治体で済むケース</a></li>
              <li><a href="#checklist">優良業者のチェックリスト5項目</a></li>
              <li><a href="#akushitsu">悪質業者の手口と見分け方</a></li>
              <li><a href="#aimitsumori">相見積もりで失敗しない3つのコツ</a></li>
              <li><a href="#trouble">トラブルになったときの相談先</a></li>
              <li><a href="#faq">よくある質問</a></li>
            </ol>
          </nav>

          <h2 id="itsu">業者に頼むべきケース・自治体で済むケース</h2>
          <p>
            大前提として、<strong>1〜数点で自分で運び出せるなら自治体の粗大ごみが最安</strong>です
            （<a href="/guide/sodaigomi-seal/">粗大ごみシールの買い方</a>参照）。業者が向いているのは次のケースです。
          </p>
          <ul>
            <li><strong>量が多い</strong>：引っ越し・遺品整理・実家の片付けなど、点数が多いほど「積み放題」が割安に</li>
            <li><strong>急いでいる</strong>：自治体は予約制で数日〜数週間待ち。業者は即日対応も可能</li>
            <li><strong>運び出せない</strong>：大型家具・階段しかない物件・高齢世帯など</li>
            <li><strong>家電4品目が混ざっている</strong>：冷蔵庫・洗濯機などは自治体の粗大ごみに出せないため、業者ならまとめて処理できる（<a href="/guide/reizouko-sentakuki/">冷蔵庫・洗濯機の処分方法</a>参照）</li>
          </ul>
          <p>
            料金相場（単品・トラック積み放題）は{" "}
            <a href="/guide/funyohin-hiyo/" style={{ color: "#b45309", fontWeight: 600, textDecoration: "underline" }}>不用品回収の費用相場</a>{" "}
            に詳しくまとめています。
          </p>

          <h2 id="checklist">優良業者のチェックリスト5項目</h2>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>チェック項目</th>
                  <th>なぜ重要か</th>
                </tr>
              </thead>
              <tbody>
                {CHECKLIST.map((c) => (
                  <tr key={c.point}>
                    <td style={{ fontWeight: 600 }}>☑ {c.point}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-600)" }}>{c.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="article-callout">
            最重要は1つ目の<strong>「一般廃棄物収集運搬業」の許可</strong>です。家庭から出るごみを収集運搬できるのは、
            この許可を持つ（または自治体から委託・許可業者と提携している）業者だけ。
            自治体サイトの許可業者一覧で確認できます。
          </p>

          {/* アフィリエイト（不用品回収）— 比較検討の文脈 */}
          <InlineAd locale="ja" />

          <h2 id="akushitsu">悪質業者の手口と見分け方</h2>
          <p>
            消費生活センターに寄せられる不用品回収トラブルには、はっきりした<strong>共通パターン</strong>があります。
            次のサインが1つでもあれば避けるのが無難です。
          </p>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>危険なサイン</th>
                  <th>何が起きるか</th>
                </tr>
              </thead>
              <tbody>
                {TROUBLE_SIGNS.map((t) => (
                  <tr key={t.sign}>
                    <td style={{ fontWeight: 600 }}>⚠️ {t.sign}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-600)" }}>{t.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="article-callout">
            <strong>「無料」は最大の警戒ワード。</strong>回収・運搬・処分にはどうしてもコストがかかります。
            それを「無料」にできるのは、後から請求するか、正規の処理をしていないかのどちらかである可能性が高い、
            と考えるのが安全です。
          </p>

          <h2 id="aimitsumori">相見積もりで失敗しない3つのコツ</h2>
          <ol>
            <li><strong>2〜3社に同じ条件で依頼する</strong>：品目リストと写真を送って条件を揃えると、純粋な料金比較ができます。</li>
            <li><strong>「総額」で比較する</strong>：基本料金の安さではなく、作業費・処分費・車両費・階段料金まで含めた総額で見る。</li>
            <li><strong>追加料金の条件を文面で残す</strong>：「当日量が増えた場合はいくらか」を事前にメール等で確認しておくと、当日の交渉材料になります。</li>
          </ol>

          <h2 id="trouble">トラブルになったときの相談先</h2>
          <ul>
            <li><strong>消費生活センター（電話188）</strong>：高額請求・強引な契約はまずここへ。クーリングオフの助言も受けられます。</li>
            <li><strong>警察相談専用電話（#9110）</strong>：脅迫的な取り立てなど身の危険を感じる場合。</li>
            <li><strong>自治体の清掃担当窓口</strong>：無許可業者の通報先。地域の許可業者の案内も受けられます。</li>
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
            本記事は一般的な注意点をまとめたものです。個別のトラブルについては消費生活センター等の公的窓口にご相談ください。
          </div>

          <div className="article-related">
            <strong>関連リンク</strong>
            <div className="article-related-links">
              <a href="/guide/funyohin-hiyo/" className="btn btn-outline">不用品回収の費用相場</a>
              <a href="/guide/sodaigomi-seal/" className="btn btn-outline">粗大ごみシールの買い方</a>
              <a href="/guide/hikkoshi-gomi/" className="btn btn-outline">引越しゴミの処分方法</a>
              <a href="/items/" className="btn btn-outline">品目別の捨て方一覧</a>
            </div>
          </div>
        </article>
      </div>
      <BottomAdBanner locale="ja" />
    </>
  );
}
