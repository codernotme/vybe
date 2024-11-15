// components/AnonymousChat.tsx
import { useState, useEffect } from "react";
import { api } from "../convex/_generated/api"; // adjust path to your Convex API
import { useMutation, useQuery } from "convex/react";
import { Button, Input, Text } from "@nextui-org/react";

interface Message {
  id: string;
  text: string;
  userId: string; // anonymized unique identifier
  timestamp: Date;
}

const AnonymousChat = () => {
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messages = useQuery(api.anonymousChat.getMessages); // fetch messages
  const sendMessage = useMutation(api.anonymousChat.sendMessage); // mutation to send message

  useEffect(() => {
    if (!sessionId) {
      // Generate a session-based unique identifier for the user
      setSessionId(`user-${Math.random().toString(36).substr(2, 9)}`);
    }
  }, [sessionId]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage({ text: message, userId: sessionId });
      setMessage(""); // clear input after sending
    }
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-4 bg-gray-100 rounded-md shadow-lg">
      <div className="overflow-y-auto flex-grow mb-4 p-2">
        {messages?.map((msg: Message) => (
          <div key={msg.id} className="mb-2">
            <Text small color="gray">
              {msg.userId}:
            </Text>
            <Text>{msg.text}</Text>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <Input
          clearable
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
        />
        <Button auto onClick={handleSendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default AnonymousChat;
