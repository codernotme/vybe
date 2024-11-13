import { SignUp, UserButton } from "@clerk/clerk-react";
import { Unauthenticated, Authenticated } from "convex/react";
import { StrictMode } from "react";
import { Card } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <StrictMode>
      <Card>
        <Unauthenticated>
          <SignUp />
        </Unauthenticated>
        <Authenticated>
          <UserButton />
        </Authenticated>
      </Card>
    </StrictMode>
  );
}
