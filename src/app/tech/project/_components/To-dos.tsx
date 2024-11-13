"use client";
import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@nextui-org/button";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Input } from "@nextui-org/input";

interface PersonalWorkspaceProps {
    projectId: Id<"projectWorkspaces">;
    userId: Id<"users">;
  }

export default function ToDos( {projectId, userId}: PersonalWorkspaceProps) {
    const addTodoMutation = useMutation(api.workspace.addTodo);

    const [newTodo, setNewTodo] = useState<string>("");
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
    return(
        <>
      <h2>To-Do List</h2>
      <Input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Type a new task"
        title="New Todo"
      />
      <Button onClick={handleAddTodo}>Add Todo</Button>

      {/* {<h2>GitHub Logs</h2>
      {githubLogs && githubLogs.length > 0 ? (
        githubLogs.map((log: any, index: number) => (
          <div key={index}>
            <p>{log.message}</p>
          </div>
        ))
      ) : (
        <p>No GitHub logs available.</p>
      )}} */}
      </>
    )
};