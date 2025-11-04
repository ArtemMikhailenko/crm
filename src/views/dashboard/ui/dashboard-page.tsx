"use client";

import { Calendar, ChevronDown, Ellipsis, Download } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

type StatusColor = "coral" | "purple" | "blue" | "green";

export function DashboardPage() {
  const rows: { name: string; order: string; status: { label: string; color: StatusColor }; date: string }[] = [
    { name: "Просчет", order: "1865682", status: { label: "Pause", color: "coral" }, date: "10.10.2025" },
    { name: "Просчет", order: "1865682", status: { label: "Planning", color: "purple" }, date: "10.10.2025" },
    { name: "Просчет", order: "1865682", status: { label: "Review", color: "blue" }, date: "10.10.2025" },
    { name: "Просчет", order: "1865682", status: { label: "Process", color: "green" }, date: "10.10.2025" },
    { name: "Просчет", order: "1865682", status: { label: "Planning", color: "purple" }, date: "10.10.2025" },
  ];

  const payments = [
    { label: "Lorem ipsum", color: "bg-emerald-400", percent: 59 },
    { label: "Lorem ipsum", color: "bg-purple-400", percent: 59 },
    { label: "Lorem ipsum", color: "bg-indigo-400", percent: 59 },
    { label: "Lorem ipsum", color: "bg-slate-400", percent: 59 },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
        {/* Page header with actions */}
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Statistics and achievements</h1>
          <div className="flex items-center gap-4">
            <div className="hidden text-sm text-muted-foreground md:block">Select a date</div>
            <button className="flex items-center gap-2 rounded-full border border-[#ccd5dc] bg-white px-4 py-2 text-sm">
              <Calendar className="h-4 w-4" /> Nov 2025
              <ChevronDown className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-2 rounded-full border border-[#ccd5dc] bg-white px-4 py-2 text-sm">
              <Download className="h-4 w-4" /> Export
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Row 1 */}
        <div className="grid gap-6 xl:grid-cols-7">
          {/* Current challenges */}
          <Card className="xl:col-span-4 shadow-[0_5px_25px_rgba(107,114,128,0.2)]">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-[20px]">Current challenges</CardTitle>
              <button className="h-9 w-9 rounded-full border border-[#aab8c2] text-slate-600 flex items-center justify-center">
                <Ellipsis className="mt-[2px] h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Table header */}
              <div className="grid grid-cols-4 text-sm text-[#aab8c2]">
                <div>НАЗВАНИЕ</div>
                <div>№ ЗАКАЗА</div>
                <div>СТАТУС</div>
                <div>ДАТА</div>
              </div>
              <div className="space-y-3">
                {rows.map((r, i) => (
                  <div key={i} className="grid grid-cols-4 items-center text-sm">
                    <div className="text-slate-800">{r.name}</div>
                    <div className="text-slate-800">{r.order}</div>
                    <div>
                      <StatusBadge label={r.status.label} color={r.status.color} />
                    </div>
                    <div className="text-slate-800">{r.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reciprocal payments */}
          <Card className="xl:col-span-3 shadow-[0_5px_25px_rgba(107,114,128,0.2)]">
            <CardHeader className="flex-row items-start justify-between">
              <CardTitle className="text-[20px]">Reciprocal payments</CardTitle>
              <div className="text-xs text-emerald-500">↑ 3,0% vs last month</div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {/* Left list */}
                <div className="space-y-3">
                  {payments.map((p, i) => (
                    <div key={i} className="space-y-1.5">
                      {/* Header: bullet + title */}
                      <div className="flex items-center gap-2">
                        <span className={`h-3 w-3 rounded-full ${p.color}`} />
                        <span className="text-[14px] leading-none text-[#2d3145]">{p.label}</span>
                      </div>
                      {/* Content: percent + description */}
                      <div className="flex items-center gap-2">
                        <span className="text-[24px] leading-[1.4] font-bold text-[#2d3145]">{p.percent}%</span>
                        <span className="text-[12px] leading-none text-[#81838f]">Lorem ipsum</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Donut chart with gaps and rounded caps */}
                <div className="flex items-center justify-center">
                  <DonutChart
                    size={260}
                    thickness={32}
                    gap={10}
                    data={[
                      { value: 64, color: "#79c3b3" }, // teal
                      { value: 22, color: "#9b60e5" }, // purple
                      { value: 7, color: "#e5d2f5" },  // light purple
                      { value: 7, color: "#e9eef2" },  // light grey
                    ]}
                    center={{
                      value: "53",
                      label: "Активные заказы",
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 2 */}
        <div className="grid gap-6 xl:grid-cols-7">
          {/* Weekly Revenue */}
          <Card className="xl:col-span-5 shadow-[0_5px_25px_rgba(107,114,128,0.2)]">
            <CardHeader>
              <CardTitle className="text-[20px]">Weekly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Legend */}
              <div className="mb-2 flex gap-10">
                {["Lorem ipsum", "Lorem ipsum", "Lorem ipsum"].map((l, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <span
                      className={
                        "h-2.5 w-2.5 rounded-full " +
                        (i === 0 ? "bg-purple-400" : i === 1 ? "bg-indigo-400" : "bg-emerald-400")
                      }
                    />
                    <span>{l}</span>
                    <span className="ml-3 text-2xl font-bold text-slate-900">40</span>
                    <span className="ml-2 text-xs text-emerald-500">↑ 3,0% vs last month</span>
                  </div>
                ))}
              </div>
              {/* Bars placeholder */}
              <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-3">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="flex h-48 w-full flex-col justify-end gap-2">
                    <div className="mx-auto h-6 w-14 rounded-xl bg-purple-200" />
                    <div className="mx-auto h-20 w-14 rounded-xl bg-purple-500" />
                    <div className="mx-auto h-24 w-14 rounded-xl bg-emerald-400" />
                  </div>
                ))}
              </div>
              {/* Axis labels */}
              <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                <span>Nov 1</span>
                <span>Nov 15</span>
                <span>Nov 30</span>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="xl:col-span-2 shadow-[0_5px_25px_rgba(107,114,128,0.2)]">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-[20px]">Schedule</CardTitle>
              <div className="flex items-center gap-2 rounded-full border border-[#ccd5dc] px-4 py-2 text-sm">
                October 2025 <ChevronDown className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <SimpleCalendar />
            </CardContent>
          </Card>
        </div>
      </div>
  );
}

function StatusBadge({ label, color }: { label: string; color: StatusColor }) {
  const styles =
    color === "coral"
      ? "bg-[#fce7e2] text-[#ee896d]"
      : color === "purple"
        ? "bg-[#eee1f8] text-[#a868de]"
        : color === "blue"
          ? "bg-[#d0dbfb] text-[#164cec]"
          : "bg-[#e4f3f0] text-[#79c3b3]";
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
}

function SimpleCalendar() {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const numbers = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-[#abadb5]">
        {days.map(d => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {numbers.map(n => (
          <div
            key={n}
            className="flex h-8 items-center justify-center rounded-full border border-[#eff2f5] text-xs text-slate-700"
          >
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

type DonutDatum = { value: number; color: string };
function DonutChart({
  size = 250,
  thickness = 24,
  gap = 6,
  data,
  center,
}: {
  size?: number;
  thickness?: number;
  gap?: number; // gap in degrees between segments
  data: DonutDatum[];
  center?: { value: string; label?: string };
}) {
  const radius = size / 2;
  const inner = radius - thickness;
  const circumference = 2 * Math.PI * ((inner + radius) / 2);
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  // Convert values to angles, subtracting a small gap per segment
  const gapDeg = Math.max(0, Math.min(gap, 20));
  const segments = data.map(d => ({ ...d, angle: (d.value / total) * 360 }));

  let currentAngle = -90; // start at top

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer subtle ring */}
      <svg width={size} height={size} className="absolute inset-0">
        <circle
          cx={radius}
          cy={radius}
          r={radius - 1}
          fill="#fff"
          stroke="#eff2f5"
          strokeWidth={2}
        />
      </svg>
      <svg width={size} height={size} className="absolute inset-0">
        {segments.map((seg, i) => {
          const a = Math.max(0, seg.angle - gapDeg);
          const dash = (a / 360) * circumference;
          const gapPx = (gapDeg / 360) * circumference;
          const dashArray = `${dash} ${circumference}`;
          const offset = (currentAngle / 360) * circumference;
          currentAngle += seg.angle;
          return (
            <circle
              key={i}
              cx={radius}
              cy={radius}
              r={(inner + radius) / 2}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={dashArray}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${radius} ${radius})`}
            />
          );
        })}
      </svg>
      {/* Inner white circle */}
      <svg width={size} height={size} className="absolute inset-0">
        <circle cx={radius} cy={radius} r={inner} fill="#fff" stroke="#eff2f5" strokeWidth={2} />
      </svg>
      {/* Center content */}
      {center && (
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-[42px] font-bold leading-none text-[#2d3145]">{center.value}</div>
            {center.label && (
              <div className="mt-2 text-[18px] leading-none text-[#2d3145]">{center.label}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
