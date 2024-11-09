"use client";

import { useConversation } from "@/hooks/useConversation";
import { useQuery } from "convex/react";
import React, { useMemo } from "react";
import { api } from "../../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../../convex/_generated/dataModel";
import Message from "./Message";

type Props = {};

const Body = (props: Props) => {
  const { conversationId } = useConversation();

  const messages = useQuery(api.messages.get, {
    id: conversationId as Id<"conversations">
  });

  const isLoading = !messages;

  const renderedMessages = useMemo(() => {
    return messages?.map(
      ({ message, senderImage, senderName, isCurrentUser }, index) => {
        const lastByUser =
          index > 0 &&
          messages[index - 1]?.message.senderId ===
            messages[index].message.senderId;

        return (
          <Message
            key={message._id}
            fromCurrentUser={isCurrentUser}
            senderImage={senderImage}
            senderName={senderName}
            lastByUser={lastByUser}
            content={message.content}
            createdAt={message._creationTime}
            type={message.type}
          />
        );
      }
    );
  }, [messages]);

  if (isLoading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="flex-1 w-full max-h-[80vh] overflow-y-auto flex flex-col-reverse gap-4 p-4  rounded-lg shadow-inner no-scrollbar smooth-scroll">
      {renderedMessages}
    </div>
  );
};

export default Body;
