"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { UserPlus2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { UseMutationState } from "@/hooks/useMutationState";
import { api } from "../../../convex/_generated/api";
import styled from "styled-components";

const addFriendFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
});

const AddFriendDialog = () => {
  const { mutate: createRequest, pending } = UseMutationState(
    api.request.create
  );

  const form = useForm<z.infer<typeof addFriendFormSchema>>({
    resolver: zodResolver(addFriendFormSchema),
    defaultValues: {
      username: ""
    }
  });

  const handleSubmit = async (values: z.infer<typeof addFriendFormSchema>) => {
    try {
      await createRequest({ username: values.username });
      form.reset();
      toast.success("Request sent");
    } catch (error) {
      toast.error(
        error instanceof ConvexError
          ? error.message || "Unexpected error occurred"
          : "Unexpected error occurred"
      );
    }
  };

  return (
    <Dialog>
      <StyledWrapper>
        <Button>
          <DialogTrigger>
            <UserPlus2 className="text-secondary-foreground" />
          </DialogTrigger>
        </Button>
      </StyledWrapper>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Send a request to connect with your friends.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={pending} type="submit">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

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

export default AddFriendDialog;
