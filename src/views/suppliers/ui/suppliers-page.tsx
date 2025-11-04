"use client";

import { Card, CardContent } from "@/shared/ui/card";
import { Modal } from "@/shared/ui/modal";
import { Button } from "@/shared/ui/button";
import { Search, Filter as FilterIcon, ChevronDown, PlusSquare, Ellipsis, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

export function SuppliersPage() {
  const router = useRouter();
  const [openCreate, setOpenCreate] = React.useState(false);
  const [orgName, setOrgName] = React.useState("");

  const openCreateModal = () => setOpenCreate(true);
  const closeCreateModal = () => {
    setOpenCreate(false);
    setOrgName("");
  };

  const onSave = () => {
    // TODO: integrate API to create supplier, then refresh list
    if (!orgName.trim()) return; // simple required validation
    closeCreateModal();
  };
  return (
      <div className="mx-auto max-w-[1300px] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Suppliers (1456)</h1>
          <button onClick={openCreateModal} className="flex items-center gap-3 rounded-full bg-[#2d3145] px-6 py-3 text-white">
            <PlusSquare className="h-5 w-5" />
            <span className="text-base">Create a new</span>
          </button>
        </div>

        {/* Filter card (exact spec) */}
        <div className="rounded-2xl bg-white px-6 py-9 shadow-[0_5px_25px_rgba(107,114,128,0.15)]">
          {/* Search row */}
          <div className="flex items-end gap-2">
            <div className="relative w-[1200px] max-w-full">
              <input
                className="h-[49px] w-full rounded-full border border-[#ccd5dc] bg-white pl-11 pr-4 text-sm text-[#2d3145] placeholder-[#2d3145] focus:outline-none"
                placeholder="Поиск"
              />
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2d3145]/60" />
            </div>
            <button className="grid h-12 w-12 place-items-center rounded-full bg-[#2d3145] text-white">
              <FilterIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Secondary filters row */}
          <div className="mt-5 flex items-end gap-6">
            {/* Select period */}
            <div className="w-[296px]">
              <div className="mb-1 text-[14px] font-medium text-[#2d3145]">Select period</div>
              <div className="flex h-[49px] w-full items-center justify-between rounded-full border border-[#ccd5dc] bg-white px-4 text-sm text-[#abadb5]">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-5 w-5 rounded-[6px] border border-[#ccd5dc]" />
                  input_label
                </div>
              </div>
            </div>

            {/* Sort */}
            <div className="w-[296px]">
              <div className="mb-1 text-[14px] font-medium text-[#2d3145]">Sort</div>
              <button className="flex h-[49px] w-full items-center justify-between rounded-full border border-[#ccd5dc] bg-white px-4 text-sm text-[#abadb5]">
                Alphabetically <ChevronDown className="h-5 w-5 text-[#abadb5]" />
              </button>
            </div>

            {/* Actions */}
            <button className="ml-auto h-12 w-[296px] rounded-full bg-[#2d3145] text-base text-white">Apply</button>
            <button className="h-12 w-[296px] rounded-full border border-[#2d3145] text-base text-[#2d3145]">Reset</button>
          </div>
        </div>

        {/* Table card */}
        <Card className="shadow-[0_5px_25px_rgba(107,114,128,0.2)]">
          <CardContent className="p-0">
            {/* Top-right add button inside card */}
            <div className="flex justify-end px-4 pt-4 pb-3">
              <button onClick={openCreateModal} className="flex items-center gap-2 rounded-full bg-[#79c3b3] px-6 py-2 text-sm text-white">
                <PlusSquare className="h-4 w-4" /> Add a new
              </button>
            </div>

            {/* Header grid: match screenshot columns within 1300px */}
            <div className="grid grid-cols-[150px_240px_120px_120px_220px_1fr_56px] items-center border-b border-[#e9edf0] bg-[#eff2f5] text-[14px] text-[#2d3145] shadow-[inset_0_-6px_6px_-6px_rgba(0,0,0,0.15)]">
              <div className="px-4 py-3">Date</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">Name</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">ID</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">Type</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">Contacts</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">Commentary</div>
              <div className="border-l border-[#f1f3f4] px-2 py-3" />
            </div>

            {/* Rows (mock) */}
            {supplierRows.map((r, i) => (
              <div
                key={i}
                onClick={() => router.push(`/dashboard/suppliers/${encodeURIComponent(r.id)}`)}
                className={
                  "grid cursor-pointer grid-cols-[150px_240px_120px_120px_220px_1fr_56px] items-center border-b border-[#eff2f5] text-[14px] text-[#2d3145] transition-colors hover:bg-emerald-50/60 " +
                  (i % 2 === 0 ? "bg-white" : "bg-emerald-50/30")
                }
              >
                <div className="px-4 py-3">{r.date}</div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">{r.name}</div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">{r.id}</div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">{r.type}</div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">{r.contact}</div>
                <div className="border-l border-[#f1f3f4] px-4 py-3 text-slate-600">{r.comment}</div>
                <div className="border-l border-[#f1f3f4] px-2 py-2 text-right">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="grid h-8 w-8 place-items-center rounded-full border border-[#aab8c2] bg-white text-slate-600"
                  >
                    <Ellipsis className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Create supplier modal */}
        <Modal
          open={openCreate}
          onClose={closeCreateModal}
          title={
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-600">
                <PlusSquare className="h-5 w-5" />
              </div>
              <span>Add a new supplier</span>
            </div>
          }
          className="max-w-[496px]"
        >
          {/* divider under header */}
          <div className="-mx-6 mb-3 border-t border-slate-200" />

          {/* delete hint row (non-functional for create) */}
          <div className="mb-2 flex items-center justify-end gap-2 text-sm text-[#575a6a]">
            <Trash2 className="h-4 w-4" />
            <span>delete</span>
          </div>

          {/* field */}
          <div className="space-y-2">
            <div className="text-[14px] font-medium text-[#2d3145]">Name of organization</div>
            <input
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="input_label"
              className="h-[49px] w-full rounded-full border border-[#ccd5dc] bg-white px-4 text-sm text-[#2d3145] placeholder-[#abadb5] outline-none focus:ring-2 focus:ring-[#2d3145]/20"
              aria-invalid={!orgName.trim()}
            />
          </div>

          {/* actions */}
          <div className="mt-6 flex gap-4">
            <Button
              type="button"
              onClick={closeCreateModal}
              className="h-12 w-[216px] rounded-full border border-[#ccd5dc] bg-white text-[#2d3145]"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onSave}
              disabled={!orgName.trim()}
              className="h-12 w-[216px] rounded-full bg-[#2d3145] text-white disabled:opacity-50"
            >
              Save
            </Button>
          </div>
        </Modal>
      </div>
  );
}

const supplierRows = [
  {
    date: "16/08/2013",
    name: "Binford Ltd.",
    id: "8861",
    type: "Duct tape.",
    contact: "(505) 555-0125",
    comment: "An interesting implication of the 2007 study concerns the use of hand sanitizers by observant Muslim",
  },
  {
    date: "15/08/2017",
    name: "Abstergo Ltd.",
    id: "8829",
    type: "Brick",
    contact: "(702) 555-0122",
    comment: "Even factoring differences in body weight between children and adults into account, it would still n",
  },
  {
    date: "15/08/2017",
    name: "Acme Co.",
    id: "1577",
    type: "Lumber",
    contact: "(406) 555-0120",
    comment: "So yes, the alcohol (ethanol) in hand sanitizers can be absorbed through the skin, but no, it would ",
  },
  {
    date: "18/09/2016",
    name: "Abstergo Ltd.",
    id: "9151",
    type: "Rubble",
    contact: "(201) 555-0124",
    comment: "Twenty 30-second applications within half an hour is well in excess of almost anyone’s use of a sani",
  },
  {
    date: "12/06/2020",
    name: "Biffco Enterprises Ltd.",
    id: "1374",
    type: "Concrete",
    contact: "(808) 555-0111",
    comment: "The study was repeated with three brands of hand sanitizers containing 55%, 85%, and 95% ethanol. Th",
  },
];
