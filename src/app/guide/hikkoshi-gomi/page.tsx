import type { Metadata } from "next";
import InlineAd from "@/components/InlineAd";
import BottomAdBanner from "@/components/BottomAdBanner";

const PAGE_PATH = "/guide/hikkoshi-gomi";
const UPDATED = "2026年6月7日";

export const metadata: Metadata = {
  title: "引越しで出る大量ゴミの処分方法【2026年版】間に合わない時の裏ワザ・逆算スケジュール",
  description:
    "引越しで出る大量のゴミを最短・最安で片付ける方法を解説。ゴミの種類別の正しい出口、退去日からの逆算スケジュール、自治体の粗大ごみが間に合わない時の裏ワザ、ケース別おすすめ、不用品回収業者の選び方までまとめました。",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: "引越しで出る大量ゴミの処分方法【2026年版】 | ゴミの日.com",
    description:
      "ゴミの種類別の出口、逆算スケジュール、間に合わない時の裏ワザ、ケース別おすすめ、業者の選び方を解説。",
  },
};

// 引越しゴミの「種類 × 出口」
const ROUTE_BY_TYPE: { type: string; route: string; note: string }[] = [
  { type: "可燃・不燃・資源（通常ゴミ）", route: "通常の収集日に出す", note: "量が多いと一度に出せない自治体あり。指定袋制の地域は袋代が必要" },
  { type: "粗大ごみ（家具・寝具・自転車など）", route: "自治体に事前申込 → 処理券を貼って収集", note: "予約制で数日〜数週間待ち。引越しで最大の難所" },
  { type: "家電4品目（エアコン・TV・冷蔵庫/冷凍庫・洗濯機/乾燥機）", route: "家電リサイクル法ルート（購入店・指定引取場所・回収業者）", note: "粗大ごみには出せない。別途リサイクル料金が必要" },
  { type: "パソコン", route: "メーカー回収・小型家電リサイクル", note: "資源有効利用促進法の対象。データ消去を忘れずに" },
  { type: "まだ使えるもの", route: "買取・フリマ・寄付", note: "状態が良ければ処分費が浮く・プラスになることも" },
];

// 基本ルート4つと費用・スピード
const ROUTES: { route: string; cost: string; speed: string; fit: string }[] = [
  { route: "自治体の通常収集（可燃・不燃・資源）", cost: "無料〜指定袋代", speed: "次の収集日まで待つ", fit: "少量・計画的に出せる" },
  { route: "自治体の粗大ごみ回収", cost: "1点 数百〜2,000円程度", speed: "予約制・数日〜数週間", fit: "数点・早めに動ける人" },
  { route: "買取・フリマ・寄付", cost: "±0〜プラス", speed: "数日〜数週間", fit: "状態の良い家電・家具・ブランド品" },
  { route: "不用品回収業者", cost: "積み放題 1万〜9万円", speed: "即日・当日対応も可", fit: "量が多い・急ぎ・運び出しが大変" },
];

