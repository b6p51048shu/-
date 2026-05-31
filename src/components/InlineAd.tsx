import { adContent } from "@/lib/i18n";
import type { BagsUILocale } from "@/lib/i18n";
import { AD_HREF, AD_IMP_PIXEL, isAdConfigured } from "@/lib/adConfig";

/**
 * エリアページに埋め込むインライン広告カード
 * - サーバーコンポーネント（SSRで初期表示）
 * - rel="nofollow sponsored" でGoogleのpaid linkポリシーに準拠
 */
export default function InlineAd({ locale = "ja" }: { locale?: BagsUILocale }) {
  if (!isAdConfigured()) return null;

  const t = adContent[locale];

  return (
    <aside className="inline-ad" aria-label={t.label}>
      <span className="ad-label">{t.label}</span>
      <h3 className="inline-ad-title">{t.inline.title}</h3>
      <p className="inline-ad-body">{t.inline.body}</p>
      <a
        href={AD_HREF}
        target="_blank"
        rel="noopener nofollow sponsored"
        className="inline-ad-cta"
      >
        {t.inline.cta}
      </a>
      {AD_IMP_PIXEL && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={AD_IMP_PIXEL}
          width={1}
          height={1}
          alt=""
          style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
        />
      )}
    </aside>
  );
}
