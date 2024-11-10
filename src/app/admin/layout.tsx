import SidebarWrapper from "@/components/common/SidebarWrapper";
import SideNav from "@/components/common/SideNav";

export const metadata = {
  title: "VYBE",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="w-full justify-between min-h-screen">
        <SidebarWrapper>
          <SideNav />
          {children}
        </SidebarWrapper>
      </main>
    </>
  );
}
