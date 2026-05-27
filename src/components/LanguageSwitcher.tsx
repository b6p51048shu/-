"use client";

import { useEffect, useState } from "react";
import { LOCALES } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const LABELS: Record<Locale | "ja", string> = {
  ja: "JA", en: "EN", ko: "KO", zh: "ZH",
};

export default function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState<Locale | "ja">("ja");
  const [basePath, setBasePath] = useState("");

  useEffect(() => {
    const pathname = window.location.pathname;
    // /en/... /ko/... /zh/... のいずれかで始まるか
    const match = pathname.match(/^\/(en|ko|zh)(\/.*)?$/);
    if (match) {
      setCurrentLocale(match[1] as Locale);
      setBasePath(match[2] ?? "");
    } else {
      setCurrentLocale("ja");
      // /Tokyo/... → /en/Tokyo/... のように変換
      setBasePath(pathname === "/" ? "" : pathname);
    }
  }, []);

  function getPath(lang: Locale | "ja"): string {
    if (lang === "ja") return basePath || "/";
    return `/${lang}${basePath}`;
  }

  const allLangs: (Locale | "ja")[] = ["ja", ...LOCALES];

  return (
    <div className="lang-switcher">
      {allLangs.map((lang, i) => (
        <span key={lang} style={{ display: "contents" }}>
          {i > 0 && <span className="lang-sep">|</span>}
          <a
            href={getPath(lang)}
            className={`lang-btn ${currentLocale === lang ? "active" : ""}`}
            aria-label={lang.toUpperCase()}
          >
            {LABELS[lang]}
          </a>
        </span>
      ))}
    </div>
  );
}
