"use client";

import {
  PlusSquare,
  Search,
  Calendar as CalendarIcon,
  ChevronDown,
  Filter,
  Upload,
  Printer,
  Ellipsis,
} from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export function ApplicationsPage() {
  return (
    <div className="space-y-5">
      {/* Header + CTA */}
      <div className="flex items-center justify-between h-12">
        <h1 className="text-[32px] leading-[1.4] font-bold">All applications (89)</h1>
        <Button className="h-12 rounded-[48px] bg-[#2d3145] text-white px-6 gap-3">
          <PlusSquare className="h-5 w-5" />
          <span className="text-[16px]">Create new Application</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="rounded-[16px] p-6 pt-9 space-y-5">
        {/* Search + Sort */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#81838f]" />
              <Input
                placeholder="Search"
                className="h-[49px] pl-11 rounded-[48px] border-[#ccd5dc]"
              />
            </div>
          </div>
          <Button className="h-12 w-12 rounded-full bg-[#2d3145] text-white p-0">
            <Filter className="h-6 w-6" />
          </Button>
        </div>

        {/* 4 Select-like inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Date of Creation", left: <CalendarIcon className="h-5 w-5" /> },
            { label: "Type" },
            { label: "Client" },
            { label: "Created" },
          ].map((f, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="text-[14px] font-medium text-[#2d3145]">{f.label}</div>
              <div className="relative flex items-center h-[49px] rounded-[48px] border border-[#ccd5dc] px-4 gap-2 text-[#abadb5] bg-white">
                {f.left && <span className="text-[#81838f]">{f.left}</span>}
                <span className="text-[14px]">input_label</span>
                <ChevronDown className="ml-auto h-5 w-5 text-[#81838f]" />
              </div>
            </div>
          ))}
        </div>

        {/* Reset / Apply */}
        <div className="flex items-end gap-5">
          <Button
            variant="outline"
            className="h-12 w-[298px] rounded-[48px] border-[#2d3145] text-[#2d3145]">
            Reset
          </Button>
          <Button className="h-12 w-[298px] rounded-[48px] bg-[#2d3145] text-white">
            Apply
          </Button>
        </div>
      </Card>

      {/* Table card */}
      <Card className="rounded-[16px] p-0 shadow-[0_5px_25px_rgba(107,114,128,0.15)]">
        {/* Tabs + right controls */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-10">
            <button className="relative pb-2 text-[#79c3b3]">
              Current
              <span className="absolute left-0 right-[-16px] -bottom-[2px] h-[2px] bg-[#79c3b3]" />
            </button>
            <button className="pb-2 text-[#2d3145] opacity-80">Completed</button>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-full border border-[#ccd5dc] bg-white px-5 py-2 text-sm text-[#2d3145]">
              Columns <ChevronDown className="h-4 w-4" />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-full border border-[#aab8c2] bg-white text-slate-600">
              <Upload className="h-5 w-5" />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-full border border-[#aab8c2] bg-white text-slate-600">
              <Printer className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="border-b border-[#e9edf0]" />

        {/* Header grid */}
        <div className="grid [grid-template-columns:repeat(7,177px)_57px] items-center bg-[#eff2f5] text-[14px] text-[#2d3145] shadow-[inset_0_-6px_6px_-6px_rgba(0,0,0,0.15)]">
          {[
            "Creation Date",
            "Application name",
            "Commentary",
            "Client",
            "Application type",
            "Created",
            "Responsible",
            "",
          ].map((h, i) => (
            <div
              key={i}
              className={
                "px-4 py-3 " + (i !== 0 ? "border-l border-[#f1f3f4]" : "")
              }>
              {h}
            </div>
          ))}
        </div>

        {/* Body rows */}
        <div className="max-w-full overflow-x-auto">
          {rows.map((r, i) => (
            <div
              key={i}
              className={
                "grid [grid-template-columns:repeat(7,177px)_57px] items-center text-[14px] text-[#2d3145] border-b border-[#eff2f5] " +
                (i % 2 === 0 ? "bg-white" : "bg-emerald-50/30")
              }>
              <div className="px-4 py-3">{r.creationDate}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">{r.applicationName}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3 truncate">{r.commentary}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">{r.client}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">{r.applicationType}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">{r.created}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">{r.responsible}</div>
              <div className="border-l border-[#f1f3f4] px-2 py-3 flex items-center justify-center">
                <Ellipsis className="h-5 w-5 text-slate-500" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

const rows = [
  {
    creationDate: "16/08/2013",
    applicationName: "Foundation Filling",
    commentary:
      "An interesting implication of the 2007 study concerns the use of hand sanitizers by observant Muslim",
    client: "Louis Vuitton",
    applicationType: "Clarify details",
    created: "Flores, Juanita",
    responsible: "Flores, Juanita",
  },
  {
    creationDate: "15/08/2017",
    applicationName: "Roofing",
    commentary:
      "Even factoring differences in body weight between children and adults into account, it would still n",
    client: "Pizza Hut",
    applicationType: "Clarify details",
    created: "Nguyen, Shane",
    responsible: "Nguyen, Shane",
  },
  {
    creationDate: "15/08/2017",
    applicationName: "Electrical",
    commentary:
      "So yes, the alcohol (ethanol) in hand sanitizers can be absorbed through the skin, but no, it would ",
    client: "IBM",
    applicationType: "Approval",
    created: "Nguyen, Shane",
    responsible: "Nguyen, Shane",
  },
  {
    creationDate: "18/09/2016",
    applicationName: "Metal Installation",
    commentary:
      "Twenty 30-second applications within half an hour is well in excess of almost anyone’s use of a sani",
    client: "Ferrari",
    applicationType: "Approval",
    created: "Flores, Juanita",
    responsible: "Flores, Juanita",
  },
  {
    creationDate: "12/06/2020",
    applicationName: "Facing",
    commentary:
      "The study was repeated with three brands of hand sanitizers containing 55%, 85%, and 95% ethanol. Th",
    client: "eBay",
    applicationType: "Clarify details",
    created: "Cooper, Kristin",
    responsible: "Cooper, Kristin",
  },
  {
    creationDate: "28/10/2012",
    applicationName: "Brickwork",
    commentary:
      "Simultaneously we had a problem with prisoner drunkenness that we couldn’t figure out. I mean , the ",
    client: "Louis Vuitton",
    applicationType: "Approval",
    created: "Cooper, Kristin",
    responsible: "Cooper, Kristin",
  },
  {
    creationDate: "12/06/2020",
    applicationName: "Tiling",
    commentary:
      "An average healthy 7 year old boy weighs about 50 lb (23 kg). If we suppose the same amount of alcoh",
    client: "Mitsubishi",
    applicationType: "Approval",
    created: "Flores, Juanita",
    responsible: "Flores, Juanita",
  },
  {
    creationDate: "18/09/2016",
    applicationName: "Formwork Installation",
    commentary:
      "The principal alcohol in Purell hand sanitizer (to take the most talked-about brand) is 70% ethanol ",
    client: "Gillette",
    applicationType: "Clarify details",
    created: "Miles, Esther",
    responsible: "Miles, Esther",
  },
  {
    creationDate: "16/08/2013",
    applicationName: "Insulation",
    commentary:
      "Their blood alcohol levels rose to 0.007 to 0.02 o/oo (parts per thousand), or 0.7 to 2.0 mg/L.",
    client: "Apple",
    applicationType: "Approval",
    created: "Henry, Arthur",
    responsible: "Henry, Arthur",
  },
];
