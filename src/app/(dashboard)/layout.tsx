import Navbar from "@/components/common/Navbar";

export const metadata = {
  title: "Dashboard"
};
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full justify-between h-full flex flex-col gap-4">
      <Navbar />
      {children}
    </main>
  );
}
