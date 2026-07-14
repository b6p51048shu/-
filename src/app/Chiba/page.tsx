// Chiba 県トップページ（実装は src/components/pages/prefTopPage.tsx を共有）
import { createPrefTopPage } from "@/components/pages/prefTopPage";

const { generateMetadata, Page } = createPrefTopPage("Chiba");
export { generateMetadata };
export default Page;
