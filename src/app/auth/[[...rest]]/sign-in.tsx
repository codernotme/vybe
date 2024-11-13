import { SignIn, UserButton } from "@clerk/clerk-react";
import { Unauthenticated, Authenticated } from "convex/react";
import { StrictMode } from "react";
import { Card } from "@/components/ui/card";

export default function SigninPage() {
  return (
    <StrictMode>
      <Card>
        <Unauthenticated>
          <SignIn />
        </Unauthenticated>
        <Authenticated>
          <UserButton />
        </Authenticated>
      </Card>
    </StrictMode>
  );
}
