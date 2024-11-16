"use client";

import React from "react";
import AnonymousPost from "@/components/AnonymousPost";
import PostPage from "./_components/Posts";

export default function Home() {
  return (
    <>
      <main className="main">
        <AnonymousPost />
        <PostPage />
      </main>
    </>
  );
}
