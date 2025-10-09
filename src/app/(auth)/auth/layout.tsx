import { type PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4">
      {children}
    </main>
  );
}
