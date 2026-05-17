"use client";

import { useState } from "react";
import type { WardInfo } from "@/lib/data";
import { en } from "@/lib/i18n";

type Props = { wardName: string; wardInfo: WardInfo; wardSlug: string };

export default function EnWardPageClient({ wardName, wardInfo, wardSlug }: Props) {
  const t = en;
  const [query, setQuery] = useState("");

  const filtered = wardInfo.areas.filter((a) =>
    a.area.toLowerCase().includes(query.toLowerCase()) ||
    a.slug.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="/en">Home</a>
        <span>{wardSlug} Ward</span>
      </nav>

      <h1 className="section-title">{t.ward.listTitle(`${wardSlug} Ward`)}</h1>
      <p style={{ color: "var(--gray-600)", marginBottom: "1.5rem" }}>
        {t.ward.listDesc(wardInfo.areas.length)}
        <span style={{ fontSize: ".85rem", marginLeft: ".5rem", color: "var(--gray-400)" }}>
          ({wardName})
        </span>
      </p>

      <div className="search-filter">
        <span className="search-filter-icon">🔍</span>
        <input
          type="text"
          placeholder={t.ward.filterPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: "var(--gray-400)" }}>{t.ward.noResults}</p>
      ) : (
        <div className="area-list">
          {filtered.map((a) => (
            <a key={a.slug} href={`/en/Tokyo/${wardSlug}/${a.slug}`} className="area-link">
              <span style={{ fontSize: ".8em", opacity: .7, display: "block", marginBottom: ".1rem" }}>{a.area}</span>
              {a.slug.replace(/-/g, " ")}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
