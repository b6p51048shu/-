// 記事系コンテンツの多言語辞書（ja/en/ko/zh）。
// UI文字列は i18n.ts、記事本文はこちらに集約する。
// ※ 料金・自治体データ等は本文テンプレートのみ翻訳し、データ値は日本語のまま扱う。

import type { BagsUILocale } from "@/lib/i18n";

/* ──────────────────────────────────────────────
 * お役立ちガイド一覧（/guide）
 * ────────────────────────────────────────────── */
export type GuideContent = {
  metaTitle: string;
  metaDesc: string;
  bcHome: string;
  bcCurrent: string;
  h1: string;
  lead: string;
  backHome: string;
  articles: { slug: string; title: string; desc: string }[];
};

export const guideContent: Record<BagsUILocale, GuideContent> = {
  ja: {
    metaTitle: "お役立ちガイド | ゴミの日.com",
    metaDesc: "不用品回収の費用相場、粗大ごみの捨て方、引越し時のゴミ処分など、ごみ・不用品の処分に役立つ情報をまとめています。",
    bcHome: "ホーム",
    bcCurrent: "お役立ちガイド",
    h1: "お役立ちガイド",
    lead: "ごみの分別・処分や、不用品・粗大ごみの片付けに役立つ情報をまとめています。",
    backHome: "← トップに戻る",
    articles: [
      {
        slug: "sodaigomi-seal",
        title: "粗大ごみシール（処理券）の買い方・値段【東京23区】",
        desc: "A券200円・B券300円の組み合わせ方、コンビニでの買い方、記入・貼り方、区ごとの注意点まで解説。",
      },
      {
        slug: "hikkoshi-gomi",
        title: "引越しで出る大量ゴミの処分方法【2026年版】",
        desc: "ゴミの種類別の出口、退去日からの逆算スケジュール、自治体回収が間に合わない時の裏ワザ、ケース別おすすめ、業者の選び方まで解説。",
      },
      {
        slug: "funyohin-hiyo",
        title: "不用品回収の費用相場【2026年版】",
        desc: "単品・トラック積み放題の料金目安、自治体回収との違い、安く抑えるコツ、悪質業者の見分け方まで解説。",
      },
      {
        slug: "gyousha-erabikata",
        title: "不用品回収業者の選び方と悪質業者の見分け方",
        desc: "優良業者のチェックリスト5項目、「無料回収」トラックなど悪質業者の手口、相見積もりのコツ、トラブル時の相談先を解説。",
      },
      {
        slug: "reizouko-sentakuki",
        title: "冷蔵庫・洗濯機の処分方法5つ【家電リサイクル法】",
        desc: "粗大ごみに出せない冷蔵庫・洗濯機の処分ルート5つの比較、リサイクル料金の目安、リサイクル券の手順、水抜き等の準備を解説。",
      },
      {
        slug: "ihin-seiri",
        title: "遺品整理の進め方と費用相場【間取り別】",
        desc: "進め方の5ステップ、自分でやるか業者かの判断基準、間取り別の費用相場、業者選び、相続・供養の注意点まで解説。",
      },
      {
        slug: "jikka-katazuke",
        title: "実家の片付け（生前整理）の進め方",
        desc: "親と揉めない声かけのコツ、片付ける場所の優先順位、自治体と業者の使い分け、売れる物の見極めを解説。",
      },
      {
        slug: "gomi-yashiki",
        title: "ゴミ屋敷の片付け費用と手順",
        desc: "自力でできるレベルの判断基準、間取り別の費用相場、業者の選び方と近所への配慮、自治体の支援制度、再発防止まで解説。",
      },
      {
        slug: "aircon-cleaning",
        title: "エアコン分解洗浄で冷えが復活・電気代の節約に",
        desc: "効きが悪い原因は内部の汚れ。分解洗浄が節電になる理由、料金相場、自分でできる範囲との違い、安く頼むコツを解説。",
      },
    ],
  },
  en: {
    metaTitle: "Helpful Guides | Gomi no Hi.com",
    metaDesc: "Tips on junk removal costs, how to dispose of oversized garbage, and clearing out items when moving — practical help for getting rid of garbage and unwanted items.",
    bcHome: "Home",
    bcCurrent: "Helpful Guides",
    h1: "Helpful Guides",
    lead: "Useful information for sorting and disposing of garbage, and for clearing out unwanted and oversized items.",
    backHome: "← Back to top",
    articles: [
      {
        slug: "funyohin-hiyo",
        title: "Junk Removal Costs (2026 Guide)",
        desc: "Price guidelines for single items and flat-rate truck plans, how they differ from municipal collection, tips to cut costs, and how to spot dishonest operators.",
      },
    ],
  },
  ko: {
    metaTitle: "유용한 가이드 | 고미노히닷컴",
    metaDesc: "폐기물 수거 비용 시세, 대형 쓰레기 배출 방법, 이사 시 쓰레기 처리 등 쓰레기·폐기물 처분에 도움이 되는 정보를 정리했습니다.",
    bcHome: "홈",
    bcCurrent: "유용한 가이드",
    h1: "유용한 가이드",
    lead: "쓰레기 분리·배출과 폐기물·대형 쓰레기 정리에 도움이 되는 정보를 정리했습니다.",
    backHome: "← 처음으로",
    articles: [
      {
        slug: "funyohin-hiyo",
        title: "폐기물 수거 비용 시세 【2026년판】",
        desc: "단품·트럭 정액제 요금 기준, 지자체 수거와의 차이, 저렴하게 줄이는 요령, 악덕 업자 구별법까지 해설.",
      },
    ],
  },
  zh: {
    metaTitle: "实用指南 | 垃圾日.com",
    metaDesc: "整理了上门回收费用行情、大件垃圾的丢弃方法、搬家时的垃圾处理等有助于处理垃圾和废旧物品的信息。",
    bcHome: "首页",
    bcCurrent: "实用指南",
    h1: "实用指南",
    lead: "整理了有助于垃圾分类与丢弃、以及清理废旧物品和大件垃圾的信息。",
    backHome: "← 返回首页",
    articles: [
      {
        slug: "funyohin-hiyo",
        title: "上门回收费用行情【2026年版】",
        desc: "单件、卡车装到满套餐的价格参考，与政府回收的区别，省钱诀窍，以及识别不良业者的方法。",
      },
    ],
  },
};

/* ──────────────────────────────────────────────
 * 不用品回収の費用相場（/guide/funyohin-hiyo）
 *  rich フィールド(*_html / *Html)は <strong> 等を含むため dangerouslySetInnerHTML で描画する。
 * ────────────────────────────────────────────── */
export type FunyohinContent = {
  metaTitle: string;
  metaDesc: string;
  ogTitle: string;
  ogDesc: string;
  bcHome: string;
  bcGuide: string;
  bcCurrent: string;
  h1: string;
  updated: string;
  leadHtml: string;
  tocTitle: string;
  toc: string[];
  // 1. 早見表
  s1H: string;
  s1PHtml: string;
  s1Heads: [string, string, string];
  s1Rows: [string, string, string][];
  s1CalloutHtml: string;
  // 2. 内訳
  s2H: string;
  s2P: string;
  s2ListHtml: string[];
  // 3. 品目別
  s3H: string;
  s3P: string;
  s3Heads: [string, string, string];
  s3Items: [string, string, string][];
  s3CalloutHtml: string;
  // 4. トラック
  s4H: string;
  s4P: string;
  s4Heads: [string, string, string, string];
  s4Plans: [string, string, string, string][];
  s4P2Html: string;
  // 5. 自治体との違い
  s5H: string;
  s5P: string;
  s5Heads: [string, string, string];
  s5Rows: [string, string, string][];
  s5P2Html: string;
  s5CalloutPre: string;
  s5CalloutLink: string;
  s5CalloutPost: string;
  // 6. 安く抑えるコツ
  s6H: string;
  s6ListHtml: string[];
  // 7. 注意点
  s7H: string;
  s7P: string;
  s7ListHtml: string[];
  // FAQ
  faqH: string;
  faq: { q: string; a: string }[];
  disclaimer: string;
  relatedTitle: string;
  relatedGuide: string;
  relatedCalendar: string;
};

