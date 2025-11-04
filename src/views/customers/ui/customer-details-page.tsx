"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock3,
  Building2,
  ReceiptText,
  MoreHorizontal,
  PlusSquare,
  Ellipsis,
  Phone,
  Mail,
} from "lucide-react";

import { Card } from "@/shared/ui/card";
import { Avatar } from "@/shared/ui/avatar";

export function CustomerDetailsPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-[1304px] space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-3 rounded-full border border-[#ccd5dc] px-6 py-3 text-[#2d3145]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_504px]">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Header card with basic info */}
          <Card className="rounded-2xl border-none bg-white p-0 shadow-[0_5px_25px_rgba(107,114,128,0.1)]">
            <div className="grid gap-5 px-8 pb-9 pt-5">
              <div className="flex items-start justify-between">
                <h1 className="text-[32px] font-bold leading-[1.4] text-[#2d3145]">
                  Biffco Enterprises Ltd.
                </h1>
                <div className="flex items-center gap-4 text-[14px] text-[#81838f]">
                  <span>id 45776890690</span>
                  <span>Edited Nov 11</span>
                  <button className="grid h-9 w-9 place-items-center rounded-full border border-[#aab8c2] bg-white">
                    <MoreHorizontal className="h-4 w-4 text-[#aab8c2]" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <InfoRow icon={<Clock3 className="h-5 w-5" />} label="Created" value="15/08/2017" />
                <InfoRow
                  icon={<Building2 className="h-5 w-5" />}
                  label="Registered address"
                  value="76, Velyka Arnautska St., Odesa, Ukraine, 65045, office 2"
                />
                <InfoRow
                  icon={<ReceiptText className="h-5 w-5" />}
                  label="Requisites"
                  value="IBAN: UA393287040000026002054312944 in JSC CB “PRIVATBANK”"
                />
              </div>
            </div>
          </Card>

          {/* Documents */}
          <Card className="rounded-2xl border-none bg-white p-0 shadow-[0_5px_25px_rgba(107,114,128,0.1)]">
            <div className="flex items-center justify-between px-6 pb-4 pt-5">
              <div className="text-[20px] font-bold text-[#2d3145]">Documents</div>
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-full bg-[#79c3b3] px-6 py-2 text-sm text-white">
                  <PlusSquare className="h-4 w-4" /> Add a new
                </button>
                <button className="grid h-9 w-9 place-items-center rounded-full border border-[#aab8c2] bg-white">
                  <MoreHorizontal className="h-4 w-4 text-[#aab8c2]" />
                </button>
              </div>
            </div>
            {/* Tabs (static) */}
            <div className="flex flex-wrap gap-3 px-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <button
                  key={i}
                  className={
                    "rounded-full px-4 py-1.5 text-[14px] " +
                    (i === 0
                      ? "text-[#79c3b3] shadow-[inset_0_-1px_0_0_#79c3b3]"
                      : "text-[#2d3145] shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.12)]")
                  }
                >
                  Lorem ipsum
                </button>
              ))}
            </div>

            {/* Thumbnails grid */}
            <div className="px-6 pb-6 pt-4">
              <div className="grid grid-cols-7 gap-6 max-lg:grid-cols-5 max-md:grid-cols-4 max-sm:grid-cols-3">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="space-y-1 text-center">
                    <div className="relative h-[71px] w-[71px] rounded-lg border border-[#c9e7e1] shadow-[0_5px_18px_rgba(96,153,143,0.2)]" />
                    <div className="text-[10px] text-[#2d3145]">Contract.png</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Customer projects table */}
          <Card className="rounded-2xl border-none bg-white p-0 shadow-[0_5px_25px_rgba(107,114,128,0.1)]">
            <div className="flex items-center justify-between px-4 pt-3">
              <div className="px-2 py-2 text-[20px] font-bold text-[#2d3145]">Customer projects</div>
              <div className="flex items-center gap-3 pr-2">
                <button className="flex items-center gap-2 rounded-full border border-[#ccd5dc] px-6 py-2 text-[14px] text-[#2d3145]">
                  Columns
                  <svg viewBox="0 0 24 24" className="h-4 w-4"><path d="M6 9l6 6 6-6" stroke="#2d3145" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button className="grid h-9 w-9 place-items-center rounded-full border border-[#aab8c2] bg-white">
                  <Ellipsis className="h-4 w-4 text-[#aab8c2]" />
                </button>
              </div>
            </div>

            {/* Header */}
            <div className="mt-2 grid grid-cols-[118px_1px_163px_1px_163px_1px_163px_1px_163px] items-center text-[14px]">
              <HeaderCell className="bg-[#eff2f5]">Дата</HeaderCell>
              <Divider />
              <HeaderCell className="bg-[#eff2f5]">Project name</HeaderCell>
              <Divider />
              <HeaderCell className="bg-[#eff2f5]">ID</HeaderCell>
              <Divider />
              <HeaderCell className="bg-[#eff2f5]">Менеджер</HeaderCell>
              <Divider />
              <HeaderCell className="bg-[#eff2f5]">Статус</HeaderCell>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#eff2f5]">
              {projects.map((p, i) => (
                <div key={i} className="grid grid-cols-[118px_1px_163px_1px_163px_1px_163px_1px_163px] text-[14px]">
                  <Cell>{p.date}</Cell>
                  <Divider />
                  <Cell>{p.name}</Cell>
                  <Divider />
                  <Cell>{p.id}</Cell>
                  <Divider />
                  <Cell>{p.manager}</Cell>
                  <Divider />
                  <Cell>
                    <span className={badgeClass(p.status)}>{p.status}</span>
                  </Cell>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Funds flow */}
          <Card className="rounded-2xl border-none bg-white p-0 shadow-[0_5px_25px_rgba(107,114,128,0.1)]">
            <div className="flex items-center justify-between px-6 py-5">
              <div className="text-[20px] font-bold text-[#2d3145]">Funds flow</div>
              <button className="grid h-9 w-9 place-items-center rounded-full border border-[#aab8c2] bg-white">
                <MoreHorizontal className="h-4 w-4 text-[#aab8c2]" />
              </button>
            </div>
            <div className="px-6 pb-2 text-[16px] text-[#2d3145]">
              $7,560 Debited & $5,420 Credited in this Week
            </div>
            <div className="px-6 pb-4 text-[14px] text-[#242737]">
              <div className="flex items-center gap-12">
                <Legend color="#6e41b7" label="Lorem ipsum" />
                <Legend color="#9b7de0" label="Lorem ipsum" />
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <DayBars key={i} />
                ))}
              </div>
            </div>
          </Card>

          {/* Contacts */}
          <Card className="rounded-2xl border-none bg-white p-0 shadow-[0_5px_25px_rgba(107,114,128,0.1)]">
            <div className="flex items-center justify-between px-6 py-5">
              <div className="text-[20px] font-bold text-[#2d3145]">Contacts</div>
              <button className="grid h-9 w-9 place-items-center rounded-full border border-[#aab8c2] bg-white">
                <MoreHorizontal className="h-4 w-4 text-[#aab8c2]" />
              </button>
            </div>
            <div className="space-y-6 px-6 pb-6">
              {contacts.map((c, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Avatar className="h-6 w-6" />
                  <div className="flex flex-col gap-1">
                    <div className="text-[14px] font-medium text-[#2d3145]">{c.name}</div>
                    <div className="flex items-center gap-2 text-[14px] text-[#81838f]">
                      <Phone className="h-4 w-4" /> {c.phone}
                    </div>
                    <div className="flex items-center gap-2 text-[14px] text-[#81838f]">
                      <Mail className="h-4 w-4" /> {c.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-6 text-[14px]">
      <div className="flex items-center gap-2 text-[#81838f]">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-[#2d3145]">{value}</div>
    </div>
  );
}

function Divider() {
  return <div className="h-12 w-px bg-[#f1f3f4]" />;
}

function HeaderCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={"px-4 py-3 text-[#2d3145] shadow-[inset_0_-6px_6px_-6px_rgba(0,0,0,0.15)] " + className}>{children}</div>
  );
}

function Cell({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-3 text-[#2d3145]">{children}</div>;
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[14px] text-[#242737]">
      <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </div>
  );
}

function DayBars() {
  return (
    <div className="flex h-40 items-end justify-center gap-2 rounded-lg border border-[#eff2f5] bg-[#fafbfc] p-1">
      <div className="h-1/3 w-2 rounded bg-[#9b7de0]" />
      <div className="h-2/3 w-2 rounded bg-[#6e41b7]" />
    </div>
  );
}

const projects = [
  { date: "16/08/2013", name: "Binford Ltd.", id: "8861", manager: "Flores, Juanita", status: "Planning" },
  { date: "15/08/2017", name: "Abstergo Ltd.", id: "8829", manager: "Nguyen, Shane", status: "Review" },
  { date: "15/08/2017", name: "Acme Co.", id: "1577", manager: "Nguyen, Shane", status: "Process" },
  { date: "18/09/2016", name: "Abstergo Ltd.", id: "9151", manager: "Flores, Juanita", status: "Process" },
  { date: "12/06/2020", name: "Biffco Enterprises Ltd.", id: "1374", manager: "Cooper, Kristin", status: "Pause" },
];

function badgeClass(status: string) {
  switch (status) {
    case "Planning":
      return "inline-flex items-center rounded-full bg-[#eee1f8] px-3 py-1 text-[12px] text-[#a868de]";
    case "Review":
      return "inline-flex items-center rounded-full bg-[#d0dbfb] px-3 py-1 text-[12px] text-[#164cec]";
    case "Process":
      return "inline-flex items-center rounded-full bg-[#e4f3f0] px-3 py-1 text-[12px] text-[#79c3b3]";
    case "Pause":
      return "inline-flex items-center rounded-full bg-[#fce7e2] px-3 py-1 text-[12px] text-[#ee896d]";
    default:
      return "inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[12px] text-slate-600";
  }
}

const contacts = [
  { name: "Henry Arthur", phone: "(217) 555-0113", email: "binhan628@gmail.com" },
  { name: "Henry Arthur", phone: "(217) 555-0113", email: "binhan628@gmail.com" },
  { name: "Henry Arthur", phone: "(217) 555-0113", email: "binhan628@gmail.com" },
  { name: "Henry Arthur", phone: "(217) 555-0113", email: "binhan628@gmail.com" },
];

export default CustomerDetailsPage;
