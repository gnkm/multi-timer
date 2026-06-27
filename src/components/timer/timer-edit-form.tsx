import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { type UseFormRegister, useForm } from "react-hook-form";
import { buttonClassName, inputClassName } from "@/app/ui";
import { cn } from "@/lib/cn";
import { splitSeconds, toTotalSeconds } from "@/lib/timer";
import {
  type TimerEditFormValues,
  timerEditFormSchema,
} from "@/lib/timer-edit-form-schema";
import { useTimerStore } from "@/stores/timer-store";
import type { Timer } from "@/types/timer";
import { TimerIconButton } from "./timer-icon-button";

type TimerEditFormProps = {
  onCancel: () => void;
  onSaved: () => void;
  timer: Timer;
};

type DurationFieldProps = {
  error?: string;
  id: string;
  label: string;
  max: number;
  registration: ReturnType<UseFormRegister<TimerEditFormValues>>;
};

function parseDurationInput(value: string): number {
  if (value === "") {
    return 0;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function DurationField({
  error,
  id,
  label,
  max,
  registration,
}: DurationFieldProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <input
        {...registration}
        aria-invalid={error ? true : undefined}
        aria-label={label}
        className={cn(
          inputClassName,
          "w-16 text-center text-2xl font-light tabular-nums sm:w-20",
          error && "border-red-500 dark:border-red-500",
        )}
        id={id}
        inputMode="numeric"
        max={max}
        min={0}
        type="number"
      />
      <label className="text-xs text-zinc-500 dark:text-zinc-400" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

export function TimerEditForm({
  onCancel,
  onSaved,
  timer,
}: TimerEditFormProps) {
  const editTimer = useTimerStore((state) => state.editTimer);
  const { hours, minutes, seconds } = splitSeconds(timer.remainingSeconds);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<TimerEditFormValues>({
    defaultValues: { hours, minutes, seconds },
    resolver: zodResolver(timerEditFormSchema),
  });

  const numberField = (name: keyof TimerEditFormValues) =>
    register(name, { setValueAs: parseDurationInput });

  const fieldError =
    errors.hours?.message ?? errors.minutes?.message ?? errors.seconds?.message;

  const onSubmit = handleSubmit((values) => {
    editTimer(
      timer.id,
      toTotalSeconds(values.hours, values.minutes, values.seconds),
    );
    onSaved();
  });

  return (
    <form
      className="flex flex-col items-center gap-4"
      noValidate
      onSubmit={onSubmit}
    >
      <div className="flex items-start justify-center gap-2">
        <DurationField
          error={errors.hours?.message}
          id={`${timer.id}-hours`}
          label="時間"
          max={99}
          registration={numberField("hours")}
        />
        <span
          aria-hidden="true"
          className="pt-2 text-2xl font-light text-zinc-400 dark:text-zinc-500"
        >
          :
        </span>
        <DurationField
          error={errors.minutes?.message}
          id={`${timer.id}-minutes`}
          label="分"
          max={59}
          registration={numberField("minutes")}
        />
        <span
          aria-hidden="true"
          className="pt-2 text-2xl font-light text-zinc-400 dark:text-zinc-500"
        >
          :
        </span>
        <DurationField
          error={errors.seconds?.message}
          id={`${timer.id}-seconds`}
          label="秒"
          max={59}
          registration={numberField("seconds")}
        />
      </div>
      {fieldError ? (
        <p
          className="text-center text-xs text-red-600 dark:text-red-400"
          role="alert"
        >
          {fieldError}
        </p>
      ) : null}
      <div className="flex items-center justify-center gap-2">
        <TimerIconButton label="キャンセル" onClick={onCancel}>
          <X aria-hidden="true" className="size-5" />
        </TimerIconButton>
        <TimerIconButton
          className={cn(buttonClassName, "size-9 shrink-0 p-0")}
          label="保存"
          type="submit"
        >
          <Check aria-hidden="true" className="size-5" />
        </TimerIconButton>
      </div>
    </form>
  );
}
