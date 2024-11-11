//For Tech students
import { GithubIcon } from "@/components/icons";
import {
  CalendarIcon,
  HomeIcon,
  AvatarIcon,
  BackpackIcon,
  VideoIcon,
} from "@radix-ui/react-icons";
import { NewspaperIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavigation = () => {
  const pathname = usePathname();

  const paths = useMemo(
    () => [
      {
        name: "Home",
        href: "/",
        icon: <HomeIcon className="h-6 w-6" />,
        active: pathname === "/",
      },
      {
        name: "Friends",
        href: "/friends",
        icon: <AvatarIcon className="h-6 w-6" />,
        active: pathname === "/friends",
      },
      {
        name: "Project",
        href: "/tech/project",
        icon: <GithubIcon className="h-6 w-6" />,
        active: pathname === "/project",
      },
      {
        name: "Events",
        href: "/events",
        icon: <CalendarIcon className="h-6 w-6" />,
        active: pathname === "/tech/events",
      },
      {
        name: "Newsletter",
        href: "/newsletter",
        icon: <NewspaperIcon className="h-6 w-6" />,
        active: pathname === "/tech/newsletter",
      },
      {
        name: "Mentor Connect",
        href: "/mentor/students",
        icon: <BackpackIcon className="h-6 w-6" />,
        active: pathname === "/mentor/students",
      },
      {
        name: "Watch",
        href: "/watch",
        icon: <VideoIcon className="h-6 w-6" />,
        active: pathname === "/watch",
      },
    ],
    [pathname]
  );

  return paths;
};
