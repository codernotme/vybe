"use client";
import React, { useState, useEffect } from "react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
}

const BlogFeed: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Fetch approved blog posts from backend (replace with actual data fetch)
    // setBlogs(approvedBlogs);
  }, []);

  return (
    <div>
      <h2>VYBE Newsletter</h2>
      {blogs.map((blog) => (
        <div key={blog.id} className="blog-post">
          <h3>{blog.title}</h3>
          <p>{blog.content}</p>
          <p>Author: {blog.author}</p>
        </div>
      ))}
    </div>
  );
};

export default BlogFeed;
