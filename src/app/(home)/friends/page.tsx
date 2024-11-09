// page.tsx
"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import FriendCard from "./friendsBox";
import { Card } from "@/components/ui/card";

export default function Friends() {
  const friends = useQuery(api.friends.get); // Query to get friends

  if (friends === undefined) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    ); // Centered loading state
  }

  if (friends.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-500">
        No friends found.
      </div>
    ); // Centered no friends message
  }

  return (
    <main className="flex flex-col justify-between items-center">
      <Card className="max-w-md p-4">
        <h2 className="text-2xl font-bold mb-6">Friends List</h2>
        <div className="flex flex-col justify-center gap-4">
          {friends.map((friend) => (
            <FriendCard key={friend._id} friend={friend} />
          ))}
        </div>
      </Card>
    </main>
  );
}
