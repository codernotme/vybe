"use client";

import ItemList from "@/components/shared/item-list/ItemList";
import { useQuery } from "convex/react";
import React from "react";
import { Loader2Icon } from "lucide-react";
import DirectMessage from "./_components/DirectMessage";
import GroupDialog from "./_components/GroupDialog";
import GroupConvoItem from "./_components/GroupConvoItem";
import { api } from "../../../../../convex/_generated/api";

type Props = React.PropsWithChildren<{}>;

const ConversationLayout = ({ children }: Props) => {
  const conversations = useQuery(api.conversations.get);
  return (
    <>
      <ItemList title="Messages" action={<GroupDialog />}>
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No conversations found
            </p>
          ) : (
            conversations.map((conversations) => {
              return conversations.conversation.isGroup ? (
                <GroupConvoItem
                  key={conversations.conversation._id}
                  id={conversations.conversation._id}
                  name={conversations.conversation.name || ""}
                  lastMessageSender={conversations.lastMessage?.sender}
                  lastMessageContent={conversations.lastMessage?.content}
                />
              ) : (
                <DirectMessage
                  key={conversations.conversation._id}
                  id={conversations.conversation._id}
                  username={conversations.otherMember?.username || ""}
                  imageUrl={conversations.otherMember?.imageUrl || ""}
                  lastMessageSender={conversations.lastMessage?.sender}
                  lastMessageContent={conversations.lastMessage?.content}
                />
              );
            })
          )
        ) : (
          <Loader2Icon className="w-6 h-6 animate-spin" />
        )}
      </ItemList>
      {children}
    </>
  );
};

export default ConversationLayout;
