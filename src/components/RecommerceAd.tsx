/**
 * 宅配買取（リコマース）広告 — A8.net 素材をそのまま掲載
 * - href / img src / 計測ピクセル / 画像サイズは素材どおり（改変禁止）
 * - 計測ピクセル(1x1)は素材ごとに必ず描画
 * - 説明文は固定。誘導表現は入れない
 */
const PIXEL_STYLE = {
  position: "absolute",
  width: 1,
  height: 1,
  opacity: 0,
  pointerEvents: "none",
} as const;

export default function RecommerceAd({ variant }: { variant: "full" | "text" }) {
  return (
    <aside className="recommerce-ad" aria-label="広告">
      <span className="ad-label">広告</span>
      <p>
        まだ使えるものは、捨てる前に買い取ってもらう方法もあります。本・CD・DVD・ゲーム・小型家電・ブランド品・楽器などが対象で、申し込みはAmazonアカウントで行えます。送料は無料です。
      </p>

      {variant === "full" && (
        <div className="recommerce-rect">
          <a
            href="https://px.a8.net/svt/ejp?a8mat=4BGAUX+BE7PCQ+3XHM+60H7L"
            target="_blank"
            rel="noopener nofollow sponsored"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              width={300}
              height={250}
              alt=""
              src="https://www22.a8.net/svt/bgt?aid=261101049689&wid=002&eno=01&mid=s00000018337001010000&mc=1"
              style={{ border: 0 }}
            />
          </a>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            width={1}
            height={1}
            src="https://www19.a8.net/0.gif?a8mat=4BGAUX+BE7PCQ+3XHM+60H7L"
            alt=""
            style={PIXEL_STYLE}
          />
        </div>
      )}

      <a
        className="recommerce-text"
        href="https://px.a8.net/svt/ejp?a8mat=4BGAUX+BE7PCQ+3XHM+5ZEMQ"
        target="_blank"
        rel="noopener nofollow sponsored"
      >
        Amazonアカウントで利用できる【リコマース宅配買取サービス】
      </a>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        width={1}
        height={1}
        src="https://www12.a8.net/0.gif?a8mat=4BGAUX+BE7PCQ+3XHM+5ZEMQ"
        alt=""
        style={PIXEL_STYLE}
      />
    </aside>
  );
}
