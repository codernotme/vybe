import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, ThumbsUp, ThumbsDown } from "lucide-react"

interface VideoPlayerProps {
  videoId: string
}

export default function VideoPlayer({ videoId }: VideoPlayerProps) {
  return (
    <Card className="bg-card">
      <CardContent className="p-4">
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg"
            ></iframe>
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-muted rounded-lg">
              <p className="text-xl text-muted-foreground">Select a video to play</p>
            </div>
          )}
        </div>
        {videoId && (
          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <ThumbsUp className="mr-2 h-4 w-4" />
                Like
              </Button>
              <Button variant="outline" size="sm">
                <ThumbsDown className="mr-2 h-4 w-4" />
                Dislike
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}