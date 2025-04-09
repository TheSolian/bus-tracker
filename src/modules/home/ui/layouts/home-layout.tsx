import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeNavbar } from "@/modules/home/ui/components/home-navbar";
import { HomeSidebar } from "@/modules/home/ui/components/home-sidebar";
interface Props {
  children: React.ReactNode;
}

export const HomeLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <HomeNavbar />
      <div className="flex min-h-screen min-w-full pt-16">
        <HomeSidebar />
        <main>{children}</main>
      </div>
    </SidebarProvider>
  );
};
