"use client";

import { useEffect, useState } from "react";
import { adContent } from "@/lib/i18n";
import type { BagsUILocale } from "@/lib/i18n";
import {
  AD_BANNER_MOBILE,
  AD_BANNER_RECT,
  AD_MOBILE_BREAKPOINT,
  isAdConfigured,
} from "@/lib/adConfig";

const STORAGE_KEY = "gomicale_bottom_ad_closed";

/**
 * 広告バナー（A8.net 公式素材をそのまま掲載＝改変なしで規約準拠）
 * - PC: 300×250 レクタングルを画面右下にフローティング表示
 * - モバイル: 320×50 を画面下部固定バー表示（レクタングルは画面を覆うため不使用）
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
  const banner = isMobile ? AD_BANNER_MOBILE : AD_BANNER_RECT;

  const handleClose = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  // インプレッション計測ピクセル（表示中のバナーのみ）
  const pixel = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={banner.pixel}
      width={1}
      height={1}
      alt=""
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
    />
  );

  // ── モバイル: 画面下部固定バー（320×50） ──
  if (isMobile) {
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
            <img src={banner.src} alt={t.banner.title} width={banner.width} height={banner.height} />
          </a>
          <button
            className="bottom-ad-close"
            onClick={handleClose}
            aria-label={t.closeAria}
            type="button"
          >
            ×
          </button>
          {pixel}
        </div>
      </>
    );
  }

  // ── PC: 画面右下フローティング（300×250 レクタングル） ──
  return (
    <div className="float-ad-rect" role="complementary" aria-label={t.label}>
      <div className="float-ad-rect-bar">
        <span className="ad-label">{t.label}</span>
        <button
          className="float-ad-rect-close"
          onClick={handleClose}
          aria-label={t.closeAria}
          type="button"
        >
          ×
        </button>
      </div>
      <a
        href={banner.href}
        target="_blank"
        rel="noopener nofollow sponsored"
        className="float-ad-rect-link"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={banner.src} alt={t.banner.title} width={banner.width} height={banner.height} />
      </a>
      {pixel}
    </div>
  );
}
