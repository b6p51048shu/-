import type { Metadata } from "next";
import { groupItemsByCategory, ITEM_CATEGORIES, GOMI_ITEMS } from "@/data/items";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "品目別の捨て方一覧 | 何ゴミかすぐわかる分別ガイド",
  description: `スプレー缶・モバイルバッテリー・布団・自転車など、捨て方に迷いやすい${GOMI_ITEMS.length}品目の分別区分と出し方を解説。東京23区を中心に「何ゴミ？」がすぐわかります。`,
  alternates: { canonical: "/items/" },
  openGraph: {
    title: "品目別の捨て方一覧 | ゴミの日.com",
    description: "捨て方に迷いやすい品目の分別区分と出し方を品目別に解説。",
  },
};

export default function ItemsIndexPage() {
  const groups = groupItemsByCategory();

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "ホーム", path: "/" },
    { name: "品目別の捨て方", path: "/items/" },
  ]);

  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "品目別の捨て方一覧",
    numberOfItems: GOMI_ITEMS.length,
    itemListElement: GOMI_ITEMS.map((i, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: i.name,
      url: `https://gominohi.com/items/${i.slug}/`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }}
      />
      <div className="container-narrow">
        <nav className="breadcrumb" aria-label="パンくず">
          <a href="/">ホーム</a>
          <span>品目別の捨て方</span>
        </nav>

        <h1 className="section-title">品目別の捨て方一覧</h1>
        <p style={{ lineHeight: 1.9, margin: "1rem 0 2rem" }}>
          「これって何ゴミ？」に品目別で答えます。分別区分は自治体ごとに異なるため、正確な区分と収集曜日は
          <a href="/">お住まいの地域のページ</a>でご確認ください。
        </p>

        {groups.map(({ category, items }) => {
          const cat = ITEM_CATEGORIES[category];
          return (
            <section key={category} style={{ marginBottom: "2.5rem" }}>
              <h2 className="section-title">
                <span
                  style={{
                    display: "inline-block",
                    background: cat.color,
                    color: "#fff",
                    borderRadius: "6px",
                    padding: ".1rem .6rem",
                    fontSize: ".9rem",
                    verticalAlign: "middle",
                  }}
                >
                  {cat.label}
                </span>
                <span style={{ marginLeft: ".5rem", fontSize: ".85rem", color: "var(--gray-700)" }}>
                  が主流の品目
                </span>
              </h2>
              <div className="area-list">
                {items.map((i) => (
                  <a key={i.slug} href={`/items/${i.slug}/`} className="area-link">
                    {i.emoji} {i.name}
                  </a>
                ))}
              </div>
            </section>
          );
        })}

        <div style={{ marginTop: "2rem" }}>
          <a href="/" className="btn btn-outline">
            地域から収集日を調べる
          </a>
        </div>
      </div>
    </>
  );
}
