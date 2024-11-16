"use client";
import React from "react";
import { NextPage } from "next";
import NewsletterSubmissionForm from "./NewsletterSubmissionForm";
import BlogFeed from "./BlogFeed";

const Newsletter: NextPage = () => {
  return (
    <div className="newsletter-container">
      <h1>VYBE Newsletter</h1>
      <NewsletterSubmissionForm />
      <BlogFeed />
    </div>
  );
};

export default Newsletter;
