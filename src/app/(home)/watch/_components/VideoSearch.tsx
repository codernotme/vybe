import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { Image } from "@nextui-org/image";
interface Video {
  id: { videoId: string };
  snippet: {
    title: string;
    thumbnails: { medium: { url: string } };
    channelTitle: string;
  };
}

interface VideoSearchProps {
  onVideoSelect: (videoId: string) => void;
}

export default function VideoSearch({ onVideoSelect }: VideoSearchProps) {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchVideos = async () => {
    setIsLoading(true);
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    try {
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${query}&key=${API_KEY}`
      );
      setVideos(res.data.items);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a video..."
          className="flex-grow"
        />
        <Button onClick={searchVideos} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Search
        </Button>
      </div>
      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
        {videos.map((video) => (
          <Card
            key={video.id.videoId}
            className="cursor-pointer hover:bg-accent transition-colors"
          >
            <CardContent
              className="p-4 flex items-start space-x-4"
              onClick={() => onVideoSelect(video.id.videoId)}
            >
              <Image
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-40 h-24 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold line-clamp-2 mb-1">
                  {video.snippet.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {video.snippet.channelTitle}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
