"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
});

export default function NewsletterSubmissionForm() {
  const { toast } = useToast();
  const user = useQuery(api.users.get);
  const userLoading = !user;
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const submitBlog = useMutation(api.newsletter.submitNewsletter);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || userLoading) {
      toast({
        title: "User not found",
        description: "Please log in before submitting a newsletter.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await submitBlog({
        title: values.title,
        content: values.content,
        authorId: user._id, // Ensure user ID is passed correctly
      });
      toast({
        title: "Newsletter submitted",
        description: "Your newsletter has been submitted for approval.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while submitting your newsletter.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Newsletter Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter your newsletter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Newsletter Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your newsletter content..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading || userLoading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
