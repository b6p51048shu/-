"use client";

import { useEffect, useState } from "react";
import { adContent } from "@/lib/i18n";
import type { BagsUILocale } from "@/lib/i18n";
import {
  AD_BANNER_MOBILE,
  AD_BANNER_PC,
  AD_MOBILE_BREAKPOINT,
  isAdConfigured,
} from "@/lib/adConfig";

const STORAGE_KEY = "gomicale_bottom_ad_closed_at";
const HIDE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7日

/**
 * 画面下部固定の広告バナー
 * - ビューポート幅に応じて モバイル(320×50) / PC(468×60) バナーを出し分け
 * - 各バナーは個別のリンクURL・インプレッション計測ピクセルを使用（CTR個別計測）
 * - ×ボタンで閉じる → localStorage に7日間記録
 */
export default function BottomAdBanner({ locale = "ja" }: { locale?: BagsUILocale }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    if (!isAdConfigured()) return;
    setMounted(true);

    // ビューポート判定
    setIsMobile(window.innerWidth < AD_MOBILE_BREAKPOINT);

    // localStorageから閉じた時刻を確認
    try {
      const closedAt = localStorage.getItem(STORAGE_KEY);
      if (closedAt) {
        const elapsed = Date.now() - parseInt(closedAt, 10);
        if (!isNaN(elapsed) && elapsed < HIDE_DURATION_MS) return; // 7日以内に閉じた → 非表示
      }
      setVisible(true);
    } catch {
      setVisible(true);
    }

    // リサイズ追随
    const handleResize = () => setIsMobile(window.innerWidth < AD_MOBILE_BREAKPOINT);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted || !visible) return null;

  const t = adContent[locale];
  const banner = isMobile ? AD_BANNER_MOBILE : AD_BANNER_PC;

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
        <span className="ad-label bottom-ad-label">{t.label}</span>
        <a
          href={banner.href}
          target="_blank"
          rel="noopener nofollow sponsored"
          className="bottom-ad-image-link"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={banner.src}
            alt={t.banner.title}
            width={banner.width}
            height={banner.height}
          />
        </a>
        <button
          className="bottom-ad-close"
          onClick={handleClose}
          aria-label={t.closeAria}
          type="button"
        >
          ×
        </button>
        {/* インプレッション計測ピクセル（表示中のバナーのみ） */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={banner.pixel}
          width={1}
          height={1}
          alt=""
          style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
        />
      </div>
    </>
  );
}
