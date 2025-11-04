"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Dot,
  Ellipsis,
  Mail,
  Phone,
} from "lucide-react";

type Driver = {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
};

type Vehicle = {
  id: string;
  name: string;
  number: string;
  year: number;
  type: string;
  vin: string;
  dataSheet: string;
  mileage: string;
  fuelType: string;
  expensePer100: string;
  amortization: string;
};

type HistoryEntry = {
  date: string;
  projectNumber: string;
  driver: string;
  mileageStart: string | number;
  mileageEnd: string | number;
  travelTime: string;
  fuelFlow: string | number;
  commentary: string;
  startPhoto: string; // icon name placeholder
  endPhoto: string; // icon name placeholder
};

const vehicle: Vehicle = {
  id: "car-1",
  name: "Mercedes-Benz Axor",
  number: "ERA 77 0X",
  year: 2020,
  type: "Manipulator",
  vin: "57835985909905",
  dataSheet: "JJ78965",
  mileage: "56000 km",
  fuelType: "diesel",
  expensePer100: "40 ltr.",
  amortization: "1240 czk",
};

const drivers: Driver[] = [
  {
    id: "d1",
    name: "Henry Arthur",
    phone: "(217) 555-0113",
    email: "binhan628@gmail.com",
    avatar: "https://i.pravatar.cc/96?img=21",
  },
  {
    id: "d2",
    name: "Henry Arthur",
    phone: "(217) 555-0113",
    email: "binhan628@gmail.com",
    avatar: "https://i.pravatar.cc/96?img=26",
  },
];

const history: HistoryEntry[] = [
  {
    date: "18/09/2016",
    projectNumber: "307,555,0133",
    driver: "Darrell Steward",
    mileageStart: 1374,
    startPhoto: "bulldozer",
    mileageEnd: 9462,
    endPhoto: "bulldozer",
    travelTime: "12:33:18",
    fuelFlow: 185,
    commentary: "An interesting implic…",
  },
  {
    date: "18/09/2016",
    projectNumber: "406,555,0120",
    driver: "Jane Cooper",
    mileageStart: 5028,
    startPhoto: "crane",
    mileageEnd: 1439,
    endPhoto: "crane",
    travelTime: "05:30:21",
    fuelFlow: 540,
    commentary: "Even factor…",
  },
  {
    date: "18/09/2016",
    projectNumber: "252,555,0126",
    driver: "Arlene McCoy",
    mileageStart: 2798,
    startPhoto: "bulldozer",
    mileageEnd: 3536,
    endPhoto: "bulldozer",
    travelTime: "13:11:35",
    fuelFlow: 816,
    commentary: "So yes, the a…",
  },
];

