import {
  CalendarIcon,
  BackpackIcon,
  HomeIcon,
  ChatBubbleIcon,
  VideoIcon,
  AvatarIcon
} from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavigation = () => {
  const pathname = usePathname();

  const paths = useMemo(
    () => [
      {
        name: "Home",
        href: "/home",
        icon: <HomeIcon className="h-6 w-6" />,
        active: pathname === "/home"
      },
      {
        name: "Friends",
        href: "/friends",
        icon: <AvatarIcon className="h-6 w-6" />,
        active: pathname === "/friends"
      },
      {
        name: "Watch",
        href: "/watch",
        icon: <VideoIcon className="h-6 w-6" />,
        active: pathname === "/watch"
      }
    ],
    [pathname]
  );

  return paths;
};
