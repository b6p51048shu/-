// Saitama 区・市ページ（実装は src/components/pages/wardPage.tsx を共有）
import { createWardPage } from "@/components/pages/wardPage";
import { wardParamsFor } from "@/lib/staticParams";

const { generateMetadata, Page } = createWardPage("Saitama");
export { generateMetadata };
export default Page;

export function generateStaticParams() {
  return wardParamsFor("Saitama");
}
export const dynamicParams = false;
