// components/AnonymousPost.tsx
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { Button, Input, Card } from "@nextui-org/react";
import { api } from "../../convex/_generated/api";

interface Post {
  id: string;
  text: string;
  userId: string; // anonymized unique identifier
  timestamp: Date;
}

const AnonymousPost = () => {
  const [postText, setPostText] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const posts = useQuery(api.anonymousPost.getPosts); // fetch recent posts
  const addPost = useMutation(api.anonymousPost.addPost); // mutation to add post

  useEffect(() => {
    if (!sessionId) {
      // Generate a session-based unique identifier for the user
      setSessionId(`user-${Math.random().toString(36).substr(2, 9)}`);
    }
  }, [sessionId]);

  const handleAddPost = async () => {
    if (postText.trim()) {
      const result = await addPost({ text: postText, userId: sessionId, timestamp: new Date() });
      if (result?.error) {
        alert(result.error); // Notify user if post limit is reached
      } else {
        setPostText(""); // Clear input if post was successful
      }
    }
  };

  return (
    <div className="flex flex-col max-w-md mx-auto p-4 bg-gray-100 rounded-md shadow-lg">
      <div className="mb-4">
        <Input
          placeholder="Write an anonymous post..."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          fullWidth
        />
        <Button onClick={handleAddPost} className="mt-2">
          Post
        </Button>
      </div>
      <div className="space-y-4">
        {posts?.map((post: Post) => (
          <Card key={post.id}>
            <p>
              {post.userId} - {new Date(post.timestamp).toLocaleString()}
            </p>
            <p>{post.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnonymousPost;
