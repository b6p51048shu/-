import type { Metadata } from "next";
import { getWardBySlug } from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { notFound } from "next/navigation";
import WardPageClient from "./WardPageClient";

type Props = { params: Promise<{ ward: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ward: wardSlug } = await params;
  const result = await getWardBySlug(wardSlug);
  if (!result) return {};
  const { name: wardName, info } = result;
  return {
    title: `${wardName}のごみ収集日一覧`,
    description: `${wardName}の全${info.areas.length}地域のごみ収集日（燃やすごみ・資源ごみ・プラスチック）を一覧表示。地域を選ぶと収集曜日をすぐに確認できます。`,
    alternates: {
      canonical: `/Tokyo/${wardSlug}/`,
      languages: {
        ja: `/Tokyo/${wardSlug}/`,
        en: `/en/Tokyo/${wardSlug}/`,
        ko: `/ko/Tokyo/${wardSlug}/`,
        zh: `/zh/Tokyo/${wardSlug}/`,
      },
    },
    openGraph: {
      title: `${wardName}のごみ収集日 | ゴミの日.com`,
      description: `${wardName}全${info.areas.length}地域のごみ収集スケジュール。`,
    },
  };
}

export default async function WardPage({ params }: Props) {
  const { ward: wardSlug } = await params;
  const result = await getWardBySlug(wardSlug);

  if (!result) notFound();

  const { name: wardName, info } = result;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${wardName}のごみ収集日一覧`,
    description: `${wardName}の全地域のごみ収集スケジュール`,
    numberOfItems: info.areas.length,
  };

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "ホーム", path: "/" },
    { name: wardName, path: `/Tokyo/${wardSlug}/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <WardPageClient wardName={wardName} wardInfo={info} wardSlug={wardSlug} />
    </>
  );
}
