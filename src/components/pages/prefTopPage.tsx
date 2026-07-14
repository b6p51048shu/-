// 県トップページ（市区一覧・日本語のみ）の共有実装。
// 各県ディレクトリ（src/app/{Pref}/page.tsx）から createPrefTopPage(pref) で生成する。
// データ未対応の県（region-index に県キーが無い）は「準備中」表示の200ページになる。

import type { Metadata } from "next";
import { regionIndex } from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { getCurrentYearJST } from "@/lib/date";
import { PREFS } from "@/lib/prefs";
import type { PrefSlug } from "@/lib/prefs";
import wardIndexRaw from "../../../public/data/ward-index.json";

type WardIndexEntry = {
  slug: string;
  areas: Array<{ slug: string }>;
  has_bags?: boolean;
};
const wardIndex = wardIndexRaw as unknown as Record<string, WardIndexEntry>;

export function createPrefTopPage(pref: PrefSlug) {
  const name = PREFS[pref];

  function generateMetadata(): Metadata {
    const year = getCurrentYearJST();
    return {
      title: `${name}のごみ収集日カレンダー【${year}年】市区一覧`,
      description: `${name}のごみ収集日カレンダー。市区を選ぶと、地域ごとの燃やすごみ・資源・プラスチックの収集曜日を確認できます。`,
      alternates: {
        canonical: `/${pref}/`,
      },
      openGraph: {
        title: `${name}のごみ収集日カレンダー | ゴミの日.com`,
        description: `${name}のごみ収集日を市区・地域別に検索。`,
      },
    };
  }

  function Page() {
    // region-index の県キー配下のグループ（例: Tokyo → { "23区": [...], "多摩地区": [...] }）
    const groups = regionIndex[pref] ?? {};
    const groupEntries = Object.entries(groups)
      .map(([groupName, wardNames]) => ({
        groupName,
        wards: wardNames.filter((w) => wardIndex[w]),
      }))
      .filter((g) => g.wards.length > 0);

    const breadcrumbLd = breadcrumbJsonLd([
      { name: "ホーム", path: "/" },
      { name, path: `/${pref}/` },
    ]);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <div className="container">
          <nav className="breadcrumb" aria-label="パンくず">
            <a href="/">ホーム</a>
            <span>{name}</span>
          </nav>

          <h1 className="section-title">{name}のごみ収集日カレンダー</h1>
          <p style={{ color: "var(--gray-600)", marginBottom: "1.5rem" }}>
            {name}の市区一覧です。市区を選ぶと、地域ごとのごみ収集スケジュールを確認できます。
          </p>

          {groupEntries.length === 0 ? (
            <p style={{ color: "var(--gray-600)", lineHeight: 1.9 }}>
              {name}の収集日データは現在準備中です。対応まで今しばらくお待ちください。
              <br />
              <a href="/">← トップページへ戻る</a>
            </p>
          ) : (
            groupEntries.map(({ groupName, wards }) => (
              <section key={groupName}>
                <h2 className="section-title" style={{ marginTop: "1.5rem" }}>{groupName}</h2>
                <div className="ward-grid">
                  {wards.map((w) => (
                    <a key={w} href={`/${pref}/${wardIndex[w].slug}/`} className="ward-card">
                      {w}
                      <div className="ward-card-count">
                        {wardIndex[w].areas.length}地域
                        {wardIndex[w].has_bags && (
                          <span className="ward-card-bags" title="指定ごみ袋情報あり"> 🛍️</span>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </>
    );
  }

  return { generateMetadata, Page };
}
