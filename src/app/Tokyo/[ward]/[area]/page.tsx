// Tokyo 地域ページ（実装は src/components/pages/areaPage.tsx を共有）
import { createAreaPage } from "@/components/pages/areaPage";

const { generateMetadata, Page } = createAreaPage("Tokyo");
export { generateMetadata };
export default Page;
