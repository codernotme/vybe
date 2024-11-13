"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button, Card, Input } from "@nextui-org/react";
import ToDos from "./To-dos";
import InviteUsers from "./InviteUsers";
import { useRouter } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";

interface PersonalWorkspaceProps {
  projectId: Id<"projectWorkspaces">;
  userId: Id<"users">;
}

const PersonalWorkspace: React.FC<PersonalWorkspaceProps> = ({ projectId, userId }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const chatMessages = useQuery(api.workspace.fetchProjectChatMessages, { projectId, userId });
  const addMessage = useMutation(api.workspace.addProjectChatMessage);
  const [newMessage, setNewMessage] = useState("");

  const projectDetails = useQuery(api.workspace.getProjectWorkspace, { projectId, userId });

  useEffect(() => {
    if (projectDetails) {
      setIsAuthorized(true);
    }
  }, [projectDetails]);

  const handleAddMessage = async () => {
    if (newMessage.trim()) {
      await addMessage({ projectId, senderId: userId, content: newMessage });
      setNewMessage("");
    }
  };

  if (!isAuthorized) {
    return <div>Access Denied. You are not a member of this project.</div>;
  }

  return (
    <div className="p-6">
      <Button onClick={() => router.push("/")}>Back to Workspaces</Button>
      <Card className="mt-4">
        <h2>Project Chat</h2>
        {chatMessages?.map((msg) => (
          <p key={msg._id}>{msg.content}</p>
        ))}
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <Button onClick={handleAddMessage}>Send</Button>
      </Card>

      <ToDos projectId={projectId} userId={userId} />
      <InviteUsers projectId={projectId} />
    </div>
  );
};

export default PersonalWorkspace;
