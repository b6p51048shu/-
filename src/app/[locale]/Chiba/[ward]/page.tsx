// Chiba 区・市ページ 多言語版（実装は src/components/pages/localeWardPage.tsx を共有）
import { createLocaleWardPage } from "@/components/pages/localeWardPage";

const { generateMetadata, Page } = createLocaleWardPage("Chiba");
export { generateMetadata };
export default Page;
