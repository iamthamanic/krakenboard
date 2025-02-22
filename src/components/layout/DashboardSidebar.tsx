
import {
  BarChart,
  Globe,
  Share2,
  MessageCircle,
  CreditCard,
  LineChart,
  FormInput,
  LayoutDashboard
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
  { 
    items: [
      { icon: LayoutDashboard, label: "Gesamtübersicht", href: "/" },
    ]
  },
  { 
    group: "Website",
    items: [
      { icon: LineChart, label: "Traffic Analytics", href: "/website/traffic" },
      { icon: FormInput, label: "Form Analytics", href: "/website/forms" },
    ]
  },
  {
    group: "Social Media",
    items: [
      { icon: MessageCircle, label: "Organic Performance", href: "/social/organic" },
      { icon: CreditCard, label: "Paid Campaigns", href: "/social/paid" },
    ]
  },
  {
    group: "Google Ads",
    items: [
      { icon: BarChart, label: "Campaign Overview", href: "/google/campaigns" },
      { icon: Share2, label: "Performance Metrics", href: "/google/metrics" },
    ]
  },
];

export const DashboardSidebar = () => {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarContent className="pt-16">
        {menuItems.map((group) => (
          <SidebarGroup key={group.group || 'overview'}>
            {group.group && (
              <SidebarGroupLabel className="px-6 text-base font-medium mb-2">
                {group.group}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.href}
                        className="flex items-center gap-4 px-6 py-2 hover:bg-accent transition-colors"
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-base">{item.label}</span>
                      </a>
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
