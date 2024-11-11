"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import SideNavAdmin from "./SideNavbarL/SideNavAdmin";
import SideNavTech from "./SideNavbarL/SideNavTech";
import SideNavMentor from "./SideNavbarL/SideNavMentor";
import SideNavCommunity from "./SideNavbarL/SideNavCommunity";
import SideNavMember from "./SideNavbarL/SideNavMember";


export default function SideNav(){
    const user = useQuery(api.users.get);

    if (user?.role === "admin"){
        return(<>
        <SideNavAdmin/>
        </>);
    }
    else if (user?.role === "tech"){
        return(<>
        <SideNavTech/>
        </>);
    }
    else if (user?.role === "mentor"){
        return(<>
        <SideNavMentor/>
        </>);
    }
    else if (user?.role === "community"){
        return(<>
        <SideNavCommunity/>
        </>);
    }
    else {
        return(<>
        <SideNavMember/>
        </>);
    }
}