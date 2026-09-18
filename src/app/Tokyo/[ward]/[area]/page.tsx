// Tokyo 地域ページ（実装は src/components/pages/areaPage.tsx を共有）
import { createAreaPage } from "@/components/pages/areaPage";
import { areaParamsFor } from "@/lib/staticParams";

const { generateMetadata, Page } = createAreaPage("Tokyo");
export { generateMetadata };
export default Page;

export function generateStaticParams() {
  return areaParamsFor("Tokyo");
}
export const dynamicParams = false;
