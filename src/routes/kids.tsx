import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/kids")({
  beforeLoad: () => {
    throw redirect({
      to: "/shop",
      search: { category: "living-kids" },
    });
  },
  component: () => null,
});
