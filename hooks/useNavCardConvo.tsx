import { ChatBubbleIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavigation = () => {
  const pathname = usePathname();

  const paths = useMemo(
    () => [
      {
        name: "Chat",
        href: "/chat/conversations",
        icon: <ChatBubbleIcon />,
        active: pathname === "/chat/conversations"
      }
    ],
    [pathname]
  );

  return paths;
};
