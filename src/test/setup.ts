import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import { useCounterStore } from "@/stores/counter-store";
import { server } from "./msw/server";

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  useCounterStore.setState({ count: 0 });
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => {
  server.close();
});
