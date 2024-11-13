"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Removed Toast import
import { Id } from "../../../../../convex/_generated/dataModel";
import { Send } from "lucide-react";

interface InviteUsersProps {
  projectId: Id<"projectWorkspaces">;
}

export default function InviteUsers({ projectId }: InviteUsersProps) {
  const inviteUser = useMutation(api.workspace.inviteUser);
  const [email, setEmail] = useState("");

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInvite = async () => {
    if (!email.trim()) {
      console.log("Error: Please enter an email address.");
      return;
    }

    if (!isValidEmail(email)) {
      console.log("Invalid Email: Please enter a valid email address.");
      return;
    }

    try {
      await inviteUser({ projectId, email });
      console.log(`Invitation Sent: An invitation has been sent to ${email}`);
      setEmail("");
    } catch (error) {
      console.error("Failed to send invitation:", error);
      console.log("Error: Failed to send invitation. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Invite Users</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleInvite();
          }}
          className="space-y-4"
        >
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email"
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full flex items-center justify-center space-x-2">
            <Send className="w-4 h-4" />
            <span>Send Invitation</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
