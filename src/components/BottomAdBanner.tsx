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

const STORAGE_KEY = "gomicale_bottom_ad_closed";

/**
 * 画面下部固定の広告バナー
 * - ビューポート幅に応じて モバイル(320×50) / PC(468×60) バナーを出し分け
 * - 各バナーは個別のリンクURL・インプレッション計測ピクセルを使用（CTR個別計測）
 * - ×ボタンで閉じる → sessionStorage に記録（ブラウザタブを閉じるまで非表示）
 * - タブを閉じて再訪すると再表示される
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

    // sessionStorageから閉じたフラグを確認（タブを閉じるとリセットされる）
    try {
      const closed = sessionStorage.getItem(STORAGE_KEY);
      if (closed === "1") return; // このセッション中は閉じられている → 非表示
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
      sessionStorage.setItem(STORAGE_KEY, "1");
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
