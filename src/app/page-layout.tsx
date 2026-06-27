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
      {children}
    </div>
  );
}
