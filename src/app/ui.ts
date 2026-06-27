import { cn } from "@/lib/cn";

export const buttonClassName = cn(
  "inline-flex touch-manipulation items-center justify-center rounded-lg px-4 py-2 text-sm font-medium",
  "bg-zinc-900 text-white shadow-sm",
  "transition-colors duration-150 hover:bg-zinc-800",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50",
  "disabled:pointer-events-none disabled:opacity-50",
  "dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white",
  "dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950",
);

export const secondaryButtonClassName = cn(
  "inline-flex touch-manipulation items-center justify-center rounded-lg px-4 py-2 text-sm font-medium",
  "border border-zinc-200 bg-white text-zinc-900 shadow-sm",
  "transition-colors duration-150 hover:bg-zinc-50",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50",
  "disabled:pointer-events-none disabled:opacity-50",
  "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800",
  "dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950",
);

export const inputClassName = cn(
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm",
  "transition-[color,box-shadow,border-color] duration-150 placeholder:text-zinc-400",
  "focus-visible:border-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/15",
  "dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500",
  "dark:focus-visible:border-zinc-600 dark:focus-visible:ring-zinc-100/15",
);

export const cardClassName = cn(
  "rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm",
  "dark:border-zinc-800/80 dark:bg-zinc-900/70",
);

export const hintClassName = cn(
  "rounded-lg border border-zinc-200/80 bg-zinc-50 px-3 py-2 text-sm leading-relaxed text-zinc-600",
  "dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-400",
);

export const navLinkClassName = cn(
  "rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors duration-150",
  "hover:bg-zinc-100 hover:text-zinc-900",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2",
  "dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
  "dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950",
);

export const navLinkActiveClassName = cn(
  "rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white",
  "dark:bg-zinc-100 dark:text-zinc-900",
);
