"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function BlogFeed() {
  const [users, setUsers] = useState<any[]>([]);
  const approvedblog = useQuery(api.newsletter.fetchBlogByState, {
    state: "approved",
  });
  
  // Fetch all users only when necessary (to avoid unnecessary re-renders)
  const allUsers = useQuery(api.users.get);

  useEffect(() => {
    if (Array.isArray(allUsers)) {
      setUsers(allUsers);
    }
  }, [allUsers]);

  // Handle loading state for both queries
  if (!approvedblog || approvedblog.length === 0) {
    return <p>No approved blogs yet.</p>;
  }

  return (
    <div className="space-y-6">
      {approvedblog.map((newsletter) => {
        // Find the author for each newsletter using the 'users' state
        const author = users.find((user) => user._id === newsletter.authorId);
        return (
          <Card key={newsletter._id}>
            <CardHeader>
              <CardTitle>{newsletter.title}</CardTitle>
              <CardDescription>By {author?.username || "Unknown"}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{newsletter.content}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
