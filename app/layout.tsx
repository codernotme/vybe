import "./globals.css";
import AuthPage from "./auth/[[...rest]]/page";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Providers from "./providers";
import { Link } from "@nextui-org/link";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Providers>
        <div className="relative flex flex-col h-screen">
          <SignedIn>
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              {children}
            </main>
          </SignedIn>
          <SignedOut>
            {/* Redirect to authentication page for signed-out users */}
            <AuthPage />
          </SignedOut>
          <footer className="w-full flex items-center justify-center py-3">
            <Link
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              External Link
            </Link>
          </footer>
        </div>
      </Providers>
    </>
  );
}
