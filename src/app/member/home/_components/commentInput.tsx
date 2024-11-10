"use client";
import { Card } from "@/components/ui/card";
import { z } from "zod";
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
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

// Define the validation schema for the chat input
const chatSchema = z.object({
  type: z.literal("text"),
  content: z.string().min(1, {
    message: "Please enter a message"
  })
});

// Define Props type correctly
type Props = {
  postId: Id<"posts">; // Ensure postId is of the correct type
};

const ChatInput: React.FC<Props> = ({ postId }) => {
  const { mutate: createComment, pending } = UseMutationState(
    api.post.createComment
  );

  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      type: "text",
      content: ""
    }
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { value } = event.target;
    form.setValue("content", value);
  };

  const handleSubmit = async (values: z.infer<typeof chatSchema>) => {
    try {
      // Call the mutation to create a comment and increment the comments count
      await createComment({
        postId,
        content: values.content
      });
      form.reset(); // Reset the form upon successful comment submission
      toast.success("Comment added successfully!"); // Notify the user of success
    } catch (error) {
      // Handle errors appropriately
      toast.error(
        error instanceof ConvexError ? error.data : "Unexpected error occurred"
      );
    }
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
              render={({ field }) => (
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
