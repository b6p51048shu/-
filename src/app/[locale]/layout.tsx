import type { Metadata } from "next";
import { getT, isValidLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }>; children: React.ReactNode };

// 🔴 多言語ページ（/en /ko /zh）は全て noindex（2026-09-17）
//
// 理由: サイトマップに送っていた22,910URLのうち16,947（74%）が多言語ページだったが、
// 実績はクリック全体の4%（日本語95.7% / 多言語4.3%）しかなく、中身も見出しだけ翻訳して
// 地域名は日本語のまま並ぶ薄いリンク集だった（英語版の本文は日本語文字が24%混在）。
// 「サイトの74%が薄い自動生成ページ」という構成はスケールコンテンツとして
// サイト全体の品質評価を押し下げるため、インデックス対象から外す。
//
// 経緯: 2026-08-20にサイト全体の検索表示が99%消失（5,000〜12,000/日 → 18〜75/日）。
// 手動対策なし・インデックス登録は1.81万ページ維持・技術的にも正常という状態が4週間続き、
// 「インデックスから消えた」のではなく「インデックスにあるのに順位が落ちた」＝
// サイト全体のアルゴリズム的な品質降格と判断した。その最有力の原因がこの構成。
//
// 方針: URL自体は残す（既存リンクを壊さない・404を大量発生させない）。
// noindex を付けてサイトマップからも外し、Googleに自然に落としてもらう。
// 完全にインデックスから消えたのを確認してから、ルートごと削除するか判断する。
// ※ robots はメタデータの後方セグメントが前方を上書きする（Next.js公式: Merging）。
//   ルートの app/layout.tsx が index:true を設定しているのをここで打ち消している。
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getT(locale);
  return {
    title: { absolute: `${t.site.title} | ${t.site.tagline}` },
    description: t.site.tagline,
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        ja: "/",
        en: "/en/",
        ko: "/ko/",
        zh: "/zh/",
        "x-default": "/",
      },
    },
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    },
  };
}

export default async function LocaleLayout({ children }: Props) {
  return children;
}
