// 粗大ごみの出し方ページ（日本語）の共有実装。
// 各県ディレクトリ（src/app/{Pref}/[ward]/sodaigomi/page.tsx）から createSodaigomiPage(pref) で生成する。

import type { Metadata } from "next";
import { getWardBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { sodaigomiContent, fillTemplate } from "@/lib/articleContent";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import SodaigomiArticle from "@/components/SodaigomiArticle";
import type { PrefSlug } from "@/lib/prefs";

type Props = { params: Promise<{ ward: string }> };

export function createSodaigomiPage(pref: PrefSlug) {
  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { ward: wardSlug } = await params;
    const result = await getWardBySlug(wardSlug);
    if (!result || result.pref !== pref) return {};
    const { name: wardName } = result;
    const c = sodaigomiContent.ja;
    const f = (tpl: string) => fillTemplate(tpl, { ward: wardName });
    return {
      title: f(c.metaTitle),
      description: f(c.metaDesc),
      alternates: {
        canonical: `/${pref}/${wardSlug}/sodaigomi/`,
        languages: {
          ja: `/${pref}/${wardSlug}/sodaigomi/`,
          "x-default": `/${pref}/${wardSlug}/sodaigomi/`,
          en: `/en/${pref}/${wardSlug}/sodaigomi/`,
          ko: `/ko/${pref}/${wardSlug}/sodaigomi/`,
          zh: `/zh/${pref}/${wardSlug}/sodaigomi/`,
        },
      },
      openGraph: {
        title: f(c.ogTitle),
        description: f(c.ogDesc),
      },
    };
  }

  async function Page({ params }: Props) {
    const { ward: wardSlug } = await params;
    const result = await getWardBySlug(wardSlug);

    // 詳細データが揃っている自治体のみ公開（薄いコンテンツ防止）
    if (!result || result.pref !== pref || !result.info.oversized_detail) notFound();

    const { name: wardName, info } = result;

    const breadcrumbLd = breadcrumbJsonLd([
      { name: "ホーム", path: "/" },
      { name: wardName, path: `/${pref}/${wardSlug}/` },
      { name: "粗大ごみの出し方", path: `/${pref}/${wardSlug}/sodaigomi/` },
    ]);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <SodaigomiArticle locale="ja" pref={pref} wardName={wardName} wardSlug={wardSlug} info={info} />
      </>
    );
  }

  return { generateMetadata, Page };
}
