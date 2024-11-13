"use client";
import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@nextui-org/button";
import { Id } from "../../../../../convex/_generated/dataModel";

interface PersonalWorkspaceProps {
  projectId: Id<"projectWorkspaces">;
  userId: Id<"users">;
}

const PersonalWorkspace: React.FC<PersonalWorkspaceProps> = ({ projectId, userId }) => {
  // Fetch chat messages for the project
  const chatMessages = useQuery(api.workspace.fetchProjectChatMessages, {
    projectId,});

  // Fetch GitHub logs for a placeholder repo URL (or actual URL if available)
  const githubLogs = useQuery(api.workspace.fetchGitHubLogs, {
    repoUrl: "https://github.com/sample/repo",
  });

  // Define mutation hooks for adding messages and todos
  const addMessageMutation = useMutation(api.workspace.addProjectChatMessage);
  const addTodoMutation = useMutation(api.workspace.addTodo);

  const [newMessage, setNewMessage] = useState<string>("");
  const [newTodo, setNewTodo] = useState<string>("");

  const handleAddMessage = async () => {
    if (newMessage.trim()) {
      await addMessageMutation({
        projectId, // Using projectId instead of convoId
        senderId: userId,
        content: newMessage,
      });
      setNewMessage("");
    }
  };

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      await addTodoMutation({
        projectId,
        creatorId: userId,
        content: newTodo,
        completed: false,
      });
      setNewTodo("");
    }
  };

  return (
    <div>
      <h2>Project Chat</h2>
      {chatMessages && chatMessages.length > 0 ? (
        chatMessages.map((msg: any) => <p key={msg._id}>{msg.content}</p>)
      ) : (
        <p>No messages yet.</p>
      )}
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
        title="New Message"
      />
      <Button onClick={handleAddMessage}>Send</Button>

      <h2>To-Do List</h2>
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Type a new task"
        title="New Todo"
      />
      <Button onClick={handleAddTodo}>Add Todo</Button>

      <h2>GitHub Logs</h2>
      {githubLogs && githubLogs.length > 0 ? (
        githubLogs.map((log: any, index: number) => (
          <div key={index}>
            <p>{log.message}</p>
          </div>
        ))
      ) : (
        <p>No GitHub logs available.</p>
      )}
    </div>
  );
};

export default PersonalWorkspace;
