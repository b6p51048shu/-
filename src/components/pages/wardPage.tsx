// 区・市ページ（日本語）の共有実装。
// 各県ディレクトリ（src/app/{Pref}/[ward]/page.tsx）から createWardPage(pref) で生成する。
// 東京のみのデータ状態でも従来の /Tokyo/... と同一出力になること（P0受け入れ条件）。

import type { Metadata } from "next";
import { getWardBySlug, garbageLabel, GARBAGE_KEYS } from "@/lib/data";
import type { AreaSchedule, GarbageKey } from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { getCurrentYearJST } from "@/lib/date";
import { notFound } from "next/navigation";
import WardPageClient from "@/components/WardPageClient";
import SourceNote from "@/components/SourceNote";
import { getItemBySlug } from "@/data/items";
import type { PrefSlug } from "@/lib/prefs";

type Props = { params: Promise<{ ward: string }> };

/** 「よく検索される品目」リンク集に出す定番品目（品目辞典 /items/ の一部・定番slug） */
const POPULAR_ITEM_SLUGS = [
  "spray-can",
  "futon",
  "mattress",
  "bicycle",
  "microwave",
  "refrigerator",
  "aircon",
  "sofa",
  "mobile-battery",
  "hina-doll",
];

/** ward内で実際に使われているごみ種別キー（1件でも値がある種別のみ列として表示） */
function usedGarbageKeys(areas: AreaSchedule[]): GarbageKey[] {
  return GARBAGE_KEYS.filter((key) => areas.some((a) => (a[key] ?? "").trim() !== ""));
}

/** 粗大ごみの手数料テキストの冒頭のみ抜粋（1文目・長すぎる場合は60字で丸める） */
function feeExcerpt(fee: string): string {
  const firstSentence = fee.split(/[。\n]/)[0] ?? fee;
  return firstSentence.length > 60 ? `${firstSentence.slice(0, 60)}…` : firstSentence;
}