export function CarDetailsPage() {
  return (
    <div className="mx-auto w-full max-w-[1304px] space-y-5">
      {/* Top heading */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm text-[#2d3145] hover:opacity-80">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-[28px] font-bold leading-[1.4] text-[#2d3145] sm:text-[32px]">
            {vehicle.name}
          </h1>
        </div>
        <div className="flex items-center gap-6 text-sm text-[#7b7f8f]">
          <div className="text-[#2d3145]">{vehicle.number}</div>
          <div className="hidden items-center gap-2 sm:flex">
            <Calendar className="h-4 w-4" />
            <span>Created Nov 11</span>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-[#ccd5dc]">
            <Ellipsis className="h-5 w-5 text-[#2d3145]" />
          </button>
        </div>
      </div>

      {/* Two top cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Vehicle data */}
        <Card className="rounded-2xl border border-[#eef1f4] bg-white p-0 shadow-sm">
          <CardHeader className="flex-row items-center justify-between border-b border-[#eff2f5] py-4">
            <CardTitle className="text-[#2d3145]">Vehicle data</CardTitle>
            <button className="grid h-9 w-9 place-items-center rounded-full border border-[#ccd5dc]">
              <Ellipsis className="h-5 w-5 text-[#2d3145]" />
            </button>
          </CardHeader>
          <CardContent className="px-4 py-5 sm:px-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {/* Left column */}
              <InfoItem label="Year in issue" value={vehicle.year} />
              <InfoItem label="Mileage" value={vehicle.mileage} />
              <InfoItem label="Type" value={vehicle.type} />
              <InfoItem label="Fuel Type" value={vehicle.fuelType} />
              <InfoItem label="VIN" value={vehicle.vin} />
              <InfoItem label="Expense per 100 km" value={vehicle.expensePer100} />
              <InfoItem label="Data Sheet" value={vehicle.dataSheet} />
              <InfoItem label="Amortization/m" value={vehicle.amortization} />
            </div>
          </CardContent>
        </Card>

        {/* Secured drivers */}
        <Card className="rounded-2xl border border-[#eef1f4] bg-white p-0 shadow-sm">
          <CardHeader className="flex-row items-center justify-between border-b border-[#eff2f5] py-4">
            <CardTitle className="text-[#2d3145]">Secured drivers</CardTitle>
            <button className="grid h-9 w-9 place-items-center rounded-full border border-[#ccd5dc]">
              <Ellipsis className="h-5 w-5 text-[#2d3145]" />
            </button>
          </CardHeader>
          <CardContent className="space-y-4 px-4 py-5 sm:px-6">
            {drivers.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-xl border border-[#eff2f5] p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={d.avatar} alt={d.name} />
                    <AvatarFallback>{d.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-[#2d3145]">{d.name}</div>
                    <div className="mt-1 flex items-center gap-4 text-xs text-[#7b7f8f]">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> {d.phone}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" /> {d.email}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="grid h-9 w-9 place-items-center rounded-full border border-[#ccd5dc]">
                  <Ellipsis className="h-5 w-5 text-[#2d3145]" />
                </button>
              </div>
            ))}

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="size-1.5 rounded-full bg-[#bfc2cc]" />
              <span className="size-1.5 rounded-full bg-[#2d3145]" />
              <span className="size-1.5 rounded-full bg-[#bfc2cc]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History filter */}
      <section className="rounded-2xl border border-[#eef1f4] bg-white p-0">
        <div className="border-b border-[#eff2f5] px-6 py-4">
          <h2 className="text-xl font-semibold text-[#2d3145]">History</h2>
        </div>
        <div className="flex flex-wrap items-end gap-6 px-6 py-5">
          <div className="w-[232px] flex-1 min-w-[220px]">
            <div className="mb-1.5 text-sm font-medium text-[#2d3145]">
              Select a period
            </div>
            <div className="relative">
              <Input
                placeholder="input_label"
                className="h-[49px] rounded-[48px] border-[#ccd5dc] pr-10 text-sm text-[#abadb5] placeholder:text-[#abadb5]"
              />
              <ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2d3145]" />
            </div>
          </div>
          <div className="w-[232px] flex-1 min-w-[220px]">
            <div className="mb-1.5 text-sm font-medium text-[#2d3145]">
              Project Number
            </div>
            <div className="relative">
              <Input
                placeholder="input_label"
                className="h-[49px] rounded-[48px] border-[#ccd5dc] pr-10 text-sm text-[#abadb5] placeholder:text-[#abadb5]"
              />
              <ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2d3145]" />
            </div>
          </div>

          <Button className="h-12 w-[232px] rounded-full bg-[#2d3145] text-base text-white hover:bg-[#2d3145]/90">
            Apply
          </Button>
          <Button
            variant="outline"
            className="h-12 w-[232px] rounded-full border-[#2d3145] text-base text-[#2d3145] hover:bg-[#2d3145]/10"
          >
            Reset
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-b-2xl bg-white shadow-[0_5px_25px_rgba(107,114,128,0.3)]">
          {/* Header */}
          <div className="grid grid-cols-[150px_170px_200px_170px_160px_170px_160px_120px_120px_1fr_60px] border-y border-[#eff2f5] bg-[#eff2f5] text-sm text-[#2d3145]">
            {[
              "Date",
              "Project Number",
              "Driver",
              "Mileage at the start",
              "Odometer photo",
              "Mileage at the end",
              "Odometer photo",
              "Travel time",
              "Fuel flow",
              "Commentary",
            ].map((h, idx) => (
              <div
                key={h}
                className={cn(
                  "flex items-center gap-2 px-4 py-3",
                  idx !== 0 && "border-l border-[#f1f3f4]"
                )}
              >
                {/* Sort icon mimic */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 4L11 7H5L8 4Z" fill="currentColor" opacity="0.5" />
                  <path d="M8 12L5 9H11L8 12Z" fill="currentColor" opacity="0.5" />
                </svg>
                {h}
              </div>
            ))}
            <div className="border-l border-[#f1f3f4] px-4 py-3" />
          </div>

          {/* Rows */}
          <div>
            {history.map((r, i) => (
              <div
                key={i}
                className="grid grid-cols-[150px_170px_200px_170px_160px_170px_160px_120px_120px_1fr_60px] items-center border-b border-[#eff2f5] text-sm text-[#2d3145]"
              >
                <div className="px-4 py-3">{r.date}</div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">{r.projectNumber}</div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">
                  <Link
                    href={`/dashboard/logistics/drivers/${encodeURIComponent(r.driver)}`}
                    className="text-[#2d3145] hover:underline"
                  >
                    {r.driver}
                  </Link>
                </div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">{r.mileageStart}</div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">{r.startPhoto}</div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">{r.mileageEnd}</div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">{r.endPhoto}</div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">{r.travelTime}</div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">{r.fuelFlow}</div>
                <div className="border-l border-[#f1f3f4] px-4 py-3 text-slate-600">{r.commentary}</div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">
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
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="text-xs text-[#7b7f8f]">{label}</div>
      <div className="truncate text-[14px] font-medium text-[#2d3145]">{value}</div>
    </div>
  );
}

export default CarDetailsPage;
