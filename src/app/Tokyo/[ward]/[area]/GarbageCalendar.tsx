"use client";

import { useState, useMemo } from "react";
import type { AreaSchedule } from "@/lib/data";

type Props = { wardName: string; areaName: string; schedule: AreaSchedule };

type GarbageEvent = { label: string; color: string; bg: string };

const GARBAGE_DEFAULTS: { key: keyof AreaSchedule; label: string; short: string; color: string; bg: string }[] = [
  { key: "burnable",   label: "可燃ごみ",    short: "可燃",  color: "#fff", bg: "#ef4444" },
  { key: "unburnable", label: "不燃ごみ",    short: "不燃",  color: "#fff", bg: "#3b82f6" },
  { key: "recyclable", label: "資源ごみ",    short: "資源",  color: "#fff", bg: "#10b981" },
  { key: "plastic",    label: "プラスチック", short: "プラ",  color: "#fff", bg: "#8b5cf6" },
  { key: "pet",        label: "ペットボトル", short: "ペット", color: "#fff", bg: "#f59e0b" },
];

/** schedule.labels があれば上書き、なければデフォルトを使う */
function getGarbageTypes(schedule: AreaSchedule) {
  return GARBAGE_DEFAULTS.map((def) => {
    const labelKey = def.key as keyof NonNullable<AreaSchedule["labels"]>;
    const customLabel = schedule.labels?.[labelKey];
    if (!customLabel) return def;
    // 短縮名: 最大4文字（長い場合は先頭4文字）
    const short = customLabel.length <= 4 ? customLabel : customLabel.slice(0, 4);
    return { ...def, label: customLabel, short };
  });
}

const DAY_CHAR: Record<string, number> = {
  月: 1, 火: 2, 水: 3, 木: 4, 金: 5, 土: 6, 日: 0,
  月曜: 1, 火曜: 2, 水曜: 3, 木曜: 4, 金曜: 5, 土曜: 6, 日曜: 0,
  月曜日: 1, 火曜日: 2, 水曜日: 3, 木曜日: 4, 金曜日: 5, 土曜日: 6, 日曜日: 0,
};

const WEEK_NUM: Record<string, number[]> = {
  "第１": [1], "第1": [1], "１": [1], "1": [1],
  "第２": [2], "第2": [2], "２": [2], "2": [2],
  "第３": [3], "第3": [3], "３": [3], "3": [3],
  "第４": [4], "第4": [4], "４": [4], "4": [4],
  "第５": [5], "第5": [5], "５": [5], "5": [5],
};

const FULL_TO_HALF: Record<string, string> = {
  "１":"1","２":"2","３":"3","４":"4","５":"5",
};

function toHalf(s: string): string {
  return s.replace(/[１２３４５]/g, (c) => FULL_TO_HALF[c] ?? c);
}

/** バッジ表示用: 括弧内を除去して・で分割 */
function splitBadgeLabel(label: string): string[] {
  const stripped = label.replace(/（[^）]*）|\([^)]*\)/g, "").trim();
  return stripped.split("・").filter(Boolean);
}

/** スケジュール文字列を正規化（複合語除去 → 「〇曜日」→「〇」） */
function normalize(text: string): string {
  return text
    .replace(/同日|翌日|当日|祝日|休日|平日|毎日|前日|本日|昨日|収集日|回収日/g, "")
    .replace(/([月火水木金土日])曜日/g, "$1")
    .replace(/([月火水木金土日])曜/g, "$1");
}

/** 週番号をすべて抽出（複数形式に対応）
 *  - 「第1火・第3火」: 各"第N"を個別にマッチ → [1, 3]
 *  - 「第1・3月」: 最初の"第N"＋後続"・M" → [1, 3]
 *  - 「隔週」: 第1・3週として近似 → [1, 3]
 */
function extractNths(text: string): number[] {
  const nths = new Set<number>();
  // 「隔週」→ 第1・3週として近似表示（正確な開始週は自治体により異なる）
  if (text.includes('隔週')) {
    nths.add(1);
    nths.add(3);
    return [...nths];
  }
  // 「第N」をすべて収集（「第1火・第3火」形式）
  for (const m of text.matchAll(/第([１２３４５1-5])/g)) {
    nths.add(parseInt(toHalf(m[1]), 10));
  }
  // 「第N・M」の「・M」部分も収集（「第1・3月」形式）
  for (const m of text.matchAll(/第[１２３４５1-5]((?:[・、,，][１２３４５1-5])+)/g)) {
    for (const n of m[1].matchAll(/[・、,，]([１２３４５1-5])/g)) {
      nths.add(parseInt(toHalf(n[1]), 10));
    }
  }
  return [...nths];
}

