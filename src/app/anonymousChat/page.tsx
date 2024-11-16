"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import AnonymousPage from "@/components/Anonymous/AnonymousPage";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
export default function AnonymousChat() {
  const user = useQuery(api.users.get);
  if (user?.role === "member" || user?.role === "tech") {
    return (
      <Card className="flex flex-col w-full mt-4">
        <CardHeader>
          <h2 className="text-xl font-semibold">Anonymous Chat</h2>
        </CardHeader>
        <CardContent>
          <AnonymousPage />
        </CardContent>
      </Card>
    );
  } else {
    return null;
  }
}
