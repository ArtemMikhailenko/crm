"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { ChevronDown, Plus, Search, SlidersHorizontal, Truck, Trash2 } from "lucide-react";
import { Modal } from "@/shared/ui/modal";

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
  { name: "MAN TGX", number: "UA8654DS", workType: "Interior Design", transportType: "bulldozer", responsible: "Darrell Steward", mileage: "5028", commentary: "An interesting implication of the 2007 study concerns the use of hand sanitizers by observant Muslim" },
  { name: "Ford F-Max", number: "E777EE", workType: "Plumbing", transportType: "crane", responsible: "Jane Cooper", mileage: "5948", commentary: "Even factoring differences in body weight between children and adults into account, it would still n" },
  { name: "DAF XF 105", number: "UA8654DS", workType: "Formwork Installation", transportType: "bulldozer", responsible: "Arlene McCoy", mileage: "4152", commentary: "So yes, the alcohol (ethanol) in hand sanitizers can be absorbed through the skin, but no, it would " },
  { name: "Ford F-Max", number: "E777EE", workType: "Tiling", transportType: "manipulator", responsible: "Theresa Webb", mileage: "8829", commentary: "Twenty 30-second applications within half an hour is well in excess of almost anyone's use of a sani" },
  { name: "MAN TGX", number: "4BB 9999", workType: "Pouring", transportType: "bulldozer", responsible: "Bessie Cooper", mileage: "4349", commentary: "The study was repeated with three brands of hand sanitizers containing 55%, 85%, and 95% ethanol. Th" },
  { name: "DAF XF 105", number: "4BB 9999", workType: "Excavation", transportType: "manipulator", responsible: "Leslie Alexander", mileage: "1439", commentary: "Simultaneously we had a problem with prisoner drunkenness that we couldn't figure out. I mean , the " },
  { name: "Mercedes-Benz Axor", number: "UA8654DS", workType: "Insulation", transportType: "grader", responsible: "Wade Warren", mileage: "9462", commentary: "An average healthy 7 year old boy weighs about 50 lb (23 kg). If we suppose the same amount of alcoh" },
  { name: "Ford F-Max", number: "E777EE", workType: "Electrical", transportType: "crane", responsible: "Courtney Henry", mileage: "1577", commentary: "The principal alcohol in Purell hand sanitizer (to take the most talked-about brand) is 70% ethanol " },
  { name: "DAF XF 105", number: "4BB 9999", workType: "Roofing", transportType: "manipulator", responsible: "Brooklyn Simmons", mileage: "1374", commentary: "Their blood alcohol levels rose to 0.007 to 0.02 o/oo (parts per thousand), or 0.7 to 2.0 mg/L." },
  { name: "MAN TGX", number: "UA8654DS", workType: "Brickwork", transportType: "bulldozer", responsible: "Darlene Robertson", mileage: "3536", commentary: "However rare side effects observed among children can be metabolic acidosis, coma, respiratory depre" },
  { name: "Ford F-Max", number: "4BB 9999", workType: "Facing", transportType: "manipulator", responsible: "Devon Lane", mileage: "5560", commentary: "Ask CDCR San Quintin State Prison 2008. We installed Purex dispensers throughout the prison to comba" },
  { name: "DAF XF 105", number: "UA8654DS", workType: "Metal Installation", transportType: "grader", responsible: "Annette Black", mileage: "8861", commentary: "Alcohol based exposures through inadvertently consuming hand sanitizer, have been observed to produc" },
];

