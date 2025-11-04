"use client";

import { Card } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { ChevronDown, PlusSquare, Search, SlidersHorizontal, Ellipsis } from "lucide-react";

type Row = {
  name: string;
  phone: string;
  email: string;
  car: string;
  license: string;
  experience: string;
  commentary: string;
};

const rows: Row[] = [
  { name: "Albert Flores", phone: "(217) 555-0113", email: "albert.flores@example.com", car: "MAN TGX", license: "UA8654DS", experience: "5 years", commentary: "Experienced driver with..." },
  { name: "Wade Warren", phone: "(505) 555-0125", email: "wade.warren@example.com", car: "Ford F-Max", license: "E777EE", experience: "3 years", commentary: "Reliable and punctual..." },
  { name: "Esther Howard", phone: "(702) 555-0122", email: "esther.howard@example.com", car: "DAF XF 105", license: "UA8654DS", experience: "7 years", commentary: "Expert in long-haul..." },
  { name: "Cameron Williamson", phone: "(219) 555-0114", email: "cameron.w@example.com", car: "Ford F-Max", license: "E777EE", experience: "4 years", commentary: "Good safety record..." },
  { name: "Brooklyn Simmons", phone: "(208) 555-0112", email: "brooklyn.s@example.com", car: "MAN TGX", license: "4BB 9999", experience: "6 years", commentary: "Specializes in heavy..." },
  { name: "Leslie Alexander", phone: "(405) 555-0128", email: "leslie.a@example.com", car: "DAF XF 105", license: "4BB 9999", experience: "8 years", commentary: "Professional driver..." },
  { name: "Guy Hawkins", phone: "(208) 555-0112", email: "guy.hawkins@example.com", car: "Mercedes-Benz Axor", license: "UA8654DS", experience: "2 years", commentary: "New but promising..." },
  { name: "Savannah Nguyen", phone: "(684) 555-0102", email: "savannah.n@example.com", car: "Ford F-Max", license: "E777EE", experience: "5 years", commentary: "Great communication..." },
];

export function DriversPage() {
  return (
    <div className="mx-auto w-full max-w-[1304px] space-y-5">
      {/* Top bar */}
      <div className="flex h-12 items-end justify-between">
        <h1 className="text-[32px] font-bold leading-[1.4] text-[#2d3145]">Drivers (56)</h1>
        <button
          className="inline-flex h-12 w-[168px] items-center justify-center gap-3 rounded-full bg-[#2d3145] px-6 text-[16px] leading-none text-white"
          type="button">
          <PlusSquare className="h-5 w-5" />
          <span className="text-nowrap">Add a driver</span>
        </button>
      </div>

      {/* Filters card */}
      <Card className="rounded-2xl bg-white p-0 shadow-none">
        <div className="flex flex-col gap-4 px-6 py-9">
          {/* Row 1: Search + Sort button */}
          <div className="flex items-end gap-2">
            <div className="relative w-[1200px]">
              <Input
                placeholder="Search"
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
            {["Car", "Experience", "Sort"].map((label, i) => (
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
        <div className="grid grid-cols-[200px_180px_220px_160px_160px_160px_1fr] border-b border-[#eff2f5] bg-[#eff2f5] text-[14px] text-[#2d3145]">
          <div className="flex items-center gap-2 px-4 py-3">Name</div>
          <div className="border-l border-[#f1f3f4] px-4 py-3">Phone</div>
          <div className="border-l border-[#f1f3f4] px-4 py-3">Email</div>
          <div className="border-l border-[#f1f3f4] px-4 py-3">Car</div>
          <div className="border-l border-[#f1f3f4] px-4 py-3">License</div>
          <div className="border-l border-[#f1f3f4] px-4 py-3">Experience</div>
          <div className="border-l border-[#f1f3f4] px-4 py-3">Commentary</div>
        </div>

        {/* Body */}
        <div>
          {rows.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-[200px_180px_220px_160px_160px_160px_1fr] items-center border-b border-[#eff2f5] text-[14px] text-[#2d3145]"
            >
              <div className="px-4 py-3">{r.name}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">{r.phone}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">{r.email}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">{r.car}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">{r.license}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">{r.experience}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3 text-slate-600">{r.commentary}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
