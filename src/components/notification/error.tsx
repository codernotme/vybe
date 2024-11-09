"use client";

import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ErrorProps {
  error: Error;
}

export default function Error({ error }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error for debugging purposes
    console.error("An error occurred:", error);

    // Redirect to the home page after the component mounts
    const timer = setTimeout(() => {
      router.push("/home");
    }, 2000); // Delay to show loading spinner

    // Clear the timer on component unmount
    return () => clearTimeout(timer);
  }, [error, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <Loader2Icon className="w-8 h-8 animate-spin mb-4" />
      <p className="text-lg font-semibold">Oops! Something went wrong.</p>
      <p className="text-gray-600">We are redirecting you to the homepage...</p>
    </div>
  );
}
