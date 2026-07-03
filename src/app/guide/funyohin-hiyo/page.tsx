import type { Metadata } from "next";
import { funyohinContent } from "@/lib/articleContent";
import FunyohinArticle from "@/components/FunyohinArticle";

const c = funyohinContent.ja;

export const metadata: Metadata = {
  title: c.metaTitle,
  description: c.metaDesc,
  alternates: {
    canonical: "/guide/funyohin-hiyo/",
    languages: {
      ja: "/guide/funyohin-hiyo/",
      "x-default": "/guide/funyohin-hiyo/",
      en: "/en/guide/funyohin-hiyo/",
      ko: "/ko/guide/funyohin-hiyo/",
      zh: "/zh/guide/funyohin-hiyo/",
    },
  },
  openGraph: {
    title: c.ogTitle,
    description: c.ogDesc,
  },
};

export default function FunyohinHiyoPage() {
  return <FunyohinArticle locale="ja" />;
}
