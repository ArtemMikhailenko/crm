"use client";

import { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

import { Sidebar, SidebarProvider } from "./sidebar";
import { Header } from "./header";

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen flex-col bg-muted/20">
        {/* Global top header (above sidebar and content) */}
        <div className="p-3 lg:p-4">
          <Header />
        </div>

        {/* Content row: sidebar + page content */}
        <div className="flex min-h-0 flex-1">
          <Sidebar />

          {/* Main content */}
          <main className={cn("flex-1 overflow-y-auto p-4 lg:p-6", className)}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
