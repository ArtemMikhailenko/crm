"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Separator,
} from "@/shared/ui";
import {
  ArrowUpDown,
  ChevronDown,
  Columns3,
  MoreHorizontal,
  RefreshCcw,
  Search,
  Share2,
} from "lucide-react";

type Props = {
  userId?: string;
};

// Lightweight mock for visual layout
const MOCK_EMPLOYEES = Array.from({ length: 10 }).map((_, i) => ({
  id: String(1000 + i),
  name: [
    "Albert Flores",
    "Leslie Alexander",
    "Devon Lane",
    "Jane Cooper",
    "Floyd Miles",
  ][i % 5],
  role: ["Engineer", "Driver", "Operator"][i % 3],
  week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, j) => ({
    day: d,
    value: j < 5 ? "8:00–18:00" : "—",
  })),
}));

export function UserSchedulePage({ userId }: Props) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-[1304px] space-y-5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold leading-8 text-slate-900">
          User schedule
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => router.push(`/dashboard/users/${userId ?? ""}`)}
          >
            Back
          </Button>
        </div>
      </div>

      {/* Filters + Tabs + Actions (styled to match dark-apply layout) */}
      <Card className="rounded-2xl border-0 bg-white shadow-[0_5px_25px_rgba(107,114,128,0.12)]">
        <CardHeader className="gap-4 border-b p-6">
          {/* Filters row */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex w-full flex-1 items-end gap-4">
              {/* Search */}
              <div className="relative w-full max-w-[340px]">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input placeholder="Search" className="pl-9" />
              </div>

              {/* Company select (label on top) */}
              <div className="flex w-full max-w-[240px] flex-col gap-1">
                <span className="text-xs font-medium text-slate-500">Company</span>
                <button className="inline-flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-xs hover:bg-slate-50">
                  input_label
                  <ChevronDown className="ml-2 size-4 text-slate-400" />
                </button>
              </div>

              {/* Apply/Reset */}
              <div className="ml-auto flex items-center gap-3">
                <Button className="h-10 rounded-full bg-slate-900 px-6 text-white hover:bg-slate-900/90">
                  Apply
                </Button>
                <Button variant="outline" className="h-10 rounded-full px-6">
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs + Actions */}
          <div className="flex items-center justify-between">
            {/* Tabs */}
            <div className="flex items-center gap-6">
              <button className="relative pb-2 text-sm font-medium text-slate-900">
                Work schedule
                <span className="absolute -bottom-[1px] left-0 right-0 h-[3px] rounded-full bg-emerald-400" />
              </button>
              <button className="pb-2 text-sm font-medium text-slate-400 hover:text-slate-600">
                Employee vacations
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-xs hover:bg-slate-50">
                <Columns3 className="size-4 text-slate-400" />
                Columns
                <ChevronDown className="size-4 text-slate-400" />
              </button>
              <Button variant="outline" size="icon" className="rounded-full">
                <RefreshCcw className="size-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="size-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <MoreHorizontal className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Grid */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  {/* Sticky left group */}
                  <th className="sticky left-0 z-10 bg-slate-50 p-4 text-left text-[13px] font-medium text-slate-500 w-[220px]">
                    <span className="inline-flex items-center gap-1"><ArrowUpDown className="size-3" /> Name</span>
                  </th>
                  <th className="sticky left-[220px] z-10 bg-slate-50 p-4 text-left text-[13px] font-medium text-slate-500 w-[120px]">
                    ID
                  </th>
                  <th className="sticky left-[340px] z-10 bg-slate-50 p-4 text-left text-[13px] font-medium text-slate-500 w-[160px]">
                    <span className="inline-flex items-center gap-1"><ArrowUpDown className="size-3" /> Role</span>
                  </th>
                  {/* Days */}
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (d) => (
                      <th
                        key={d}
                        className="bg-slate-50 p-4 text-left text-[13px] font-medium text-slate-500"
                      >
                        {d}
                      </th>
                    )
                  )}
                  <th className="bg-slate-50 p-4 text-left text-[13px] font-medium text-slate-500">Actions</th>
                </tr>
                <tr>
                  <th className="sticky left-0 z-10 bg-slate-50 p-0 w-[220px]"><Separator /></th>
                  <th className="sticky left-[220px] z-10 bg-slate-50 p-0 w-[120px]"><Separator /></th>
                  <th className="sticky left-[340px] z-10 bg-slate-50 p-0 w-[160px]"><Separator /></th>
                  {Array.from({ length: 7 }).map((_, idx) => (
                    <th key={idx} className="bg-slate-50 p-0">
                      <Separator />
                    </th>
                  ))}
                  <th className="bg-slate-50 p-0"><Separator /></th>
                </tr>
              </thead>
              <tbody>
                {MOCK_EMPLOYEES.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    {/* Sticky left cells must match header left offsets */}
                    <td className="sticky left-0 z-[5] bg-white p-4 text-sm text-slate-900 w-[220px]">
                      {emp.name}
                    </td>
                    <td className="sticky left-[220px] z-[5] bg-white p-4 text-sm text-slate-600 w-[120px]">
                      {emp.id}
                    </td>
                    <td className="sticky left-[340px] z-[5] bg-white p-4 text-sm text-slate-600 w-[160px]">
                      {emp.role}
                    </td>

                    {emp.week.map((w, i) => (
                      <td key={`${emp.id}-${w.day}`} className="p-4 text-sm text-slate-700">
                        {w.value}
                      </td>
                    ))}

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="rounded-full">
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" className="rounded-full text-slate-500 hover:text-slate-700">
                          Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserSchedulePage;