// 逆算スケジュール
const SCHEDULE: { when: string; todo: string }[] = [
  { when: "引越し決定〜1ヶ月前", todo: "不要品の棚卸し。粗大ごみの予約枠はこの時点で確保（3〜4月の繁忙期は枠が埋まりやすい）。売れる物はフリマ・買取にこの時期から出す。" },
  { when: "2〜3週間前", todo: "自治体の粗大ごみを申込み、処理券を購入。家電4品目の引取方法（購入店・指定引取場所・回収業者）を決める。" },
  { when: "1週間前", todo: "通常ゴミを計画的に。お住まいの地域の「最後に出せる収集日」を確認（ここでカレンダーが効きます）。" },
  { when: "2〜3日前", todo: "売れ残り・処分漏れを不用品回収業者に見積もり依頼。即日対応の業者を1社押さえておくと「間に合わない」の保険になる。" },
  { when: "当日", todo: "最終ゴミを出す。退去後は部屋にゴミを残せないため、最後の収集日を過ぎた分は新居へ運ぶか業者に依頼。" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "引越しで出るゴミは、いつまでに片付ければいいですか？",
    a: "粗大ごみは予約制で数日〜数週間待つため、引越しが決まったらすぐ申し込むのが鉄則です。通常ゴミは「退去日までの最後の収集日」を逆算し、その日までに出し切れるよう計画します。最後の収集日を過ぎてしまう分は、新居へ運ぶか不用品回収業者に依頼します。",
  },
  {
    q: "粗大ごみの予約が間に合いません。当日まだ家にあります…",
    a: "自治体回収が間に合わない場合は、即日・当日対応の不用品回収業者が現実的な選択肢です。部屋の中からの運び出しまで対応してくれるため、退去日に間に合わせやすくなります。複数社で見積もりを取り、料金の内訳が明確な業者を選びましょう。",
  },
  {
    q: "冷蔵庫や洗濯機などの家電はどう処分すればいいですか？",
    a: "エアコン・テレビ・冷蔵庫/冷凍庫・洗濯機/乾燥機の「家電4品目」は家電リサイクル法の対象で、粗大ごみには出せません。①買い替える店で引き取ってもらう、②指定引取場所へ持ち込む、③不用品回収業者に依頼する、のいずれかになり、別途リサイクル料金がかかります。",
  },
  {
    q: "退去後に部屋へゴミを残したらどうなりますか？",
    a: "賃貸では原則、退去時に室内を空にして返す必要があります。残置物があると撤去費用を敷金から差し引かれたり、別途請求されることがあります。間に合わない場合は退去日までに不用品回収業者へ依頼して片付けるのが安全です。",
  },
  {
    q: "大量のゴミ、自治体と不用品回収業者はどちらが安いですか？",
    a: "1〜数点で自分で運べるなら自治体の粗大ごみ回収が安く済みます。一方、量が多い・急いでいる・運び出しが大変・家具家電が混在する場合は、まとめて運び出してくれる不用品回収業者の方が、手間とトータルコストで有利になりやすいです。詳しい費用相場は「不用品回収の費用相場」の記事を参照してください。",
  },
];

