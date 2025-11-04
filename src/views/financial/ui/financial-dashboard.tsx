"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Search,
  Download,
  Wallet,
  CreditCard,
  PiggyBank,
  Coins,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Calendar,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  hint?: string;
}

const MetricCard = ({ title, value, icon, hint }: MetricCardProps) => {
  return (
    <Card
      className="rounded-2xl h-[104px] w-[248px] shadow-[3px_5px_25.2px_rgba(107,114,128,0.3)] border-0 bg-white"
    >
      <CardContent className="px-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-[#2d3145] text-white flex items-center justify-center">
              {/* Icons sized to 20px to fit the 32px chip nicely */}
              <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
            </div>
            <span className="text-[18px] leading-none text-[#2d3145] font-medium">{title}</span>
          </div>
          <div>
            <span className="text-[20px] font-bold text-[#2d3145]">{value}</span>
            {hint && (
              <span className="ml-2 text-xs text-muted-foreground align-middle">{hint}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface TransactionRow {
  id: string;
  date: string;
  documentAmount: string; // +/- formatted currency
  counterparty: string;
  projectNo: string;
  orderValue: string;
  materialsSum: string;
  paymentWithVAT: string;
  costOfWork: string;
  markup: string;
  comment: string;
  status: "Planning" | "Process" | "Pause" | "Review";
  file: string;
}

const mockTransactions: TransactionRow[] = [
  {
    id: "1",
    date: "15/08/2017",
    documentAmount: "$779.58",
    counterparty: "Ferrari",
    projectNo: "702.555...",
    orderValue: "4152",
    materialsSum: "7791",
    paymentWithVAT: "1784",
    costOfWork: "$475.22",
    markup: "$475.22",
    comment: "Even fact...",
    status: "Planning",
    file: "Text",
  },
  {
    id: "2",
    date: "12/06/2020",
    documentAmount: "$490.51",
    counterparty: "McDonald...",
    projectNo: "4.06.555...",
    orderValue: "2798",
    materialsSum: "3933",
    paymentWithVAT: "8013",
    costOfWork: "$396.84",
    markup: "$396.84",
    comment: "The stud...",
    status: "Process",
    file: "Text",
  },
  {
    id: "3",
    date: "28/10/2012",
    documentAmount: "$767.50",
    counterparty: "Pizza Hut",
    projectNo: "307.555...",
    orderValue: "7791",
    materialsSum: "8829",
    paymentWithVAT: "4600",
    costOfWork: "$202.87",
    markup: "$202.87",
    comment: "Simultan...",
    status: "Process",
    file: "Text",
  },
  {
    id: "4",
    date: "12/06/2020",
    documentAmount: "$169.43",
    counterparty: "Sony",
    projectNo: "217.555...",
    orderValue: "9462",
    materialsSum: "9261",
    paymentWithVAT: "9151",
    costOfWork: "$710.68",
    markup: "$710.68",
    comment: "An avera...",
    status: "Planning",
    file: "Text",
  },
  {
    id: "5",
    date: "18/09/2016",
    documentAmount: "$105.55",
    counterparty: "eBay",
    projectNo: "207.555...",
    orderValue: "2798",
    materialsSum: "1577",
    paymentWithVAT: "9359",
    costOfWork: "$105.55",
    markup: "$105.55",
    comment: "The prin...",
    status: "Pause",
    file: "Text",
  },
  {
    id: "6",
    date: "16/08/2013",
    documentAmount: "$396.84",
    counterparty: "General...",
    projectNo: "270.555...",
    orderValue: "4600",
    materialsSum: "1374",
    paymentWithVAT: "9374",
    costOfWork: "$779.58",
    markup: "$779.58",
    comment: "Their blo...",
    status: "Process",
    file: "Text",
  },
];

export const FinancialDashboard = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* KPI row (exact 5 cards at 248px each -> 1304px). Prevent wrapping and allow horizontal scroll if viewport is narrow. */}
      <div className="pb-2">
        <div className="min-w-[1304px] flex gap-4">
          <MetricCard title="Total" value="$396 840 797" icon={<Wallet className="h-5 w-5" />} />
          <MetricCard title="Paid" value="$396 840 797" icon={<CreditCard className="h-5 w-5" />} />
          <MetricCard title="Expected" value="$396 840 797" icon={<PiggyBank className="h-5 w-5" />} />
          <MetricCard title="Expenses" value="$396" icon={<Coins className="h-5 w-5" />} />
          <MetricCard title="Profit" value="$396 840 797" icon={<TrendingUp className="h-5 w-5" />} />
        </div>
      </div>

      {/* Search + Filters card */}
      <Card className="rounded-2xl">
        {/* Match Figma paddings: px-24, pt-20, pb-36 (=> px-6 pt-5 pb-9) */}
        <CardContent className="px-6 pt-5 pb-9 space-y-4">
          {/* Search row: 1200x49 rounded-48 with #ccd5dc border, plus 48px circular button */}
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9aa8b4]" />
              <Input
                placeholder="Search"
                className="pl-11 h-[49px] rounded-[48px] bg-white border border-[#ccd5dc] text-[#2d3145] placeholder:text-[#abadb5]"
              />
            </div>
            <Button size="icon" className="h-12 w-12 rounded-full bg-[#2d3145] text-white hover:bg-[#2d3145]/90">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Filters row: 4 selects + 2 buttons at 196px width each, 16px gaps */}
          <div className="flex flex-wrap items-end gap-4">
            {/* Period */}
            <div className="w-[196px] space-y-1">
              <div className="text-[14px] font-medium text-[#2d3145]">Period</div>
              <button className="w-full h-[49px] rounded-[48px] bg-white border border-[#ccd5dc] px-4 flex items-center justify-between text-[#abadb5]">
                <span className="inline-flex items-center gap-2 text-[14px]">
                  <Calendar className="h-5 w-5 text-[#2d3145]" />
                  input_label
                </span>
                <ChevronDown className="h-5 w-5 text-[#2d3145]" />
              </button>
            </div>

            {/* Contractor */}
            <div className="w-[196px] space-y-1">
              <div className="text-[14px] font-medium text-[#2d3145]">Contractor</div>
              <button className="w-full h-[49px] rounded-[48px] bg-white border border-[#ccd5dc] px-4 flex items-center justify-between text-[#abadb5]">
                <span className="text-[14px]">input_label</span>
                <ChevronDown className="h-5 w-5 text-[#2d3145]" />
              </button>
            </div>

            {/* No. of account. */}
            <div className="w-[196px] space-y-1">
              <div className="text-[14px] font-medium text-[#2d3145]">No. of account.</div>
              <button className="w-full h-[49px] rounded-[48px] bg-white border border-[#ccd5dc] px-4 flex items-center justify-between text-[#abadb5]">
                <span className="text-[14px]">input_label</span>
                <ChevronDown className="h-5 w-5 text-[#2d3145]" />
              </button>
            </div>

            {/* Type of operation */}
            <div className="w-[196px] space-y-1">
              <div className="text-[14px] font-medium text-[#2d3145]">Type of operation</div>
              <button className="w-full h-[49px] rounded-[48px] bg-white border border-[#ccd5dc] px-4 flex items-center justify-between text-[#abadb5]">
                <span className="text-[14px]">input_label</span>
                <ChevronDown className="h-5 w-5 text-[#2d3145]" />
              </button>
            </div>

            {/* Apply */}
            <div className="w-[196px]">
              <Button className="w-full h-12 rounded-[48px] bg-[#2d3145] text-white hover:bg-[#2d3145]/90">Apply</Button>
            </div>

            {/* Reset */}
            <div className="w-[196px]">
              <Button variant="outline" className="w-full h-12 rounded-[48px] border-[#ccd5dc] text-[#2d3145]">Reset</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table header actions */}
      <Card className="rounded-2xl">
        <CardContent className="p-0">
          <div className="flex items-center justify-between px-4 md:px-6 pt-4">
            <div className="flex items-center gap-6">
              <button className="text-emerald-600 text-sm font-medium">All accounts</button>
            </div>
            <div className="flex items-center gap-2 md:gap-3 py-2">
              <Button className="rounded-full h-9 px-4 bg-emerald-500 hover:bg-emerald-500/90 text-white">
                Add an invoice
              </Button>
              <Button variant="outline" className="rounded-full h-9 px-4">
                Columns
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 text-sm">
              <thead>
                {/* Group headers to hint Debit/Credit split */}
                <tr>
                  <th className="p-3 text-left text-xs text-muted-foreground font-medium" colSpan={4}></th>
                  <th className="p-3 text-left text-xs text-muted-foreground font-medium" colSpan={3}>Debit</th>
                  <th className="p-3 text-left text-xs text-muted-foreground font-medium" colSpan={3}>Credit</th>
                  <th className="p-3" colSpan={3}></th>
                </tr>
                <tr className="border-y">
                  <th className="p-3 text-left text-muted-foreground font-medium whitespace-nowrap">⇅ Date</th>
                  <th className="p-3 text-left text-muted-foreground font-medium whitespace-nowrap">⇅ Document amount</th>
                  <th className="p-3 text-left text-muted-foreground font-medium whitespace-nowrap">Counterparty</th>
                  <th className="p-3 text-left text-muted-foreground font-medium whitespace-nowrap">No. of project</th>
                  <th className="p-3 text-left text-muted-foreground font-medium whitespace-nowrap">Order value</th>
                  <th className="p-3 text-left text-muted-foreground font-medium whitespace-nowrap">Sum of materials</th>
                  <th className="p-3 text-left text-muted-foreground font-medium whitespace-nowrap">100% payment with VAT</th>
                  <th className="p-3 text-left text-muted-foreground font-medium whitespace-nowrap">Cost of work</th>
                  <th className="p-3 text-left text-muted-foreground font-medium whitespace-nowrap">Markup</th>
                  <th className="p-3 text-left text-muted-foreground font-medium whitespace-nowrap">Comment</th>
                  <th className="p-3 text-left text-muted-foreground font-medium whitespace-nowrap">Status</th>
                  <th className="p-3 text-left text-muted-foreground font-medium whitespace-nowrap">Files</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((row) => {
                  const positive = !row.documentAmount.startsWith("-");
                  const statusStyles: Record<TransactionRow["status"], string> = {
                    Planning: "bg-violet-100 text-violet-700",
                    Process: "bg-emerald-100 text-emerald-700",
                    Pause: "bg-amber-100 text-amber-700",
                    Review: "bg-sky-100 text-sky-700",
                  };
                  return (
                    <tr key={row.id} className="border-t hover:bg-muted/40">
                      <td className="p-3 whitespace-nowrap text-foreground/90">{row.date}</td>
                      <td className={`p-3 font-medium ${positive ? "text-emerald-600" : "text-red-600"}`}>{row.documentAmount}</td>
                      <td className="p-3 whitespace-nowrap">{row.counterparty}</td>
                      <td className="p-3 whitespace-nowrap text-muted-foreground">{row.projectNo}</td>
                      <td className="p-3 whitespace-nowrap">{row.orderValue}</td>
                      <td className="p-3 whitespace-nowrap">{row.materialsSum}</td>
                      <td className="p-3 whitespace-nowrap">{row.paymentWithVAT}</td>
                      <td className="p-3 whitespace-nowrap">{row.costOfWork}</td>
                      <td className="p-3 whitespace-nowrap">{row.markup}</td>
                      <td className="p-3 whitespace-nowrap text-muted-foreground">{row.comment}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[row.status]}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap text-muted-foreground">{row.file}</td>
                      <td className="p-3 w-8 text-right">
                        <button className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between px-4 md:px-6 py-4 border-t">
            <p className="text-xs md:text-sm text-muted-foreground">Showing {mockTransactions.length} of {mockTransactions.length} records</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-full" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">1</Button>
              <Button variant="outline" size="sm" className="rounded-full">2</Button>
              <Button variant="outline" size="sm" className="rounded-full">3</Button>
              <Button variant="outline" size="sm" className="rounded-full">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};