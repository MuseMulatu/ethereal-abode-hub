import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/kitchen")({
  beforeLoad: () => {
    throw redirect({
      to: "/shop",
      search: { category: "dining" },
    });
  },
  component: () => null,
});
