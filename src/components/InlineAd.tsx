"use client";

import { useEffect, useState } from "react";
import { adContent } from "@/lib/i18n";
import type { BagsUILocale } from "@/lib/i18n";
import {
  AD_BANNER_PC,
  AD_BANNER_MOBILE,
  AD_MOBILE_BREAKPOINT,
  isAdConfigured,
} from "@/lib/adConfig";

/**
 * 記事・エリアページに埋め込むインライン広告
 * - A8.net 公式バナー素材をそのまま掲載（自作の派手カードは廃止）
 * - 画面幅で PC(468×60) / モバイル(320×50) を出し分け（二重インプレッション防止のため
 *   実際に表示する側の画像だけを1枚描画する）
 * - 画像＝アフィリリンク。rel="nofollow sponsored" で Google の paid link ポリシーに準拠
 * - クリックを直接促す表現は入れない（A8 会員規約の「クリック誘導」抵触を回避）
 */
export default function InlineAd({ locale = "ja" }: { locale?: BagsUILocale }) {
  // null = 未判定（SSR直後）。判定後に true/false。
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${AD_MOBILE_BREAKPOINT - 1}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!isAdConfigured()) return null;

  // マウント前は高さだけ確保してレイアウトシフトを防ぐ
  if (isMobile === null) return <div className="inline-ad-slot" aria-hidden="true" />;

  const t = adContent[locale];
  const b = isMobile ? AD_BANNER_MOBILE : AD_BANNER_PC;

  return (
    <aside className="inline-ad" aria-label={t.label}>
      <span className="ad-label">{t.label}</span>
      <p className="inline-ad-lead">{t.inline.title}</p>

      <a
        href={b.href}
        target="_blank"
        rel="noopener nofollow sponsored"
        className="inline-ad-banner-link"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={b.src} width={b.width} height={b.height} alt={t.banner.title} />
      </a>

      {b.pixel && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={b.pixel}
          width={1}
          height={1}
          alt=""
          style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
        />
      )}
    </aside>
  );
}
