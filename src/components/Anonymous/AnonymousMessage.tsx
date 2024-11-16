"use client";

import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar } from "@nextui-org/avatar";

type Props = {
  senderImage?: string;
  senderName?: string;
  lastByUser: boolean;
  content: string;
  createdAt: number;
  seen?: React.ReactNode;
};

const AnonymousMessage = ({
  senderImage,
  senderName,
  lastByUser,
  content,
  createdAt,
  seen,
}: Props) => {
  const formatTime = (timestamp: number) => format(timestamp, "HH:mm");

  const fromCurrentUser = senderName === "user1";

  return (
    <div
      className={cn("flex items-end gap-3", {
        "justify-end": fromCurrentUser,
        "justify-start": !fromCurrentUser,
      })}
    >
      {!fromCurrentUser && !lastByUser && (
        <Avatar
          className="w-8 h-8 opacity-80 hover:opacity-100 transition-opacity duration-300"
          showFallback src='https://images.unsplash.com/broken'
          alt={senderName || "Anonymous"}
        />
      )}

      <div
        className={cn("flex flex-col max-w-[70%] space-y-1", {
          "items-end text-right": fromCurrentUser,
          "items-start text-left": !fromCurrentUser,
        })}
      >
        {!fromCurrentUser && !lastByUser && senderName && (
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {senderName}
          </span>
        )}

        <div
          className={cn(
            "px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105",
            {
              "bg-gradient-to-r from-purple-500 to-purple-600 text-white":
                fromCurrentUser,
              "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-200":
                !fromCurrentUser,
              "rounded-br-none": !lastByUser && fromCurrentUser,
              "rounded-bl-none": !lastByUser && !fromCurrentUser,
            }
          )}
        >
          <p className="text-sm break-words whitespace-pre-wrap break-all">
            {content}
          </p>

          <p
            className={cn("text-xs mt-1", {
              "text-gray-300": fromCurrentUser,
              "text-gray-500 dark:text-gray-400": !fromCurrentUser,
            })}
          >
            {formatTime(createdAt)}
          </p>
        </div>

        {seen && <div className="text-xs text-blue-500 mt-1">{seen}</div>}
      </div>

      {fromCurrentUser && !lastByUser && (
        <Avatar
          className="w-8 h-8 opacity-80 hover:opacity-100 transition-opacity duration-300 bg-rose-700"
          showFallback src='https://images.unsplash.com/broken'
          alt="You"
        />
      )}
    </div>
  );
};

export default AnonymousMessage;

