
import {
  BarChart,
  Globe,
  Home,
  LayoutDashboard,
  Settings,
  Share2,
  ShoppingCart,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { icon: Home, label: "Overview", href: "/" },
  { icon: Globe, label: "Web Traffic", href: "/traffic" },
  { icon: Share2, label: "Social Media", href: "/social" },
  { icon: BarChart, label: "Analytics", href: "/analytics" },
  { icon: ShoppingCart, label: "E-Commerce", href: "/ecommerce" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export const DashboardSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
