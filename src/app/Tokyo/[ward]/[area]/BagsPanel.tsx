import type { DesignatedBags } from "@/lib/data";

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

export default function BagsPanel({ bags }: { bags: DesignatedBags }) {
  if (!bags.required) return null;

  return (
    <section className="bags-panel" aria-label="指定ごみ袋情報">
      <h2 className="bags-title">
        🛍️ 指定ごみ袋
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
                    <th>サイズ</th>
                    <th>容量</th>
                    <th>1枚あたり</th>
                    <th>10枚セット</th>
                  </tr>
                </thead>
                <tbody>
                  {type.sizes.map((s) => (
                    <tr key={s.size}>
                      <td className="bags-size">{s.size}</td>
                      <td className="bags-capacity">{s.capacity}</td>
                      <td className="bags-price">
                        {s.price_per_bag != null ? `${s.price_per_bag}円` : "—"}
                      </td>
                      <td className="bags-price-10">
                        {s.price_per_10 != null ? `${s.price_per_10}円` : "—"}
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
        <span className="bags-buy-label">🏪 販売場所：</span>
        <span className="bags-buy-text">{bags.where_to_buy}</span>
        <a
          href={bags.info_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bags-info-link"
        >
          詳細・取扱店一覧 →
        </a>
      </div>
    </section>
  );
}
