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
import {  Trash2 } from "lucide-react";
import { Textarea } from "@nextui-org/input";
import { toast } from "sonner";
import styled from "styled-components";

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


export default function PostInput() {
  const posts = useQuery(api.posts.get);
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const createPost = useMutation(api.post.create);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const fileType = file.type;

      if (fileType.startsWith("image/")) {
        if (fileType === "image/gif") {
          setSelectedGif(reader.result as string);
        } else {
          setSelectedImage(reader.result as string);
        }
      } else if (fileType.startsWith("video/")) {
        setSelectedVideo(reader.result as string);
      }

      setFileUploaded(true);
    };

    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
      "video/*": [".mp4", ".mov"],
      "gif/*": [".gif"]
    }
  });

  const handlePost = async () => {
    const isPostValid =
      postText?.trim() !== "" || selectedImage || selectedVideo || selectedGif;

    if (!isPostValid) {
      toast.error(
        "Please add text or select an image, video, or GIF to create a post."
      );
      return;
    }

    setIsPosting(true);

    try {
      await createPost({
        type: selectedImage
          ? "image"
          : selectedVideo
            ? "video"
            : selectedGif
              ? "gif"
              : "text",
        content: postText ?? undefined,
        imageUrl: selectedImage ?? undefined,
        videoUrl: selectedVideo ?? undefined,
        gifUrl: selectedGif ?? undefined
      });

      toast.success("Post created successfully!", {
        icon: "📝",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff"
        }
      });
      setSelectedImage(null);
      setSelectedVideo(null);
      setSelectedGif(null);
      setPostText("");
      setFileUploaded(false);
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsPosting(false);
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
      <div>
        <Card className="overflow-hidden sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-4 border-gray-800 shadow-2xl rounded-xl">
          <CardHeader>
            <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Create a New Post
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="w-full min-h-[100px] bg-secondary border-gray-300 focus:border-gray-500 rounded-lg resize-none transition-colors duration-300"
            />
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 transition-colors ${isDragActive ? "border-blue-500" : "border-gray-300"} bg-secondary`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-center">Drop the files here ...</p>
              ) : (
                <div>
                  <div className="flex items-center justify-center max-w-[100px]">
                    <svg
                      viewBox="0 0 24 24"
                      fill=""
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                          fill=""
                        ></path>{" "}
                      </g>
                    </svg>
                  </div>
                  <p className="text-center">
                    Drag & drop files here, or click to select files
                  </p>
                </div>
              )}
            </div>
            {fileUploaded && (
              <div className="border border-gray-300 p-4 rounded-lg transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-sm">File uploaded successfully</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFileUploaded(false);
                      setSelectedImage(null);
                      setSelectedVideo(null);
                      setSelectedGif(null);
                    }}
                    className=" hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
                {selectedImage && (
                  <Image
                    src={selectedImage}
                    alt="Selected"
                    width={500}
                    height={300}
                    className="mt-2 rounded-md object-cover"
                  />
                )}
                {selectedVideo && (
                  <video
                    src={selectedVideo}
                    controls
                    className="mt-2 max-w-full h-auto rounded-md"
                  />
                )}
                {selectedGif && (
                  <Image
                    src={selectedGif}
                    alt="Selected GIF"
                    width={500}
                    height={300}
                    className="mt-2 rounded-md object-cover"
                  />
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <StyledWrapper>
              <button onClick={handlePost} disabled={isPosting}>
                <div className="svg-wrapper-1">
                  <div className="svg-wrapper">
                    <svg
                      height="24"
                      width="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path
                        d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
                <span>Post</span>
              </button>
            </StyledWrapper>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

const StyledWrapper = styled.div`
  button {
    font-family: inherit;
    font-size: 18px;
    background: linear-gradient(to bottom, #4dc7d9 0%, #66a6ff 100%);
    color: white;
    padding: 0.8em 1.2em;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 25px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
    transition: all 0.3s;
  }

  button:hover {
    transform: translateY(-3px);
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
    padding: 0em;
    background: linear-gradient(to bottom, #5bd9ec 0%, #97c3ff 100%);
    cursor: pointer;
  }

  button:active {
    transform: scale(0.95);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  }

  button span {
    display: block;
    margin-left: 0.4em;
    transition: all 0.3s;
  }

  button:hover span {
    scale: 0;
    font-size: 0%;
    opacity: 0;
    transition: all 0.5s;
  }

  button svg {
    width: 18px;
    height: 18px;
    fill: white;
    transition: all 0.3s;
  }

  button .svg-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    transition: all 0.3s;
  }

  button:hover .svg-wrapper {
    background-color: rgba(43, 169, 228, 0.897);
    width: 54px;
    height: 54px;
  }

  button:hover svg {
    width: 25px;
    height: 25px;
    margin-right: 5px;
    transform: rotate(45deg);
  }
`;
