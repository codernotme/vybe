import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar } from "@nextui-org/avatar";

type Props = {
  fromCurrentUser: boolean;
  senderImage: string;
  senderName: string;
  lastByUser: boolean;
  content: string[];
  createdAt: number;
  seen?: React.ReactNode;
  type: string;
};

const Message = ({
  fromCurrentUser,
  senderImage,
  senderName,
  lastByUser,
  content,
  createdAt,
  seen,
  type
}: Props) => {
  const formatTime = (timestamp: number) => {
    return format(timestamp, "HH:mm");
  };

  return (
    <div
      className={cn("flex items-end gap-3", {
        "justify-end": fromCurrentUser,
        "justify-start": !fromCurrentUser
      })}
    >
      {/* Show Avatar for the sender when not the current user and no previous message by the same user */}
      {!fromCurrentUser && !lastByUser && (
        <Avatar
          className="w-8 h-8 opacity-80 hover:opacity-100 transition-opacity duration-300"
          src={senderImage}
          alt={senderName}
        />
      )}

      {/* Message Bubble and Content */}
      <div
        className={cn("flex flex-col max-w-[70%] space-y-1", {
          "items-end text-right": fromCurrentUser,
          "items-start text-left": !fromCurrentUser
        })}
      >
        {/* Show Sender Name for non-consecutive messages */}
        {!lastByUser && (
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {senderName}
          </span>
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            "px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105",
            {
              "bg-gradient-to-r from-blue-500 to-blue-600 text-white":
                fromCurrentUser,
              "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-200":
                !fromCurrentUser,
              "rounded-br-none": !lastByUser && fromCurrentUser,
              "rounded-bl-none": !lastByUser && !fromCurrentUser
            }
          )}
        >
          {type === "text" && (
            <p className="text-sm break-words whitespace-pre-wrap break-all">
              {content}
            </p>
          )}

          {/* Timestamp */}
          <p
            className={cn("text-xs mt-1", {
              "text-gray-300": fromCurrentUser,
              "text-gray-500 dark:text-gray-400": !fromCurrentUser
            })}
          >
            {formatTime(createdAt)}
          </p>
        </div>

        {/* Seen Indicator */}
        {seen && <div className="text-xs text-blue-500 mt-1">{seen}</div>}
      </div>

      {/* Show Avatar for the sender when it's the current user */}
      {fromCurrentUser && !lastByUser && (
        <Avatar
          className="w-8 h-8 opacity-80 hover:opacity-100 transition-opacity duration-300"
          src={senderImage}
          alt={senderName}
        />
      )}
    </div>
  );
};

export default Message;
