"use client";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { NextUIProvider } from "@nextui-org/system";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { dark, neobrutalism } from "@clerk/themes";
export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export default function Providers({ children, themeProps }: ProvidersProps) {
  const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";
  const convex = new ConvexReactClient(CONVEX_URL);

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        signIn: {
          baseTheme: neobrutalism,
        },
      }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {" "}
        <NextUIProvider>
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </NextUIProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
