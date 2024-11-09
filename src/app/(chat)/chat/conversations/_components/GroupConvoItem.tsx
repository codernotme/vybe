import React from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  id: Id<"conversations">;
  name: string;
  lastMessageSender?: string;
  lastMessageContent?: string;
};

const GroupConvoItem = ({
  id,
  name,
  lastMessageSender,
  lastMessageContent
}: Props) => {
  return (
    <Link href={`/chat/conversations/${id}`} className="w-full">
      <Card className="p-4 flex flex-row items-center gap-4 hover:shadow-lg transition-shadow duration-300">
        {/* Group Avatar */}
        <Avatar className="w-12 h-12">
          <AvatarFallback>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        {/* Conversation Info */}
        <div className="flex flex-col truncate">
          {/* Group Name */}
          <h4 className="text-lg font-semibold truncate">{name}</h4>

          {/* Last Message */}
          {lastMessageSender && lastMessageContent ? (
            <span className="text-sm text-gray-500 truncate">
              <span className="font-semibold">{lastMessageSender}: </span>
              <span className="truncate">{lastMessageContent}</span>
            </span>
          ) : (
            <p className="text-sm text-gray-400">Start a conversation</p>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default GroupConvoItem;
