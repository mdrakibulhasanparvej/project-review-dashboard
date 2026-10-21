import { IconChartBar, IconUsers } from "@tabler/icons-react";
import type { Route } from "@/types";

export const adminRoutes: Route[] = [
  {
    title: "Administration",
    items: [
      {
        title: "Platform overview",
        url: "/admin/overview",
        icon: IconChartBar,
      },
      {
        title: "Mentors",
        url: "/admin/mentors",
        icon: IconUsers,
      },
    ],
  },
];
