// components/AnonymousPost.tsx
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { Button, Input, Card, Switch, Select } from "@nextui-org/react";
import { api } from "../../convex/_generated/api";

interface Post {
  _id: string;
  _creationTime: number;
  text: string;
  userId?: string;
  isAnonymous: boolean;
}

const PostComponent = ({ post }: { post: Post }) => (
  <Card key={post._id} className="mb-4">
    <p>
      {post.isAnonymous ? "Anonymous" : "Tech User"} -{" "}
      {new Date(post._creationTime).toLocaleString()}
    </p>
    <p>{post.text}</p>
  </Card>
);

const AnonymousPost = () => {
  const [postText, setPostText] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [postDuration, setPostDuration] = useState(24);
  const posts = useQuery(api.anonymousPost.getPosts);
  const addPost = useMutation(api.anonymousPost.addPost);

  useEffect(() => {
    if (!sessionId) {
      setSessionId(`user-${Math.random().toString(36).substr(2, 9)}`);
    }
  }, [sessionId]);

  const handleAddPost = async () => {
    if (postText.trim()) {
      const result = (await addPost({
        text: postText,
        userId: isAnonymous || !sessionId ? undefined : sessionId,
        isAnonymous: isAnonymous,
        duration: postDuration,
      })) as { error?: string } | null;
      if (result?.error) {
        alert(result.error);
      } else {
        setPostText("");
      }
    }
  };

  return (
    <div className="flex flex-col max-w-md mx-auto p-4 bg-gray-100 rounded-md shadow-lg">
      <div className="mb-4">
        <Input
          placeholder="Write a post..."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          fullWidth
        />
        <div className="flex items-center mt-2">
          <Switch
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <span className="ml-2">Post Anonymously</span>
        </div>
        <Button onClick={handleAddPost} className="mt-2">
          Post
        </Button>
      </div>
      {posts?.map((post: Post) => (
        <PostComponent key={post._id} post={post} />
      ))}
    </div>
  );
};

export default AnonymousPost;
