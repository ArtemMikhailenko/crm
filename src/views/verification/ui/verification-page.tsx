"use client";

import React, { useEffect } from "react";

import { useSearchParams } from "next/navigation";

import { useVerification } from "@/features/auth/hooks";

import { VerificationLoader } from "@/shared/ui/loader";

export function VerificationPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? null;
  const { verification } = useVerification();

  useEffect(() => {
    if (token) {
      verification({ token });
    }
  }, [token, verification]);

  return <VerificationLoader message="Verifying your email address..." />;
}
