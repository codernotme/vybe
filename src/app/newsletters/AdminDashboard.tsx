"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export default function AdminDashboard() {
  const pendingblog = useQuery(api.newsletter.fetchBlogByState, {
    state: "pending",
  });
  const updateState = useMutation(api.newsletter.updateblogtate);

  const handleStateChange = async (id: Id<"blog">, state: string) => {
    await updateState({ newsletterId: id, state });
  };

  if (!pendingblog || pendingblog.length === 0) {
    return <p>No pending blog.</p>;
  }

  return (
    <ScrollArea className="h-[400px] w-full border p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {pendingblog.map((newsletter) => (
        <Card key={newsletter._id}>
          <CardHeader>
            <CardTitle>{newsletter.title}</CardTitle>
            <CardDescription>
              Submitted by {newsletter.authorId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{newsletter.content}</p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handleStateChange(newsletter._id, "approved")}
            >
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleStateChange(newsletter._id, "rejected")}
            >
              Reject
            </Button>
          </CardFooter>
        </Card>
      ))}
    </ScrollArea>
  );
}
