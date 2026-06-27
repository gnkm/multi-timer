import type { ComponentProps, ReactNode } from "react";
import { secondaryButtonClassName } from "@/app/ui";
import { cn } from "@/lib/cn";

type TimerIconButtonProps = {
  children: ReactNode;
  label: string;
} & Pick<ComponentProps<"button">, "disabled" | "onClick">;

const iconButtonClassName = cn(secondaryButtonClassName, "size-8 shrink-0 p-0");

export function TimerIconButton({
  children,
  disabled,
  label,
  onClick,
}: TimerIconButtonProps) {
  return (
    <button
      type="button"
      className={iconButtonClassName}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
