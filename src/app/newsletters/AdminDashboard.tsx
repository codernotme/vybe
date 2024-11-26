"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast"

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
}

export function AdminDashboard() {
  const { toast } = useToast()
  const [pendingBlogs, setPendingBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Fetch pending blog posts from backend (replace with actual data fetch)
    // For demonstration, we'll use dummy data
    setPendingBlogs([
      {
        id: "1",
        title: "Pending Blog Post 1",
        content: "This is a pending blog post.",
        author: "John Doe",
      },
      {
        id: "2",
        title: "Pending Blog Post 2",
        content: "This is another pending blog post.",
        author: "Jane Smith",
      },
    ]);
  }, []);

  const handleApproval = async (blogId: string, approved: boolean) => {
    // Call backend function to update blog approval status
    // await approveBlog({ blogId, approved });
    toast({
      title: `Blog ${approved ? "approved" : "rejected"}`,
      description: `The blog post has been ${approved ? "approved" : "rejected"}.`,
    });
    setPendingBlogs(pendingBlogs.filter((blog) => blog.id !== blogId));
  };

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="space-y-4">
        {pendingBlogs.map((blog) => (
          <Card key={blog.id}>
            <CardHeader>
              <CardTitle>{blog.title}</CardTitle>
              <CardDescription>By {blog.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{blog.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                onClick={() => handleApproval(blog.id, true)}
                variant="default"
              >
                Approve
              </Button>
              <Button
                onClick={() => handleApproval(blog.id, false)}
                variant="destructive"
              >
                Reject
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
