"use client";

// 「今日/明日は何ゴミ」表示ブロック（静的エクスポート対応・2026-09）。
//
// 背景: このブロックは元々 areaPage.tsx がサーバーで getCurrentDayOfWeekJST()/getTodayGarbage() を
// 呼んで描画していたが、静的エクスポートではページはビルド時に1回だけHTML化されるため、
// サーバー側で計算すると「ビルド日の今日」のまま固定されてしまう。
// そのためこのブロックだけクライアントコンポーネントに切り出し、マウント後にブラウザの
// Date（getCurrentDayOfWeekJST は内部で Date.now() を使う）で今日/明日を算出する。
// マウント前（SSGされた初期HTML）は同じ枠の高さを持つ空要素を出し、レイアウトシフトを防ぐ。
//
// 曜日の表・FAQ・本文などSEOに関わる部分は areaPage.tsx 側のサーバー静的HTMLに残したまま。

import { useEffect, useState } from "react";
import { getTodayGarbage, getTomorrowGarbage } from "@/lib/garbageSchedule";
import type { AreaSchedule } from "@/lib/data";
import { getCurrentDayOfWeekJST } from "@/lib/date";

type Props = { schedule: AreaSchedule };

const DAY_NAMES = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];

export default function TodayTomorrow({ schedule }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // マウント前: レイアウトシフトを起こさないよう、従来と同じ枠だけ出す（文言は出さない）
    return (
      <>
        <div className="today-section" aria-hidden="true">
          <h2>&nbsp;</h2>
          <div className="today-items">
            <span className="today-badge" style={{ visibility: "hidden" }}>
              ✅
            </span>
          </div>
        </div>
        <div className="today-section" style={{ borderLeftColor: "#f59e0b" }} aria-hidden="true">
          <h2>&nbsp;</h2>
          <div className="today-items">
            <span className="today-badge" style={{ visibility: "hidden" }}>
              ⚠️
            </span>
          </div>
        </div>
      </>
    );
  }

  const todayItems = getTodayGarbage(schedule);
  const tomorrowItems = getTomorrowGarbage(schedule);
  const currentDayJST = getCurrentDayOfWeekJST();
  const todayName = DAY_NAMES[currentDayJST];
  const tomorrowName = DAY_NAMES[(currentDayJST + 1) % 7];

  return (
    <>
      <div className="today-section">
        <h2>📅 今日（{todayName}）のごみ</h2>
        <div className="today-items">
          {todayItems.length > 0 ? (
            todayItems.map((item) => (
              <span key={item} className="today-badge">✅ {item}</span>
            ))
          ) : (
            <span className="today-none">収集なし</span>
          )}
        </div>
      </div>
      <div className="today-section" style={{ borderLeftColor: "#f59e0b" }}>
        <h2>📅 明日（{tomorrowName}）のごみ</h2>
        <div className="today-items">
          {tomorrowItems.length > 0 ? (
            tomorrowItems.map((item) => (
              <span key={item} className="today-badge" style={{ background: "#fffbeb", color: "#92400e" }}>
                ⚠️ {item}
              </span>
            ))
          ) : (
            <span className="today-none">収集なし</span>
          )}
        </div>
      </div>
    </>
  );
}
