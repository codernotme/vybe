"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button, Card, CardBody, CardFooter, CardHeader, Image, Input, Spacer } from "@nextui-org/react";
import ToDos from "./To-dos";
import InviteUsers from "./InviteUsers";
import { useRouter } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import { ChevronLeft } from "lucide-react";

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
    <>
    <main className="items-center justify-center min-h-screen  p-4">
    <Button onClick={() => router.push("/tech/project")}><ChevronLeft/>Back</Button>
    <div className="flex flex-row w-full gap-3">
      <Card className="mt-4 p-4 w-[700px] h-[400px]">
        <CardHeader>
        <h2>Project Chat</h2>
        </CardHeader>
        <CardBody>
        {chatMessages?.map((msg) => (
          <div key={msg._id} className="flex items-center gap-2 p-2">
            <Image src={msg.senderImage} alt={msg.senderName} className="w-8 h-8 rounded-full" />
            <div>
              <p className="font-bold">{msg.senderName}</p>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        </CardBody>
        <Spacer y={1} />
        <CardFooter>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <Button onClick={handleAddMessage}>Send</Button>
        </CardFooter>
      </Card>
      <div>
        <div className="flex flex-row gap-3">
      <Card className="mt-4 p-4">
      <ToDos projectId={projectId} userId={userId} />
      </Card>
      <Card className="mt-4 p-4">
      <InviteUsers projectId={projectId} />
      </Card>
        </div>
      </div>
    </div>
    </main>
    </>
  );
};

export default PersonalWorkspace;
