// components/AnonymousChat.tsx
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { Button, Input, Switch } from "@nextui-org/react"; // Add import for Switch component
import { api } from "../../convex/_generated/api";

interface Message {
  id: string;
  text: string;
  userId: string; // anonymized unique identifier
}

const AnonymousChat = () => {
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false); // Add state for anonymous mode
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
      await sendMessage({ text: message, userId: isAnonymous ? null : sessionId });
      setMessage(""); // clear input after sending
    }
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-4 bg-gray-100 rounded-md shadow-lg">
      <div className="overflow-y-auto flex-grow mb-4 p-2">
        {messages?.map((msg: Message) => (
          <div key={msg.id} className="mb-2">
            <span className="font-semibold">
              {"User"}:
            </span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
        />
        <div className="flex items-center">
          <Switch checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
          <span className="ml-2">Send Anonymously</span>
        </div>
        <Button onClick={handleSendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default AnonymousChat;
