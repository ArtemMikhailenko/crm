import { type PropsWithChildren } from "react";

import { DashboardLayout } from "@/shared/ui/dashboard-layout";

export default function DashboardRouteLayout({ children }: PropsWithChildren) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
