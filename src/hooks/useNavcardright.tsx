import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavigation = () => {
    const pathname = usePathname();

    const paths = useMemo(() => [
        {
            name: "Stories",
            href: "/stories",
            active: pathname === "/stories",
        }
    ], [pathname]);

    return paths;
}
