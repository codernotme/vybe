import { useQuery } from "convex/react";
import { createContext, useState, useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from '../../../convex/_generated/dataModel';

interface UserContextProps {
  userId: string;
}

export const UserContext = createContext<UserContextProps>({ userId: "" });

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Fetch the current user ID from your authentication system
    const fetchUserId = async () => {
      const id = await getCurrentUserId(); // Replace with actual function to get user ID
      setUserId(id);
    };

    fetchUserId();
  }, []);

  return (
    <UserContext.Provider value={{ userId }}>
      {children}
    </UserContext.Provider>
  );
};

async function getCurrentUserId(): Promise<string> {
  // Implement your logic to get the current user ID
  return "currentUserId"; // Replace with actual user ID
}
