import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@nextui-org/avatar";
import Link from "next/link";

type Props = {
  friend: {
    _id: string;
    imageUrl: string;
    username: string;
    email: string;
  };
  // Optional: add a link prop if you want navigation on friend click
  link?: string; // Link to navigate to on friend click
};

const FriendCard = ({ friend, link }: Props) => {
  // Consider using `useMemo` if avatar rendering is expensive
  const initials = friend.username.slice(0, 2).toUpperCase();

  return (
    <Card
      className={`p-4 max-w-md flex flex-row items-center gap-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
        link ? "cursor-pointer" : ""
      }`} // Add cursor pointer for hover if link exists
    >
      {/* Display initials for fallback or performance optimization */}
      <Avatar
        isBordered
        src={friend.imageUrl}
        alt={`${friend.username}'s avatar`}
        className="w-12 h-12 rounded-full bg-gray-300 text-gray-700" // Set fallback color and text
      >
        {friend.imageUrl ? null : initials}
      </Avatar>

      <div className="flex flex-col truncate">
        <Link
          href={"#"}
          className="text-lg font-semibold truncate hover:text-blue-500"
        >
          {friend.username}
        </Link>{" "}
        <p className="text-sm text-gray-500 truncate">{friend.email}</p>
      </div>
    </Card>
  );
};

export default FriendCard;
