"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlogFeed from "./BlogFeed";
import NewsletterSubmissionForm from "./NewsletterSubmissionForm";
import  AdminDashboard  from "./AdminDashboard";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Newsletter() {
  const user = useQuery(api.users.get);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">VYBE Newsletter</h1>
      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="flex justify-center mb-4">
          <TabsTrigger value="feed" className="mx-2">
            Blog Feed
          </TabsTrigger>
          {(user?.role === "mentor" ||
            user?.role === "community" ||
            user?.role === "admin") && (
            <TabsTrigger value="submit" className="mx-2">
              Submit Blog
            </TabsTrigger>
          )}
          {user?.role === "admin" && (
            <TabsTrigger value="admin" className="mx-2">
              Admin
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="feed">
          <BlogFeed />
        </TabsContent>
        {(user?.role === "mentor" ||
          user?.role === "community" ||
          user?.role === "admin") && (
          <TabsContent value="submit">
            <NewsletterSubmissionForm />
          </TabsContent>
        )}
        {user?.role === "admin" && (
          <TabsContent value="admin">
            <AdminDashboard />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
