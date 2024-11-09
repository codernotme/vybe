"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ImageIcon,
  Mail,
  MessageCircle,
  ThumbsUp,
  User,
  User2Icon
} from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { Image } from "@nextui-org/image";

export default function UserProfileDashboard() {
  const { user } = useUser();
  const userPosts = useQuery(api.getUserPosts.getUserPosts);
  const friends = useQuery(api.friends.get);
  const users = useQuery(api.users.get);

  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: users?.name || "",
    username: user?.username || "",
    email: user?.emailAddresses[0]?.emailAddress || ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = useMutation(api.users.update);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await update({
        clerkId: user?.id || "",
        ...userInfo
      });
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  if (!userPosts || !friends || !users) {
    return (
      <div className="container flex justify-center items-center h-full">
        <div className="loader">
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 w-full">
      <Card className="w-full">
        <CardContent className="p-0">
          <div className="relative h-48"></div>
          <div className="px-4 pb-4">
            <Avatar className="w-32 h-32 border-4 border-white -mt-16 mb-4">
              <AvatarImage
                src={user?.imageUrl || ""}
                alt={user?.username || "User Avatar"}
              />
              <AvatarFallback>
                {userInfo.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{users.name}</h1>
              <Button onClick={handleEdit}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 mt-4 space-y-4 md:space-y-0">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center ">About</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    name="name"
                    value={userInfo.name}
                    onChange={handleChange}
                    placeholder="Name"
                  />
                  <Input
                    name="username"
                    value={userInfo.username}
                    onChange={handleChange}
                    placeholder="Username"
                  />
                  <Input
                    name="email"
                    value={userInfo.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  <Button onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  {error && <p className="text-red-500">{error}</p>}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="flex items-center text-muted-foreground">
                    <User2Icon className="mr-2 h-4 w-4" />
                    {userInfo.username}
                  </p>
                  <p className="flex items-center text-muted-foreground">
                    <Mail className="mr-2 h-4 w-4" />
                    {userInfo.email}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mx-auto">
            <CardHeader>
              <CardTitle>Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="posts" className="w-full">
                <TabsList>
                  <TabsTrigger value="posts">Posts</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                </TabsList>
                <TabsContent value="posts">
                  {userPosts.map((post) => (
                    <Card key={post.post._id} className="mb-4">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground mb-2 text-left">
                          {new Date(post.post._creationTime).toLocaleString()}{" "}
                          ago
                        </p>
                        <p className="text-lg text-left bg-secondary rounded-md p-2">
                          {post.post.content}
                        </p>
                        {post.post.imageUrl && (
                          <Image
                            src={post.post.imageUrl}
                            alt="Post content"
                            className="rounded-md"
                            width="auto"
                            height="auto"
                            loading="lazy"
                          />
                        )}
                        <div className="flex items-center mt-4 space-x-4">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="mr-2 h-4 w-4" />
                            Like
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Comment
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                <TabsContent value="media">
                  <div className="grid grid-cols-3 gap-4">
                    {userPosts
                      .filter((post) => post.post.imageUrl) // Filter posts with media
                      .map((post) => (
                        <div
                          key={post.post._id}
                          className="aspect-square bg-muted rounded-md flex items-center justify-center"
                        >
                          <Image
                            src={post.post.imageUrl}
                            alt="Post content"
                            className="rounded-md"
                            width="auto"
                            height="auto"
                            loading="lazy" // Lazy loading for images
                          />
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="px-4">
          <Card>
            <CardHeader>
              <CardTitle>Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                {friends.map((friend) => (
                  <div key={friend._id} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={friend.imageUrl} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{friend.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {friend.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
