"use client";

import { usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();

  // 現在のパスから言語を判定し、切替先URLを生成
  const isEn = pathname.startsWith("/en");
  const jaPath = isEn ? pathname.replace(/^\/en/, "") || "/" : pathname;
  const enPath = isEn ? pathname : `/en${pathname === "/" ? "" : pathname}`;

  return (
    <div className="lang-switcher">
      <a
        href={jaPath}
        className={`lang-btn ${!isEn ? "active" : ""}`}
        aria-label="日本語"
      >
        🇯🇵 JP
      </a>
      <a
        href={enPath}
        className={`lang-btn ${isEn ? "active" : ""}`}
        aria-label="English"
      >
        🇬🇧 EN
      </a>
    </div>
  );
}
