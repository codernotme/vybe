"use client";
import React, { useEffect, useState } from "react";
import { NextPage } from "next";

// Define a BlogPost type for TypeScript
interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
}

const Newsletter: NextPage = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Fetch approved blog posts from the backend
    const fetchBlogs = async () => {
      try {
        // Replace with the actual API call to fetch approved blog posts
        const response = await fetch("/api/newsletters"); // Update this path as necessary
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="newsletter-container">
      <h1>VYBE Newsletter</h1>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <div key={blog.id} className="blog-post">
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            <p className="author">Written by: {blog.author}</p>
          </div>
        ))
      ) : (
        <p>No newsletters available at the moment.</p>
      )}
    </div>
  );
};

export default Newsletter;
