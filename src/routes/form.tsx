import { createFileRoute } from "@tanstack/react-router";
import { FormPage } from "@/app/pages/form-page";

export const Route = createFileRoute("/form")({
  component: FormPage,
});