// 品目別 / トラックのテーブルは price/note を locale ごとに保持する
export const funyohinContent: Record<BagsUILocale, FunyohinContent> = {
  ja: {
    metaTitle: "不用品回収の費用相場【2026年版】料金の目安・トラック積み放題・安く抑えるコツ",
    metaDesc: "不用品回収の費用相場を品目別・トラック積み放題プラン別にわかりやすく解説。自治体の粗大ごみ回収との違い、料金を安く抑える5つのコツ、悪質業者を避ける注意点まで、初めての方向けにまとめました。",
    ogTitle: "不用品回収の費用相場【2026年版】 | ゴミの日.com",
    ogDesc: "品目別・トラック積み放題の料金目安、自治体回収との違い、安く抑えるコツ、悪質業者の見分け方を解説。",
    bcHome: "ホーム",
    bcGuide: "お役立ちガイド",
    bcCurrent: "不用品回収の費用相場",
    h1: "不用品回収の費用相場【2026年版】",
    updated: "最終更新日: 2026年6月7日",
    leadHtml:
      "引越しや大掃除、遺品整理などで出た不用品。「業者に頼むといくらかかるの？」という疑問に、<strong>品目別・トラック積み放題プラン別の費用相場</strong>をわかりやすくまとめました。自治体の粗大ごみ回収との使い分けや、料金を安く抑えるコツ、悪質業者を避ける注意点も解説します。",
    tocTitle: "この記事の内容",
    toc: [
      "不用品回収の費用相場（早見表）",
      "料金の内訳 ― 何にお金がかかる？",
      "品目別の費用相場",
      "トラック積み放題プランの相場",
      "自治体の粗大ごみ回収との違い",
      "安く抑える5つのコツ",
      "悪質業者を避ける注意点",
      "よくある質問",
    ],
    s1H: "不用品回収の費用相場（早見表）",
    s1PHtml:
      "不用品回収の料金は、大きく分けて「<strong>単品（品目ごと）</strong>」と「<strong>トラック積み放題（量でまとめる）</strong>」の2つの料金体系があります。ざっくりした目安は次のとおりです。",
    s1Heads: ["頼み方", "費用の目安", "向いているケース"],
    s1Rows: [
      ["単品回収", "2,000〜15,000円/点", "処分品が1〜3点と少ない"],
      ["軽トラック積み放題", "10,000〜30,000円", "一人暮らしの片付け"],
      ["1.5tトラック積み放題", "30,000〜60,000円", "1〜2部屋分"],
      ["2tトラック積み放題", "50,000〜90,000円", "一軒家・ファミリー世帯"],
    ],
    s1CalloutHtml:
      "<strong>※ 金額はあくまで一般的な目安です。</strong>地域・業者・搬出条件（階段の有無、エレベーター、駐車スペースなど）によって変動します。正確な金額は必ず見積もりで確認してください。",
    s2H: "料金の内訳 ― 何にお金がかかる？",
    s2P: "不用品回収の料金は、主に次の要素の合計で決まります。",
    s2ListHtml: [
      "<strong>基本料金・出張費</strong>：3,000〜5,000円程度。業者の出張や手続きの費用です。",
      "<strong>作業費（人件費）</strong>：搬出の人数・時間に応じて加算されます。",
      "<strong>処分費・リサイクル費</strong>：品目ごとの処分にかかる費用。エアコン・テレビ・冷蔵庫・洗濯機の「家電4品目」は法律で<strong>リサイクル料金</strong>が別途必要です。",
      "<strong>オプション料金</strong>：階段料金（エレベーターなしの高層階）、分解・取り外し、即日対応、深夜・早朝対応などで加算される場合があります。",
    ],
    s3H: "品目別の費用相場",
    s3P: "代表的な品目の費用目安です（基本料金・出張費は別途かかる場合があります）。",
    s3Heads: ["品目", "費用の目安", "備考"],
    s3Items: [
      ["冷蔵庫（小型）", "5,000〜10,000円", "別途リサイクル料金 約3,740円〜"],
      ["冷蔵庫（大型）", "8,000〜15,000円", "別途リサイクル料金 約4,730円〜"],
      ["洗濯機・乾燥機", "4,000〜8,000円", "別途リサイクル料金 約2,530円〜"],
      ["エアコン", "6,000〜12,000円", "取り外し工事費を含む場合あり"],
      ["テレビ（液晶・小）", "4,000〜8,000円", "別途リサイクル料金 約1,870円〜"],
      ["ソファ（2人掛け）", "4,000〜8,000円", "—"],
      ["ソファ（3人掛け）", "6,000〜12,000円", "大型・本革は割増"],
      ["ベッド（シングル）", "5,000〜10,000円", "マットレス別の場合あり"],
      ["マットレス", "4,000〜8,000円", "—"],
      ["ダイニングテーブル", "3,000〜8,000円", "サイズ・素材で変動"],
      ["タンス・食器棚（大）", "5,000〜12,000円", "—"],
      ["電子レンジ", "1,500〜3,000円", "—"],
      ["自転車", "2,000〜4,000円", "—"],
      ["布団（1組）", "1,000〜3,000円", "—"],
    ],
    s3CalloutHtml:
      "<strong>家電4品目（エアコン・テレビ・冷蔵庫/冷凍庫・洗濯機/乾燥機）</strong>は「家電リサイクル法」の対象で、回収費とは別に<strong>リサイクル料金</strong>がかかります。メーカー・サイズで金額が異なります。",
    s4H: "トラック積み放題プランの相場",
    s4P: "処分品が多いときは、トラックに積める分だけ定額で回収する「積み放題プラン」がお得です。世帯規模の目安は次のとおりです。",
    s4Heads: ["プラン", "積載量の目安", "費用の目安", "こんな人に"],
    s4Plans: [
      ["軽トラック積み放題", "約1〜1.5畳分", "10,000〜30,000円", "一人暮らしの片付け・少量の不用品"],
      ["1.5tトラック積み放題", "約2〜3畳分", "30,000〜60,000円", "1〜2部屋分・カップル世帯の引越し残置物"],
      ["2tトラック積み放題", "約3〜4畳分", "50,000〜90,000円", "ファミリー世帯・一軒家の大量処分"],
    ],
    s4P2Html:
      "なお「積み放題」でも、家電リサイクル料金や、規定量を超えた分の追加料金が発生する場合があります。<strong>どこまでが定額に含まれるか</strong>を見積もり時に確認しておくと安心です。",
    s5H: "自治体の粗大ごみ回収との違い（どっちが得？）",
    s5P: "「不用品回収業者」と「自治体の粗大ごみ回収」は、料金も使い勝手も異なります。状況に応じて使い分けましょう。",
    s5Heads: ["比較項目", "自治体の粗大ごみ回収", "不用品回収業者"],
    s5Rows: [
      ["料金", "安い（1点 数百円〜2,000円程度）", "やや高い（量・条件による）"],
      ["運び出し", "自分で集積所まで出す", "部屋からそのまま搬出"],
      ["対応スピード", "予約制で数日〜数週間待ち", "即日・当日対応も可能"],
      ["まとめて処分", "点数・サイズ制限あり", "大量でもまとめてOK"],
    ],
    s5P2Html:
      "<strong>1〜2点・自分で運べる</strong>なら自治体回収がお得。<strong>量が多い・急ぎ・運び出しが大変・家具家電が混在</strong>するなら、手間を含めたトータルで不用品回収業者が有利になりやすいです。",
    s5CalloutPre: "お住まいの地域のごみ収集日は、当サイトの ",
    s5CalloutLink: "ごみ収集日カレンダー",
    s5CalloutPost: " で確認できます。なお粗大ごみは多くの自治体で事前申し込み制のため、収集日・手数料は各地域ページに掲載している自治体公式の粗大ごみ案内ページをご確認ください。",
    s6H: "不用品回収を安く抑える5つのコツ",
    s6ListHtml: [
      "<strong>複数社で相見積もりを取る</strong>：同じ内容でも業者で料金差が大きいため、2〜3社を比較するのが基本です。",
      "<strong>売れるものは先に売る</strong>：状態の良い家電・家具・ブランド品はリサイクルショップやフリマアプリで売れば、処分費が浮くどころかプラスになることも。",
      "<strong>自分で運べるものは自治体回収を併用</strong>：小物や1〜2点の粗大ごみは自治体に出し、運び出しが大変なものだけ業者に頼むと節約できます。",
      "<strong>トラック積み放題にまとめる</strong>：点数が多いなら単品より積み放題プランの方が割安になりやすいです。",
      "<strong>平日・閑散期を狙う</strong>：引越しシーズン（3〜4月）や週末は混み合い割高になりがち。日程に余裕があれば平日がおすすめです。",
    ],
    s7H: "悪質業者を避けるための注意点",
    s7P: "残念ながら、不用品回収にはトラブルもあります。安心して頼むために、次の点をチェックしましょう。",
    s7ListHtml: [
      "<strong>「無料回収」をうたうトラック・チラシに安易に頼まない</strong>：積み込み後に高額請求されたり、回収物が不法投棄されるケースがあります。",
      "<strong>許可の有無を確認する</strong>：一般家庭の不用品回収には、自治体の「一般廃棄物収集運搬業」の許可（または委託）が必要です。",
      "<strong>会社の所在地・連絡先が明確か</strong>：固定電話・住所・運営会社が確認できる業者を選びましょう。",
      "<strong>見積もりが明朗か</strong>：基本料金・作業費・処分費などの内訳を書面で提示してくれる業者は信頼できます。「一式」だけの見積もりは要注意。",
      "<strong>追加料金の条件を事前に確認</strong>：当日になって「階段料金」「分解費」などで大幅に上乗せされないよう、見積もり時に確認しておきます。",
    ],
    faqH: "よくある質問",
    faq: [
      {
        q: "不用品回収の費用相場はどれくらいですか？",
        a: "単品なら1点あたり2,000〜15,000円程度、量が多い場合はトラック積み放題プランで軽トラック10,000〜30,000円、2tトラック50,000〜90,000円程度が目安です。基本料金・出張費・階段料金などが加算される場合があります。",
      },
      {
        q: "自治体の粗大ごみ回収と不用品回収業者、どちらが安いですか？",
        a: "1〜2点だけなら自治体の粗大ごみ回収（1点数百円〜2,000円程度）の方が安いことが多いです。一方、量が多い・すぐに処分したい・運び出しが大変・家電や家具が混在する場合は、まとめて運び出してくれる不用品回収業者の方が手間とトータルコストで有利になることがあります。",
      },
      {
        q: "見積もりは無料ですか？",
        a: "多くの優良業者は出張見積もり・電話見積もりを無料で行っています。複数社から相見積もりを取り、料金の内訳（基本料金・作業費・処分費など）を明確に提示してくれる業者を選ぶのが安心です。",
      },
      {
        q: "「無料回収」をうたうトラックに頼んでも大丈夫ですか？",
        a: "注意が必要です。「無料」と言いながら積み込み後に高額請求するトラブルや、回収物の不法投棄が問題になっています。一般家庭の不用品回収には自治体の「一般廃棄物収集運搬業」の許可が必要です。許可の有無や所在地・連絡先が明確な業者を選びましょう。",
      },
      {
        q: "不用品回収を安くするコツはありますか？",
        a: "①複数社で相見積もりを取る、②売れるものはリサイクルショップやフリマアプリで先に売る、③自分で運べるものは自治体回収を併用する、④トラック積み放題プランにまとめる、⑤平日や閑散期を狙う、といった方法で費用を抑えられます。",
      },
    ],
    disclaimer:
      "本記事の費用はいずれも一般的な目安であり、実際の料金を保証するものではありません。正確な金額・サービス内容は各業者の見積もり・公式情報をご確認ください。",
    relatedTitle: "関連リンク",
    relatedGuide: "お役立ちガイド一覧",
    relatedCalendar: "ごみ収集日カレンダーで調べる",
  },

  en: {
    metaTitle: "Junk Removal Costs (2026 Guide): Price Estimates, Flat-Rate Truck Plans & Tips to Save",
    metaDesc: "A clear breakdown of junk removal costs by item and by flat-rate truck plan. How it differs from municipal oversized-garbage collection, 5 tips to cut costs, and how to avoid dishonest operators — written for first-timers.",
    ogTitle: "Junk Removal Costs (2026 Guide) | Gomi no Hi.com",
    ogDesc: "Price estimates by item and flat-rate truck plan, differences from municipal collection, money-saving tips, and how to spot bad operators.",
    bcHome: "Home",
    bcGuide: "Helpful Guides",
    bcCurrent: "Junk Removal Costs",
    h1: "Junk Removal Costs (2026 Guide)",
    updated: "Last updated: June 7, 2026",
    leadHtml:
      "Got unwanted items from a move, a big clean-out, or sorting an estate? For the question \"How much does a removal company actually cost?\", we've put together a clear guide to <strong>prices by item and by flat-rate truck plan</strong>. We also cover when to use this versus municipal oversized-garbage collection, tips to keep costs down, and how to avoid dishonest operators.",
    tocTitle: "In this article",
    toc: [
      "Junk removal costs (quick reference)",
      "What you're paying for — the cost breakdown",
      "Cost estimates by item",
      "Flat-rate truck plan prices",
      "How it differs from municipal collection",
      "5 tips to cut costs",
      "How to avoid dishonest operators",
      "FAQ",
    ],
    s1H: "Junk removal costs (quick reference)",
    s1PHtml:
      "Junk removal pricing falls broadly into two systems: <strong>per-item (single pieces)</strong> and <strong>flat-rate truck plans (bundled by volume)</strong>. Here are the rough guidelines.",
    s1Heads: ["How you book", "Estimated cost", "Best for"],
    s1Rows: [
      ["Per-item removal", "¥2,000–15,000 / item", "Only 1–3 items to dispose of"],
      ["Light-truck flat rate", "¥10,000–30,000", "Clearing out a single-person home"],
      ["1.5t-truck flat rate", "¥30,000–60,000", "About 1–2 rooms"],
      ["2t-truck flat rate", "¥50,000–90,000", "Houses / family households"],
    ],
    s1CalloutHtml:
      "<strong>* These figures are general estimates only.</strong> They vary by area, operator, and carry-out conditions (stairs, elevator availability, parking space, etc.). Always confirm the exact price with a quote.",
    s2H: "What you're paying for — the cost breakdown",
    s2P: "Junk removal pricing is mainly the sum of the following elements.",
    s2ListHtml: [
      "<strong>Base fee / call-out fee</strong>: around ¥3,000–5,000. Covers the operator's visit and paperwork.",
      "<strong>Labor</strong>: added according to the number of workers and time needed for carry-out.",
      "<strong>Disposal / recycling fees</strong>: the cost of disposing of each item. The \"four home appliances\" (AC, TV, refrigerator, washing machine) require a separate <strong>recycling fee</strong> by law.",
      "<strong>Optional charges</strong>: may be added for stairs (upper floors without an elevator), disassembly/removal, same-day service, late-night/early-morning service, and so on.",
    ],
    s3H: "Cost estimates by item",
    s3P: "Estimated costs for common items (a base/call-out fee may apply separately).",
    s3Heads: ["Item", "Estimated cost", "Notes"],
    s3Items: [
      ["Refrigerator (small)", "¥5,000–10,000", "Plus recycling fee from approx. ¥3,740"],
      ["Refrigerator (large)", "¥8,000–15,000", "Plus recycling fee from approx. ¥4,730"],
      ["Washing/drying machine", "¥4,000–8,000", "Plus recycling fee from approx. ¥2,530"],
      ["Air conditioner", "¥6,000–12,000", "May include removal/installation labor"],
      ["TV (small LCD)", "¥4,000–8,000", "Plus recycling fee from approx. ¥1,870"],
      ["Sofa (2-seater)", "¥4,000–8,000", "—"],
      ["Sofa (3-seater)", "¥6,000–12,000", "Surcharge for large / genuine leather"],
      ["Bed (single)", "¥5,000–10,000", "Mattress may be charged separately"],
      ["Mattress", "¥4,000–8,000", "—"],
      ["Dining table", "¥3,000–8,000", "Varies by size and material"],
      ["Dresser / cupboard (large)", "¥5,000–12,000", "—"],
      ["Microwave oven", "¥1,500–3,000", "—"],
      ["Bicycle", "¥2,000–4,000", "—"],
      ["Futon set (1)", "¥1,000–3,000", "—"],
    ],
    s3CalloutHtml:
      "The <strong>four home appliances (air conditioner, TV, refrigerator/freezer, washing machine/dryer)</strong> are covered by the Home Appliance Recycling Act and incur a <strong>recycling fee</strong> on top of the removal cost. The amount varies by manufacturer and size.",
    s4H: "Flat-rate truck plan prices",
    s4P: "When you have a lot to dispose of, a \"flat-rate truck plan\" — a fixed price for whatever fits in the truck — is good value. Rough guidelines by household size:",
    s4Heads: ["Plan", "Approx. capacity", "Estimated cost", "Who it's for"],
    s4Plans: [
      ["Light-truck flat rate", "Approx. 1–1.5 tatami mats", "¥10,000–30,000", "Single-person clean-out / a few items"],
      ["1.5t-truck flat rate", "Approx. 2–3 tatami mats", "¥30,000–60,000", "1–2 rooms / a couple's leftover move items"],
      ["2t-truck flat rate", "Approx. 3–4 tatami mats", "¥50,000–90,000", "Family households / large house clear-outs"],
    ],
    s4P2Html:
      "Note that even with a flat-rate plan, appliance recycling fees or surcharges for exceeding the set volume may apply. It's reassuring to confirm <strong>exactly what's included in the flat rate</strong> when you get your quote.",
    s5H: "How it differs from municipal collection (which is cheaper?)",
    s5P: "A \"junk removal company\" and \"municipal oversized-garbage collection\" differ in both price and convenience. Use whichever suits your situation.",
    s5Heads: ["Comparison", "Municipal oversized-garbage collection", "Junk removal company"],
    s5Rows: [
      ["Price", "Cheap (a few hundred to ~¥2,000 per item)", "Somewhat higher (depends on volume/conditions)"],
      ["Carry-out", "You take it to the collection point yourself", "Carried straight out of your room"],
      ["Speed", "By appointment; days to weeks of waiting", "Same-day service often possible"],
      ["Bulk disposal", "Item-count and size limits apply", "Large volumes handled all at once"],
    ],
    s5P2Html:
      "If you have <strong>1–2 items and can carry them yourself</strong>, municipal collection is cheaper. If you have <strong>a lot, are in a hurry, find carry-out difficult, or have a mix of furniture and appliances</strong>, a junk removal company often wins once you factor in the effort and total cost.",
    s5CalloutPre: "You can check garbage collection days for your area with our ",
    s5CalloutLink: "garbage collection calendar",
    s5CalloutPost: ". Note that oversized garbage requires advance application in many municipalities, so please check the official oversized-garbage page linked on each area page for collection days and fees.",
    s6H: "5 tips to cut junk removal costs",
    s6ListHtml: [
      "<strong>Get quotes from several companies</strong>: prices differ a lot for the same job, so comparing 2–3 companies is the basics.",
      "<strong>Sell what you can first</strong>: appliances, furniture, and brand-name items in good condition can be sold at recycle shops or flea-market apps — saving disposal costs or even turning a profit.",
      "<strong>Use municipal collection for what you can carry</strong>: put out small items and 1–2 oversized pieces yourself, and only hire a company for the hard-to-carry things to save money.",
      "<strong>Bundle into a flat-rate truck plan</strong>: with many items, a flat-rate plan is usually cheaper than per-item.",
      "<strong>Aim for weekdays / off-peak</strong>: moving season (March–April) and weekends get busy and pricey. If your schedule allows, weekdays are recommended.",
    ],
    s7H: "How to avoid dishonest operators",
    s7P: "Unfortunately, junk removal does have its troubles. To hire with confidence, check the following points.",
    s7ListHtml: [
      "<strong>Don't casually use trucks/flyers advertising \"free collection\"</strong>: there are cases of huge bills after loading, or illegally dumped items.",
      "<strong>Check that they're licensed</strong>: removing junk from ordinary households requires a municipal \"general waste collection and transport\" license (or contract).",
      "<strong>Is the company's address and contact clear?</strong> Choose operators with a verifiable landline, address, and operating company.",
      "<strong>Is the quote transparent?</strong> Operators who provide an itemized written quote (base fee, labor, disposal, etc.) are trustworthy. Be wary of a single \"lump-sum\" quote.",
      "<strong>Confirm the conditions for extra charges in advance</strong>: check at quote time so you aren't hit on the day with big add-ons like \"stair fees\" or \"disassembly fees.\"",
    ],
    faqH: "Frequently asked questions",
    faq: [
      {
        q: "What's the typical cost of junk removal?",
        a: "For single items, roughly ¥2,000–15,000 each. For larger volumes, a flat-rate truck plan runs about ¥10,000–30,000 for a light truck and ¥50,000–90,000 for a 2t truck. A base fee, call-out fee, stair fee, and similar may be added.",
      },
      {
        q: "Which is cheaper, municipal oversized-garbage collection or a junk removal company?",
        a: "For just 1–2 items, municipal oversized-garbage collection (a few hundred to ~¥2,000 per item) is usually cheaper. On the other hand, if you have a lot, want quick disposal, find carry-out hard, or have a mix of appliances and furniture, a junk removal company that carries everything out can win on effort and total cost.",
      },
      {
        q: "Are quotes free?",
        a: "Many reputable companies provide free on-site and phone quotes. It's safest to get quotes from several companies and choose one that clearly itemizes the cost (base fee, labor, disposal, etc.).",
      },
      {
        q: "Is it safe to use a truck advertising \"free collection\"?",
        a: "Caution is needed. There are problems with operators who say \"free\" but bill a large amount after loading, and with illegal dumping of collected items. Removing junk from ordinary households requires a municipal \"general waste collection and transport\" license. Choose operators whose license, address, and contact details are clear.",
      },
      {
        q: "Are there tips to make junk removal cheaper?",
        a: "You can cut costs by: (1) getting quotes from several companies, (2) selling sellable items at recycle shops or flea-market apps first, (3) using municipal collection for what you can carry yourself, (4) bundling into a flat-rate truck plan, and (5) aiming for weekdays or off-peak times.",
      },
    ],
    disclaimer:
      "All costs in this article are general estimates and do not guarantee actual prices. Please confirm exact amounts and service details with each company's quote and official information.",
    relatedTitle: "Related links",
    relatedGuide: "All helpful guides",
    relatedCalendar: "Look up the garbage collection calendar",
  },

  ko: {
    metaTitle: "폐기물 수거 비용 시세 【2026년판】 요금 기준·트럭 정액제·저렴하게 줄이는 요령",
    metaDesc: "폐기물 수거 비용 시세를 품목별·트럭 정액제 플랜별로 알기 쉽게 해설. 지자체 대형 쓰레기 수거와의 차이, 요금을 저렴하게 줄이는 5가지 요령, 악덕 업자를 피하는 주의점까지 초보자를 위해 정리했습니다.",
    ogTitle: "폐기물 수거 비용 시세 【2026년판】 | 고미노히닷컴",
    ogDesc: "품목별·트럭 정액제 요금 기준, 지자체 수거와의 차이, 저렴하게 줄이는 요령, 악덕 업자 구별법을 해설.",
    bcHome: "홈",
    bcGuide: "유용한 가이드",
    bcCurrent: "폐기물 수거 비용 시세",
    h1: "폐기물 수거 비용 시세 【2026년판】",
    updated: "최종 업데이트: 2026년 6월 7일",
    leadHtml:
      "이사나 대청소, 유품 정리 등에서 나온 폐기물. \"업자에게 맡기면 얼마나 들까?\"라는 의문에 대해 <strong>품목별·트럭 정액제 플랜별 비용 시세</strong>를 알기 쉽게 정리했습니다. 지자체 대형 쓰레기 수거와의 구분 사용, 요금을 저렴하게 줄이는 요령, 악덕 업자를 피하는 주의점도 해설합니다.",
    tocTitle: "이 글의 내용",
    toc: [
      "폐기물 수거 비용 시세（한눈 표）",
      "요금 내역 ― 무엇에 돈이 드나？",
      "품목별 비용 시세",
      "트럭 정액제 플랜 시세",
      "지자체 대형 쓰레기 수거와의 차이",
      "저렴하게 줄이는 5가지 요령",
      "악덕 업자를 피하는 주의점",
      "자주 묻는 질문",
    ],
    s1H: "폐기물 수거 비용 시세（한눈 표）",
    s1PHtml:
      "폐기물 수거 요금은 크게 「<strong>단품（품목별）</strong>」과 「<strong>트럭 정액제（양으로 묶음）</strong>」 두 가지 요금 체계가 있습니다. 대략적인 기준은 다음과 같습니다.",
    s1Heads: ["의뢰 방법", "비용 기준", "적합한 경우"],
    s1Rows: [
      ["단품 수거", "2,000〜15,000엔/점", "처분품이 1〜3점으로 적음"],
      ["경트럭 정액제", "10,000〜30,000엔", "1인 가구 정리"],
      ["1.5t 트럭 정액제", "30,000〜60,000엔", "1〜2개 방 분량"],
      ["2t 트럭 정액제", "50,000〜90,000엔", "단독주택·가족 세대"],
    ],
    s1CalloutHtml:
      "<strong>※ 금액은 어디까지나 일반적인 기준입니다.</strong> 지역·업자·반출 조건（계단 유무, 엘리베이터, 주차 공간 등）에 따라 달라집니다. 정확한 금액은 반드시 견적으로 확인하세요.",
    s2H: "요금 내역 ― 무엇에 돈이 드나？",
    s2P: "폐기물 수거 요금은 주로 다음 요소의 합계로 정해집니다.",
    s2ListHtml: [
      "<strong>기본 요금·출장비</strong>：3,000〜5,000엔 정도. 업자의 출장 및 절차 비용입니다.",
      "<strong>작업비（인건비）</strong>：반출 인원·시간에 따라 가산됩니다.",
      "<strong>처분비·재활용비</strong>：품목별 처분 비용. 에어컨·TV·냉장고·세탁기의 「가전 4품목」은 법으로 <strong>재활용 요금</strong>이 별도로 필요합니다.",
      "<strong>옵션 요금</strong>：계단 요금（엘리베이터 없는 고층）, 분해·탈거, 당일 대응, 심야·이른 아침 대응 등으로 가산되는 경우가 있습니다.",
    ],
    s3H: "품목별 비용 시세",
    s3P: "대표적인 품목의 비용 기준입니다（기본 요금·출장비가 별도로 드는 경우가 있습니다）.",
    s3Heads: ["품목", "비용 기준", "비고"],
    s3Items: [
      ["냉장고（소형）", "5,000〜10,000엔", "별도 재활용 요금 약 3,740엔〜"],
      ["냉장고（대형）", "8,000〜15,000엔", "별도 재활용 요금 약 4,730엔〜"],
      ["세탁기·건조기", "4,000〜8,000엔", "별도 재활용 요금 약 2,530엔〜"],
      ["에어컨", "6,000〜12,000엔", "탈거 공사비를 포함하는 경우 있음"],
      ["TV（LCD·소형）", "4,000〜8,000엔", "별도 재활용 요금 약 1,870엔〜"],
      ["소파（2인용）", "4,000〜8,000엔", "—"],
      ["소파（3인용）", "6,000〜12,000엔", "대형·천연 가죽은 할증"],
      ["침대（싱글）", "5,000〜10,000엔", "매트리스 별도인 경우 있음"],
      ["매트리스", "4,000〜8,000엔", "—"],
      ["다이닝 테이블", "3,000〜8,000엔", "크기·소재에 따라 변동"],
      ["옷장·찬장（대）", "5,000〜12,000엔", "—"],
      ["전자레인지", "1,500〜3,000엔", "—"],
      ["자전거", "2,000〜4,000엔", "—"],
      ["이불（1세트）", "1,000〜3,000엔", "—"],
    ],
    s3CalloutHtml:
      "<strong>가전 4품목（에어컨·TV·냉장고/냉동고·세탁기/건조기）</strong>은 「가전 재활용법」 대상으로, 수거비와 별도로 <strong>재활용 요금</strong>이 듭니다. 제조사·크기에 따라 금액이 다릅니다.",
    s4H: "트럭 정액제 플랜 시세",
    s4P: "처분품이 많을 때는 트럭에 실을 수 있는 만큼 정액으로 수거하는 「정액제 플랜」이 이득입니다. 세대 규모 기준은 다음과 같습니다.",
    s4Heads: ["플랜", "적재량 기준", "비용 기준", "이런 분에게"],
    s4Plans: [
      ["경트럭 정액제", "약 1〜1.5조다미 분량", "10,000〜30,000엔", "1인 가구 정리·소량 폐기물"],
      ["1.5t 트럭 정액제", "약 2〜3조다미 분량", "30,000〜60,000엔", "1〜2개 방 분량·커플 세대 이사 잔여물"],
      ["2t 트럭 정액제", "약 3〜4조다미 분량", "50,000〜90,000엔", "가족 세대·단독주택 대량 처분"],
    ],
    s4P2Html:
      "다만 「정액제」라도 가전 재활용 요금이나 규정량을 초과한 분의 추가 요금이 발생하는 경우가 있습니다. <strong>어디까지가 정액에 포함되는지</strong>를 견적 시 확인해 두면 안심입니다.",
    s5H: "지자체 대형 쓰레기 수거와의 차이（어느 쪽이 이득？）",
    s5P: "「폐기물 수거 업자」와 「지자체 대형 쓰레기 수거」는 요금도 편의성도 다릅니다. 상황에 따라 구분해 사용합시다.",
    s5Heads: ["비교 항목", "지자체 대형 쓰레기 수거", "폐기물 수거 업자"],
    s5Rows: [
      ["요금", "저렴（1점 수백 엔〜2,000엔 정도）", "다소 비쌈（양·조건에 따라）"],
      ["반출", "직접 집하장까지 배출", "방에서 그대로 반출"],
      ["대응 속도", "예약제로 며칠〜몇 주 대기", "당일 대응도 가능"],
      ["한꺼번에 처분", "점수·크기 제한 있음", "대량이라도 한꺼번에 OK"],
    ],
    s5P2Html:
      "<strong>1〜2점·직접 옮길 수 있다</strong>면 지자체 수거가 이득. <strong>양이 많음·급함·반출이 힘듦·가구 가전이 혼재</strong>한다면 수고를 포함한 총비용에서 폐기물 수거 업자가 유리해지기 쉽습니다.",
    s5CalloutPre: "거주 지역의 쓰레기 수거일은 본 사이트의 ",
    s5CalloutLink: "쓰레기 수거일 캘린더",
    s5CalloutPost: " 에서 확인할 수 있습니다. 또한 대형 쓰레기는 많은 지자체에서 사전 신청제이므로, 수거일·수수료는 각 지역 페이지에 게재된 지자체 공식 대형 쓰레기 안내 페이지를 확인하세요.",
    s6H: "폐기물 수거를 저렴하게 줄이는 5가지 요령",
    s6ListHtml: [
      "<strong>여러 업체에서 상호 견적을 받는다</strong>：같은 내용이라도 업체별 요금 차가 크므로 2〜3곳을 비교하는 것이 기본입니다.",
      "<strong>팔 수 있는 것은 먼저 판다</strong>：상태 좋은 가전·가구·명품은 중고숍이나 중고거래 앱에서 팔면 처분비가 절약될 뿐 아니라 오히려 이득이 되기도 합니다.",
      "<strong>직접 옮길 수 있는 것은 지자체 수거를 병행</strong>：소품이나 1〜2점의 대형 쓰레기는 지자체에 내고, 반출이 힘든 것만 업자에게 맡기면 절약됩니다.",
      "<strong>트럭 정액제로 묶는다</strong>：점수가 많다면 단품보다 정액제 플랜이 더 저렴해지기 쉽습니다.",
      "<strong>평일·비수기를 노린다</strong>：이사철（3〜4월）이나 주말은 붐비고 비싸지기 쉽습니다. 일정에 여유가 있다면 평일을 추천합니다.",
    ],
    s7H: "악덕 업자를 피하기 위한 주의점",
    s7P: "안타깝게도 폐기물 수거에는 문제도 있습니다. 안심하고 맡기기 위해 다음 사항을 확인합시다.",
    s7ListHtml: [
      "<strong>「무료 수거」를 내세우는 트럭·전단에 쉽게 의뢰하지 않는다</strong>：실은 뒤 고액을 청구하거나, 수거물을 불법 투기하는 사례가 있습니다.",
      "<strong>허가 유무를 확인한다</strong>：일반 가정의 폐기물 수거에는 지자체의 「일반 폐기물 수집 운반업」 허가（또는 위탁）가 필요합니다.",
      "<strong>회사 소재지·연락처가 명확한가</strong>：유선 전화·주소·운영 회사를 확인할 수 있는 업자를 선택합시다.",
      "<strong>견적이 명료한가</strong>：기본 요금·작업비·처분비 등의 내역을 서면으로 제시하는 업자는 신뢰할 수 있습니다. 「일괄」만 적힌 견적은 주의.",
      "<strong>추가 요금 조건을 사전에 확인</strong>：당일 「계단 요금」 「분해비」 등으로 크게 추가되지 않도록 견적 시 확인해 둡니다.",
    ],
    faqH: "자주 묻는 질문",
    faq: [
      {
        q: "폐기물 수거 비용 시세는 어느 정도인가요？",
        a: "단품이라면 1점당 2,000〜15,000엔 정도, 양이 많은 경우 트럭 정액제 플랜으로 경트럭 10,000〜30,000엔, 2t 트럭 50,000〜90,000엔 정도가 기준입니다. 기본 요금·출장비·계단 요금 등이 가산되는 경우가 있습니다.",
      },
      {
        q: "지자체 대형 쓰레기 수거와 폐기물 수거 업자 중 어느 쪽이 싼가요？",
        a: "1〜2점뿐이라면 지자체 대형 쓰레기 수거（1점 수백 엔〜2,000엔 정도）가 싼 경우가 많습니다. 반면 양이 많음·즉시 처분·반출이 힘듦·가전과 가구가 혼재하는 경우는, 한꺼번에 반출해 주는 폐기물 수거 업자가 수고와 총비용에서 유리할 수 있습니다.",
      },
      {
        q: "견적은 무료인가요？",
        a: "많은 우량 업자는 출장 견적·전화 견적을 무료로 진행합니다. 여러 업체에서 상호 견적을 받아, 요금 내역（기본 요금·작업비·처분비 등）을 명확히 제시하는 업자를 선택하는 것이 안심입니다.",
      },
      {
        q: "「무료 수거」를 내세우는 트럭에 맡겨도 괜찮나요？",
        a: "주의가 필요합니다. 「무료」라고 하면서 적재 후 고액을 청구하는 문제나, 수거물의 불법 투기가 문제되고 있습니다. 일반 가정의 폐기물 수거에는 지자체의 「일반 폐기물 수집 운반업」 허가가 필요합니다. 허가 유무나 소재지·연락처가 명확한 업자를 선택합시다.",
      },
      {
        q: "폐기물 수거를 싸게 하는 요령이 있나요？",
        a: "①여러 업체에서 상호 견적을 받기, ②팔 수 있는 것은 중고숍이나 중고거래 앱에서 먼저 팔기, ③직접 옮길 수 있는 것은 지자체 수거를 병행하기, ④트럭 정액제 플랜으로 묶기, ⑤평일이나 비수기를 노리기 등으로 비용을 줄일 수 있습니다.",
      },
    ],
    disclaimer:
      "본 글의 비용은 모두 일반적인 기준이며, 실제 요금을 보장하는 것은 아닙니다. 정확한 금액·서비스 내용은 각 업자의 견적·공식 정보를 확인하세요.",
    relatedTitle: "관련 링크",
    relatedGuide: "유용한 가이드 목록",
    relatedCalendar: "쓰레기 수거일 캘린더로 조회",
  },

  zh: {
    metaTitle: "上门回收费用行情【2026年版】价格参考·卡车装到满·省钱诀窍",
    metaDesc: "按品类、按卡车装到满套餐清晰解说上门回收费用行情。与政府大件垃圾回收的区别、降低费用的5个诀窍、避开不良业者的注意事项，专为初次使用者整理。",
    ogTitle: "上门回收费用行情【2026年版】 | 垃圾日.com",
    ogDesc: "按品类、按卡车装到满的价格参考，与政府回收的区别，省钱诀窍，以及识别不良业者的方法。",
    bcHome: "首页",
    bcGuide: "实用指南",
    bcCurrent: "上门回收费用行情",
    h1: "上门回收费用行情【2026年版】",
    updated: "最后更新：2026年6月7日",
    leadHtml:
      "搬家、大扫除、遗物整理等产生的废旧物品。针对「请业者上门要花多少钱？」这一疑问，我们清晰整理了<strong>按品类、按卡车装到满套餐的费用行情</strong>。还会解说与政府大件垃圾回收的区分使用、降低费用的诀窍，以及避开不良业者的注意事项。",
    tocTitle: "本文内容",
    toc: [
      "上门回收费用行情（速查表）",
      "费用构成 ― 钱花在哪里？",
      "按品类的费用行情",
      "卡车装到满套餐的行情",
      "与政府大件垃圾回收的区别",
      "降低费用的5个诀窍",
      "避开不良业者的注意事项",
      "常见问题",
    ],
    s1H: "上门回收费用行情（速查表）",
    s1PHtml:
      "上门回收的收费大致分为「<strong>单件（按品类）</strong>」和「<strong>卡车装到满（按量打包）</strong>」两种收费体系。大致参考如下。",
    s1Heads: ["委托方式", "费用参考", "适合的情况"],
    s1Rows: [
      ["单件回收", "2,000〜15,000日元/件", "需处理的物品仅1〜3件"],
      ["轻卡装到满", "10,000〜30,000日元", "单身住所的整理"],
      ["1.5t卡车装到满", "30,000〜60,000日元", "1〜2个房间的量"],
      ["2t卡车装到满", "50,000〜90,000日元", "独栋·家庭住户"],
    ],
    s1CalloutHtml:
      "<strong>※ 金额仅为一般参考。</strong>会因地区、业者、搬出条件（有无楼梯、电梯、停车位等）而变动。准确金额请务必通过报价确认。",
    s2H: "费用构成 ― 钱花在哪里？",
    s2P: "上门回收的费用主要由以下要素相加决定。",
    s2ListHtml: [
      "<strong>基本费·上门费</strong>：约3,000〜5,000日元。是业者上门及手续的费用。",
      "<strong>作业费（人工费）</strong>：按搬出的人数·时间加算。",
      "<strong>处理费·回收费</strong>：各品类处理所需的费用。空调·电视·冰箱·洗衣机的「家电四品类」依法须另付<strong>回收费</strong>。",
      "<strong>选项费用</strong>：楼梯费（无电梯的高层）、拆解·拆卸、当日上门、深夜·清晨上门等情况可能加算。",
    ],
    s3H: "按品类的费用行情",
    s3P: "常见品类的费用参考（基本费·上门费可能另计）。",
    s3Heads: ["品类", "费用参考", "备注"],
    s3Items: [
      ["冰箱（小型）", "5,000〜10,000日元", "另付回收费 约3,740日元〜"],
      ["冰箱（大型）", "8,000〜15,000日元", "另付回收费 约4,730日元〜"],
      ["洗衣机·烘干机", "4,000〜8,000日元", "另付回收费 约2,530日元〜"],
      ["空调", "6,000〜12,000日元", "可能含拆卸工程费"],
      ["电视（液晶·小）", "4,000〜8,000日元", "另付回收费 约1,870日元〜"],
      ["沙发（2人座）", "4,000〜8,000日元", "—"],
      ["沙发（3人座）", "6,000〜12,000日元", "大型·真皮加价"],
      ["床（单人）", "5,000〜10,000日元", "床垫可能另计"],
      ["床垫", "4,000〜8,000日元", "—"],
      ["餐桌", "3,000〜8,000日元", "按尺寸·材质变动"],
      ["衣柜·餐具柜（大）", "5,000〜12,000日元", "—"],
      ["微波炉", "1,500〜3,000日元", "—"],
      ["自行车", "2,000〜4,000日元", "—"],
      ["被褥（1套）", "1,000〜3,000日元", "—"],
    ],
    s3CalloutHtml:
      "<strong>家电四品类（空调·电视·冰箱/冷冻柜·洗衣机/烘干机）</strong>属于「家电回收法」对象，在回收费之外另需<strong>回收费</strong>。金额因厂商·尺寸而异。",
    s4H: "卡车装到满套餐的行情",
    s4P: "需处理的物品多时，按卡车能装的量定额回收的「装到满套餐」更划算。按家庭规模的参考如下。",
    s4Heads: ["套餐", "载量参考", "费用参考", "适合的人"],
    s4Plans: [
      ["轻卡装到满", "约1〜1.5榻榻米", "10,000〜30,000日元", "单身整理·少量废旧物品"],
      ["1.5t卡车装到满", "约2〜3榻榻米", "30,000〜60,000日元", "1〜2个房间·情侣住户的搬家遗留物"],
      ["2t卡车装到满", "约3〜4榻榻米", "50,000〜90,000日元", "家庭住户·独栋的大量处理"],
    ],
    s4P2Html:
      "另外即使是「装到满」，也可能产生家电回收费或超出规定量部分的追加费用。在报价时确认<strong>哪些包含在定额内</strong>会更安心。",
    s5H: "与政府大件垃圾回收的区别（哪个更划算？）",
    s5P: "「上门回收业者」与「政府大件垃圾回收」在费用与便利性上都不同。请按情况区分使用。",
    s5Heads: ["比较项目", "政府大件垃圾回收", "上门回收业者"],
    s5Rows: [
      ["费用", "便宜（每件数百日元〜2,000日元左右）", "稍贵（视量·条件而定）"],
      ["搬出", "自己搬到集中点", "直接从房间搬出"],
      ["响应速度", "预约制，需等数天〜数周", "也可当日上门"],
      ["一并处理", "有件数·尺寸限制", "大量也可一并OK"],
    ],
    s5P2Html:
      "若<strong>仅1〜2件·能自己搬运</strong>，政府回收更划算。若<strong>量大·赶时间·搬出吃力·家具家电混杂</strong>，把人力等计入后，上门回收业者在总成本上往往更有利。",
    s5CalloutPre: "您所在地区的垃圾收集日，可在本站的 ",
    s5CalloutLink: "垃圾收集日历",
    s5CalloutPost: " 查询。另外大件垃圾在许多行政区为事先申请制，收集日·手续费请查看各地区页面所载的行政区官方大件垃圾指南页面。",
    s6H: "降低上门回收费用的5个诀窍",
    s6ListHtml: [
      "<strong>向多家公司比价</strong>：即使内容相同，业者之间价差也很大，比较2〜3家是基本。",
      "<strong>能卖的先卖</strong>：状态良好的家电·家具·名牌品在二手店或二手交易App出售，不仅省下处理费，甚至能盈利。",
      "<strong>能自己搬的并用政府回收</strong>：小件或1〜2件大件垃圾自己拿去政府回收，只把难搬的委托业者，可省钱。",
      "<strong>打包成卡车装到满</strong>：件数多时，定额套餐通常比单件更便宜。",
      "<strong>瞄准工作日·淡季</strong>：搬家季（3〜4月）和周末拥挤且偏贵。日程宽裕的话推荐工作日。",
    ],
    s7H: "避开不良业者的注意事项",
    s7P: "遗憾的是，上门回收也存在纠纷。为安心委托，请确认以下几点。",
    s7ListHtml: [
      "<strong>不要轻易委托宣称「免费回收」的卡车·传单</strong>：存在装车后索要高额费用，或将回收物非法丢弃的情况。",
      "<strong>确认有无许可</strong>：一般家庭的上门回收，需要行政区的「一般废弃物收集运输业」许可（或委托）。",
      "<strong>公司所在地·联系方式是否明确</strong>：请选择可确认固定电话·地址·运营公司的业者。",
      "<strong>报价是否清晰</strong>：以书面列明基本费·作业费·处理费等明细的业者值得信赖。只写「一式」的报价需注意。",
      "<strong>事先确认追加费用的条件</strong>：在报价时确认，以免当天被「楼梯费」「拆解费」等大幅加价。",
    ],
    faqH: "常见问题",
    faq: [
      {
        q: "上门回收的费用行情大概是多少？",
        a: "单件每件约2,000〜15,000日元；量大时按卡车装到满套餐，轻卡约10,000〜30,000日元，2t卡车约50,000〜90,000日元。可能加算基本费·上门费·楼梯费等。",
      },
      {
        q: "政府大件垃圾回收和上门回收业者，哪个更便宜？",
        a: "仅1〜2件时，政府大件垃圾回收（每件数百日元〜2,000日元左右）通常更便宜。另一方面，若量大·想尽快处理·搬出吃力·家电与家具混杂，能一并搬出的上门回收业者在人力与总成本上可能更有利。",
      },
      {
        q: "报价免费吗？",
        a: "许多优质业者提供免费上门报价·电话报价。最好向多家公司比价，并选择能清晰列明费用明细（基本费·作业费·处理费等）的业者。",
      },
      {
        q: "委托宣称「免费回收」的卡车没问题吗？",
        a: "需要注意。存在口称「免费」却在装车后索要高额费用的纠纷，以及回收物被非法丢弃的问题。一般家庭的上门回收需要行政区的「一般废弃物收集运输业」许可。请选择许可有无、所在地·联系方式明确的业者。",
      },
      {
        q: "有让上门回收更便宜的诀窍吗？",
        a: "可通过以下方式降低费用：①向多家公司比价；②能卖的先在二手店或二手交易App卖掉；③能自己搬的并用政府回收；④打包成卡车装到满套餐；⑤瞄准工作日或淡季。",
      },
    ],
    disclaimer:
      "本文费用均为一般参考，不保证实际价格。准确金额·服务内容请以各业者的报价·官方信息为准。",
    relatedTitle: "相关链接",
    relatedGuide: "实用指南一览",
    relatedCalendar: "用垃圾收集日历查询",
  },
};

