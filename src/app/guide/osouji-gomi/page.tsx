import type { Metadata } from "next";
import type { ReactNode } from "react";
import RecommerceAd from "@/components/RecommerceAd";
import { getItemBySlug } from "@/data/items";
import { guideContent } from "@/lib/articleContent";

const PAGE_PATH = "/guide/osouji-gomi/";
const TITLE = "大掃除で出たごみの分け方と出し方｜12月に間に合わせるコツ";
const DESCRIPTION =
  "年末の大掃除で一気に出る衣類・食器・紙類・小型家電・スプレー缶・粗大ごみを、何ごみにどう出すかを整理。12月は粗大ごみの申込が混むので、収集日と申込期限を先に押さえるのがコツです。";
const H1 = "大掃除で出たごみの分け方と出し方｜12月に間に合わせるコツ";
const BREADCRUMB = "大掃除のごみの分け方";
const DATE_PUBLISHED = "2026-11-10";
const UPDATED = "2026年11月10日";

const RELATED_ITEMS = ["clothes", "futon", "carpet", "kotatsu", "heater", "glass-pottery", "cardboard", "newspaper", "books", "magazine", "cosmetics", "spray-can", "battery", "button-battery", "light-bulb", "pc", "mobile-battery", "calendar", "photo-album"];
const RELATED_GUIDES = ["sodaigomi-seal", "funyohin-hiyo", "hikkoshi-gomi"];

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
    q: "大掃除のごみが多すぎて、1回の収集日に出しきれません",
    a: "多くの自治体は1回に出せる量の目安（例：45Lの袋で3〜4袋まで）を設けています。何回かに分けるか、清掃事務所・処理施設への持ち込み（自己搬入。要予約の自治体が多い）を検討してください。持ち込みは年末の受付日が限られるので、早めに確認を。",
    body: <>多くの自治体は1回に出せる量の目安（例：45Lの袋で3〜4袋まで）を設けています。何回かに分けるか、清掃事務所・処理施設への持ち込み（自己搬入。要予約の自治体が多い）を検討してください。持ち込みは年末の受付日が限られるので、早めに確認を。</>,
  },
  {
    q: "年内最終の収集日は、どこで分かりますか",
    a: "お住まいの区市の公式サイトに、11月下旬〜12月上旬に「年末年始のごみ収集」のお知らせが出ます。当サイトの区市ページの「よくある質問」でも、発表された自治体から順に更新しています。",
    body: <>お住まいの区市の公式サイトに、11月下旬〜12月上旬に「年末年始のごみ収集」のお知らせが出ます。当サイトの区市ページの「よくある質問」でも、発表された自治体から順に更新しています。</>,
  },
  {
    q: "不用品回収業者に頼むときの注意は",
    a: "自治体の許可（一般廃棄物収集運搬業）か、自治体からの委託がある業者を選んでください。「無料回収」のトラックや拡声器で回る業者には、高額請求や不法投棄のトラブルが報告されています。費用の目安と見分け方は不用品回収の費用相場と業者の選び方。",
    body: <>自治体の許可（一般廃棄物収集運搬業）か、自治体からの委託がある業者を選んでください。「無料回収」のトラックや拡声器で回る業者には、高額請求や不法投棄のトラブルが報告されています。費用の目安と見分け方は<a href="/guide/funyohin-hiyo/">不用品回収の費用相場</a>と<a href="/guide/gyousha-erabikata/">業者の選び方</a>。</>,
  },
  {
    q: "引っ越しと大掃除が重なりました",
    a: "引っ越しは量が桁違いに増えるので、引っ越しで出た大量のごみの処分方法を先に読んでください。退去日から逆算して粗大ごみを申し込むのが要点です。",
    body: <>引っ越しは量が桁違いに増えるので、<a href="/guide/hikkoshi-gomi/">引っ越しで出た大量のごみの処分方法</a>を先に読んでください。退去日から逆算して粗大ごみを申し込むのが要点です。</>,
  },
];

