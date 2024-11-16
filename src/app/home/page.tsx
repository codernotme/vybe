"use client";

import React from "react";
import AnonymousPost from "@/components/Anonymous/AnonymousPost";
import PostPage from "./_components/Posts";
import PostInput from "./_components/PostInput";

export default function Home() {
  return (
    <>
      <main className="main">
        <PostInput />
        <PostPage />
      </main>
    </>
  );
}
