"use client";

import type { AreaSchedule } from "@/lib/data";

type Props = { wardName: string; areaName: string; schedule: AreaSchedule };

const DAY_MAP: Record<string, number> = {
  月: 1, 火: 2, 水: 3, 木: 4, 金: 5, 土: 6, 日: 0,
  月曜日: 1, 火曜日: 2, 水曜日: 3, 木曜日: 4, 金曜日: 5, 土曜日: 6, 日曜日: 0,
};

function extractFirstDay(str: string): number | null {
  const chars = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日", "月", "火", "水", "木", "金", "土", "日"];
  for (const c of chars) {
    if (str.includes(c)) return DAY_MAP[c];
  }
  return null;
}

function nextWeekday(targetDay: number): Date {
  const d = new Date();
  const diff = (targetDay - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + diff);
  d.setHours(8, 0, 0, 0);
  return d;
}

function formatICSDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export default function IcsButton({ wardName, areaName, schedule }: Props) {
  const handleDownload = () => {
    const events: string[] = [];
    const entries: { label: string; value: string }[] = [
      { label: "燃やすごみ収集", value: schedule.burnable },
      { label: "燃やさないごみ収集", value: schedule.unburnable ?? "" },
      { label: "資源ごみ収集", value: schedule.recyclable ?? "" },
      { label: "プラスチック収集", value: schedule.plastic ?? "" },
    ].filter((e) => e.value);

    for (const { label, value } of entries) {
      const day = extractFirstDay(value);
      if (day === null) continue;
      const start = nextWeekday(day);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      events.push(
        [
          "BEGIN:VEVENT",
          `SUMMARY:${label}（${areaName}）`,
          `DTSTART:${formatICSDate(start)}`,
          `DTEND:${formatICSDate(end)}`,
          `DESCRIPTION:${wardName} ${areaName}の${label}\\n収集日: ${value}`,
          `RRULE:FREQ=WEEKLY`,
          "END:VEVENT",
        ].join("\r\n")
      );
    }

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//ゴミカレ//GOMICALE//JA",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      ...events,
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gomicale_${wardName}_${areaName}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button className="ics-btn" onClick={handleDownload}>
      📅 カレンダーに追加（.ics）
    </button>
  );
}
