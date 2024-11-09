"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ErrorProps {
  error: Error;
}

export default function Error({ error }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error("An error occurred:", error);

    // Check if the error is related to unauthorized access
    if (error.message.includes("Unauthorized - User has logged out")) {
      // Redirect to the login page if unauthorized
      router.push("/");
    } else {
      // Redirect to the home page for other errors
      router.push("/home");
    }
  }, [error, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <p className="text-lg font-semibold">User Logged Out. Redirecting...</p>
    </div>
  );
}
