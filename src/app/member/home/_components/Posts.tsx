"use client";
import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useDropzone } from "react-dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Image } from "@nextui-org/image";
import { api } from "../../../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "../../../../../convex/_generated/dataModel";
import CommentInput from "./commentInput";
import { Heart, Share2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger
} from "@/components/ui/dialog";
import Link from "next/link";
import { ChatBubbleIcon } from "@radix-ui/react-icons";

const ExpandableText = ({ content }: { content: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100;

  if (!content) return null;

  return (
    <p className="text-sm text-gray-700 dark:text-gray-200">
      {isExpanded ? content : `${content.substring(0, maxLength)}...`}
      {content.length > maxLength && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm ml-1 focus:outline-none"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
    </p>
  );
};

const CommentSection = ({
  postId,
  isVisible,
  handleDeleteComment
}: {
  postId: Id<"posts">;
  isVisible: boolean;
  handleDeleteComment: (commentId: Id<"comments">) => void;
}) => {
  const comments = useQuery(api.posts.getComments, { postId });

  if (!comments) {
    return <Skeleton className="h-6 w-full" />;
  }

  return (
    <div className={`mt-4 ${isVisible ? "block" : "hidden"}`}>
      {comments.map((comment: any) => (
        <div
          key={comment.comment._id}
          className="flex items-start space-x-3 mb-3"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={comment.authorImage} alt={comment.authorName} />
            <AvatarFallback>{comment.authorName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 flex-grow shadow-md">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {comment.authorName}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {comment.comment.content}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteComment(comment.comment._id)}
            className="text-gray-400 hover:text-red-500 ml-2"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      ))}
      <CommentInput postId={postId} />
    </div>
  );
};

export default function PostPage() {
  const posts = useQuery(api.posts.get);
  const deletePost = useMutation(api.post.deletePost);
  const deleteComment = useMutation(api.post.deleteComment);
  const [expandedPostId, setExpandedPostId] = useState<Id<"posts"> | null>(null);



  const handleDeleteComment = async (commentId: Id<"comments">) => {
    try {
      await deleteComment({ commentId });
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleDelete = async (postId: Id<"posts">) => {
    try {
      await deletePost({ postId });
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const toggleComments = (postId: Id<"posts">) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };
  const likePost = useMutation(api.post.like);

  const handleLike = async (postId: Id<"posts">) => {
    try {
      await likePost({ postId });
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  if (!posts) {
    return (
      <div className="container mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-xl space-y-4 p-4">
        {[...Array(3)].map((_, idx) => (
          <Skeleton key={idx} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    );
  }
  return (
    <div className="justify-between items-center mx-auto max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl space-y-6 p-4 top-0">
{posts.map((post: any) => (
        <Card
          key={post.post._id}
          className={` bg-background overflow-hidden max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-2 items-center justify-between shadow-lg rounded-lg `}
        >
          <CardHeader className="p-4 flex items-center space-x-4 flex-row">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.authorImage} alt={post.authorName} />
              <AvatarFallback>{post.authorName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <p className="font-semibold truncate">{post.authorName}</p>
              <p className="text-xs">
                {new Date(post.post._creationTime).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </p>
            </div>
            {post.isCurrentUser && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(post.post._id)}
                className="group relative flex lg:h-12 lg:w-12 sm:h-10 sm:w-10 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-red-800 bg-red-400 hover:bg-red-600"
              >
                <svg
                  viewBox="0 0 1.625 1.625"
                  className="absolute -top-7 fill-white delay-100 group-hover:top-6 group-hover:animate-[spin_1.4s] group-hover:duration-1000"
                  height="15"
                  width="15"
                >
                  <path d="M.471 1.024v-.52a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099h-.39c-.107 0-.195 0-.195-.195"></path>
                  <path d="M1.219.601h-.163A.1.1 0 0 1 .959.504V.341A.033.033 0 0 0 .926.309h-.26a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099v-.39a.033.033 0 0 0-.032-.033"></path>
                  <path d="m1.245.465-.15-.15a.02.02 0 0 0-.016-.006.023.023 0 0 0-.023.022v.108c0 .036.029.065.065.065h.107a.023.023 0 0 0 .023-.023.02.02 0 0 0-.007-.016"></path>
                </svg>
                <svg
                  width="16"
                  fill="none"
                  viewBox="0 0 39 7"
                  className="origin-right duration-500 group-hover:rotate-90"
                >
                  <line
                    stroke-width="4"
                    stroke="white"
                    y2="5"
                    x2="39"
                    y1="5"
                  ></line>
                  <line
                    stroke-width="3"
                    stroke="white"
                    y2="1.5"
                    x2="26.0357"
                    y1="1.5"
                    x1="12"
                  ></line>
                </svg>
                <svg width="16" fill="none" viewBox="0 0 33 39" className="">
                  <mask fill="white" id="path-1-inside-1_8_19">
                    <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                  </mask>
                  <path
                    mask="url(#path-1-inside-1_8_19)"
                    fill="white"
                    d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                  ></path>
                  <path stroke-width="4" stroke="white" d="M12 6L12 29"></path>
                  <path stroke-width="4" stroke="white" d="M21 6V29"></path>
                </svg>
              </Button>
            )}
          </CardHeader>
          <div className="p-4">
            {/* Image Display */}
            {post.post.imageUrl && (
              <Image
                src={post.post.imageUrl}
                alt="Post content"
                className=" lg:max-w-[500px] items-center object-cover rounded-lg justify-center mx-auto"
              />
            )}
            {/* Video Display */}
            {post.post.videoUrl && (
              <video
                src={post.post.videoUrl}
                controls
                className=" items-center object-cover rounded-lg"
              />
            )}

            {/* GIF Display */}
            {post.post.gifUrl && (
              <Image
                src={post.post.gifUrl}
                alt="Post GIF"
                className=" items-center rounded-lg justify-center mx-auto"
              />
            )}
          </div>
          <CardContent className="p-4 space-y-4 text-lg">
            <ExpandableText content={post.post.content || ""} />
          </CardContent>
          <CardFooter className="p-4 flex justify-between items-center">
            <Button
              onClick={() => handleLike(post.post._id)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-500"
            >
              <Heart className="h-6 w-6" strokeWidth={2} />
              <span className="ml-2">{post.post.likesCount || 0}</span>{" "}
              {/* Show likes count */}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleComments(post.post._id)}
              className="text-gray-400 hover:text-blue-500"
            >
              <ChatBubbleIcon className="h-6 w-6" />
            </Button>

            {/* Dialog for sharing post */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-green-500"
                >
                  <Share2 className="h-6 w-6 mr-1" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>Share Post</DialogHeader>
                <div className="flex space-x-4 justify-center">
                  {/* Twitter Share Button */}
                  <Button size={"icon"} variant={"ghost"} className="bg-white">
                    <Link
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        window.location.href
                      )}`}
                      target="_blank"
                    >
                      <Image
                        src="/assets/twitter.png"
                        alt="twitter"
                        width={"auto"}
                        height={"auto"}
                      />
                    </Link>
                  </Button>
                  {/* Facebook Share Button */}
                  <Button size={"icon"} variant={"ghost"}>
                    <Link
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.href
                      )}`}
                      target="_blank"
                    >
                      <Image
                        src="/assets/facebook.png"
                        alt="facebook"
                        width={"auto"}
                        height={"auto"}
                      />
                    </Link>
                  </Button>
                  {/* WhatsApp Share Button */}
                  <Button size={"icon"} variant={"ghost"}>
                    <Link
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        window.location.href
                      )}`}
                      target="_blank"
                    >
                      <Image
                        src="/assets/whatsapp.png"
                        alt="whatsapp"
                        width={"auto"}
                        height={"auto"}
                      />
                    </Link>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
          <CommentSection
            postId={post.post._id}
            isVisible={expandedPostId === post.post._id}
            handleDeleteComment={handleDeleteComment}
          />
        </Card>
      ))}

    </div>
    );
}