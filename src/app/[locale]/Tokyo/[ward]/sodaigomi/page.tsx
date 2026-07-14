// Tokyo 粗大ごみページ 多言語版（実装は src/components/pages/localeSodaigomiPage.tsx を共有）
import { createLocaleSodaigomiPage } from "@/components/pages/localeSodaigomiPage";

const { generateMetadata, Page } = createLocaleSodaigomiPage("Tokyo");
export { generateMetadata };
export default Page;
