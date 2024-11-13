"use client";
import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button, Input } from "@nextui-org/react";
import { Id } from "../../../../../convex/_generated/dataModel";

interface InviteUsersProps {
  projectId: Id<"projectWorkspaces">;
}

const InviteUsers: React.FC<InviteUsersProps> = ({ projectId }) => {
  const inviteUser = useMutation(api.workspace.inviteUser);
  const [email, setEmail] = useState("");

  const handleInvite = async () => {
    if (email.trim()) {
      await inviteUser({ projectId, email });
      setEmail("");
    }
  };

  return (
    <div className="mt-4">
      <h3>Invite Users</h3>
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter user email"
      />
      <Button onClick={handleInvite}>Invite</Button>
    </div>
  );
};

export default InviteUsers;
