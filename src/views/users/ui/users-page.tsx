"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Separator } from "@/shared/ui/separator";
import { Modal } from "@/shared/ui/modal";
import { AddUserForm } from "./add-user-form";
import { AddCompanyForm } from "./add-company-form";
import { UsersList } from "@/shared/components/users/UsersList";
import { CompaniesList } from "@/shared/components/companies/CompaniesList";
import {
  PlusSquare,
  Search,
  Filter as FilterIcon,
  ChevronDown,
  Printer,
  Upload,
  Ellipsis,
} from "lucide-react";

type TabKey = "all" | "employees" | "subcontract";

export function UsersPage() {
  const [activeTab, setActiveTab] = React.useState<TabKey>("all");
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const openCreate = () => setOpen(true);
  const closeCreate = () => setOpen(false);

  const getTitle = () => {
    switch (activeTab) {
      case "employees":
        return "Employees";
      case "subcontract":
        return "Subcontractors";
      default:
        return "All Members";
    }
  };

  return (
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{getTitle()}</h1>
          <button
            onClick={openCreate}
            className="flex items-center gap-3 rounded-full bg-[#2d3145] px-6 py-3 text-white"
          >
            <PlusSquare className="h-5 w-5" />
            <span className="text-base">
              {activeTab === "subcontract" ? "Add subcontractor" : "New user"}
            </span>
          </button>
        </div>

        {/* Main content area */}
        <Card className="shadow-[0_5px_25px_rgba(107,114,128,0.2)]">
          <CardContent className="p-0">
            {/* Tabs + right controls inside card */}
            <div className="flex items-center justify-between px-4 pb-3 pt-4">
              <div className="flex items-center gap-8">
                {([
                  { key: "all", label: "All members" },
                  { key: "employees", label: "Employees" },
                  { key: "subcontract", label: "Subcontract" },
                ] as { key: TabKey; label: string }[]).map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={
                      "relative pb-2 transition-colors " +
                      (activeTab === t.key
                        ? "text-[#67b9a6]"
                        : "text-[#2d3145] opacity-80")
                    }
                  >
                    {t.label}
                    {activeTab === t.key && (
                      <span className="absolute left-0 right-[-16px] -bottom-[2px] h-[2px] bg-[#67b9a6]" />
                    )}
                  </button>
                ))}
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

            {/* Tab content */}
            <div className="p-4">
              {activeTab === "subcontract" ? (
                <CompaniesList activeTab="contractors" />
              ) : (
                <UsersList activeTab={activeTab} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Create modal (content depends on tab) */}
        <Modal
          open={open}
          onClose={closeCreate}
          title={activeTab === "subcontract" ? "Add a company" : "Add user"}
        >
          {activeTab === "subcontract" ? (
            <AddCompanyForm onCancel={closeCreate} onSuccess={closeCreate} />
          ) : (
            <AddUserForm onCancel={closeCreate} onSuccess={closeCreate} />
          )}
        </Modal>
      </div>
  );
}
