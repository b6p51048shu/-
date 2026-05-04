"use client";

"use client";

import { useState } from "react";
import type { WardInfo } from "@/lib/data";

type Props = {
  wardName: string;
  wardInfo: WardInfo;
  wardParam: string;
};

export default function WardPageClient({ wardName, wardInfo, wardParam }: Props) {
  const [query, setQuery] = useState("");

  const filtered = wardInfo.areas.filter((a) =>
    a.area.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="パンくず">
        <a href="/">ホーム</a>
        <span>{wardName}</span>
      </nav>

      <h1 className="section-title">{wardName}のごみ収集日</h1>
      <p style={{ color: "var(--gray-600)", marginBottom: "1.5rem" }}>
        全{wardInfo.areas.length}地域の収集スケジュールを掲載しています。地域名をクリックすると詳細を確認できます。
      </p>

      <div className="search-filter">
        <span className="search-filter-icon">🔍</span>
        <input
          type="text"
          placeholder="地域名で絞り込む（例：西新宿）"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: "var(--gray-400)" }}>該当する地域が見つかりません</p>
      ) : (
        <div className="area-list">
          {filtered.map((a, filteredIdx) => {
            const actualIdx = wardInfo.areas.findIndex((x) => x.area === a.area);
            return (
              <a
                key={a.area}
                href={`/ku/${wardParam}/${actualIdx}`}
                className="area-link"
              >
                {a.area}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