export default function OsoujiGomiPage() {
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
              <li><a href="#s1">先に押さえること：12月は「出せる日」が減る</a></li>
              <li><a href="#s2">衣類・布団・カーテン・カーペット</a></li>
              <li><a href="#s3">食器・ガラス・鍋・包丁</a></li>
              <li><a href="#s4">紙類：本・雑誌・段ボール・カレンダー・写真</a></li>
              <li><a href="#s5">小型家電・電池・電球</a></li>
              <li><a href="#s6">スプレー缶・化粧品・灯油</a></li>
              <li><a href="#s7">家具・暖房器具：粗大ごみの申込を先に</a></li>
              <li><a href="#s8">大掃除のごみを減らす順番</a></li>
              <li><a href="#faq">よくある質問</a></li>
            </ol>
          </nav>

          <h2 id="s1">先に押さえること：12月は「出せる日」が減る</h2>
          <p>大掃除のごみで失敗する原因は、分別そのものより「出すタイミング」です。</p>
          <ul>
            <li><strong>年内の最終収集日は、ごみの種類ごとに違う</strong>。燃やすごみは12月30日や31日まで収集する自治体が多い一方、資源やびん・缶・不燃ごみは12月20日台で終わる自治体があります。お住まいの区市の最終日は、各自治体の公式サイトで11月下旬〜12月上旬に発表されます。</li>
            <li><strong>粗大ごみは申込制で、12月は枠が埋まりやすい</strong>。年内の収集を希望するなら、12月上旬までに申し込むのが目安です。年末の受付休止期間（例：12月29日〜1月3日）は申込自体ができません。</li>
            <li>当サイトでは、お住まいの区市のページで通常の収集日を確認できます。年末年始の特別日程はページ下部の「よくある質問」で順次更新しています。</li>
          </ul>
          <p>この記事では、大掃除で出やすいごみを「何ごみか」「どう出すか」で整理します。分別のルールは自治体ごとに違うので、迷ったら区市のページで確認してください。</p>

          <h2 id="s2">衣類・布団・カーテン・カーペット</h2>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>品目</th>
                  <th>多くの自治体での扱い</th>
                  <th>注意</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>衣類（着られるもの）</td>
                  <td>資源（古布・古着）回収</td>
                  <td>汚れ・濡れたものは燃やすごみ。雨の日は出さない自治体が多い</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>衣類（下着・靴下・汚れたもの）</td>
                  <td>燃やすごみ</td>
                  <td>回収に出せない品目は自治体の一覧で確認</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>布団・毛布</td>
                  <td>粗大ごみ（切って小さくすれば燃やすごみに出せる自治体もある）</td>
                  <td>1枚単位で料金がかかる。何枚まで1点扱いかは自治体による</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>カーテン</td>
                  <td>燃やすごみ（大きいものは粗大ごみ）</td>
                  <td>金属フック・レールは外して不燃ごみ</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>カーペット・ラグ</td>
                  <td>粗大ごみ（丸めて指定サイズ以下なら燃やすごみの自治体も）</td>
                  <td>電気カーペットは小型家電や不燃扱いの自治体がある</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>詳しくは<a href="/items/clothes/">衣類の捨て方</a>、<a href="/items/futon/">布団の捨て方</a>、<a href="/items/carpet/">カーペットの捨て方</a>を参照してください。</p>

          <h2 id="s3">食器・ガラス・鍋・包丁</h2>
          <ul>
            <li>陶器・ガラスの食器は<strong>不燃ごみ</strong>が基本です。割れたものは新聞紙などに包み、袋に「キケン」「ガラス」と書いて出す自治体が多いです。</li>
            <li>鍋・フライパン・やかんなどの金属は不燃ごみ、または金属類の資源回収。一定サイズ（例：一辺30cm）を超えると粗大ごみになります。</li>
            <li>包丁・はさみは刃を紙で包んで不燃ごみ。「刃物」と袋に書いて出します。</li>
          </ul>
          <p><a href="/items/glass-pottery/">食器・ガラスの捨て方</a>に、割れ物の包み方をまとめています。</p>

          <h2 id="s4">紙類：本・雑誌・段ボール・カレンダー・写真</h2>
          <ul>
            <li>本・雑誌・新聞・段ボールは<strong>資源</strong>です。ひもで十字に縛ります。濡れると回収されないことがあるので、雨の日は次回に回します。</li>
            <li>カレンダー・ポスター・チラシは雑がみとして資源に出せる自治体が多いですが、金属の留め具は外します。</li>
            <li>写真・アルバム・感熱紙のレシートは資源にならず、<strong>燃やすごみ</strong>です。アルバムの台紙は燃やすごみ、金属の留め具は不燃ごみに分けます。</li>
          </ul>
          <p>12月は年賀状の整理やカレンダーの入れ替えで紙が増えます。古紙の集団回収や拠点回収を使うと、収集日を待たずに出せます。<a href="/items/cardboard/">段ボールの捨て方</a>、<a href="/items/books/">本の捨て方</a>、<a href="/items/calendar/">カレンダーの捨て方</a>。</p>

          <h2 id="s5">小型家電・電池・電球</h2>
          <ul>
            <li>ドライヤー、電気ケトル、ゲーム機、携帯電話などは<strong>小型家電リサイクル</strong>の回収ボックス（区役所・家電量販店など）に出せます。ボックスに入らないサイズは不燃ごみや粗大ごみです。</li>
            <li>乾電池・ボタン電池・モバイルバッテリーは<strong>燃やすごみに混ぜない</strong>でください。収集車や処理施設の火災の原因になります。乾電池は拠点回収や「有害ごみ」、リチウムイオン電池は回収協力店（JBRC）や自治体の指定ルートへ。</li>
            <li>蛍光管は「有害ごみ」や拠点回収、LED電球・白熱電球は不燃ごみという自治体が多いです。</li>
          </ul>
          <p><a href="/items/mobile-battery/">モバイルバッテリーの捨て方</a>、<a href="/items/battery/">乾電池の捨て方</a>、<a href="/items/light-bulb/">電球の捨て方</a>。</p>

          <h2 id="s6">スプレー缶・化粧品・灯油</h2>
          <ul>
            <li>スプレー缶・カセットボンベは<strong>中身を使い切ってから</strong>。穴を開けるかどうかは自治体で方針が分かれています（近年は「穴を開けない」自治体が増えています）。区市のページで確認してください。</li>
            <li>化粧品は中身を紙に吸わせるなどして燃やすごみ、容器は素材ごとに分けます。マニキュア・除光液は中身が残っていると危険物扱いの自治体があります。</li>
            <li>灯油は家庭ごみに出せません。購入したガソリンスタンドや販売店に相談します。</li>
          </ul>
          <p><a href="/items/spray-can/">スプレー缶の捨て方</a>、<a href="/items/cosmetics/">化粧品の捨て方</a>。</p>

          <h2 id="s7">家具・暖房器具：粗大ごみの申込を先に</h2>
          <p>こたつ、ストーブ、ファンヒーター、棚、椅子は粗大ごみです。12月は申込が集中するため、<strong>先に申し込んでから片付けを始める</strong>と、収集日から逆算して作業できます。</p>
          <ul>
            <li>申込は電話またはインターネット。インターネットは24時間受け付ける自治体が多く、年末は電話がつながりにくくなります。</li>
            <li>手数料は粗大ごみ処理券（シール）を購入して貼ります。買い方と値段は<a href="/guide/sodaigomi-seal/">粗大ごみシールの買い方・値段一覧</a>。</li>
            <li>石油ストーブ・ファンヒーターは灯油を抜いてから。電池も外します。</li>
            <li>年内に間に合わないときの選択肢は<a href="/guide/sodaigomi-nenmatsu/">年末に粗大ごみが間に合わないとき</a>にまとめました。</li>
          </ul>
          <p><a href="/items/kotatsu/">こたつの捨て方</a>、<a href="/items/heater/">ストーブ・ヒーターの捨て方</a>。</p>

          <h2 id="s8">大掃除のごみを減らす順番</h2>
          <ol>
            <li><strong>売れるもの・譲れるものを先に分ける</strong>：本、ゲーム、家電、ブランド品、使っていない贈答品は宅配買取やフリマに回すと、ごみの量と手数料が減ります。</li>
            <li><strong>粗大ごみを申し込む</strong>：収集日が決まれば、作業の締め切りになります。</li>
            <li><strong>資源（紙・衣類・びん缶）の最終収集日を確認する</strong>：燃やすごみより早く終わることが多いからです。</li>
            <li><strong>燃やすごみ・不燃ごみは最終日の前の収集日に出す</strong>：最終日に集中すると、集積所があふれて回収されないことがあります。</li>
          </ol>

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
