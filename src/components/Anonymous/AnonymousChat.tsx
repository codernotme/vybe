"use client";

import { useState, useEffect } from "react";
import { Button, Input, Switch } from "@nextui-org/react";
import { api } from "../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";


const AnonymousChat = () => {
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [randomUser, setRandomUser] = useState<string | null>(null);

  const messages = useQuery(api.anonymousChat.getMessages);
  const sendMessage = useMutation(api.anonymousChat.sendMessage);
  const getRandomUser = useQuery(api.anonymousChat.getRandomUser,{ role: "member" });

  useEffect(() => {
    if (!sessionId) {
      setSessionId(`user-${Math.random().toString(36).substr(2, 9)}`);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!randomUser) {
      const fetchRandomUser = async () => {
        const user = getRandomUser
        setRandomUser(user?._id || null);
      };
      fetchRandomUser();
    }
  }, [getRandomUser, randomUser]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage({
        text: message,
        userId: isAnonymous ? "" : sessionId ?? "",
        randomUser: randomUser || "",
      });
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-4 bg-gray-800 rounded-md shadow-lg">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default AnonymousChat;
