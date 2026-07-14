// Saitama 県トップページ（実装は src/components/pages/prefTopPage.tsx を共有）
import { createPrefTopPage } from "@/components/pages/prefTopPage";

const { generateMetadata, Page } = createPrefTopPage("Saitama");
export { generateMetadata };
export default Page;
