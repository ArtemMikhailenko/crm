import React from "react";
import { UserSchedulePage } from "@/views/users/ui/user-schedule-page";

export default function Page(props: any) {
  const params = props?.params as { id: string };
  const id = params?.id;

  return (
    <div className="min-h-screen bg-slate-50">
      <UserSchedulePage userId={id} />
    </div>
  );
}
