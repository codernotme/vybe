import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BlogFeed from "./BlogFeed"
import NewsletterSubmissionForm from "./NewsletterSubmissionForm"
import { AdminDashboard } from "./AdminDashboard"

export default function Newsletter() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">VYBE Newsletter</h1>
      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feed">Blog Feed</TabsTrigger>
          <TabsTrigger value="submit">Submit Blog</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>
        <TabsContent value="feed">
          <BlogFeed />
        </TabsContent>
        <TabsContent value="submit">
          <NewsletterSubmissionForm />
        </TabsContent>
        <TabsContent value="admin">
          <AdminDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}

