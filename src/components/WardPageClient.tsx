"use client";

import { useState } from "react";
import type { WardInfo } from "@/lib/data";

type Props = {
  pref: string;
  wardName: string;
  wardInfo: WardInfo;
  wardSlug: string;
};

export default function WardPageClient({ pref, wardName, wardInfo, wardSlug }: Props) {
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

      <h1 className="section-title">{wardName}のごみ収集日カレンダー</h1>
      <p style={{ color: "var(--gray-600)", marginBottom: "1.5rem" }}>
        全{wardInfo.areas.length}地域の収集スケジュールを掲載しています。地域名をクリックすると詳細を確認できます。
      </p>

      {(wardInfo.oversized_detail || wardInfo.oversized_url) && (
        <div className="oversized-notice">
          <span className="oversized-notice-icon" aria-hidden="true">🪑</span>
          <div className="oversized-notice-body">
            <p className="oversized-notice-title">粗大ごみの出し方</p>
            <p className="oversized-notice-text">
              {wardName}の粗大ごみは事前の申し込みが必要な場合が多く、収集日カレンダーには表示されません。申し込み方法・手数料・注意点をまとめています。
            </p>
            {wardInfo.oversized_detail ? (
              <a href={`/${pref}/${wardSlug}/sodaigomi/`} className="oversized-notice-link">
                {wardName}の粗大ごみの出し方を見る →
              </a>
            ) : (
              <a href={wardInfo.oversized_url} target="_blank" rel="noopener noreferrer" className="oversized-notice-link">
                {wardName}の粗大ごみ申し込み（公式）→
              </a>
            )}
          </div>
        </div>
      )}

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
          {filtered.map((a) => (
            <a
              key={a.slug}
              href={`/${pref}/${wardSlug}/${a.slug}/`}
              className="area-link"
            >
              {a.area}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
