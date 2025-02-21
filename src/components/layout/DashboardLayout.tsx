
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1">
          <Header />
          <main className="pt-16 px-4 md:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
