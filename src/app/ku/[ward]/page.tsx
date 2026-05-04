import type { Metadata } from "next";
import { wardData, wardNames, getWard } from "@/lib/data";
import WardPageClient from "./WardPageClient";

type Props = { params: Promise<{ ward: string }> };

export async function generateStaticParams() {
  return wardNames.map((ward) => ({ ward: encodeURIComponent(ward) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ward: wardParam } = await params;
  const wardName = decodeURIComponent(wardParam);
  const info = wardData[wardName];
  if (!info) return {};
  return {
    title: `${wardName}のごみ収集日一覧`,
    description: `${wardName}の全${info.areas.length}地域のごみ収集日（燃やすごみ・資源ごみ・プラスチック）を一覧表示。地域を選ぶと収集曜日をすぐに確認できます。`,
    openGraph: {
      title: `${wardName}のごみ収集日 | ゴミカレ`,
      description: `${wardName}全${info.areas.length}地域のごみ収集スケジュール。`,
    },
  };
}

export default async function WardPage({ params }: Props) {
  const { ward: wardParam } = await params;
  const wardName = decodeURIComponent(wardParam);
  const info = getWard(wardName);

  if (!info) {
    return (
      <div className="container">
        <p>区が見つかりません: {wardName}</p>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${wardName}のごみ収集日一覧`,
    description: `${wardName}の全地域のごみ収集スケジュール`,
    numberOfItems: info.areas.length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WardPageClient wardName={wardName} wardInfo={info} wardParam={wardParam} />
    </>
  );
}
