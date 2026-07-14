// Chiba 地域ページ 多言語版（実装は src/components/pages/localeAreaPage.tsx を共有）
import { createLocaleAreaPage } from "@/components/pages/localeAreaPage";

const { generateMetadata, Page } = createLocaleAreaPage("Chiba");
export { generateMetadata };
export default Page;