/** スケジュール文字列を解析して「その月の収集日リスト」を返す */
function parseSchedule(text: string, year: number, month: number): number[] {
  if (!text) return [];
  const daysInMonth = new Date(year, month, 0).getDate();
  const dates: number[] = [];

  // 正規化: 「火曜日」→「火」「毎週」→「」
  const norm = normalize(text).replace(/毎週/g, "");

  // 「第N・第M〇」パターン（月N回収集）
  // 対応形式:
  //   末尾形式: 「第1火・第3火」「第2・4水」→ 曜日が末尾
  //   先頭形式: 「木（第1・3週）」「水（第2・4週）」→ 曜日が先頭
  const nthSegments = norm.split(/[、,，\s]+/);
  for (const seg of nthSegments) {
    const dayMatch = seg.match(/([月火水木金土日])$/) ?? seg.match(/^([月火水木金土日])/);
    if (!dayMatch) continue;
    const dow = DAY_CHAR[dayMatch[1]];
    if (dow === undefined) continue;
    const nths = extractNths(seg);
    if (nths.length === 0) continue;
    let count = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      if (new Date(year, month - 1, d).getDay() === dow) {
        count++;
        if (nths.includes(count)) dates.push(d);
      }
    }
  }

  // 第N系がなければ毎週パターン
  if (!norm.includes("第")) {
    const dayChars = ["月","火","水","木","金","土","日"] as const;
    for (const char of dayChars) {
      // 単体の曜日文字のみ：「〇」が他の曜日文字に隣接していないかチェック
      const re = new RegExp(`(?<![月火水木金土日])${char}(?![月火水木金土日])`, "g");
      if (re.test(norm)) {
        const dow = DAY_CHAR[char];
        for (let d = 1; d <= daysInMonth; d++) {
          if (new Date(year, month - 1, d).getDay() === dow) dates.push(d);
        }
      }
    }
    // 上でマッチしない場合（「月・木」のように・区切り）
    if (dates.length === 0) {
      for (const char of dayChars) {
        if (norm.includes(char)) {
          const dow = DAY_CHAR[char];
          for (let d = 1; d <= daysInMonth; d++) {
            if (new Date(year, month - 1, d).getDay() === dow) dates.push(d);
          }
        }
      }
    }
  }

  return [...new Set(dates)].sort((a, b) => a - b);
}

export default function GarbageCalendar({ wardName, areaName, schedule }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const calendarData = useMemo(() => {
    const map: Record<number, GarbageEvent[]> = {};
    for (const { key, label: _label, short: _short, color, bg } of getGarbageTypes(schedule)) {
      const val = schedule[key] as string | undefined;
      if (!val) continue;
      const dates = parseSchedule(val, year, month);
      for (const d of dates) {
        if (!map[d]) map[d] = [];
        map[d].push({ label: _label, color, bg });
      }
    }
    return map;
  }, [year, month, schedule]);

  const firstDow = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate();
  // カレンダーは月曜始まり: 月=0, 火=1, ..., 日=6
  const startOffset = (firstDow + 6) % 7;

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear();

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="calendar-wrap">
      <div className="calendar-header">
        <button className="cal-nav" onClick={prevMonth} aria-label="前月">‹</button>
        <h2 className="cal-title">{year}年{month}月</h2>
        <button className="cal-nav" onClick={nextMonth} aria-label="翌月">›</button>
      </div>

      <div className="calendar-grid">
        {["月","火","水","木","金","土","日"].map((d, i) => (
          <div key={d} className={`cal-dow ${i === 5 ? "sat" : i === 6 ? "sun" : ""}`}>{d}</div>
        ))}
        {cells.map((d, i) => {
          const col = i % 7;
          const events = d ? (calendarData[d] ?? []) : [];
          return (
            <div
              key={i}
              className={[
                "cal-cell",
                !d ? "empty" : "",
                d && isToday(d) ? "today" : "",
                col === 5 ? "sat" : col === 6 ? "sun" : "",
              ].join(" ")}
            >
              {d && (
                <>
                  <span className="cal-day">{d}</span>
                  <div className="cal-events">
                    {events.flatMap((ev, j) =>
                      splitBadgeLabel(ev.label).map((part, k) => (
                        <span key={`${j}-${k}`} className="cal-badge" style={{ background: ev.bg, color: ev.color }}>
                          {part}
                        </span>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="cal-legend">
        {getGarbageTypes(schedule).filter(({ key }) => schedule[key as keyof AreaSchedule]).map(({ label, short, bg }) => (
          <span key={label} className="cal-legend-item">
            <span className="cal-legend-badge" style={{ background: bg, color: "#fff" }}>{short}</span>
            <span style={{ fontSize: ".8rem", color: "var(--gray-600)" }}>{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
