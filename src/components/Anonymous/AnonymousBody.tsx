"use client";

import { useQuery } from "convex/react";
import React, { useMemo } from "react";
import { api } from "../../../convex/_generated/api";
import AnonymousMessage from "./AnonymousMessage";

type Props = {};

const AnonymousBody = (props: Props) => {
  const anonymousMessages = useQuery(api.anonymousChat.getMessages);
  const isLoading = !anonymousMessages?.length;

  const renderedMessages = useMemo(() => {
    return anonymousMessages?.map((msg, index) => {
      const lastByUser =
        index > 0 && anonymousMessages[index - 1]?.userId === msg.userId;

      return (
        <AnonymousMessage
          key={msg._id}
          lastByUser={lastByUser}
          content={msg.text}
          createdAt={msg._creationTime}
        />
      );
    });
  }, [anonymousMessages]);

  if (isLoading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="flex-1 w-full max-h-[80vh] overflow-y-auto flex flex-col-reverse gap-4 p-4 rounded-lg shadow-inner no-scrollbar smooth-scroll">
      {renderedMessages}
    </div>
  );
};

export default AnonymousBody;
