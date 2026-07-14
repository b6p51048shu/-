// Chiba 区・市ページ（実装は src/components/pages/wardPage.tsx を共有）
import { createWardPage } from "@/components/pages/wardPage";

const { generateMetadata, Page } = createWardPage("Chiba");
export { generateMetadata };
export default Page;
