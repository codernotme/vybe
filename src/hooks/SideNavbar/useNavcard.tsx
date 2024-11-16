import {
  CalendarIcon,
  BackpackIcon,
  HomeIcon,
  VideoIcon,
  AvatarIcon,
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
        name: "Watch",
        href: "/watch",
        icon: <VideoIcon className="h-6 w-6" />,
        active: pathname === "/watch",
      },
      {
        name: "Events",
        href: "/events",
        icon: <CalendarIcon className="h-6 w-6" />,
        active: pathname === "/tech/events",
      },
      {
        name: "Newsletter",
        href: "/newsletters",
        icon: <NewspaperIcon className="h-6 w-6" />,
        active: pathname === "/newsletters",
      },
      {
        name: "Mentor Connect",
        href: "/mentor/students",
        icon: <BackpackIcon className="h-6 w-6" />,
        active: pathname === "/mentor/students",
      },
    ],
    [pathname]
  );

  return paths;
};
