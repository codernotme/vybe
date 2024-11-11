//For Admin
import {
  CalendarIcon,
  BackpackIcon,
  HomeIcon,
  VideoIcon,
  AvatarIcon,
  GearIcon,
} from "@radix-ui/react-icons";
import { NewspaperIcon, ShieldCheckIcon } from "lucide-react";
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
        name: "Admin Dashboard",
        href: "/admin/dashboard",
        icon: <ShieldCheckIcon className="h-6 w-6" />,
        active: pathname === "/admin/dashboard",
      },
      {
        name: "User Management",
        href: "/admin/users",
        icon: <AvatarIcon className="h-6 w-6" />,
        active: pathname === "/admin/users",
      },
      {
        name: "Events",
        href: "/events",
        icon: <CalendarIcon className="h-6 w-6" />,
        active: pathname === "/tech/events",
      },
      {
        name: "Reports",
        href: "/admin/reports",
        icon: <GearIcon className="h-6 w-6" />,
        active: pathname === "/admin/reports",
      },
    ],
    [pathname]
  );

  return paths;
};
