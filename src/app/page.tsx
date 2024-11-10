"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import AdminPage from "./admin/page";
import CommunityPage from "./community/page";
import MentorView from "./mentor/page";
import TechPage from "./tech/page";
import MemberPage from "./member/page";

export default function Home(){
    const user = useQuery(api.users.get);

    if (user?.role === "admin"){
        return(<>
        <AdminPage/>
        </>);
    }
    else if (user?.role === "tech"){
        return(<>
        <TechPage/>
        </>);
    }
    else if (user?.role === "mentor"){
        return(<>
        <MentorView/>
        </>);
    }
    else if (user?.role === "community"){
        return(<>
        <CommunityPage/>
        </>);
    }
    else {
        return(<>
        <MemberPage/>
        </>);
    }
}