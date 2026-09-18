import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { siteChrome } from "@/lib/i18n";

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "東京都のごみ収集日カレンダー｜地域からすぐ検索 - ゴミの日.com",
    template: "%s | ゴミの日.com",
  },
  description:
    "東京都（23区・多摩地区52自治体）のごみ収集日を地域別に検索。燃やすごみ・資源ごみ・プラスチックの収集曜日を今すぐ確認。GPS対応・無料。",
  keywords: ["ごみ収集日", "東京都", "東京23区", "多摩地区", "燃やすごみ", "資源ごみ", "ごみの日", "収集カレンダー"],
  authors: [{ name: "ゴミの日.com運営事務局" }],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "ゴミの日.com",
    title: "東京都のごみ収集日カレンダー | ゴミの日.com",
    description: "東京都のごみ収集日を地域別に検索。GPS対応・無料。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ゴミの日.com - 東京都のごみ収集日カレンダー",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "東京都のごみ収集日カレンダー | ゴミの日.com",
    description: "東京都のごみ収集日を地域別に検索。GPS対応・無料。",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
    languages: {
      ja: "/",
      "x-default": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/raccoon.png",
    shortcut: "/raccoon.png",
    apple: "/raccoon.png",
  },
  metadataBase: new URL("https://gominohi.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 静的エクスポートではリクエストヘッダーからの言語判定は使えない（外国語ページは削除済みのため常に日本語固定）。
  const chrome = siteChrome.ja;
  const homeHref = "/";
  const disclaimerHref = "/disclaimer/";
  const privacyHref = "/privacy/";

  const siteJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://gominohi.com/#website",
        name: "ゴミの日.com",
        url: "https://gominohi.com/",
        inLanguage: "ja",
        publisher: { "@id": "https://gominohi.com/#organization" },
      },
      {
        "@type": "Organization",
        "@id": "https://gominohi.com/#organization",
        name: "ゴミの日.com運営事務局",
        url: "https://gominohi.com/",
        logo: "https://gominohi.com/raccoon.png",
        email: "gominohi.araiguma@gmail.com",
      },
    ],
  };

  return (
    <html lang="ja" className={notoSansJP.className}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XN645HLXN1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XN645HLXN1');
            `,
          }}
        />
        {/* Google AdSense（審査・広告配信用。ads.txt は public/ads.txt に設置） */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2929551202966135"
          crossOrigin="anonymous"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ゴミの日" />
      </head>
      <body>
        <div className="app-shell">
          <header className="site-header">
            <a href={homeHref} className="site-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/raccoon.png" className="logo-raccoon" alt="" width={36} height={36} />
              <span className="logo-text">ゴミの日.com</span>
            </a>
            <nav className="site-nav">
              <a href={homeHref}>{chrome.navTop}</a>
              <a href="/items/">品目でさがす</a>
              <a href="/guide/">お役立ちガイド</a>
            </nav>
          </header>
          <main className="site-main">{children}</main>
          <footer className="site-footer">
            <div className="footer-inner">
              <p className="footer-copy">{chrome.footerCopy}</p>
              <p className="footer-note">{chrome.footerNote}</p>
              <p className="footer-links">
                <a href="/items/">品目別の捨て方</a>
                <span aria-hidden="true"> · </span>
                <a href="/guide/">お役立ちガイド</a>
                <span aria-hidden="true"> · </span>
                <a href="/about/">運営者情報</a>
                <span aria-hidden="true"> · </span>
                <a href={privacyHref}>{chrome.navPrivacy}</a>
                <span aria-hidden="true"> · </span>
                <a href={disclaimerHref}>{chrome.navDisclaimer}</a>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
