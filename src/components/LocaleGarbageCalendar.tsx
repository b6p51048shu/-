"use client";

import { useState, useMemo } from "react";
import type { AreaSchedule, ParsedSchedule } from "@/lib/data";
import { getT } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

type Props = { schedule: AreaSchedule; locale: Locale };

type GarbageEvent = { label: string; color: string; bg: string };
type GarbageKey = "burnable" | "unburnable" | "recyclable" | "plastic" | "pet";

function makeGarbageDefaults(locale: Locale) {
  const t = getT(locale);
  return [
    { key: "burnable" as GarbageKey,   label: t.schedule.burnable,   short: t.schedule.burnable.slice(0,4),   color: "#fff", bg: "#ef4444" },
    { key: "unburnable" as GarbageKey, label: t.schedule.unburnable, short: t.schedule.unburnable.slice(0,4), color: "#fff", bg: "#3b82f6" },
    { key: "recyclable" as GarbageKey, label: t.schedule.recyclable, short: t.schedule.recyclable.slice(0,4), color: "#fff", bg: "#10b981" },
    { key: "plastic" as GarbageKey,    label: t.schedule.plastic,    short: t.schedule.plastic.slice(0,4),    color: "#fff", bg: "#8b5cf6" },
    { key: "pet" as GarbageKey,        label: t.schedule.pet,        short: t.schedule.pet.slice(0,4),        color: "#fff", bg: "#f59e0b" },
  ];
}

function getGarbageTypes(schedule: AreaSchedule, locale: Locale) {
  return makeGarbageDefaults(locale).map((def) => {
    const labelKey = def.key as keyof NonNullable<AreaSchedule["labels"]>;
    const customLabel = schedule.labels?.[labelKey];
    if (!customLabel) return def;
    const short = customLabel.length <= 4 ? customLabel : customLabel.slice(0, 4);
    return { ...def, label: customLabel, short };
  });
}

function splitBadgeLabel(label: string): string[] {
  const stripped = label.replace(/（[^）]*）|\([^)]*\)/g, "").trim();
  return stripped.split("・").filter(Boolean);
}

function getCollectionDates(parsed: ParsedSchedule | undefined, year: number, month: number): number[] {
  if (!parsed || parsed.type === "unknown") return [];
  const daysInMonth = new Date(year, month, 0).getDate();
  const dates: number[] = [];

  if (parsed.type === "weekly") {
    const daySet = new Set(parsed.days);
    for (let d = 1; d <= daysInMonth; d++) {
      if (daySet.has(new Date(year, month - 1, d).getDay())) dates.push(d);
    }
  } else if (parsed.type === "biweekly" && parsed.anchor) {
    // 真の隔週: 基準日(anchor)からの14日周期で該当曜日を追加
    const daySet = new Set(parsed.days);
    const anchor = new Date(`${parsed.anchor}T00:00:00`);
    for (let d = 1; d <= daysInMonth; d++) {
      const cur = new Date(year, month - 1, d);
      if (!daySet.has(cur.getDay())) continue;
      const diffDays = Math.round((cur.getTime() - anchor.getTime()) / 86400000);
      if (((diffDays % 14) + 14) % 14 === 0) dates.push(d);
    }
  } else if (parsed.type === "nth" || parsed.type === "biweekly") {
    const daySet = new Set(parsed.days);
    const weekSet = new Set(parsed.weeks);
    const countPerDay: Record<number, number> = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = new Date(year, month - 1, d).getDay();
      if (!daySet.has(dow)) continue;
      countPerDay[dow] = (countPerDay[dow] ?? 0) + 1;
      if (weekSet.has(countPerDay[dow])) dates.push(d);
    }
  }

  return dates.sort((a, b) => a - b);
}

export default function LocaleGarbageCalendar({ schedule, locale }: Props) {
  const t = getT(locale);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const calendarData = useMemo(() => {
    const map: Record<number, GarbageEvent[]> = {};
    for (const { key, label, color, bg } of getGarbageTypes(schedule, locale)) {
      const parsed = schedule[`${key}_parsed` as keyof AreaSchedule] as ParsedSchedule | undefined;
      if (!parsed) continue;
      const dates = getCollectionDates(parsed, year, month);
      for (const d of dates) {
        if (!map[d]) map[d] = [];
        map[d].push({ label, color, bg });
      }
    }
    return map;
  }, [year, month, schedule, locale]);

  const firstDow = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const startOffset = (firstDow + 6) % 7;

  const prevMonth = () => { if (month === 1) { setYear(y => y - 1); setMonth(12); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 12) { setYear(y => y + 1); setMonth(1); } else setMonth(m => m + 1); };
  const isToday = (d: number) => d === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear();

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
        {t.days.calHeader.map((d: string, i: number) => (
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

      <div className="cal-legend">
        {getGarbageTypes(schedule, locale).filter(({ key }) => schedule[key as keyof AreaSchedule]).map(({ label, short, bg }) => (
          <span key={label} className="cal-legend-item">
            <span className="cal-legend-badge" style={{ background: bg, color: "#fff" }}>{short}</span>
            <span style={{ fontSize: ".8rem", color: "var(--gray-600)" }}>{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
