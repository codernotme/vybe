"use client";
import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Image } from "@nextui-org/image";
import { api } from "../../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Input, Textarea } from "@nextui-org/input";
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
  const user = useQuery(api.users.get); // Fetch user details
  const posts = useQuery(api.posts.get);
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const createPost = useMutation(api.post.create);
  const addAnonymousPost = useMutation(api.anonymousPost.addPost); // Mutation for anonymous posts
  const [isAnonymous, setIsAnonymous] = useState(false); // Switch for anonymous posts
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
      } else if (fileType === "application/pdf") {
        setSelectedPdf(reader.result as string);
      }

      setFileUploaded(true);
    };

    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
      "application/pdf": [".pdf"],
      "gif/*": [".gif"],
    },
  });

  const handlePost = async () => {
    const isPostValid =
      postText?.trim() !== "" || selectedImage || selectedGif || selectedPdf;

    if (!isPostValid) {
      toast.error(
        "Please add text or select an image, or GIF to create a post."
      );
      return;
    }

    setIsPosting(true);

    try {
      const postData = {
        text: postText,
        userId: user?._id?.toString() ?? undefined,
        isAnonymous,
        duration: isAnonymous ? 24 * 60 * 60 * 1000 : 0,
        imageUrl: selectedImage ?? undefined,
        gifUrl: selectedGif ?? undefined,
        pdfUrl: selectedPdf ?? undefined,
      };

      if (isAnonymous) {
        await addAnonymousPost(postData);
        toast.success("Anonymous post created successfully!");
      } else {
        await createPost({
          type: selectedImage
            ? "image"
            : selectedGif
              ? "gif"
              : selectedPdf
                ? "pdf"
                : "text",
          content: postText ?? undefined,
          imageUrl: selectedImage ?? undefined,
          gifUrl: selectedGif ?? undefined,
          pdfUrl: selectedPdf ?? undefined,
          _creationTime: Date.now(), // Add _creationTime
        } as {
          type: string;
          content?: string;
          imageUrl?: string;
          gifUrl?: string;
          pdfUrl?: string;
          _creationTime: number;
        });
        toast.success("Post created successfully!", {
          icon: "📝",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }

      // Reset the form
      setSelectedImage(null);
      setSelectedGif(null);
      setSelectedPdf(null);
      setPostText("");
      setFileUploaded(false);
    } catch (error) {
      console.error("Error creating post:", error); // Log the error
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  if (!posts || !user) {
    return (
      <div className="container mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-xl space-y-4 p-4">
        {[...Array(3)].map((_, idx) => (
          <Skeleton key={idx} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  // Ensure only users with role "tech" see the anonymous post option
  const canPostAnonymously = user.role === "tech";

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
            {canPostAnonymously && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                  title="Post Anonymously"
                />
                <label className="text-gray-700 dark:text-gray-300">
                  Post Anonymously
                </label>
              </div>
            )}

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                isDragActive ? "border-blue-500" : "border-gray-300"
              } bg-secondary`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-center">Drop the files here ...</p>
              ) : (
                <div>
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
                      setSelectedGif(null);
                      setSelectedPdf(null);
                    }}
                    className="hover:text-red-700"
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
                {selectedGif && (
                  <Image
                    src={selectedGif}
                    alt="Selected GIF"
                    width={500}
                    height={300}
                    className="mt-2 rounded-md object-cover"
                  />
                )}
                {selectedPdf && (
                  <embed
                    src={selectedPdf}
                    type="application/pdf"
                    width="100%"
                    height="500px"
                    className="mt-2 rounded-md"
                  />
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <StyledWrapper>
              <button
                onClick={handlePost}
                disabled={isPosting}
                className="bg-gradient-to-r from-blue-400 to-purple-600 text-white font-bold py-2 px-4 rounded-md shadow-lg hover:from-blue-500 hover:to-purple-700 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="state" id="moon">
                  {isPosting ? "Posting..." : "Send"}
                </div>
                <div className="state" id="sun">
                  {isPosting ? "Posting..." : "Send"}
                </div>
                <span className="lightRotation" />
                <span className="lightRotation2" />
                <span className="lightRotation3" />
                <span className="lightRotation4" />
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
    --sunGradient: linear-gradient(
      60deg,
      #3d3393 0%,
      #2b76b9 37%,
      #2cacd1 65%,
      #35eb93 100%
    );
    --moonGradient: linear-gradient(to top, #cc208e 0%, #6713d2 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 140px;
    height: 60px;
    color: white;
    font-size: 1em;
    font-weight: bold;
    text-transform: uppercase;
    border-radius: 15px;
    background-color: transparent;
    transition: 0.5s;
    overflow: hidden;
    border: 4px solid black;
  }

  button:hover {
    box-shadow: -15px -15px 500px white;
    transition: 0.2s;
  }

  button:hover span {
    background: var(--sunGradient);
  }

  .state {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: inherit;
    transition: 0.4s;
    width: 85%;
    height: 82%;
    border: 4px solid black;
  }

  #sun {
    display: none;
    background-color: #212121;
    opacity: 0.85;
  }

  #moon {
    background-color: #212121;
    opacity: 0.85;
  }

  button:hover #sun {
    display: flex;
  }

  button:hover #moon {
    display: none;
  }

  button:hover .lightRotation {
    animation: 1s linear reverse infinite rotation413;
  }

  button:hover .lightRotation2 {
    animation: 2s linear infinite rotation_413;
  }

  button:hover .lightRotation3 {
    animation: 10s linear reverse infinite rotation_413;
  }

  button:hover .lightRotation4 {
    animation: 3s linear infinite rotation_413;
  }

  .lightRotation {
    position: absolute;
    transition: 0.4s;
    z-index: -1;
    width: 60px;
    height: 500px;
    transform: rotate(50deg);
    border-radius: inherit;
    background: var(--moonGradient);
  }

  .lightRotation2 {
    position: absolute;
    transition: 0.4s;
    z-index: -1;
    width: 75px;
    height: 500px;
    transform: rotate(110deg);
    border-radius: inherit;
    background: var(--moonGradient);
  }

  .lightRotation3 {
    position: absolute;
    transition: 0.4s;
    z-index: -1;
    width: 40px;
    height: 260px;
    border-radius: inherit;
    background: var(--moonGradient);
  }

  .lightRotation4 {
    position: absolute;
    transition: 0.4s;
    z-index: -1;
    width: 24px;
    height: 220px;
    transform: rotate(100deg);
    border-radius: inherit;
    background: var(--moonGradient);
  }

  @keyframes rotation_413 {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
`;
