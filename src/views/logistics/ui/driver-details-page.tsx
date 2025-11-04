"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";
import { ArrowLeft, Car, Ellipsis, Plus, Trash2, X, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/shared/ui/modal";

type CarRow = { name: string; number: string; transportType: string };
type TaskRow = {
  type: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  mileageStart: number;
  odoStart: string;
  mileageEnd: number;
  odoEnd: string;
  pointA: string;
  pointB: string;
  commentary: string;
};

const initialCars: CarRow[] = [
  { name: "Glass", number: "423", transportType: "561" },
  { name: "Primer", number: "738", transportType: "423" },
  { name: "Brick", number: "740", transportType: "196" },
];

const tasks: TaskRow[] = [
  {
    type: "Clarify details",
    startDate: "18/09/2016",
    startTime: "11:23 pm",
    endDate: "18/09/2016",
    endTime: "11:23 pm",
    mileageStart: 1374,
    odoStart: "bulldozer",
    mileageEnd: 9462,
    odoEnd: "bulldozer",
    pointA: "4517 W…",
    pointB: "4517 W…",
    commentary: "An interesting implic…",
  },
  {
    type: "Approval",
    startDate: "18/09/2016",
    startTime: "05:14 pm",
    endDate: "18/09/2016",
    endTime: "05:14 pm",
    mileageStart: 5028,
    odoStart: "crane",
    mileageEnd: 1439,
    odoEnd: "crane",
    pointA: "8502 Pr…",
    pointB: "8502 Pr…",
    commentary: "Even factoring differ…",
  },
  {
    type: "Clarify details",
    startDate: "18/09/2016",
    startTime: "10:41 pm",
    endDate: "18/09/2016",
    endTime: "10:41 pm",
    mileageStart: 2798,
    odoStart: "bulldozer",
    mileageEnd: 3536,
    odoEnd: "bulldozer",
    pointA: "2464 Ra…",
    pointB: "2464 Ra…",
    commentary: "So yes, the alcohol (et…",
  },
];

export function DriverDetailsPage() {
  const router = useRouter();
  const [cars, setCars] = useState<CarRow[]>(initialCars);
  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState({
    transportType: "",
    vehicleName: "",
    number: "",
    comment: "",
  });

  function resetForm() {
    setForm({ transportType: "", vehicleName: "", number: "", comment: "" });
  }

  function onSave() {
    // Basic client-side validation
    if (!form.transportType || !form.vehicleName || !form.number) {
      alert("Fill required fields");
      return;
    }
    setCars((prev) => [
      ...prev,
      {
        name: form.vehicleName,
        number: form.number,
        transportType: form.transportType,
      },
    ]);
    setOpenAdd(false);
    resetForm();
  }

  return (
    <div className="mx-auto w-full max-w-[1304px] space-y-5">
      {/* Top header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 text-sm text-[#2d3145] hover:opacity-80"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://i.pravatar.cc/96?img=15" alt="Albert Flores" />
              <AvatarFallback>AF</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-semibold text-[#2d3145] sm:text-2xl">Albert Flores</div>
              <div className="text-xs text-[#7b7f8f]">(217) 555-0113 · binhan628@gmail.com</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-[#7b7f8f]">
          <div className="text-[#2d3145]">id 45776899690</div>
          <div className="hidden sm:block">Created Nov 11</div>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-[#ccd5dc]">
            <Ellipsis className="h-5 w-5 text-[#2d3145]" />
          </button>
        </div>
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Rate and Salary */}
        <Card className="rounded-2xl border border-[#eef1f4] bg-white p-0 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#eff2f5] px-6 py-4">
            <div className="text-lg font-semibold text-[#2d3145]">Rate and Salary</div>
            <button className="grid h-9 w-9 place-items-center rounded-full border border-[#ccd5dc]">
              <Ellipsis className="h-5 w-5 text-[#2d3145]" />
            </button>
          </div>
          <CardContent className="px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
              {/* Left column with action */}
              <div className="flex flex-col gap-3">
                <Button className="h-10 w-[160px] rounded-full bg-[#2d3145] text-white">Start working</Button>
                <div className="flex items-center gap-2 text-sm text-[#7b7f8f]">
                  <span className="text-[#2d3145]">Type of work</span>
                  <span>Driver</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#7b7f8f]">
                  <span className="text-[#2d3145]">Rate</span>
                  <span className="text-[#2d3145] font-medium">$77</span>
                </div>
              </div>

              {/* Right schedule */}
              <div>
                <div className="text-sm text-[#2d3145]">Schedule</div>
                <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-[#7b7f8f]">
                  <span>Mon. 8:00-18:00</span>
                  <span>Thurs. 8:00-18:00</span>
                  <span>Tues. 8:00-18:00</span>
                  <span>Fri. 8:00-18:00</span>
                  <span>Wed. 8:00-18:00</span>
                  <span>Sat. 8:00-18:00</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My cars */}
        <Card className="rounded-2xl border border-[#eef1f4] bg-white p-0 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#eff2f5] px-6 py-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-[#2d3145]">
              <Car className="h-5 w-5" /> My cars
            </div>
            <div className="flex items-center gap-3">
              <Button className="h-10 rounded-full bg-[#2d3145] text-white" onClick={() => setOpenAdd(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add a car
              </Button>
              <button className="grid h-9 w-9 place-items-center rounded-full border border-[#ccd5dc]">
                <Ellipsis className="h-5 w-5 text-[#2d3145]" />
              </button>
            </div>
          </div>
          <CardContent className="p-0">
            <div className="grid grid-cols-[1fr_160px_160px_60px] bg-[#eff2f5] text-sm text-[#2d3145]">
              <div className="px-4 py-2">Name</div>
              <div className="border-l border-[#f1f3f4] px-4 py-2">Number</div>
              <div className="border-l border-[#f1f3f4] px-4 py-2">transport type</div>
              <div className="border-l border-[#f1f3f4] px-4 py-2" />
            </div>
            {cars.map((c, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_160px_160px_60px] items-center border-b border-[#eff2f5] text-sm text-[#2d3145]"
              >
                <div className="px-4 py-2">{c.name}</div>
                <div className="border-l border-[#f1f3f4] px-4 py-2">{c.number}</div>
                <div className="border-l border-[#f1f3f4] px-4 py-2">{c.transportType}</div>
                <div className="border-l border-[#f1f3f4] px-2 py-2">
                  <button className="flex h-6 w-6 items-center justify-center text-[#2d3145] hover:bg-gray-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                      <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* My tasks */}
      <Card className="rounded-2xl border border-[#eef1f4] bg-white p-0 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#eff2f5] px-6 py-4">
          <div className="text-lg font-semibold text-[#2d3145]">My tasks</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-full">
              Columns
            </Button>
            <button className="grid h-9 w-9 place-items-center rounded-full border border-[#ccd5dc]">
              <Ellipsis className="h-5 w-5 text-[#2d3145]" />
            </button>
          </div>
        </div>
        <div className="overflow-hidden rounded-b-2xl bg-white shadow-[0_5px_25px_rgba(107,114,128,0.15)]">
          <div className="grid grid-cols-[160px_140px_120px_140px_120px_160px_140px_160px_140px_140px_1fr_60px] bg-[#eff2f5] text-sm text-[#2d3145]">
            {[
              "Trip type",
              "Start date",
              "Start time",
              "End date",
              "End time",
              "Mileage at the start",
              "Odometer photo",
              "Mileage at the end",
              "Odometer photo",
              "Point A",
              "Point A",
              "Commentary",
            ].map((h, idx) => (
              <div key={idx} className={cn("px-4 py-2", idx !== 0 && "border-l border-[#f1f3f4]")}>{h}</div>
            ))}
          </div>
          {tasks.map((t, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[160px_140px_120px_140px_120px_160px_140px_160px_140px_140px_1fr_60px] items-center border-b border-[#eff2f5] text-sm text-[#2d3145]"
            >
              <div className="px-4 py-2">{t.type}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-2">{t.startDate}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-2">{t.startTime}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-2">{t.endDate}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-2">{t.endTime}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-2">{t.mileageStart}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-2">{t.odoStart}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-2">{t.mileageEnd}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-2">{t.odoEnd}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-2">{t.pointA}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-2">{t.pointB}</div>
              <div className="border-l border-[#f1f3f4] px-4 py-2 text-slate-600">{t.commentary}</div>
            </div>
          ))}
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
        {/* delete link row */}
        <div className="mb-2 flex items-center justify-end gap-2 text-sm text-[#575a6a]">
          <Trash2 className="h-4 w-4" /> delete
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {/* Select transport type */}
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

          {/* Vehicle name */}
          <div>
            <div className="mb-1 text-sm font-medium text-[#2d3145]">Vehicle name</div>
            <Input
              placeholder="input_label"
              className="h-[49px] rounded-full border-[#ccd5dc] text-sm placeholder:text-[#abadb5]"
              value={form.vehicleName}
              onChange={(e) => setForm((f) => ({ ...f, vehicleName: e.target.value }))}
            />
          </div>

          {/* Number */}
          <div>
            <div className="mb-1 text-sm font-medium text-[#2d3145]">Number</div>
            <Input
              placeholder="input_label"
              className="h-[49px] rounded-full border-[#ccd5dc] text-sm placeholder:text-[#abadb5]"
              value={form.number}
              onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
            />
          </div>

          {/* Comment */}
          <div>
            <div className="mb-1 text-sm font-medium text-[#242737]">Comment</div>
            <textarea
              placeholder="text_area"
              className="min-h-20 w-full rounded-xl border border-[#ccd5dc] px-4 py-3 text-sm text-[#2d3145] placeholder:text-[#abadb5]"
              value={form.comment}
              onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
            />
          </div>

          {/* Footer buttons */}
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
              onClick={onSave}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DriverDetailsPage;
