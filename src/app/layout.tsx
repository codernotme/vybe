"use client";
import { Poppins } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import ThemeProvider from "@/components/theme/theme-provider";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import ConvexClientProvider from "@/providers/ConvexClientProvider";
import AuthPage from "./auth/[[...rest]]/page";
import { Toaster } from "@/components/ui/sonner";
import "animate.css";
import { useEffect } from "react";
import { Providers } from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "300",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const mainContainer = document.querySelector(".main");

    if (mainContainer) {
      mainContainer.classList.add("page-enter");

      setTimeout(() => {
        mainContainer?.classList.add("page-enter-active");
      }, 10);

      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        mainContainer.classList.remove("page-enter", "page-enter-active");
        mainContainer.classList.add("page-exit-active");

        event.preventDefault();
        setTimeout(() => {
          window.location.href = (event.target as HTMLAnchorElement).href;
        }, 500);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, []);

  return (
    <ConvexClientProvider>
      <html lang="en">
        <head>
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="VYBE App" />
          <meta name="twitter:description" content="Best App in the world" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="VYBE App" />
          <meta property="og:description" content="Best App in the world" />
          <meta property="og:site_name" content="VYBE App" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
          />
        </head>
        <body
          className={`${poppins.className} flex flex-col w-full min-h-screen no-scrollbar `}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <TooltipProvider>
                {/* Display different content based on user's authentication status */}
                <SignedIn>
                  {/* Main content for signed-in users */}
                  <main>
                    {children} {/* Render children components */}
                  </main>
                </SignedIn>
                <SignedOut>
                  {/* Redirect to authentication page for signed-out users */}
                  <AuthPage />
                </SignedOut>
              </TooltipProvider>
              {/* Toast notifications provider */}
              <Toaster richColors />
            </Providers>
          </ThemeProvider>
        </body>
      </html>
    </ConvexClientProvider>
  );
}
