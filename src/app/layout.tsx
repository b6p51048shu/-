import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  metadataBase: new URL("https://gominohi.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={notoSansJP.className}>
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
            <a href="/" className="site-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/raccoon.png" className="logo-raccoon" alt="" width={36} height={36} />
              <span className="logo-text">ゴミの日.com</span>
            </a>
            <nav className="site-nav">
              <a href="/">トップ</a>
            </nav>
            <LanguageSwitcher />
          </header>
          <main className="site-main">{children}</main>
          <footer className="site-footer">
            <div className="footer-inner">
              <p className="footer-copy">© 2026 ゴミの日.com — 東京都ごみ収集日カレンダー</p>
              <p className="footer-note">
                掲載情報は各区の公式データに基づきますが、変更される場合があります。必ず各区の公式サイトでご確認ください。
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