/* ──────────────────────────────────────────────
 * 粗大ごみの出し方（/Tokyo/[ward]/sodaigomi）
 *  テンプレート文のみ翻訳。自治体データ（定義・手数料・電話・注意点等）は日本語のまま。
 *  プレースホルダ: {ward} {definition} {methods} {tel} {telHours} {fee} {dropoff}
 * ────────────────────────────────────────────── */

/** "{ward}は…" のようなテンプレ文へ値を差し込む簡易ヘルパー */
export function fillTemplate(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
}

export type SodaigomiContent = {
  // メタ
  metaTitle: string;
  metaDesc: string;
  ogTitle: string;
  ogDesc: string;
  // パンくず
  bcHome: string;
  bcCurrent: string;
  // 見出し・リード
  h1: string;
  lead: string;
  // 概要テーブルのラベル
  tDefinition: string;
  tMethods: string;
  tTel: string;
  tFee: string;
  tDropoff: string;
  telHoursFallback: string;
  // 手順
  stepsTitle: string;
  step1Name: string;
  step1WithDef: string;
  step1NoDef: string;
  step2Name: string;
  step2WithMethods: string;
  step2TelSuffix: string;
  step2NoMethods: string;
  step3Name: string;
  step3WithFee: string;
  step3NoFee: string;
  step4Name: string;
  step4: string;
  // インターネット受付（リンク前後で分割）
  onlinePre: string;
  onlineLink: string;
  onlinePost: string;
  // 注意点
  noteH: string;
  // 運び出し
  carryH: string;
  carryP1: string;
  carryP2: string;
  // 公式リンク通知
  officialTitle: string;
  officialText: string;
  officialLink: string;
  // FAQ
  faqSectionH: string;
  faqTelQ: string;
  faqTelA1: string;
  faqTelAHours: string;
  faqTelAOnline: string;
  faqFeeQ: string;
  faqDefQ: string;
  faqDefA: string;
  // 関連リンク
  relatedTitle: string;
  relatedSchedule: string;
  relatedFunyohin: string;
  relatedCalendar: string;
  // JSON-LD
  howtoName: string;
  howtoDesc: string;
};

