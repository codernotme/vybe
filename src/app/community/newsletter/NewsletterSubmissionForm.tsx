"use client";
import React, { useState } from "react";

const NewsletterSubmissionForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Backend function call to submit blog entry (add your API call here)
    // await submitBlog({ title, content });
    alert("Blog submitted for approval.");
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Submit a Blog Post</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Blog Title"
        required
        className="input"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your blog content..."
        required
        className="textarea"
      />
      <button type="submit" className="button">Submit</button>
    </form>
  );
};

export default NewsletterSubmissionForm;
