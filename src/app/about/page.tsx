import type { Metadata } from "next";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "運営者情報",
  description:
    "ゴミの日.com（gominohi.com）の運営者情報。サイトの目的、掲載データの方針・出典、広告掲載について、お問い合わせ先をご案内します。",
  alternates: { canonical: "/about/" },
};

const CONTACT_EMAIL = "gominohi.araiguma@gmail.com";

export default function AboutPage() {
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "ホーム", path: "/" },
    { name: "運営者情報", path: "/about/" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="container-narrow">
        <nav className="breadcrumb" aria-label="パンくず">
          <a href="/">ホーム</a>
          <span>運営者情報</span>
        </nav>

        <h1 className="section-title">運営者情報</h1>

        <article className="article">
          <div className="price-table-wrap">
            <table className="price-table">
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>サイト名</td>
                  <td>ゴミの日.com（gominohi.com）</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>運営者</td>
                  <td>ゴミの日.com運営事務局</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>お問い合わせ</td>
                  <td>
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>開設</td>
                  <td>2026年</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>サイトの目的</h2>
          <p>
            「今日、何ゴミの日だっけ？」をなくすこと。ゴミの日.comは、東京都（23区・多摩地区）の
            ごみ収集日と分別ルールを、地域を選ぶだけですぐ確認できるようにした無料サービスです。
            引っ越したばかりの方、忙しい毎日を送る方が、ゴミ出しで困らない暮らしをサポートします。
          </p>

          <h2>掲載データについて</h2>
          <ul>
            <li>収集日・分別区分のデータは、<strong>各自治体の公式サイト・公式配布資料・オープンデータ</strong>をもとに作成しています。</li>
            <li>自治体によるルール改定を反映するため、データは継続的に確認・更新しています。</li>
            <li>収集日は年末年始・祝日・災害等により変更される場合があります。<strong>正確な最新情報は必ず各自治体の公式発表をご確認ください。</strong></li>
            <li>掲載内容の誤りを見つけられた場合は、お問い合わせ先までご連絡いただけると幸いです。確認のうえ速やかに修正します。</li>
          </ul>

          <h2>広告掲載について</h2>
          <p>
            当サイトは、サービスの運営費用をまかなうためアフィリエイト広告（A8.net等）を掲載しています。
            広告であることが分かるよう表示し、コンテンツの内容は広告主の影響を受けずに作成しています。
          </p>

          <h2>関連ページ</h2>
          <div className="article-related-links" style={{ marginTop: "1rem" }}>
            <a href="/privacy/" className="btn btn-outline">プライバシーポリシー</a>
            <a href="/disclaimer/" className="btn btn-outline">免責事項</a>
            <a href="/" className="btn btn-outline">トップページ</a>
          </div>
        </article>
      </div>
    </>
  );
}
