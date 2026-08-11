// E-E-A-T表示用の共通コンポーネント（出典＋データ確認時期）。
// SEO_SPRINT.md 施策2: areaPage / wardPage / sodaigomiPage（日本語）のコンテンツ末尾に表示する。
// info_url が無ければ oversized_url で代替し、どちらも無ければリンク無しの文言のみ表示する。

const DEFAULT_DATA_CHECKED = "2026年7月";

type Props = {
  /** リンクラベルに使う自治体名（例: "世田谷区"） */
  entityName: string;
  infoUrl?: string;
  oversizedUrl?: string;
  dataChecked?: string;
};

export default function SourceNote({ entityName, infoUrl, oversizedUrl, dataChecked }: Props) {
  const url = infoUrl ?? oversizedUrl;
  const checked = dataChecked ?? DEFAULT_DATA_CHECKED;

  return (
    <p className="source-note">
      {url && (
        <>
          出典:{" "}
          <a href={url} target="_blank" rel="noopener noreferrer">
            {entityName}公式サイト
          </a>
          ／
        </>
      )}
      掲載情報は{checked}時点の公式情報に基づきます。最新の情報は必ず公式サイトをご確認ください。
    </p>
  );
}
