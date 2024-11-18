"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CommunityChatGroups from "./CommunityChatGroups";
import { useState } from "react";
import { UsersRound } from "lucide-react";

export default function CommunityDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><UsersRound /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Community Chat Groups</DialogTitle>
        </DialogHeader>
        <CommunityChatGroups />
      </DialogContent>
    </Dialog>
  );
}