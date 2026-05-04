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
    default: "ゴミカレ | 東京23区ごみ収集日カレンダー",
    template: "%s | ゴミカレ",
  },
  description:
    "東京23区のごみ収集日を地域別に検索。燃やすごみ・資源ごみ・プラスチックの収集曜日を今すぐ確認。GPS対応・無料。",
  keywords: ["ごみ収集日", "東京23区", "燃やすごみ", "資源ごみ", "ゴミカレ", "収集カレンダー"],
  authors: [{ name: "ゴミカレ" }],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "ゴミカレ",
    title: "ゴミカレ | 東京23区ごみ収集日カレンダー",
    description: "東京23区のごみ収集日を地域別に検索。GPS対応・無料。",
  },
  twitter: {
    card: "summary",
    title: "ゴミカレ | 東京23区ごみ収集日",
    description: "東京23区のごみ収集日を地域別に検索。GPS対応・無料。",
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ゴミカレ" />
      </head>
      <body>
        <div className="app-shell">
          <header className="site-header">
            <a href="/" className="site-logo">
              <span className="logo-icon">♻️</span>
              <span className="logo-text">ゴミカレ</span>
            </a>
            <nav className="site-nav">
              <a href="/">トップ</a>
            </nav>
            <LanguageSwitcher />
          </header>
          <main className="site-main">{children}</main>
          <footer className="site-footer">
            <div className="footer-inner">
              <p className="footer-copy">© 2026 ゴミカレ — 東京23区ごみ収集日カレンダー</p>
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
