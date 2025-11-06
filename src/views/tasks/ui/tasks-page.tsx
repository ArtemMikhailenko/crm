"use client";

import { Card, CardContent } from "@/shared/ui/card";
import {
  Calendar,
  ChevronDown,
  Ellipsis,
  Filter as FilterIcon,
  PlusSquare,
  Search,
  Printer,
  Upload,
  ArrowLeft,
  Book,
  UploadCloud,
  XCircle,
  FileText,
} from "lucide-react";
import { useState } from "react";

// Mock data for tasks table
const rows = [
  {
    createdAt: "16/08/2013",
    startDate: "18/08/2013",
    comment:
      "An interesting implication of the 2007 study concerns the use of hand sanitizers by observant Muslim",
    client: "Binford Ltd.",
    projectId: "P-8861",
    taskType: "Task",
    createdBy: "Flores, Juanita",
    responsible: "Nguyen, Shane",
  },
  {
    createdAt: "15/08/2017",
    startDate: "17/08/2017",
    comment: "Even factoring differences in body wei…",
    client: "Abstergo Ltd.",
    projectId: "P-8829",
    taskType: "Feature",
    createdBy: "Nguyen, Shane",
    responsible: "Cooper, Kristin",
  },
  {
    createdAt: "12/06/2020",
    startDate: "13/06/2020",
    comment: "Simultaneously we had a problem wit…",
    client: "Acme Co.",
    projectId: "P-6025",
    taskType: "Task",
    createdBy: "Cooper, Kristin",
    responsible: "Flores, Juanita",
  },
];

