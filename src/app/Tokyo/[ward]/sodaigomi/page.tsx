import type { Metadata } from "next";
import { getWardBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { sodaigomiContent, fillTemplate } from "@/lib/articleContent";
import SodaigomiArticle from "@/components/SodaigomiArticle";

type Props = { params: Promise<{ ward: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ward: wardSlug } = await params;
  const result = await getWardBySlug(wardSlug);
  if (!result) return {};
  const { name: wardName } = result;
  const c = sodaigomiContent.ja;
  const f = (tpl: string) => fillTemplate(tpl, { ward: wardName });
  return {
    title: f(c.metaTitle),
    description: f(c.metaDesc),
    alternates: {
      canonical: `/Tokyo/${wardSlug}/sodaigomi/`,
      languages: {
        ja: `/Tokyo/${wardSlug}/sodaigomi/`,
        en: `/en/Tokyo/${wardSlug}/sodaigomi/`,
        ko: `/ko/Tokyo/${wardSlug}/sodaigomi/`,
        zh: `/zh/Tokyo/${wardSlug}/sodaigomi/`,
      },
    },
    openGraph: {
      title: f(c.ogTitle),
      description: f(c.ogDesc),
    },
  };
}

export default async function OversizedPage({ params }: Props) {
  const { ward: wardSlug } = await params;
  const result = await getWardBySlug(wardSlug);

  // 詳細データが揃っている自治体のみ公開（薄いコンテンツ防止）
  if (!result || !result.info.oversized_detail) notFound();

  const { name: wardName, info } = result;

  return <SodaigomiArticle locale="ja" wardName={wardName} wardSlug={wardSlug} info={info} />;
}
