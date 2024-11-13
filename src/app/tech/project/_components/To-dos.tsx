"use client"

import React, { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from 'lucide-react'
import { Id } from "../../../../../convex/_generated/dataModel"

interface PersonalWorkspaceProps {
  projectId: Id<"projectWorkspaces">
  userId: Id<"users">
}

export default function ToDos({ projectId, userId }: PersonalWorkspaceProps) {
  const addTodoMutation = useMutation(api.workspace.addTodo)
  const deleteTodoMutation = useMutation(api.workspace.deleteTodo)
  const updateTodoStatusMutation = useMutation(api.workspace.updateTodoStatus)
  const todosQuery = useQuery(api.workspace.getTodos, { projectId })

  const [newTodo, setNewTodo] = useState<string>("")

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      await addTodoMutation({
        projectId,
        creatorId: userId,
        content: newTodo,
        completed: false,
      })
      setNewTodo("")
    }
  }

  const handleDeleteTodo = async (todoId: Id<"projectTodos">) => {
    await deleteTodoMutation({ todoId })
  }

  const handleUpdateTodoStatus = async (todoId: Id<"projectTodos">, completed: boolean) => {
    await updateTodoStatusMutation({ todoId, completed })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>To-Do List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Type a new task"
            className="flex-grow"
          />
          <Button onClick={handleAddTodo}>Add</Button>
        </div>
        {todosQuery && todosQuery.length > 0 ? (
          <ul className="space-y-2">
            {todosQuery.map((todo: any) => (
              <li key={todo._id} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                <div className="flex items-center space-x-2">
                  <Checkbox
                  checked={todo.completed}
                  onCheckedChange={(checked: boolean | "indeterminate") => handleUpdateTodoStatus(todo._id, checked as boolean)}
                  />
                  <span className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {todo.content}
                  </span>
                </div>
                {todo.creatorId === userId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground">No todos available.</p>
        )}
      </CardContent>
    </Card>
  )
}