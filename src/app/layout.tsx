import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { siteChrome } from "@/lib/i18n";
import type { BagsUILocale } from "@/lib/i18n";

// pathname から HTML lang 属性値を判定する
function htmlLangFromPathname(pathname: string): string {
  if (/^\/en(\/|$)/.test(pathname)) return "en";
  if (/^\/ko(\/|$)/.test(pathname)) return "ko";
  if (/^\/zh(\/|$)/.test(pathname)) return "zh-Hans";
  return "ja";
}

// pathname からロケールコードを判定する（フッター/ナビの翻訳用）
function localeFromPathname(pathname: string): BagsUILocale {
  if (/^\/en(\/|$)/.test(pathname)) return "en";
  if (/^\/ko(\/|$)/.test(pathname)) return "ko";
  if (/^\/zh(\/|$)/.test(pathname)) return "zh";
  return "ja";
}

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ゴミの日.com | 東京都ごみ収集日カレンダー",
    template: "%s | ゴミの日.com",
  },
  description:
    "東京都（23区・多摩地区52自治体）のごみ収集日を地域別に検索。燃やすごみ・資源ごみ・プラスチックの収集曜日を今すぐ確認。GPS対応・無料。",
  keywords: ["ごみ収集日", "東京都", "東京23区", "多摩地区", "燃やすごみ", "資源ごみ", "ごみの日", "収集カレンダー"],
  authors: [{ name: "ゴミの日.com" }],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "ゴミの日.com",
    title: "ゴミの日.com | 東京都ごみ収集日カレンダー",
    description: "東京都のごみ収集日を地域別に検索。GPS対応・無料。",
  },
  twitter: {
    card: "summary",
    title: "ゴミの日.com | 東京都ごみ収集日",
    description: "東京都のごみ収集日を地域別に検索。GPS対応・無料。",
  },
  alternates: {
    canonical: "/",
    languages: {
      ja: "/",
      en: "/en/",
      ko: "/ko/",
      zh: "/zh/",
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";
  const htmlLang = htmlLangFromPathname(pathname);
  const locale = localeFromPathname(pathname);
  const chrome = siteChrome[locale];
  const homeHref = locale === "ja" ? "/" : `/${locale}/`;
  const disclaimerHref = locale === "ja" ? "/disclaimer/" : `/${locale}/disclaimer/`;
  const privacyHref = locale === "ja" ? "/privacy/" : `/${locale}/privacy/`;

  return (
    <html lang={htmlLang} className={notoSansJP.className}>
      <head>
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
              {locale === "ja" && <a href="/items/">品目でさがす</a>}
              {locale === "ja" && <a href="/guide/">お役立ちガイド</a>}
            </nav>
            <LanguageSwitcher />
          </header>
          <main className="site-main">{children}</main>
          <footer className="site-footer">
            <div className="footer-inner">
              <p className="footer-copy">{chrome.footerCopy}</p>
              <p className="footer-note">{chrome.footerNote}</p>
              <p className="footer-links">
                {locale === "ja" && (
                  <>
                    <a href="/items/">品目別の捨て方</a>
                    <span aria-hidden="true"> · </span>
                    <a href="/guide/">お役立ちガイド</a>
                    <span aria-hidden="true"> · </span>
                  </>
                )}
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
