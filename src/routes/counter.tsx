import { createFileRoute } from "@tanstack/react-router";
import { CounterPage } from "@/app/pages/counter-page";

export const Route = createFileRoute("/counter")({
  component: CounterPage,
});
