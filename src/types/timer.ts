export type TimerStatus = "stopped" | "running" | "completed";

export type Timer = {
  id: string;
  initialSeconds: number;
  remainingSeconds: number;
  sessionTotalSeconds: number;
  status: TimerStatus;
};
