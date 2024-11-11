//For Mentors
import {
  CalendarIcon,
  BackpackIcon,
  HomeIcon,
  VideoIcon,
  AvatarIcon,
  GearIcon,
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
        name: "Sessions",
        href: "/mentor/sessions",
        icon: <VideoIcon className="h-6 w-6" />,
        active: pathname === "/mentor/sessions",
      },
      {
        name: "Events",
        href: "/events",
        icon: <CalendarIcon className="h-6 w-6" />,
        active: pathname === "/tech/events",
      },
      {
        name: "Students",
        href: "/mentor/students",
        icon: <BackpackIcon className="h-6 w-6" />,
        active: pathname === "/mentor/students",
      },
      {
        name: "Reports",
        href: "/mentor/reports",
        icon: <GearIcon className="h-6 w-6" />,
        active: pathname === "/mentor/reports",
      },
    ],
    [pathname]
  );

  return paths;
};
