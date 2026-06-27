import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/app/page-layout";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
