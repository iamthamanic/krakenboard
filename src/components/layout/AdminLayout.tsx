
import { DashboardSidebar } from "./DashboardSidebar";
import { Header } from "./Header";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1">
          <Header />
          <main className="pt-32 px-4 md:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
