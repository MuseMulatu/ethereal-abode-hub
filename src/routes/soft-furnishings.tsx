import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/soft-furnishings")({
  beforeLoad: () => {
    throw redirect({
      to: "/shop",
      search: { category: "sofas" },
    });
  },
  component: () => null,
});
