// ─────────────────────────────────────────────────────────
// A8.net アフィリエイト広告設定
// 不用品回収プログラム (株式会社FireWorks / s00000022947004)
// ─────────────────────────────────────────────────────────
//
// 設定方法:
// 1. A8の管理画面で「広告リンク作成」→「テキストリンク」を選択
// 2. 生成された <a href="..."> から URL を抜き出して AD_HREF に貼る
// 3. <img src="..."> のインプレッション計測ピクセルがあれば AD_IMP_PIXEL に貼る
//
// URL 未設定（REPLACE_ME のまま）の場合、広告は自動的に非表示になります。
// ─────────────────────────────────────────────────────────

/** インライン広告（カスタムカード）用テキストリンク - CTR個別計測 */
export const AD_HREF = "https://px.a8.net/svt/ejp?a8mat=4B5LJZ+8NDQXM+4X26+NTJWY";

/** インライン広告用インプレッション計測ピクセル */
export const AD_IMP_PIXEL: string | null = "https://www14.a8.net/0.gif?a8mat=4B5LJZ+8NDQXM+4X26+NTJWY";

/** ボトムバナー: モバイル（320×50） - CTR個別計測 */
export const AD_BANNER_MOBILE = {
  href: "https://px.a8.net/svt/ejp?a8mat=4B5LJZ+8NDQXM+4X26+NUMHT",
  src: "https://www25.a8.net/svt/bgt?aid=260601695523&wid=002&eno=01&mid=s00000022947004006000&mc=1",
  pixel: "https://www16.a8.net/0.gif?a8mat=4B5LJZ+8NDQXM+4X26+NUMHT",
  width: 320,
  height: 50,
};

/** ボトムバナー: PC（468×60） - CTR個別計測 */
export const AD_BANNER_PC = {
  href: "https://px.a8.net/svt/ejp?a8mat=4B5LJZ+8NDQXM+4X26+NU729",
  src: "https://www29.a8.net/svt/bgt?aid=260601695523&wid=002&eno=01&mid=s00000022947004004000&mc=1",
  pixel: "https://www15.a8.net/0.gif?a8mat=4B5LJZ+8NDQXM+4X26+NU729",
  width: 468,
  height: 60,
};

/** レクタングル（300×250） - PC右下フローティング用・CTR個別計測 */
export const AD_BANNER_RECT = {
  href: "https://px.a8.net/svt/ejp?a8mat=4B5LJZ+8NDQXM+4X26+NV1XD",
  src: "https://www26.a8.net/svt/bgt?aid=260601695523&wid=002&eno=01&mid=s00000022947004008000&mc=1",
  pixel: "https://www15.a8.net/0.gif?a8mat=4B5LJZ+8NDQXM+4X26+NV1XD",
  width: 300,
  height: 250,
};

/** モバイル/PC切替のブレークポイント（px） */
export const AD_MOBILE_BREAKPOINT = 768;

/** URLが未設定かを判定（広告表示制御用） */
export function isAdConfigured(): boolean {
  return !AD_HREF.includes("REPLACE_ME") && AD_HREF.startsWith("http");
}
