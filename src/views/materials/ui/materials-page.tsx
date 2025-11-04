"use client";

import { Card, CardContent } from "@/shared/ui/card";
import { ChevronDown, Ellipsis, Filter as FilterIcon, Search } from "lucide-react";

type MaterialRow = {
  date: string;
  title: string;
  category: string;
  storage: string;
  unitPrice: string;
  sizeM2: string;
  qty: number;
  supplier: string;
  amount: string;
  comment: string;
  status: "Planning" | "Process" | "Pause" | "Review";
};

const rows: MaterialRow[] = [
  {
    date: "16/08/2023",
    title: "Wall tiles",
    category: "Ceramics",
    storage: "Main warehouse",
    unitPrice: "$12.40",
    sizeM2: "1.20",
    qty: 120,
    supplier: "Acme Supplies",
    amount: "$1,488.00",
    comment: "Batch A12. Handle with care.",
    status: "Planning",
  },
  {
    date: "05/01/2024",
    title: "Marble slabs",
    category: "Stone",
    storage: "Storage B",
    unitPrice: "$86.00",
    sizeM2: "2.40",
    qty: 20,
    supplier: "Rock & Co.",
    amount: "$4,128.00",
    comment: "White carrara – premium.",
    status: "Process",
  },
  {
    date: "22/03/2024",
    title: "Oak panels",
    category: "Wood",
    storage: "Main warehouse",
    unitPrice: "$34.90",
    sizeM2: "0.80",
    qty: 75,
    supplier: "Northwood",
    amount: "$2,092.50",
    comment: "Moisture protected.",
    status: "Pause",
  },
  {
    date: "09/04/2024",
    title: "Glass sheets",
    category: "Glass",
    storage: "Storage C",
    unitPrice: "$22.10",
    sizeM2: "1.00",
    qty: 40,
    supplier: "ClearView",
    amount: "$884.00",
    comment: "Tempered 6mm",
    status: "Review",
  },
];

export function MaterialsPage() {
  return (
  <div className="mx-auto max-w-[1300px] space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Materials</h1>
        </div>

        {/* Filter/search card */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_5px_25px_rgba(107,114,128,0.15)]">
          {/* Search + sort button */}
          <div className="flex items-end gap-2">
            <div className="relative w-full">
              <input
                className="h-12 w-full rounded-full border border-[#ccd5dc] bg-white pl-11 pr-4 text-sm text-slate-700 placeholder-[#81838f] focus:outline-none"
                placeholder="Search"
              />
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#81838f]" />
            </div>
            <button className="grid h-12 w-12 place-items-center rounded-full bg-[#2d3145] text-white">
              <FilterIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Optional quick filters row (placeholder to match spacing) */}
          <div className="mt-5 flex items-center gap-5">
            <div className="flex items-center gap-6">
              <QuickField label="Category" />
              <QuickField label="Storage" />
              <QuickField label="Supplier" />
            </div>
            <div className="ml-auto flex items-center gap-5">
              <button className="h-12 rounded-full border border-[#2d3145] px-6 text-base text-[#2d3145]">Reset</button>
              <button className="h-12 rounded-full bg-[#2d3145] px-6 text-base text-white">Apply</button>
            </div>
          </div>
        </div>

        {/* Table card */}
        <Card className="shadow-[0_5px_25px_rgba(107,114,128,0.2)]">
          <CardContent className="p-0">
            {/* Header band (fits within 1300px) */}
            <div className="grid grid-cols-[90px_200px_120px_90px_70px_60px_160px_110px_200px_110px_46px] items-center border-b border-[#e9edf0] bg-[#eff2f5] text-[14px] text-[#2d3145] shadow-[inset_0_-6px_6px_-6px_rgba(0,0,0,0.15)]">
                  <div className="px-4 py-3">Date</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">Title / Category</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">Storage</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">Unit price</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">Size m²</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">Qty.</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">Supplier</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">Amount</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">Comment</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">Status</div>
                  <div className="border-l border-[#f1f3f4] px-2 py-3 text-right">&nbsp;</div>
                </div>

            {/* Body */}
            <div>
              {rows.map((r, i) => (
                <div
                  key={i}
                  className={
                    "grid grid-cols-[90px_200px_120px_90px_70px_60px_160px_110px_200px_110px_46px] items-center border-b border-[#eff2f5] text-[14px] text-[#2d3145] " +
                    (i % 2 === 0 ? "bg-white" : "bg-emerald-50/30")
                  }
                >
                  <div className="px-4 py-3">{r.date}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">
                    <div className="font-medium text-[#2d3145]">{r.title}</div>
                    <div className="text-xs text-[#81838f]">{r.category}</div>
                  </div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">{r.storage}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">{r.unitPrice}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">{r.sizeM2}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">{r.qty}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">{r.supplier}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">{r.amount}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3 text-slate-600">{r.comment}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="border-l border-[#f1f3f4] px-2 py-2 text-right">
                    <button className="grid h-8 w-8 place-items-center rounded-full border border-[#aab8c2] bg-white text-slate-600">
                      <Ellipsis className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}

function StatusBadge({ status }: { status: MaterialRow["status"] }) {
  const map: Record<MaterialRow["status"], { bg: string; text: string }> = {
    Planning: { bg: "#EAF2FF", text: "#2165D1" },
    Process: { bg: "#E6F7F1", text: "#2B8A6D" },
    Pause: { bg: "#FFF3E6", text: "#C56A12" },
    Review: { bg: "#F1E6FF", text: "#7C3AED" },
  };
  const { bg, text } = map[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
      style={{ backgroundColor: bg, color: text }}
    >
      {status}
    </span>
  );
}

function QuickField({ label }: { label: string }) {
  return (
    <div className="flex w-auto flex-col gap-1">
      <div className="text-[14px] font-medium text-[#2d3145]">{label}</div>
      <button className="flex h-12 w-[240px] items-center justify-between rounded-full border border-[#ccd5dc] bg-white px-4 text-sm text-[#abadb5]">
        input_label <ChevronDown className="h-5 w-5 text-[#abadb5]" />
      </button>
    </div>
  );
}
