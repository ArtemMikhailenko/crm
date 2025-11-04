"use client";

import { Card, CardContent } from "@/shared/ui/card";

// Simple data to render the table. We'll map closely to the Figma example
const rows = [
  {
    date: "16/08/2013",
    name: "Binford Ltd.",
    id: "8861",
    manager: "Flores, Juanita",
    comment:
      "An interesting implication of the 2007 study concerns the use of hand sanitizers by observant Muslim",
  },
  { date: "15/08/2017", name: "Abstergo Ltd.", id: "8829", manager: "Nguyen, Shane", comment: "Even factoring differences in body wei…" },
  { date: "15/08/2017", name: "Acme Co.", id: "1577", manager: "Nguyen, Shane", comment: "So yes, the alcohol (ethanol) …" },
  { date: "18/09/2016", name: "Abstergo Ltd.", id: "9151", manager: "Flores, Juanita", comment: "Twenty 30-second applications within…" },
  { date: "12/06/2020", name: "Biffco Enterprises Ltd.", id: "1374", manager: "Cooper, Kristin", comment: "The study was repeated with three br…" },
  { date: "28/10/2012", name: "Acme Co.", id: "6025", manager: "Cooper, Kristin", comment: "Simultaneously we had a problem wit…" },
  { date: "12/06/2020", name: "Abstergo Ltd.", id: "4846", manager: "Flores, Juanita", comment: "An average healthy 7 year old boy …" },
];

export function ProjectsPage() {
  return (
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* Title + search + action */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Objednatelé</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                className="h-10 w-[320px] rounded-full border border-[#ccd5dc] bg-white px-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                placeholder="Поиск"
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</div>
            </div>
            <button className="rounded-full bg-slate-900 px-5 py-2 text-sm text-white">Search</button>
            <button className="rounded-full border border-[#ccd5dc] bg-white px-5 py-2 text-sm text-slate-700">Add new</button>
          </div>
        </div>

        <Card className="shadow-[0_5px_25px_rgba(107,114,128,0.2)]">
          <CardContent className="p-0">
            {/* Table header band */}
            <div className="grid grid-cols-[160px_280px_160px_280px_1fr] items-center border-b border-[#eff2f5] bg-[#eff2f5] text-[14px] text-[#2d3145]">
              <div className="flex items-center gap-2 px-4 py-3">
                <span className="text-[#2d3145]">Дата</span>
              </div>
              <div className="px-4 py-3">Имя</div>
              <div className="px-4 py-3">ID</div>
              <div className="px-4 py-3">Ответственный менеджер</div>
              <div className="px-4 py-3">Комментарий</div>
            </div>

            {/* Body */}
            <div>
              {rows.map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[160px_280px_160px_280px_1fr] items-center border-b border-[#eff2f5] text-[14px] text-[#2d3145]"
                >
                  {/* vertical separators illusion via background gradients could be heavy; use pseudo-cols: add right borders except last */}
                  <div className="px-4 py-3">{r.date}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">{r.name}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">{r.id}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">{r.manager}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3 text-slate-600">{r.comment}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
