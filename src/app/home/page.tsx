"use client";

import React from "react";
import PostInput from "./_components/PostInput";
import PostPage from "./_components/Posts";

export default function Home() {
  return(
    <>
    <main className="main">
      <PostInput/>
      <PostPage/>
    </main>
    </>
  );
}