export function CarsPage() {
  const router = useRouter();
  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState({
    transportType: "",
    vehicleName: "",
    number: "",
    comment: "",
  });

  const resetForm = () =>
    setForm({ transportType: "", vehicleName: "", number: "", comment: "" });
  const headers = useMemo(
    () => [
      { key: "name", label: "Name", width: 177, sortable: true },
      { key: "number", label: "Number", width: 177 },
      { key: "workType", label: "Type of work", width: 177, sortable: true },
      { key: "transportType", label: "Type of transportation", width: 177, sortable: true },
      { key: "responsible", label: "Responsible", width: 177 },
      { key: "mileage", label: "Mileage", width: 177 },
      { key: "commentary", label: "Commentary", width: 177 },
    ],
    []
  );

  return (
    <div className="mx-auto w-full max-w-[1304px] space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between">
        <h1 className="text-[32px] font-bold leading-[140%] text-[#2d3145]">
          Cars<span className="text-[#2d3145]">(56)</span>
        </h1>
        <Button
          className="h-12 gap-3 rounded-full bg-[#2d3145] px-6 text-white hover:bg-[#2d3145]/90"
          onClick={() => setOpenAdd(true)}
        >
          <Plus className="h-5 w-5" />
          Add a car
        </Button>
      </div>

      {/* Filter Panel */}
      <Card className="rounded-2xl border border-[#e6ebf0] bg-white p-9 shadow-none">
        <div className="space-y-4">
          {/* Search */}
          <div className="flex items-start gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2d3145]" />
              <Input
                placeholder="Search"
                className="h-[49px] rounded-full border-[#ccd5dc] pl-11 text-sm text-[#2d3145] placeholder:text-[#2d3145]"
              />
            </div>
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-[#2d3145] hover:bg-[#2d3145]/90"
            >
              <SlidersHorizontal className="h-6 w-6 text-white" />
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-end gap-6">
            {/* Transport type */}
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium text-[#2d3145]">
                Transport type
              </label>
              <div className="relative">
                <Input
                  placeholder="input_label"
                  className="h-[49px] rounded-full border-[#ccd5dc] pr-10 text-sm text-[#abadb5] placeholder:text-[#abadb5]"
                />
                <ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2d3145]" />
              </div>
            </div>

            {/* Responsible */}
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium text-[#2d3145]">
                Responsible
              </label>
              <div className="relative">
                <Input
                  placeholder="input_label"
                  className="h-[49px] rounded-full border-[#ccd5dc] pr-10 text-sm text-[#abadb5] placeholder:text-[#abadb5]"
                />
                <ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2d3145]" />
              </div>
            </div>

            {/* Sort */}
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium text-[#2d3145]">Sort</label>
              <div className="relative">
                <Input
                  placeholder="Alphabetically"
                  className="h-[49px] rounded-full border-[#ccd5dc] pr-10 text-sm text-[#abadb5] placeholder:text-[#abadb5]"
                />
                <ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2d3145]" />
              </div>
            </div>

            {/* Apply button */}
            <Button className="h-12 flex-1 rounded-full bg-[#2d3145] text-base text-white hover:bg-[#2d3145]/90">
              Apply
            </Button>

            {/* Reset button */}
            <Button
              variant="outline"
              className="h-12 flex-1 rounded-full border-[#2d3145] text-base text-[#2d3145] hover:bg-[#2d3145]/10"
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>
      {/* Add a car modal */}
      <Modal
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
          resetForm();
        }}
        className="max-w-[496px] rounded-2xl shadow-[0_36px_28.4px_30px_rgba(47,61,83,0.3)]"
        title={
          <div className="flex items-center gap-2 text-[#2d3145]">
            <Truck className="h-5 w-5" />
            <span className="text-lg">Add a car</span>
          </div>
        }
      >
        <div className="mb-2 flex items-center justify-end gap-2 text-sm text-[#575a6a]">
          <Trash2 className="h-4 w-4" /> delete
        </div>
        <div className="space-y-4">
          <div>
            <div className="mb-1 text-sm font-medium text-[#2d3145]">Select the type of transport</div>
            <div className="relative">
              <Input
                placeholder="input_label"
                className="h-[49px] rounded-full border-[#ccd5dc] pr-10 text-sm text-[#abadb5] placeholder:text-[#abadb5]"
                value={form.transportType}
                onChange={(e) => setForm((f) => ({ ...f, transportType: e.target.value }))}
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 8l4 4 4-4" stroke="#2d3145" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div>
            <div className="mb-1 text-sm font-medium text-[#2d3145]">Vehicle name</div>
            <Input
              placeholder="input_label"
              className="h-[49px] rounded-full border-[#ccd5dc] text-sm placeholder:text-[#abadb5]"
              value={form.vehicleName}
              onChange={(e) => setForm((f) => ({ ...f, vehicleName: e.target.value }))}
            />
          </div>
          <div>
            <div className="mb-1 text-sm font-medium text-[#2d3145]">Number</div>
            <Input
              placeholder="input_label"
              className="h-[49px] rounded-full border-[#ccd5dc] text-sm placeholder:text-[#abadb5]"
              value={form.number}
              onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
            />
          </div>
          <div>
            <div className="mb-1 text-sm font-medium text-[#242737]">Comment</div>
            <textarea
              placeholder="text_area"
              className="min-h-20 w-full rounded-xl border border-[#ccd5dc] px-4 py-3 text-sm text-[#2d3145] placeholder:text-[#abadb5]"
              value={form.comment}
              onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
            />
          </div>
          <div className="mt-3 flex items-center gap-4">
            <Button
              variant="outline"
              className="h-12 w-[216px] rounded-full border-[#ccd5dc] text-[#2d3145]"
              onClick={() => {
                setOpenAdd(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              className="h-12 w-[216px] rounded-full bg-[#2d3145] text-white"
              onClick={() => {
                setOpenAdd(false);
                resetForm();
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>

      {/* Table */}
      <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-[3px_5px_25.2px_rgba(107,114,128,0.3)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#eff2f5]">
                {headers.map((header, index) => (
                  <th
                    key={header.key}
                    className={cn(
                      "px-4 py-3 text-left text-sm font-medium text-[#2d3145]",
                      "border-b border-[#e6ebf0]/40",
                      index === 0 && "border-l-0"
                    )}
                    style={{ width: header.width }}
                  >
                    <div className="flex items-center gap-1">
                      {header.sortable && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="text-[#2d3145]"
                        >
                          <path
                            d="M8 4L11 7H5L8 4Z"
                            fill="currentColor"
                            opacity="0.5"
                          />
                          <path
                            d="M8 12L5 9H11L8 12Z"
                            fill="currentColor"
                            opacity="0.5"
                          />
                        </svg>
                      )}
                      {header.label}
                    </div>
                  </th>
                ))}
                <th className="w-[58px] border-b border-[#e6ebf0]/40 bg-[#eff2f5] px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => router.push(`/dashboard/logistics/cars/${rowIndex + 1}`)}
                  className="border-b border-[#f1f3f4] bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3 text-sm text-[#2d3145]">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#2d3145]">
                    {row.number}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#2d3145]">
                    {row.workType}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#2d3145]">
                    {row.transportType}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#2d3145]">
                    {row.responsible}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#2d3145]">
                    {row.mileage}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#2d3145]">
                    <div className="truncate max-w-[145px]" title={row.commentary}>
                      {row.commentary}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="flex h-6 w-6 items-center justify-center text-[#2d3145] hover:bg-gray-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                        <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
