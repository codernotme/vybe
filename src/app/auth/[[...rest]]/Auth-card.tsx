"use client";
import { StrictMode, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@nextui-org/button";
import SigninPage from "./sign-in";
import SignupPage from "./sign-up";

export default function AuthCard() {
  const [selectedOption, setSelectedOption] = useState<"signIn" | "signUp">(
    "signIn"
  );

  return (
    <StrictMode>
      <Card className="p-6 max-w-md mx-auto">
        {/* Button Options */}
        <div className="flex justify-center mb-6">
          <Button
            className={`mr-4 ${selectedOption === "signIn" ? "text-blue-500 font-bold" : ""}`}
            onClick={() => setSelectedOption("signIn")}
          >
            Sign In
          </Button>
          <Button
            className={`${selectedOption === "signUp" ? "text-blue-500 font-bold" : ""}`}
            onClick={() => setSelectedOption("signUp")}
          >
            Sign Up
          </Button>
        </div>

        {/* Conditional Rendering based on the selected option */}
        {selectedOption === "signIn" && <SigninPage/> }
        {selectedOption === "signUp" && <SignupPage/>}
      </Card>
    </StrictMode>
  );
}