export default function HikkoshiGomiPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "引越しで出る大量ゴミの処分方法【2026年版】間に合わない時の裏ワザ・逆算スケジュール",
        description:
          "引越しで出る大量ゴミを最短・最安で片付ける方法。種類別の出口、逆算スケジュール、間に合わない時の裏ワザ、ケース別おすすめ、業者の選び方まで。",
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
          { "@type": "ListItem", position: 3, name: "引越しゴミの処分方法", item: `https://gominohi.com${PAGE_PATH}` },
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
          <span>引越しゴミの処分方法</span>
        </nav>

        <h1 className="section-title">引越しで出る大量ゴミの処分方法【2026年版】</h1>
        <p className="article-updated">最終更新日: {UPDATED}</p>

        <article className="article">
          <p className="article-lead">
            引越しは「荷造り」より<strong>不用品の処分</strong>でつまずく人が多いもの。退去日は動かせないのに、
            自治体の粗大ごみは予約制で<strong>数日〜数週間待ち</strong>…。この記事では、引越しで出る大量のゴミを
            <strong>「種類別の正しい出口」「退去日からの逆算スケジュール」「間に合わない時の裏ワザ」</strong>
            の3点で、最短・最安で片付ける方法を解説します。
          </p>

          <nav className="article-toc" aria-label="目次">
            <div className="article-toc-title">この記事の内容</div>
            <ol>
              <li><a href="#type">引越しゴミは「種類」で出口が変わる</a></li>
              <li><a href="#routes">処分ルート4つと費用・スピード</a></li>
              <li><a href="#schedule">退去日からの逆算スケジュール</a></li>
              <li><a href="#maniawanai">「間に合わない」を防ぐ4つのコツ</a></li>
              <li><a href="#urawaza">それでも間に合わない時の裏ワザ</a></li>
              <li><a href="#case">ケース別おすすめの片付け方</a></li>
              <li><a href="#gyousha">不用品回収業者をうまく使う・選ぶ</a></li>
              <li><a href="#faq">よくある質問</a></li>
            </ol>
          </nav>

          <h2 id="type">引越しゴミは「種類」で出口が変わる</h2>
          <p>
            引越しゴミを効率よく片付ける第一歩は、<strong>「これはどこに出すゴミか」を仕分けること</strong>です。
            種類によって出口（処分ルート）と締め切りがまったく違い、特に
            <strong>粗大ごみと家電4品目は通常の収集日には出せません</strong>。
          </p>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>ゴミの種類</th>
                  <th>出口（処分ルート）</th>
                  <th>注意点</th>
                </tr>
              </thead>
              <tbody>
                {ROUTE_BY_TYPE.map((r) => (
                  <tr key={r.type}>
                    <td>{r.type}</td>
                    <td>{r.route}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-600)" }}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="article-callout">
            <strong>つまずきポイントNo.1は家電4品目。</strong>エアコン・テレビ・冷蔵庫/冷凍庫・洗濯機/乾燥機は
            「家電リサイクル法」の対象で、粗大ごみとして出すことはできません。退去直前に気づくと詰みやすいので、
            最初に分けておきましょう。
          </p>

          <h2 id="routes">処分ルート4つと費用・スピード</h2>
          <p>
            引越しゴミの出口は、大きく次の4ルート。<strong>費用の安さ・スピード・手間</strong>はトレードオフの関係です。
          </p>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>ルート</th>
                  <th>費用の目安</th>
                  <th>スピード</th>
                  <th>向いているケース</th>
                </tr>
              </thead>
              <tbody>
                {ROUTES.map((r) => (
                  <tr key={r.route}>
                    <td>{r.route}</td>
                    <td className="price">{r.cost}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-600)" }}>{r.speed}</td>
                    <td style={{ fontSize: ".85rem", color: "var(--gray-600)" }}>{r.fit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            基本は<strong>「安い順（自治体→買取→業者）に使い、足りない分を上のルートで埋める」</strong>のが鉄則。
            時間に余裕があるほど安く、急ぐほど業者寄りになります。各品目の細かい料金は
            {" "}<a href="/guide/funyohin-hiyo/" style={{ color: "#b45309", fontWeight: 600, textDecoration: "underline" }}>不用品回収の費用相場</a>{" "}
            にまとめています。
          </p>

          <h2 id="schedule">退去日からの逆算スケジュール</h2>
          <p>
            引越しゴミは<strong>「いつやるか」で難易度が激変</strong>します。退去日から逆算した、つまずかない段取りがこちらです。
          </p>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>時期</th>
                  <th>やること</th>
                </tr>
              </thead>
              <tbody>
                {SCHEDULE.map((s) => (
                  <tr key={s.when}>
                    <td style={{ whiteSpace: "nowrap", fontWeight: 600 }}>{s.when}</td>
                    <td>{s.todo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="article-callout">
            最大のコツは<strong>「最後に出せる収集日」を早めに把握すること</strong>。お住まいの地域の収集曜日は、当サイトの
            {" "}<a href="/" style={{ color: "#b45309", fontWeight: 600, textDecoration: "underline" }}>ごみ収集日カレンダー</a>{" "}
            で確認できます。退去日とカレンダーを突き合わせ、通常ゴミの「ラストチャンス」を押さえておきましょう。
          </p>

          {/* アフィリエイト広告（不用品回収）— 逆算で「間に合わない」を意識した直後に置く */}
          <InlineAd locale="ja" />

          <h2 id="maniawanai">「間に合わない」を防ぐ4つのコツ</h2>
          <ul>
            <li><strong>粗大ごみの予約は引越し決定の直後に</strong>：3〜4月の繁忙期は2〜3週間待ちになることも。枠が空いていないと退去日に間に合いません。</li>
            <li><strong>「最後に出せる収集日」を逆算する</strong>：通常ゴミは収集日が決まっています。退去日の何日前が最終かをカレンダーで確認。</li>
            <li><strong>家電4品目は別ルートと割り切る</strong>：粗大ごみに出せないため、購入店の引取や指定引取場所・回収業者を早めに手配。</li>
            <li><strong>「一度に大量」は断られることがある</strong>：戸別収集は1回の点数・サイズに制限がある自治体も。大量なら分割か業者を検討。</li>
          </ul>

          <h2 id="urawaza">それでも間に合わない時の裏ワザ</h2>
          <p>
            予約が取れない、量が読めなかった、急な引越し——そんな時の現実的な逃げ道が4つあります。
          </p>
          <ol>
            <li><strong>不用品回収業者の「即日・積み放題」</strong>：当日対応・部屋からの運び出し込みで、退去日に間に合わせやすい最有力の手段。量が多いほど割安になりやすい。</li>
            <li><strong>引越し業者の不用品引取オプション</strong>：引越しと同時に一部の不用品を引き取ってもらえる場合がある（対応品目が限られ、割高なこともあるため要確認）。</li>
            <li><strong>買取＋回収の併用</strong>：売れる家電・家具は買取に回し、残りを回収業者へ。買取分で回収費を相殺できることも。</li>
            <li><strong>少量の通常ゴミは新居の自治体で出す</strong>：退去に間に合わない通常ゴミは、新居に運んでから出す手も（粗大ごみは原則、住んでいる自治体のルールに従う）。</li>
          </ol>
          <p className="article-callout">
            <strong>退去日は待ってくれません。</strong>「予約が取れるか不安」「量が多い」という時点で、
            即日対応の不用品回収業者に<strong>見積もりだけ取って1社押さえておく</strong>と、保険として安心です。
          </p>

          <h2 id="case">ケース別おすすめの片付け方</h2>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr>
                  <th>あなたの状況</th>
                  <th>おすすめの組み合わせ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>単身・少量・時間に余裕</td>
                  <td>自治体中心。通常ゴミ＋粗大ごみ数点を計画的に出す。費用は最小。</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>単身・時間がない</td>
                  <td>軽トラック積み放題で一括。運び出しも任せて時短。</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>ファミリー・大量</td>
                  <td>2tトラック積み放題＋売れる家電は買取。まとめて一気に片付け。</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>とにかく安く</td>
                  <td>自治体＋フリマ/買取を最大活用し、運べない物・残った物だけ回収業者へ。</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="gyousha">不用品回収業者をうまく使う・選ぶ</h2>
          <p>
            業者は「急ぎ・大量・運び出し」に強い一方、選び方を誤るとトラブルのもと。次の点を押さえれば安心して使えます。
          </p>
          <ul>
            <li><strong>2〜3社で相見積もり</strong>：同じ内容でも料金差が大きい。引越しの日程が決まったら早めに比較。</li>
            <li><strong>「一般廃棄物収集運搬業」の許可を確認</strong>：一般家庭のゴミ回収にはこの許可（または委託）が必要です。</li>
            <li><strong>「無料回収」をうたうトラックに注意</strong>：積み込み後の高額請求や不法投棄のトラブルがあります。</li>
            <li><strong>見積もりの内訳が明朗か</strong>：基本料金・作業費・処分費を書面で出す業者は信頼できます。</li>
          </ul>
          <p>
            料金の目安・トラック積み放題プランの相場・悪質業者の見分け方は、
            {" "}<a href="/guide/funyohin-hiyo/" style={{ color: "#b45309", fontWeight: 600, textDecoration: "underline" }}>不用品回収の費用相場【2026年版】</a>{" "}
            で詳しく解説しています。あわせてご覧ください。
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
            本記事の費用・日数はいずれも一般的な目安です。自治体の粗大ごみの料金・予約状況や、退去時の原状回復ルールは
            お住まいの自治体・管理会社により異なります。最新の情報は各公式情報をご確認ください。
          </div>

          <div className="article-related">
            <strong>関連リンク</strong>
            <div className="article-related-links">
              <a href="/guide/funyohin-hiyo/" className="btn btn-outline">不用品回収の費用相場を見る</a>
              <a href="/guide/" className="btn btn-outline">お役立ちガイド一覧</a>
              <a href="/" className="btn btn-outline">ごみ収集日カレンダーで調べる</a>
            </div>
          </div>
        </article>
      </div>
      {/* ボトム固定広告バナー */}
      <BottomAdBanner locale="ja" />
    </>
  );
}
