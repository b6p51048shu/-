"use client";

import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const [paths, setPaths] = useState({ isEn: false, jaPath: "/", enPath: "/en" });

  useEffect(() => {
    const pathname = window.location.pathname;
    const isEn = pathname.startsWith("/en");
    const jaPath = isEn ? pathname.replace(/^\/en/, "") || "/" : pathname;
    const enPath = isEn ? pathname : `/en${pathname === "/" ? "" : pathname}`;
    setPaths({ isEn, jaPath, enPath });
  }, []);

  return (
    <div className="lang-switcher">
      <a href={paths.jaPath} className={`lang-btn ${!paths.isEn ? "active" : ""}`} aria-label="日本語">
        JA
      </a>
      <span className="lang-sep">|</span>
      <a href={paths.enPath} className={`lang-btn ${paths.isEn ? "active" : ""}`} aria-label="English">
        EN
      </a>
    </div>
  );
}
