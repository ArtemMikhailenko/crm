import { Metadata } from "next";
import { Suspense } from "react";

import { NewPasswordPage } from "@/widgets/auth";

export const metadata: Metadata = {
  title: "New Password",
  description: "New Password",
};

export default function NewPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPasswordPage />
    </Suspense>
  );
}
