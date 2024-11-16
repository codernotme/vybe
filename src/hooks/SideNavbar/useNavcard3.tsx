//For Community
import {
  CalendarIcon,
  BackpackIcon,
  HomeIcon,
  VideoIcon,
  AvatarIcon,
  GearIcon,
  ChatBubbleIcon,
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
        active: pathname === "/community/events",
      },
      {
        name: "Discussions",
        href: "/community/discussions",
        icon: <ChatBubbleIcon className="h-6 w-6" />,
        active: pathname === "/community/discussions",
      },
      {
        name: "Newsletters",
        href: "/newsletters",
        icon: <NewspaperIcon className="h-6 w-6" />,
        active: pathname === "/newsletters",
      },
    ],
    [pathname]
  );

  return paths;
};
