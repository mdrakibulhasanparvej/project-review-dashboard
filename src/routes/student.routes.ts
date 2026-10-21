import {
  IconClipboardList,
  IconSend,
  IconUserCircle,
} from "@tabler/icons-react";
import type { Route } from "@/types";

const prefix = "/student";
export const studentRoutes: Route[] = [
  {
    title: "Submissions",
    items: [
      {
        title: "Submit project",
        url: `${prefix}/submissions`,
        icon: IconSend,
      },
      {
        title: "My submissions",
        url: `${prefix}/my-submissions`,
        icon: IconClipboardList,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "My profile",
        url: `${prefix}/profile`,
        icon: IconUserCircle,
      },
    ],
  },
];
