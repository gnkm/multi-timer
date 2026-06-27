import type { ComponentProps, ReactNode } from "react";
import { secondaryButtonClassName } from "@/app/ui";
import { cn } from "@/lib/cn";

type TimerIconButtonProps = {
  children: ReactNode;
  className?: string;
  label: string;
} & Pick<ComponentProps<"button">, "disabled" | "onClick" | "type">;

const iconButtonClassName = cn(secondaryButtonClassName, "size-8 shrink-0 p-0");

export function TimerIconButton({
  children,
  className,
  disabled,
  label,
  onClick,
  type = "button",
}: TimerIconButtonProps) {
  return (
    <button
      type={type}
      className={cn(iconButtonClassName, className)}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
