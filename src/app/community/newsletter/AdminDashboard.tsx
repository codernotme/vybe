"use client";
import React, { useState, useEffect } from "react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
}

const AdminDashboard: React.FC = () => {
  const [pendingBlogs, setPendingBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Fetch pending blog posts from backend (replace with actual data fetch)
    // setPendingBlogs(data);
  }, []);

  const handleApproval = async (blogId: string, approved: boolean) => {
    // Call backend function to update blog approval status
    // await approveBlog({ blogId, approved });
    alert(`Blog ${approved ? "approved" : "rejected"}.`);
    setPendingBlogs(pendingBlogs.filter(blog => blog.id !== blogId));
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {pendingBlogs.map((blog) => (
        <div key={blog.id} className="blog-post">
          <h3>{blog.title}</h3>
          <p>{blog.content}</p>
          <p>Author: {blog.author}</p>
          <button onClick={() => handleApproval(blog.id, true)} className="approve-btn">Approve</button>
          <button onClick={() => handleApproval(blog.id, false)} className="reject-btn">Reject</button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
