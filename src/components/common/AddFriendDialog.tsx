"use client"

import React, { useState, useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserPlus2, Search } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { api } from "../../../convex/_generated/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMutation, useQuery } from "convex/react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import styled from "styled-components";


const addFriendFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long." }),
})

export default function AddFriendDialog() {
  const createRequest = useMutation(api.request.create)
  const user = useQuery(api.users.get)
  const [searchResults, setSearchResults] = useState<(typeof user)[]>([])
  const [selectedUser, setSelectedUser] = useState<typeof user | null>(null)

  const form = useForm({
    resolver: zodResolver(addFriendFormSchema),
    defaultValues: { username: "" },
  })

  const searchResultsData = useQuery(api.users.search, {
    username: form.watch("username"),
  })

  useEffect(() => {
    if (searchResultsData instanceof Error) {
      console.error("Failed to fetch search results:", searchResultsData)
      toast.error("Failed to search users. Try again later.")
    } else {
      setSearchResults(searchResultsData || [])
    }
  }, [searchResultsData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value.trim()
    form.setValue("username", username)
    if (username.length < 3) {
      setSearchResults([])
    }
  }

  const handleSubmit = async () => {
    try {
      const { username } = form.getValues()
      await createRequest({ username })
      toast.success("Friend request sent!")
      form.reset()
      setSearchResults([])
      setSelectedUser(null)
    } catch (error) {
      console.error("Error sending friend request:", error)
      toast.error("Unexpected error occurred. Please try again.")
    }
  }

  return (
    <Dialog>
      <StyledWrapper>
        <Button>
          <DialogTrigger asChild>
            <UserPlus2 className="text-secondary-foreground" />
          </DialogTrigger>
        </Button>
      </StyledWrapper>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Search for a user and send a friend request.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search username"
                        {...field}
                        className="pl-8"
                        onChange={handleInputChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <ScrollArea className="h-[200px] w-full rounded-md border">
          {searchResults.map((user) => (
            <div
              key={user?._id}
              className="flex items-center space-x-4 p-4 hover:bg-accent cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              <Avatar>
                <AvatarImage src={user?.imageUrl} alt={user?.username} />
                <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">@{user?.username}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
        {selectedUser && (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedUser.imageUrl} alt={selectedUser.username} />
                  <AvatarFallback>{selectedUser.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">@{selectedUser.username}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.name}</p>
                </div>
                <p className="text-center text-sm">
                  {selectedUser?.description || "No bio provided."}
                </p>
                <div className="text-sm">
                  <span className="font-medium">Interests: </span>
                  {selectedUser.interests?.join(", ") || "No interests listed."}
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button onClick={handleSubmit}>Send Friend Request</Button>
            </CardFooter>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  )
}

const StyledWrapper = styled.div`
Button {
  background: none;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

Button:hover {
  background: rgba(170, 170, 170, 0.062);
  transition: 0.5s;
}
`;