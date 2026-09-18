// Saitama 地域ページ（実装は src/components/pages/areaPage.tsx を共有）
import { createAreaPage } from "@/components/pages/areaPage";
import { areaParamsFor } from "@/lib/staticParams";

const { generateMetadata, Page } = createAreaPage("Saitama");
export { generateMetadata };
export default Page;

export function generateStaticParams() {
  return areaParamsFor("Saitama");
}
export const dynamicParams = false;
