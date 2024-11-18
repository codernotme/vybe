"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

export default function CommunityChatGroups() {
  const router = useRouter();
  const groups = useQuery(api.conversations.getAllCommunityGroups);
  const user = useQuery(api.users.get);
  const userMemberships = useQuery(api.conversations.getUserMemberships);
  const createGroup = useMutation(api.conversations.createCommunityGroup);
  const joinGroup = useMutation(api.conversations.joinCommunityGroup);
  const [groupName, setGroupName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateGroup = () => {
    createGroup({ name: groupName });
    setGroupName("");
    setIsCreateDialogOpen(false);
  };

  const handleJoinGroup = async (groupId: Id<"communityChatGroups">): Promise<void> => {
    await joinGroup({ groupId });
    router.push(`/chat/conversations/${groupId}`);
  };

  const isUserMember = (groupId: Id<"communityChatGroups">) => {
    return userMemberships?.some(
      (membership) => (membership.groupId as unknown as Id<"communityChatGroups">) === groupId
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Community Chat Groups</h2>
      {groups ? (
        groups.length === 0 ? (
          <p>No community chat groups available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <Card key={group._id}>
                <CardHeader>
                  <CardTitle>{group.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {!isUserMember(group._id) && (
                    <Button onClick={() => handleJoinGroup(group._id)}>Join Group</Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : (
        <p>Loading...</p>
      )}
      {user?.role === "community" && (
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Group</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Community Chat Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group Name"
              />
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}