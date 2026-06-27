import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "min-h-screen bg-linear-to-b from-zinc-50 to-zinc-100/90",
        "dark:from-zinc-950 dark:to-zinc-900",
      )}
    >
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
