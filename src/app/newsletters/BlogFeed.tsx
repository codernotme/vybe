"use client"

import React, { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface BlogPost {
  id: string
  title: string
  content: string
  author: string
}

export default function BlogFeed() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])

  useEffect(() => {
    // Fetch approved blog posts from backend (replace with actual data fetch)
    // setBlogs(approvedBlogs);
    // For now, let's use some dummy data
    setBlogs([
      {
        id: "1",
        title: "Getting Started with Next.js",
        content: "Next.js is a powerful React framework...",
        author: "John Doe",
      },
      {
        id: "2",
        title: "The Future of AI",
        content: "Artificial Intelligence is rapidly evolving...",
        author: "Jane Smith",
      },
    ])
  }, [])

  return (
    <div className="space-y-6">
      {blogs.map((blog) => (
        <Card key={blog.id}>
          <CardHeader>
            <CardTitle>{blog.title}</CardTitle>
            <CardDescription>By {blog.author}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{blog.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