export const sodaigomiContent: Record<BagsUILocale, SodaigomiContent> = {
  ja: {
    metaTitle: "{ward}の粗大ごみの出し方・申し込み方法・手数料【2026年版】",
    metaDesc:
      "{ward}で粗大ごみを出す手順をわかりやすく解説。申し込み方法（電話・インターネット）、受付電話番号、手数料の目安、注意点、公式申し込みページへのリンクをまとめています。",
    ogTitle: "{ward}の粗大ごみの出し方・申し込み方法 | ゴミの日.com",
    ogDesc: "{ward}の粗大ごみの申し込み方法・手数料・注意点をまとめて解説。",
    bcHome: "ホーム",
    bcCurrent: "粗大ごみの出し方",
    h1: "{ward}の粗大ごみの出し方・申し込み方法",
    lead: "{ward}で粗大ごみを処分する手順を、申し込み方法・受付先・手数料・注意点に分けて解説します。粗大ごみは多くの場合、事前の申し込みが必要で、収集日カレンダーには表示されません。",
    tDefinition: "粗大ごみの定義",
    tMethods: "申し込み方法",
    tTel: "受付電話",
    tFee: "手数料",
    tDropoff: "持ち込み",
    telHoursFallback: "受付時間は公式ページを確認",
    stepsTitle: "{ward}の粗大ごみを出す手順",
    step1Name: "粗大ごみの大きさ・品目を確認する",
    step1WithDef: "{ward}の粗大ごみは{definition}が対象です。申し込み前に品目と大きさを確認します。",
    step1NoDef: "捨てたい品目が粗大ごみに該当するか、大きさを確認します。",
    step2Name: "受付センターに申し込む",
    step2WithMethods: "{methods}のいずれかで申し込みます。",
    step2TelSuffix: "電話の場合は {tel}（{telHours}）。",
    step2NoMethods: "電話またはインターネットで申し込みます。",
    step3Name: "粗大ごみ処理券を購入して貼る",
    step3WithFee: "案内された金額分の処理券を購入します。{fee}",
    step3NoFee: "案内された金額分の有料粗大ごみ処理券をコンビニ等で購入し、品目に貼ります。",
    step4Name: "収集日に出す",
    step4: "指定された収集日の朝、決められた場所に出します。{dropoff}",
    onlinePre: "インターネットでの申し込みは24時間受け付けている自治体が多く便利です。{ward}の",
    onlineLink: "粗大ごみインターネット受付",
    onlinePost: "から申し込めます。",
    noteH: "申し込み時の注意点",
    carryH: "粗大ごみは「運び出し」が必要です",
    carryP1: "{ward}の戸別収集では、原則として申込者が、建物の前や敷地内の決められた場所まで粗大ごみを自分で運び出しておく必要があります。収集スタッフが部屋の中まで取りに来てくれるわけではないため、タンスやベッド、ソファ、大型の家電などは、階段の上げ下ろしや搬出が思いのほか大きな負担になりがちです。とくにエレベーターのない集合住宅の上層階や、一人暮らし・ご高齢の方だけで運び出すのが難しいケースもあります。",
    carryP2: "どうしても自分で運び出せない場合や、収集日を待たずにまとめて早く片付けたい場合は、部屋の中からの搬出・運搬まで対応してくれる不用品回収業者を利用するという選択肢もあります。料金やサービス内容は業者によって幅があるため、いくつかの業者で見積もりを比べてから決めると安心です。",
    officialTitle: "最新情報は{ward}公式ページで確認",
    officialText: "料金・受付時間・申し込み方法は変更される場合があります。お申し込み前に必ず公式ページをご確認ください。",
    officialLink: "{ward}の粗大ごみ案内（公式）→",
    faqSectionH: "よくある質問",
    faqTelQ: "{ward}の粗大ごみの申し込み先（電話番号）は？",
    faqTelA1: "{ward}粗大ごみ受付センターの電話番号は {tel} です。",
    faqTelAHours: "受付時間は {telHours}。",
    faqTelAOnline: "インターネットでの申し込みも可能です。",
    faqFeeQ: "{ward}の粗大ごみの手数料はいくら？",
    faqDefQ: "{ward}で粗大ごみになるのはどんなもの？",
    faqDefA: "{ward}では、{definition}が粗大ごみの対象です。",
    relatedTitle: "関連リンク",
    relatedSchedule: "{ward}のごみ収集日一覧",
    relatedFunyohin: "不用品回収の費用相場を見る",
    relatedCalendar: "ごみ収集日カレンダーで調べる",
    howtoName: "{ward}の粗大ごみの出し方",
    howtoDesc: "{ward}で粗大ごみを申し込んで出すまでの手順",
  },
  en: {
    metaTitle: "How to Dispose of Oversized Garbage in {ward}: Application & Fees (2026)",
    metaDesc:
      "A clear guide to disposing of oversized garbage in {ward}. Covers how to apply (phone / internet), the reception phone number, fee guidelines, points to note, and a link to the official application page.",
    ogTitle: "How to Dispose of Oversized Garbage in {ward} | Gomi no Hi.com",
    ogDesc: "A summary of how to apply for oversized-garbage collection in {ward}, plus fees and key points.",
    bcHome: "Home",
    bcCurrent: "Oversized garbage disposal",
    h1: "How to Dispose of Oversized Garbage in {ward}",
    lead: "This guide explains how to dispose of oversized garbage in {ward}, broken down by application method, where to apply, fees, and points to note. In most cases oversized garbage requires advance application and does not appear on the collection calendar.",
    tDefinition: "Definition of oversized garbage",
    tMethods: "How to apply",
    tTel: "Reception phone",
    tFee: "Fee",
    tDropoff: "Drop-off",
    telHoursFallback: "see the official page for reception hours",
    stepsTitle: "Steps to put out oversized garbage in {ward}",
    step1Name: "Check the size and type of the oversized garbage",
    step1WithDef: "In {ward}, oversized garbage covers {definition}. Check the item and its size before applying.",
    step1NoDef: "Check whether the item you want to throw away counts as oversized garbage, and its size.",
    step2Name: "Apply to the reception center",
    step2WithMethods: "Apply by one of: {methods}.",
    step2TelSuffix: " By phone, call {tel} ({telHours}).",
    step2NoMethods: "Apply by phone or online.",
    step3Name: "Buy and attach the disposal ticket",
    step3WithFee: "Buy disposal tickets for the amount you're quoted. {fee}",
    step3NoFee: "Buy paid oversized-garbage disposal tickets for the quoted amount at a convenience store, etc., and attach them to the item.",
    step4Name: "Put it out on the collection day",
    step4: "On the morning of the designated collection day, put it out at the specified place. {dropoff}",
    onlinePre: "Online application is available 24 hours in many municipalities, which is convenient. You can apply via {ward}'s ",
    onlineLink: "oversized-garbage online reception",
    onlinePost: ".",
    noteH: "Points to note when applying",
    carryH: "Oversized garbage must be carried out yourself",
    carryP1: "With {ward}'s door-to-door collection, in principle the applicant must carry the oversized garbage out to a designated spot in front of the building or on the premises themselves. Collection staff do not come into your room to pick it up, so dressers, beds, sofas, and large appliances can be a surprisingly heavy burden to move up and down stairs and carry out. It can be especially difficult on upper floors of buildings without an elevator, or for people living alone or the elderly to carry out on their own.",
    carryP2: "If you simply cannot carry it out yourself, or want to clear everything quickly without waiting for the collection day, one option is to use a junk removal company that handles carry-out and transport from inside your room. Since prices and services vary widely between companies, it's reassuring to compare quotes from several before deciding.",
    officialTitle: "Check the latest info on {ward}'s official page",
    officialText: "Fees, reception hours, and application methods may change. Please be sure to check the official page before applying.",
    officialLink: "{ward}'s oversized-garbage guide (official) →",
    faqSectionH: "Frequently asked questions",
    faqTelQ: "What is the application contact (phone number) for oversized garbage in {ward}?",
    faqTelA1: "The phone number for the {ward} oversized-garbage reception center is {tel}. ",
    faqTelAHours: "Reception hours are {telHours}. ",
    faqTelAOnline: "Online application is also available.",
    faqFeeQ: "How much is the oversized-garbage fee in {ward}?",
    faqDefQ: "What counts as oversized garbage in {ward}?",
    faqDefA: "In {ward}, {definition} is treated as oversized garbage.",
    relatedTitle: "Related links",
    relatedSchedule: "Garbage collection schedule for {ward}",
    relatedFunyohin: "See junk removal cost guidelines",
    relatedCalendar: "Look it up on the garbage collection calendar",
    howtoName: "How to dispose of oversized garbage in {ward}",
    howtoDesc: "Steps from applying to putting out oversized garbage in {ward}",
  },
  ko: {
    metaTitle: "{ward} 대형 쓰레기 배출 방법·신청 방법·수수료【2026년판】",
    metaDesc:
      "{ward}에서 대형 쓰레기를 배출하는 절차를 알기 쉽게 해설. 신청 방법（전화·인터넷）, 접수 전화번호, 수수료 기준, 주의점, 공식 신청 페이지 링크를 정리했습니다.",
    ogTitle: "{ward} 대형 쓰레기 배출 방법·신청 방법 | 고미노히닷컴",
    ogDesc: "{ward}의 대형 쓰레기 신청 방법·수수료·주의점을 정리해 해설.",
    bcHome: "홈",
    bcCurrent: "대형 쓰레기 배출 방법",
    h1: "{ward} 대형 쓰레기 배출 방법·신청 방법",
    lead: "{ward}에서 대형 쓰레기를 처분하는 절차를 신청 방법·접수처·수수료·주의점으로 나누어 해설합니다. 대형 쓰레기는 많은 경우 사전 신청이 필요하며, 수거일 캘린더에는 표시되지 않습니다.",
    tDefinition: "대형 쓰레기의 정의",
    tMethods: "신청 방법",
    tTel: "접수 전화",
    tFee: "수수료",
    tDropoff: "반입",
    telHoursFallback: "접수 시간은 공식 페이지 확인",
    stepsTitle: "{ward} 대형 쓰레기 배출 절차",
    step1Name: "대형 쓰레기의 크기·품목을 확인한다",
    step1WithDef: "{ward}의 대형 쓰레기는 {definition}이(가) 대상입니다. 신청 전에 품목과 크기를 확인합니다.",
    step1NoDef: "버리고 싶은 품목이 대형 쓰레기에 해당하는지, 크기를 확인합니다.",
    step2Name: "접수 센터에 신청한다",
    step2WithMethods: "{methods} 중 하나로 신청합니다.",
    step2TelSuffix: " 전화의 경우 {tel}（{telHours}）.",
    step2NoMethods: "전화 또는 인터넷으로 신청합니다.",
    step3Name: "대형 쓰레기 처리권을 구입해 붙인다",
    step3WithFee: "안내받은 금액만큼의 처리권을 구입합니다. {fee}",
    step3NoFee: "안내받은 금액만큼의 유료 대형 쓰레기 처리권을 편의점 등에서 구입해 품목에 붙입니다.",
    step4Name: "수거일에 배출한다",
    step4: "지정된 수거일 아침, 정해진 장소에 배출합니다. {dropoff}",
    onlinePre: "인터넷 신청은 24시간 접수하는 지자체가 많아 편리합니다. {ward}의 ",
    onlineLink: "대형 쓰레기 인터넷 접수",
    onlinePost: "에서 신청할 수 있습니다.",
    noteH: "신청 시 주의점",
    carryH: "대형 쓰레기는 「반출」이 필요합니다",
    carryP1: "{ward}의 호별 수거에서는 원칙적으로 신청자가 건물 앞이나 부지 내 정해진 장소까지 대형 쓰레기를 직접 반출해 두어야 합니다. 수거 직원이 방 안까지 가지러 오는 것은 아니므로, 옷장이나 침대, 소파, 대형 가전 등은 계단 오르내림이나 반출이 생각보다 큰 부담이 되기 쉽습니다. 특히 엘리베이터 없는 공동주택 상층부나, 1인 가구·고령자만으로 반출하기 어려운 경우도 있습니다.",
    carryP2: "도저히 직접 반출할 수 없는 경우나, 수거일을 기다리지 않고 한꺼번에 빨리 정리하고 싶은 경우에는, 방 안에서의 반출·운반까지 대응해 주는 폐기물 수거 업자를 이용하는 선택지도 있습니다. 요금이나 서비스 내용은 업자에 따라 폭이 있으므로, 여러 업자의 견적을 비교한 후 결정하면 안심입니다.",
    officialTitle: "최신 정보는 {ward} 공식 페이지에서 확인",
    officialText: "요금·접수 시간·신청 방법은 변경될 수 있습니다. 신청 전에 반드시 공식 페이지를 확인하세요.",
    officialLink: "{ward}의 대형 쓰레기 안내（공식）→",
    faqSectionH: "자주 묻는 질문",
    faqTelQ: "{ward}의 대형 쓰레기 신청처（전화번호）는？",
    faqTelA1: "{ward} 대형 쓰레기 접수 센터의 전화번호는 {tel}입니다. ",
    faqTelAHours: "접수 시간은 {telHours}. ",
    faqTelAOnline: "인터넷으로도 신청할 수 있습니다.",
    faqFeeQ: "{ward}의 대형 쓰레기 수수료는 얼마？",
    faqDefQ: "{ward}에서 대형 쓰레기가 되는 것은 어떤 것？",
    faqDefA: "{ward}에서는 {definition}이(가) 대형 쓰레기 대상입니다.",
    relatedTitle: "관련 링크",
    relatedSchedule: "{ward}의 쓰레기 수거일 목록",
    relatedFunyohin: "폐기물 수거 비용 시세 보기",
    relatedCalendar: "쓰레기 수거일 캘린더로 조회",
    howtoName: "{ward} 대형 쓰레기 배출 방법",
    howtoDesc: "{ward}에서 대형 쓰레기를 신청해 배출하기까지의 절차",
  },
  zh: {
    metaTitle: "{ward}大件垃圾的丢弃方法·申请方法·手续费【2026年版】",
    metaDesc:
      "通俗易懂地解说在{ward}丢弃大件垃圾的步骤。整理了申请方法（电话·网络）、受理电话号码、手续费参考、注意事项以及官方申请页面的链接。",
    ogTitle: "{ward}大件垃圾的丢弃方法·申请方法 | 垃圾日.com",
    ogDesc: "汇总解说{ward}大件垃圾的申请方法·手续费·注意事项。",
    bcHome: "首页",
    bcCurrent: "大件垃圾丢弃方法",
    h1: "{ward}大件垃圾的丢弃方法·申请方法",
    lead: "本文按申请方法·受理处·手续费·注意事项，分别解说在{ward}处理大件垃圾的步骤。大件垃圾多数情况下需要事先申请，不会显示在收集日历上。",
    tDefinition: "大件垃圾的定义",
    tMethods: "申请方法",
    tTel: "受理电话",
    tFee: "手续费",
    tDropoff: "自行送交",
    telHoursFallback: "受理时间请查看官方页面",
    stepsTitle: "{ward}大件垃圾的丢弃步骤",
    step1Name: "确认大件垃圾的尺寸·品类",
    step1WithDef: "{ward}的大件垃圾以{definition}为对象。申请前请确认品类与尺寸。",
    step1NoDef: "确认想丢弃的品类是否属于大件垃圾及其尺寸。",
    step2Name: "向受理中心申请",
    step2WithMethods: "通过{methods}之一进行申请。",
    step2TelSuffix: "电话的话拨打 {tel}（{telHours}）。",
    step2NoMethods: "通过电话或网络申请。",
    step3Name: "购买并粘贴大件垃圾处理券",
    step3WithFee: "购买所告知金额的处理券。{fee}",
    step3NoFee: "在便利店等购买所告知金额的收费大件垃圾处理券，并粘贴在物品上。",
    step4Name: "在收集日丢出",
    step4: "在指定收集日的早晨，丢到指定地点。{dropoff}",
    onlinePre: "网络申请在许多行政区是24小时受理，很方便。可通过{ward}的",
    onlineLink: "大件垃圾网络受理",
    onlinePost: "进行申请。",
    noteH: "申请时的注意事项",
    carryH: "大件垃圾需要自行「搬出」",
    carryP1: "在{ward}的上门收集中，原则上申请人需要自行将大件垃圾搬到建筑物前或场地内的指定地点。收集人员不会进到房间里来取，因此衣柜、床、沙发、大型家电等，上下楼梯及搬出往往比想象中更费力。尤其在没有电梯的公寓高层，或仅由独居·高龄者搬出时会有困难。",
    carryP2: "如果实在无法自行搬出，或不想等到收集日而希望一并尽快清理，也可以选择利用可从房间内搬出·运输的上门回收业者。由于费用和服务内容因业者而异，比较几家业者的报价后再决定会更安心。",
    officialTitle: "最新信息请在{ward}官方页面确认",
    officialText: "费用·受理时间·申请方法可能变更。申请前请务必确认官方页面。",
    officialLink: "{ward}的大件垃圾指南（官方）→",
    faqSectionH: "常见问题",
    faqTelQ: "{ward}大件垃圾的申请处（电话号码）是？",
    faqTelA1: "{ward}大件垃圾受理中心的电话号码是 {tel}。",
    faqTelAHours: "受理时间为 {telHours}。",
    faqTelAOnline: "也可通过网络申请。",
    faqFeeQ: "{ward}的大件垃圾手续费是多少？",
    faqDefQ: "在{ward}什么算大件垃圾？",
    faqDefA: "在{ward}，{definition}属于大件垃圾对象。",
    relatedTitle: "相关链接",
    relatedSchedule: "{ward}的垃圾收集日一览",
    relatedFunyohin: "查看上门回收费用行情",
    relatedCalendar: "用垃圾收集日历查询",
    howtoName: "{ward}大件垃圾的丢弃方法",
    howtoDesc: "{ward}从申请到丢出大件垃圾的步骤",
  },
};
