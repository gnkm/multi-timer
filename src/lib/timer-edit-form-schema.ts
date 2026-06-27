import { z } from "zod";
import { MAX_TIMER_SECONDS, toTotalSeconds } from "@/lib/timer";

export const timerEditFormSchema = z
  .object({
    hours: z.number().int().min(0).max(99),
    minutes: z.number().int().min(0).max(59),
    seconds: z.number().int().min(0).max(59),
  })
  .superRefine((data, ctx) => {
    const total = toTotalSeconds(data.hours, data.minutes, data.seconds);

    if (total <= 0) {
      ctx.addIssue({
        code: "custom",
        message: "1秒以上を設定してください",
        path: ["seconds"],
      });
    }

    if (total > MAX_TIMER_SECONDS) {
      ctx.addIssue({
        code: "custom",
        message: "最大 99:59:59 まで設定できます",
        path: ["hours"],
      });
    }
  });

export type TimerEditFormValues = z.infer<typeof timerEditFormSchema>;
