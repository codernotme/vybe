"use client";
import { Card } from "@/components/ui/card";
import { useConversation } from "@/hooks/useConversation";
import React, { useRef } from "react";
import { z } from "zod";
import { api } from "../../../../../../../../convex/_generated/api";
import { UseMutationState } from "@/hooks/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "@nextui-org/input";
import { Button } from "@/components/ui/button";
import { SendHorizonalIcon } from "lucide-react";

const chatSchema = z.object({
  type: z.literal("text"),
  content: z.string().min(1, {
    message: "Please enter a message"
  })
});

const ChatInput = () => {
  const textareRef = useRef<HTMLTextAreaElement | null>(null);
  const { conversationId } = useConversation();

  const { mutate: createMessage, pending } = UseMutationState(
    api.message.create
  );

  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      type: "text",
      content: ""
    }
  });

  const handleInputChange = (event: any) => {
    const { value, selectionStart } = event.target;

    if (selectionStart !== null) {
      form.setValue("content", value);
    }
  };

  const handleSubmit = async (values: z.infer<typeof chatSchema>) => {
    createMessage({
      conversationId,
      type: "text",
      content: [values.content]
    })
      .then(() => {
        form.reset();
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "Unexpected error occurred"
        );
      });
  };
  return (
    <Card className="w-full h-auto p-2 rounded-lg">
      <div className="flex gap-2 items-end w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex gap-2 items-end w-full"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => {
                return (
                  <FormItem className="h-auto w-full">
                    <FormControl>
                      <Textarea
                        onKeyDown={async (e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            await form.handleSubmit(handleSubmit)();
                          }
                        }}
                        variant="underlined"
                        placeholder="Enter your message"
                        className="w-full h-auto"
                        maxRows={2}
                        {...field}
                        onChange={handleInputChange}
                        onClick={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button disabled={pending} size="icon" type="submit">
              <SendHorizonalIcon />
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default ChatInput;
