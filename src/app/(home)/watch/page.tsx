"use client";

import React, { useState } from "react";
import VideoPlayer from "./_components/VideoPlayer";
import VideoSearch from "./_components/VideoSearch";

export default function Page() {
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <VideoPlayer videoId={selectedVideoId} />
          <VideoSearch onVideoSelect={handleVideoSelect} />
        </div>
      </div>
    </div>
  );
}