export function createWardPage(pref: PrefSlug) {
  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { ward: wardSlug } = await params;
    const result = await getWardBySlug(wardSlug);
    if (!result || result.pref !== pref) return {};
    const { name: wardName, info } = result;
    const year = getCurrentYearJST();
    // ごみ種別の列挙は labels 優先（区市内の全地域で labels は共通）。
    // labels が無い/デフォルトと同名の区市は従来と同一文字列（東京側の出力不変を保証）。
    const labels = info.areas[0]?.labels;
    const kindList = [
      labels?.burnable ?? "燃やすごみ",
      labels?.recyclable ?? "資源",
      labels?.plastic ?? "プラスチック",
    ];
    const kinds =
      kindList.join("・") === "燃やすごみ・資源・プラスチック"
        ? "燃やすごみ・資源・プラスチック"
        : kindList.join("、"); // 独自区分名は「・」を含むことがあるため「、」で区切る
    return {
      title: `${wardName}のごみ収集日カレンダー【${year}年】地域別一覧`,
      description: `${wardName}の全${info.areas.length}地域のごみ収集日カレンダー【${year}年】。${kinds}の収集曜日を地域別に一覧表示。地域を選ぶと収集曜日をすぐに確認できます。`,
      alternates: {
        canonical: `/${pref}/${wardSlug}/`,
        languages: {
          ja: `/${pref}/${wardSlug}/`,
          "x-default": `/${pref}/${wardSlug}/`,
          en: `/en/${pref}/${wardSlug}/`,
          ko: `/ko/${pref}/${wardSlug}/`,
          zh: `/zh/${pref}/${wardSlug}/`,
        },
      },
      openGraph: {
        title: `${wardName}のごみ収集日カレンダー【${year}年】 | ゴミの日.com`,
        description: `${wardName}全${info.areas.length}地域のごみ収集スケジュール。`,
      },
    };
  }

  async function Page({ params }: Props) {
    const { ward: wardSlug } = await params;
    const result = await getWardBySlug(wardSlug);

    if (!result || result.pref !== pref) notFound();

    const { name: wardName, info } = result;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${wardName}のごみ収集日一覧`,
      description: `${wardName}の全地域のごみ収集スケジュール`,
      numberOfItems: info.areas.length,
    };

    const breadcrumbLd = breadcrumbJsonLd([
      { name: "ホーム", path: "/" },
      { name: wardName, path: `/${pref}/${wardSlug}/` },
    ]);

    const usedKeys = usedGarbageKeys(info.areas);
    const headerSchedule = info.areas[0];
    const d = info.oversized_detail;
    const popularItems = POPULAR_ITEM_SLUGS.map((slug) => getItemBySlug(slug)).filter(
      (i): i is NonNullable<typeof i> => Boolean(i)
    );
    const labelNames = usedKeys.map((k) => garbageLabel(headerSchedule, k));

    const hasOversizedInfo = Boolean(info.oversized_detail || info.oversized_url);

    const faqs: { q: string; a: string }[] = [
      {
        q: `${wardName}のごみ収集は祝日もありますか？`,
        a: `多くの自治体では祝日も通常どおり収集を行いますが、年末年始は特別スケジュールになる場合があります。正確な収集有無は${wardName}公式サイトの収集日案内でご確認ください。`,
      },
      {
        q: `${wardName}に引っ越してきたら何を確認すればいいですか？`,
        a: `まず本ページの地域別一覧表から新しい住所の地域名を探し、収集曜日と分別区分（${labelNames.join("・") || "ごみの種類"}）を確認してください。指定ごみ袋の有無やごみを出す時間帯も自治体によって異なるため、${wardName}公式サイトもあわせてご確認ください。`,
      },
      ...(hasOversizedInfo
        ? [
            {
              q: "粗大ごみはどう申し込みますか？",
              a: `粗大ごみは通常のごみ収集とは別に、電話やインターネットでの事前申し込みが必要な自治体がほとんどです。${wardName}の申し込み方法は本ページの「粗大ごみの出し方」セクションでご案内しています。`,
            },
          ]
        : []),
    ];

    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
        <WardPageClient pref={pref} wardName={wardName} wardInfo={info} wardSlug={wardSlug} />

        <div className="container">
          {/* 1. 地域別収集曜日の一覧表（最重要・SEOテキストの本体） */}
          <section>
            <h2 className="section-title">{wardName}の地域別ごみ収集曜日一覧</h2>
            <p style={{ color: "var(--gray-600)", lineHeight: 1.9, marginBottom: "1rem" }}>
              {wardName}内の全{info.areas.length}地域の収集曜日を一覧表にまとめました。お住まいの地域名をクリックすると、収集カレンダーや粗大ごみ・ごみ袋情報など詳しい情報を確認できます。
            </p>
            <div className="price-table-wrap">
              <table className="price-table">
                <thead>
                  <tr>
                    <th>地域</th>
                    {usedKeys.map((key) => (
                      <th key={key}>{garbageLabel(headerSchedule, key)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {info.areas.map((a) => (
                    <tr key={a.slug}>
                      <td>
                        <a href={`/${pref}/${wardSlug}/${a.slug}/`}>{a.area}</a>
                      </td>
                      {usedKeys.map((key) => (
                        <td key={key}>{a[key] || "―"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 2. 粗大ごみの出し方サマリ（詳細データがある区市のみ。無ければ既存のWardPageClient側の案内に統合） */}
          {d && (
            <section>
              <h2 className="section-title">{wardName}の粗大ごみの出し方（概要）</h2>
              <p style={{ lineHeight: 1.9 }}>
                {wardName}の粗大ごみは通常のごみ収集とは別に、事前の申し込みが必要です。
                {d.methods?.length ? `申し込みは${d.methods.join("・")}で受け付けています。` : ""}
                {d.tel ? `電話でのお申し込みは${d.tel}${d.tel_hours ? `（${d.tel_hours}）` : ""}です。` : ""}
                {d.fee ? `手数料の目安は「${feeExcerpt(d.fee)}」です。` : ""}
              </p>
              <a href={`/${pref}/${wardSlug}/sodaigomi/`} className="oversized-notice-link">
                {wardName}の粗大ごみの出し方を詳しく見る →
              </a>
            </section>
          )}

          {/* 3. よく検索される品目リンク集 */}
          <section>
            <h2 className="section-title">よく検索される品目の捨て方</h2>
            <p style={{ color: "var(--gray-600)", marginBottom: "1rem" }}>
              分別区分は自治体で異なりますが、迷いやすい品目の出し方の基本をまとめています。
            </p>
            <div className="area-list">
              {popularItems.map((item) => (
                <a key={item.slug} href={`/items/${item.slug}/`} className="area-link">
                  {item.emoji} {item.name}
                </a>
              ))}
            </div>
            <p style={{ marginTop: "1rem" }}>
              <a href="/items/">品目辞典で300品目から探す →</a>
            </p>
          </section>

          {/* 4. 区市の分別区分の説明段落 */}
          {labelNames.length > 0 && (
            <section>
              <h2 className="section-title">{wardName}のごみの分別区分</h2>
              <p style={{ lineHeight: 1.9 }}>
                {wardName}の家庭ごみは「{labelNames.join("」「")}
                」に分かれます。品目によって区分が分かりにくい場合は、上記の「よく検索される品目」や
                <a href="/items/">品目辞典</a>もあわせてご活用ください。分別区分の詳細は
                {wardName}公式サイトでご確認いただけます。
              </p>
            </section>
          )}

          {/* 5. FAQ */}
          <section className="faq-section">
            <h2 className="section-title">よくある質問</h2>
            {faqs.map((f) => (
              <div key={f.q} className="faq-item">
                <p className="faq-q">Q. {f.q}</p>
                <p className="faq-a">{f.a}</p>
              </div>
            ))}
          </section>

          <SourceNote
            entityName={wardName}
            infoUrl={info.info_url}
            oversizedUrl={info.oversized_url}
            dataChecked={info.data_checked}
          />
        </div>
      </>
    );
  }

  return { generateMetadata, Page };
}
