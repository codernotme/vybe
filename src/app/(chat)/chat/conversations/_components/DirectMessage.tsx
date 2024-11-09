import React from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar } from "@nextui-org/avatar";

type Props = {
  id: Id<"conversations">;
  imageUrl: string;
  username: string;
  lastMessageSender?: string;
  lastMessageContent?: string;
};

const DirectMessage = ({
  id,
  imageUrl,
  username,
  lastMessageSender,
  lastMessageContent
}: Props) => {
  return (
    <Link href={`/chat/conversations/${id}`} className="w-full">
      <Card className="p-4 flex flex-row items-center gap-4 hover:shadow-md transition-shadow duration-300">
        {/* Avatar */}
        <Avatar
          isBordered
          src={imageUrl}
          size="md"
          className="rounded-full border-2 border-gray-200"
        />

        {/* User Info */}
        <div className="flex flex-col truncate">
          {/* Username */}
          <h4 className="text-lg font-semibold truncate">{username}</h4>

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

export default DirectMessage;
