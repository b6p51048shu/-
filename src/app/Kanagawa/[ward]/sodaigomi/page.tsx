// Kanagawa 粗大ごみページ（実装は src/components/pages/sodaigomiPage.tsx を共有）
import { createSodaigomiPage } from "@/components/pages/sodaigomiPage";

const { generateMetadata, Page } = createSodaigomiPage("Kanagawa");
export { generateMetadata };
export default Page;
