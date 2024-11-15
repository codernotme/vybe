"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function Discussions() {
  const user = useQuery(api.users.get);

  if (user?.role === "community") {
    return <div>Community Discussions</div>;
  } else {
    return null;
  }
}
