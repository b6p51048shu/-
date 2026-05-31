"use client";

import { useEffect, useState } from "react";
import { adContent } from "@/lib/i18n";
import type { BagsUILocale } from "@/lib/i18n";
import { AD_HREF, AD_IMP_PIXEL, isAdConfigured } from "@/lib/adConfig";

const STORAGE_KEY = "gomicale_bottom_ad_closed_at";
const HIDE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7日

/**
 * 画面下部固定の広告バナー
 * - ×ボタンで閉じる → localStorage に7日間記録
 * - SSR時は描画されず、マウント後にチェック
 */
export default function BottomAdBanner({ locale = "ja" }: { locale?: BagsUILocale }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isAdConfigured()) return;
    try {
      const closedAt = localStorage.getItem(STORAGE_KEY);
      if (closedAt) {
        const elapsed = Date.now() - parseInt(closedAt, 10);
        if (!isNaN(elapsed) && elapsed < HIDE_DURATION_MS) {
          return; // 7日以内に閉じられている → 非表示
        }
      }
      setVisible(true);
    } catch {
      // localStorageが使えない環境では表示
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const t = adContent[locale];

  const handleClose = () => {
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      // ignore
    }
    setVisible(false);
  };

  return (
    <>
      <div className="bottom-ad-spacer" aria-hidden="true" />
      <div className="bottom-ad-banner" role="complementary" aria-label={t.label}>
        <a
          href={AD_HREF}
          target="_blank"
          rel="noopener nofollow sponsored"
          className="bottom-ad-link"
        >
          <span className="ad-label">{t.label}</span>
          <span className="bottom-ad-text">
            <span className="bottom-ad-title">{t.banner.title}</span>
            <span className="bottom-ad-body">{t.banner.body}</span>
          </span>
          <span className="bottom-ad-cta">{t.banner.cta} →</span>
        </a>
        <button
          className="bottom-ad-close"
          onClick={handleClose}
          aria-label={t.closeAria}
          type="button"
        >
          ×
        </button>
        {AD_IMP_PIXEL && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={AD_IMP_PIXEL} width={1} height={1} alt="" style={{ display: "none" }} />
        )}
      </div>
    </>
  );
}
