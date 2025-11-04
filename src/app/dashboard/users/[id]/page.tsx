import React from "react";
import { UserDetailsPage } from "@/views/users/ui/user-details-page";

export default async function UserDetailsRoute(props: any) {
  // In Next.js 15, params must be awaited
  const params = await props?.params;
  return <UserDetailsPage userId={params.id} />;
}
