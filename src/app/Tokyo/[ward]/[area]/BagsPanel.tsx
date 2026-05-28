import type { DesignatedBags } from "@/lib/data";
import { bagsUI } from "@/lib/i18n";
import type { BagsUILocale } from "@/lib/i18n";

const COLOR_MAP: Record<string, string> = {
  "黄色":      "#fbbf24",
  "緑色":      "#10b981",
  "みどり色":  "#10b981",
  "オレンジ色": "#f97316",
  "ピンク色":  "#ec4899",
  "青色":      "#3b82f6",
  "藤色（薄紫）": "#a78bfa",
  "透明":      "#94a3b8",
};

export default function BagsPanel({ bags, locale = "ja" }: { bags: DesignatedBags; locale?: BagsUILocale }) {
  if (!bags.required) return null;

  const t = bagsUI[locale];

  return (
    <section className="bags-panel" aria-label={t.title}>
      <h2 className="bags-title">
        {t.title}
      </h2>
      {bags.note && <p className="bags-note">{bags.note}</p>}

      <div className="bags-types">
        {bags.types.map((type) => {
          const colorHex = COLOR_MAP[type.color] ?? "#94a3b8";
          return (
            <div key={type.label} className="bags-type-card">
              <div className="bags-type-header">
                <span
                  className="bags-color-swatch"
                  style={{ background: colorHex, border: type.color === "透明" ? "2px solid #cbd5e1" : "none" }}
                  aria-label={type.color}
                />
                <span className="bags-type-label">{type.label}</span>
                <span className="bags-color-name">{type.color}</span>
              </div>
              <table className="bags-price-table">
                <thead>
                  <tr>
                    <th>{t.size}</th>
                    <th>{t.capacity}</th>
                    <th>{t.perBag}</th>
                    <th>{t.per10}</th>
                  </tr>
                </thead>
                <tbody>
                  {type.sizes.map((s) => (
                    <tr key={s.size}>
                      <td className="bags-size">{s.size}</td>
                      <td className="bags-capacity">{s.capacity}</td>
                      <td className="bags-price">
                        {s.price_per_bag != null ? t.price(s.price_per_bag) : t.empty}
                      </td>
                      <td className="bags-price-10">
                        {s.price_per_10 != null ? t.price(s.price_per_10) : t.empty}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      <div className="bags-footer">
        <span className="bags-buy-label">{t.whereToBuy}</span>
        <span className="bags-buy-text">{bags.where_to_buy}</span>
        <a
          href={bags.info_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bags-info-link"
        >
          {t.detailLink}
        </a>
      </div>
    </section>
  );
}