export function TasksPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* Top bar: title + create button */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">All tasks (64)</h1>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-3 rounded-full bg-[#2d3145] px-6 py-3 text-white"
          >
            <PlusSquare className="h-5 w-5" />
            <span className="text-base">Create new task</span>
          </button>
        </div>

        {/* Filter card (as in Figma) */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_5px_25px_rgba(107,114,128,0.15)]">
          {/* Row 1: search + sort circle */}
          <div className="flex items-end gap-2">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative w-full max-w-[1193px]">
                <input
                  className="h-12 w-full rounded-full border border-[#ccd5dc] bg-white pl-11 pr-4 text-sm text-slate-700 placeholder-[#81838f] focus:outline-none"
                  placeholder="Search"
                />
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#81838f]" />
              </div>
            </div>
            <button className="grid h-12 w-12 place-items-center rounded-full bg-[#2d3145] text-white">
              <FilterIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Row 2: Date of Creation, Start of execution, Type, Client */}
          <div className="mt-5 flex items-center gap-6">
            <Field label="Date of Creation">
              <div className="relative w-[296px]">
                <input
                  className="h-12 w-full rounded-full border border-[#ccd5dc] bg-white pl-11 pr-4 text-sm text-slate-700 placeholder-[#abadb5] focus:outline-none"
                  placeholder="input_label"
                  type="text"
                />
                <Calendar className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#abadb5]" />
              </div>
            </Field>
            <Field label="Start of execution">
              <div className="relative w-[296px]">
                <input
                  className="h-12 w-full rounded-full border border-[#ccd5dc] bg-white pl-11 pr-4 text-sm text-slate-700 placeholder-[#abadb5] focus:outline-none"
                  placeholder="input_label"
                  type="text"
                />
                <Calendar className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#abadb5]" />
              </div>
            </Field>
            <Field label="Type">
              <button className="flex h-12 w-[296px] items-center justify-between rounded-full border border-[#ccd5dc] bg-white px-4 text-sm text-[#abadb5]">
                input_label <ChevronDown className="h-5 w-5 text-[#abadb5]" />
              </button>
            </Field>
            <Field label="Client">
              <button className="flex h-12 w-[296px] items-center justify-between rounded-full border border-[#ccd5dc] bg-white px-4 text-sm text-[#abadb5]">
                input_label <ChevronDown className="h-5 w-5 text-[#abadb5]" />
              </button>
            </Field>
          </div>

          {/* Row 3: Created, Responsible, Reset, Apply */}
          <div className="mt-5 flex items-center gap-5">
            <Field label="Created">
              <button className="flex h-12 w-[299px] items-center justify-between rounded-full border border-[#ccd5dc] bg-white px-4 text-sm text-[#abadb5]">
                input_label <ChevronDown className="h-5 w-5 text-[#abadb5]" />
              </button>
            </Field>
            <Field label="Responsible">
              <button className="flex h-12 w-[299px] items-center justify-between rounded-full border border-[#ccd5dc] bg-white px-4 text-sm text-[#abadb5]">
                input_label <ChevronDown className="h-5 w-5 text-[#abadb5]" />
              </button>
            </Field>
            <div className="ml-auto flex items-center gap-5">
              <button className="h-12 rounded-full border border-[#2d3145] px-6 text-base text-[#2d3145]">Reset</button>
              <button className="h-12 rounded-full bg-[#2d3145] px-6 text-base text-white">Apply</button>
            </div>
          </div>
        </div>

        {/* Table card (tabs header inside) */}
        <Card className="shadow-[0_5px_25px_rgba(107,114,128,0.2)]">
          <CardContent className="p-0">
            {/* Tabs + right controls inside white block */}
            <div className="flex items-center justify-between px-4 pb-3 pt-4">
              <div className="flex items-center gap-8">
                <button className="relative pb-2 text-[#67b9a6]">
                  Current
                  <span className="absolute left-0 right-[-16px] -bottom-[2px] h-[2px] bg-[#67b9a6]" />
                </button>
                <button className="pb-2 text-[#2d3145] opacity-80">Completed</button>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-full border border-[#ccd5dc] bg-white px-5 py-2 text-sm text-[#2d3145]">
                  Columns <ChevronDown className="h-4 w-4" />
                </button>
                <button className="grid h-9 w-9 place-items-center rounded-full border border-[#aab8c2] bg-white text-slate-600">
                  <Printer className="h-5 w-5" />
                </button>
                <button className="grid h-9 w-9 place-items-center rounded-full border border-[#aab8c2] bg-white text-slate-600">
                  <Upload className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="border-b border-[#e9edf0]" />

            {/* Header band */}
            <div className="grid grid-cols-[160px_160px_1fr_220px_160px_160px_200px_200px_56px] items-center border-b border-[#e9edf0] bg-[#eff2f5] text-[14px] text-[#2d3145] shadow-[inset_0_-6px_6px_-6px_rgba(0,0,0,0.15)]">
              <div className="px-4 py-3">Creation Date</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">Start Date</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">Comment</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">Client</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">Project ID</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">Task Type</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">Created By</div>
              <div className="border-l border-[#f1f3f4] px-4 py-3">Responsible</div>
              <div className="border-l border-[#f1f3f4] px-2 py-3 text-right">&nbsp;</div>
            </div>

            {/* Body */}
            <div>
              {rows.map((r, i) => (
                <div
                  key={i}
                  className={
                    "grid grid-cols-[160px_160px_1fr_220px_160px_160px_200px_200px_56px] items-center border-b border-[#eff2f5] text-[14px] text-[#2d3145] " +
                    (i % 2 === 0 ? "bg-white" : "bg-emerald-50/30")
                  }
                >
                  <div className="px-4 py-3">{r.createdAt}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">{r.startDate}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3 text-slate-600">{r.comment}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">{r.client}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">{r.projectId}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">{r.taskType}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">{r.createdBy}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">{r.responsible}</div>
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

        {/* Right-side drawer: Task creation */}
        {isCreateOpen && <TaskDrawer onClose={() => setIsCreateOpen(false)} />}
      </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-auto flex-col gap-1">
      <div className="text-[14px] font-medium text-[#2d3145]">{label}</div>
      {children}
    </div>
  );
}

function TaskDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* panel */}
      <div
        className="absolute right-0 top-0 h-full w-[611px] overflow-y-auto bg-white px-6 pb-8"
        style={{ boxShadow: "-36px 3px 23px -23px rgba(69,97,118,0.25)" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Task creation"
      >
        {/* Back row */}
        <div className="w-full pt-4">
          <button
            onClick={onClose}
            className="flex h-[45px] w-[114px] items-center justify-center gap-3 rounded-full border border-[#ccd5dc] px-6 text-[14px] text-[#2d3145]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="mt-4 h-px w-full bg-[#ccd5dc]" />
        </div>

        {/* Title */}
        <div className="mt-6 flex w-full items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-md text-[#2d3145]">
            <Book className="h-9 w-9" />
          </div>
          <div className="text-[24px] font-bold leading-[1.4] text-[#2d3145]">Task creation</div>
        </div>

        {/* Form body */}
        <div className="mt-6 w-full">
          <div className="w-full">
            {/* Select type */}
            <LabeledSelect label="Select type" placeholder="input_label" />
            {/* Project */}
            <LabeledSelect label="Project" placeholder="input_label" />
            {/* Responsible */}
            <LabeledSelect label="Responsible" placeholder="input_label" />
            {/* Essence */}
            <LabeledSelect label="Essence" placeholder="input_label" />

            {/* File upload */}
            <div className="mt-4">
              <div className="rounded-2xl border border-dashed border-[#aab8c2] px-6 py-6 text-center">
                <UploadCloud className="mx-auto h-9 w-9 text-[#2d3145]" />
                <div className="mt-6 text-[14px] text-[#2d3145]">Select your file or drag and drop</div>
                <div className="text-[12px] text-[#81838f]">png, pdf, jpg, doxaccepted</div>
                <div className="mt-4 flex justify-center">
                  <button className="flex h-[45px] items-center justify-center gap-2 rounded-full border border-[#ccd5dc] px-6 text-[14px] text-[#2d3145]">
                    Browse
                  </button>
                </div>
              </div>

              {/* Documents row */}
              <div className="mt-6 flex w-full flex-wrap items-start gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="grid h-12 w-12 place-items-center rounded-md bg-white">
                      <FileText className="h-10 w-10 text-[#7c3aed]" />
                    </div>
                    <div className="text-[10px] text-[#2d3145]">Document title</div>
                    <button className="text-[#aab8c2]">
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mt-6">
              <div className="mb-1 text-[14px] font-medium text-[#242737]">Comment</div>
              <textarea
                placeholder="text_area"
                className="h-20 w-full resize-none rounded-2xl border border-[#ccd5dc] px-4 py-3 text-[14px] text-[#2d3145] placeholder-[#abadb5] focus:outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="mb-6 mt-6 flex w-full items-center gap-4">
              <button
                onClick={onClose}
                className="flex h-[51px] w-1/2 items-center justify-center gap-3 rounded-full border border-[#ccd5dc] px-6 text-[18px] text-[#2d3145]"
              >
                Cancel
              </button>
              <button className="flex h-[51px] w-1/2 items-center justify-center gap-3 rounded-full bg-[#2d3145] px-6 text-[18px] text-white">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LabeledSelect({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div className="mb-4">
      <div className="mb-1 text-[14px] font-medium text-[#2d3145]">{label}</div>
      <button className="flex h-[49px] w-full items-center justify-between rounded-full border border-[#ccd5dc] bg-white px-4 text-[14px] text-[#abadb5]">
        {placeholder}
        <ChevronDown className="h-5 w-5 text-[#2d3145] opacity-60" />
      </button>
    </div>
  );
}
