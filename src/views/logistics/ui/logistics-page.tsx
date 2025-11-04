"use client";

import { useMemo } from "react";
import { Card } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { ChevronDown, PlusSquare, Search, SlidersHorizontal } from "lucide-react";

type Row = {
  name: string;
  number: string;
  workType: string;
  transportType: string;
  responsible: string;
  mileage: string;
  commentary: string;
};

const rows: Row[] = [
  { name: "MAN TGX", number: "UA8654DS", workType: "Interior Design", transportType: "bulldozer", responsible: "Darrell Steward", mileage: "5028", commentary: "An interesting implic…" },
  { name: "Ford F-Max", number: "E777EE", workType: "Plumbing", transportType: "crane", responsible: "Jane Cooper", mileage: "5948", commentary: "Even factoring differ…" },
  { name: "DAF XF 105", number: "UA8654DS", workType: "Formwork Installation", transportType: "bulldozer", responsible: "Arlene McCoy", mileage: "4152", commentary: "So yes, the alcohol …" },
  { name: "Ford F-Max", number: "E777EE", workType: "Tiling", transportType: "manipulator", responsible: "Theresa Webb", mileage: "8829", commentary: "Twenty 30-second a…" },
  { name: "MAN TGX", number: "4BB 9999", workType: "Pouring", transportType: "bulldozer", responsible: "Bessie Cooper", mileage: "4349", commentary: "The study was repea…" },
  { name: "DAF XF 105", number: "4BB 9999", workType: "Excavation", transportType: "manipulator", responsible: "Leslie Alexander", mileage: "1439", commentary: "Simultaneously we h…" },
  { name: "Mercedes-Benz Axor", number: "UA8654DS", workType: "Insulation", transportType: "grader", responsible: "Wade Warren", mileage: "9462", commentary: "An average healthy …" },
  { name: "Ford F-Max", number: "E777EE", workType: "Electrical", transportType: "crane", responsible: "Courtney Henry", mileage: "1577", commentary: "The principal alcoh…" },
  { name: "DAF XF 105", number: "4BB 9999", workType: "Roofing", transportType: "manipulator", responsible: "Brooklyn Simmons", mileage: "1374", commentary: "Their blood alcohol…" },
  { name: "MAN TGX", number: "UA8654DS", workType: "Brickwork", transportType: "bulldozer", responsible: "Darlene Robertson", mileage: "3536", commentary: "However rare side ef…" },
  { name: "Ford F-Max", number: "4BB 9999", workType: "Facing", transportType: "manipulator", responsible: "Devon Lane", mileage: "5560", commentary: "Ask CDCR San Quinti…" },
  { name: "DAF XF 105", number: "UA8654DS", workType: "Metal Installation", transportType: "grader", responsible: "Annette Black", mileage: "8861", commentary: "Alcohol based expos…" },
];

export function LogisticsPage() {
  const headers = useMemo(
    () => [
      { key: "name", label: "Name", width: 177 },
      { key: "number", label: "Number", width: 177 },
      { key: "workType", label: "Type of work", width: 177 },
      { key: "transportType", label: "Type of transportation", width: 177 },
      { key: "responsible", label: "Responsible", width: 177 },
      { key: "mileage", label: "Mileage", width: 177 },
      { key: "commentary", label: "Commentary", width: 177 },
    ],
    []
  );

  return (
    <div className="mx-auto w-full max-w-[1304px] space-y-5">
      {/* Top bar (48px height, space-between) */}
      <div className="flex h-12 items-end justify-between">
        <h1 className="text-[32px] font-bold leading-[1.4] text-[#2d3145]">Cars(56)</h1>
        <button
          className="inline-flex h-12 w-[148px] items-center justify-center gap-3 rounded-full bg-[#2d3145] px-6 text-[16px] leading-none text-white"
          type="button">
          <PlusSquare className="h-5 w-5" />
          <span className="text-nowrap">Add a car</span>
        </button>
      </div>

      {/* Filters card (rounded-16, px-24, pt/pb-36, gap-16) */}
      <Card className="rounded-2xl bg-white p-0 shadow-none">
        <div className="flex flex-col gap-4 px-6 py-9">
          {/* Row 1: Search + Sort button */}
          <div className="flex items-end gap-2">
            <div className="relative w-[1200px]">
              <Input
                placeholder="Поиск"
                className={cn(
                  "h-[49px] rounded-[48px] border-[#ccd5dc] bg-white pl-11 text-[14px] text-[#2d3145]",
                  "placeholder:text-[#2d3145]"
                )}
              />
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2d3145]" />
            </div>
            <button
              aria-label="Sort"
              className="grid h-12 w-12 place-items-center rounded-full bg-[#2d3145] text-white">
              <SlidersHorizontal className="h-6 w-6" />
            </button>
          </div>

          {/* Row 2: 3 selects + Apply/Reset */}
          <div className="flex items-end gap-6">
            {["Transport type", "Responsible", "Sort"].map((label, i) => (
              <div key={label} className="w-[232px]">
                <div className="mb-1.5 text-[14px] font-medium text-[#2d3145]">{label}</div>
                <button className="flex h-[49px] w-full items-center justify-between rounded-[48px] border border-[#ccd5dc] bg-white px-4 text-left text-[14px] text-[#abadb5]">
                  <span className="truncate">{i === 2 ? "Alphabetically" : "input_label"}</span>
                  <ChevronDown className="h-5 w-5 text-[#2d3145]" />
                </button>
              </div>
            ))}

            <button className="h-12 w-[232px] rounded-full bg-[#2d3145] px-6 text-[16px] text-white">Apply</button>
            <button className="h-12 w-[232px] rounded-full border border-[#2d3145] px-6 text-[16px] text-[#2d3145]">Reset</button>
          </div>
        </div>
      </Card>

      {/* Table */}
  <div className="rounded-2xl bg-white shadow-[0_5px_25px_rgba(107,114,128,0.3)]">
        {/* Header */}
        <div className="grid grid-cols-[177px_177px_177px_177px_177px_177px_1fr] border-b border-[#eff2f5] bg-[#eff2f5] text-[14px] text-[#2d3145]">
          {headers.map(h => (
            <div key={h.key} className="flex items-center gap-2 px-4 py-3">
              {h.label === "Name" || h.label === "Type of work" || h.label === "Type of transportation" ? (
                <span className="text-[#2d3145]">{h.label}</span>
              ) : (
                <span>{h.label}</span>
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div>
          {rows.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-[177px_177px_177px_177px_177px_177px_1fr] items-center border-b border-[#eff2f5] text-[14px] text-[#2d3145]"
            >
              <div className="px-4 py-3">{r.name}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">{r.number}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">{r.workType}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">{r.transportType}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">{r.responsible}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">{r.mileage}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3 text-slate-600">{r.commentary}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
