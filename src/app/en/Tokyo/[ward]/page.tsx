import type { Metadata } from "next";
import { getWardBySlug } from "@/lib/data";
import EnWardPageClient from "./WardPageClient";

type Props = { params: Promise<{ ward: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ward: wardSlug } = await params;
  const result = await getWardBySlug(wardSlug);
  if (!result) return {};
  const { name: wardName, info } = result;
  return {
    title: `${wardSlug} Ward Garbage Collection | Gominohi.com`,
    description: `Garbage collection schedule for ${wardSlug} Ward (${wardName}), Tokyo. ${info.areas.length} areas covered.`,
    openGraph: {
      title: `${wardSlug} Ward Garbage Collection | Gominohi.com`,
      description: `Find your garbage collection days in ${wardSlug} Ward, Tokyo.`,
    },
    alternates: { canonical: `/en/Tokyo/${wardSlug}` },
  };
}

export default async function EnWardPage({ params }: Props) {
  const { ward: wardSlug } = await params;
  const result = await getWardBySlug(wardSlug);

  if (!result) {
    return <div className="container"><p>Ward not found.</p></div>;
  }

  const { name: wardName, info } = result;

  return (
    <EnWardPageClient
      wardName={wardName}
      wardInfo={info}
      wardSlug={wardSlug}
    />
  );
}
