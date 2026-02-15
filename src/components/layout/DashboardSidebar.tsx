
import {
  Briefcase,
  FileText,
  Filter,
  Globe,
  LayoutDashboard,
  Settings,
  Plug,
  Table,
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
import { useLocation, Link } from "react-router-dom";

const dashboardMenuItems = [
  {
    group: "Trackingboard",
    items: [
      { icon: LayoutDashboard, label: "Gesamtübersicht", href: "/" },
    ]
  },
  {
    group: "My Board",
    items: [
      { icon: Table, label: "My Board", href: "/my-board" },
      { icon: FileText, label: "Master-Baustein", href: "/blocks/master" },
      { icon: Filter, label: "Funnel-Baustein", href: "/blocks/funnel" },
      { icon: Globe, label: "Website-Baustein", href: "/blocks/website" },
      { icon: Briefcase, label: "Operations-Baustein", href: "/blocks/operations" },
    ],
  },
];

const settingsMenuItems = [
  {
    group: "Einstellungen",
    items: [
      { icon: Settings, label: "Admin", href: "/admin" },
      { icon: Plug, label: "Integration", href: "/admin/integrations" },
    ]
  }
];

export const DashboardSidebar = () => {
  const location = useLocation();
  const isSettingsRoute = location.pathname.startsWith('/admin');
  const menuItems = isSettingsRoute ? settingsMenuItems : dashboardMenuItems;

  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarContent className="pt-16 overflow-y-auto">
        {menuItems.map((group, index) => (
          <SidebarGroup key={group.group || `group-${index}`} className="mb-4">
            {group.group && (
              <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70 mb-1">
                {group.group}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.href}>
                      <Link
                        to={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate text-sm">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};
