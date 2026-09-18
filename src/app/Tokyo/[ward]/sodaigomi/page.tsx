// Tokyo 粗大ごみページ（実装は src/components/pages/sodaigomiPage.tsx を共有）
import { createSodaigomiPage } from "@/components/pages/sodaigomiPage";
import { sodaigomiParamsFor } from "@/lib/staticParams";

const { generateMetadata, Page } = createSodaigomiPage("Tokyo");
export { generateMetadata };
export default Page;

export function generateStaticParams() {
  return sodaigomiParamsFor("Tokyo");
}
export const dynamicParams = false;
