import { IconClipboardList, IconUserCircle } from "@tabler/icons-react";
import type { Route } from "@/types";

export const mentorRoutes: Route[] = [
  {
    title: "Submissions",
    items: [
      {
        title: "Review projects",
        url: "/mentor/submissions",
        icon: IconClipboardList,
      },
      {
        title: "My profile",
        url: "/mentor/profile",
        icon: IconUserCircle,
      },
    ],
  },
];
