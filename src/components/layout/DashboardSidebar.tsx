
import {
  BarChart,
  Globe,
  Share2,
  MessageCircle,
  CreditCard,
  LineChart,
  FormInput,
  LayoutDashboard,
  Shield,
  FileText,
  Home
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
import { useLocation } from "react-router-dom";

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
  {
    group: "Administration",
    items: [
      { icon: Home, label: "Features Übersicht", href: "/features" },
      { icon: Shield, label: "Datenschutzerklärung", href: "/legal/privacy" },
      { icon: FileText, label: "Nutzungsbedingungen", href: "/legal/terms" },
    ]
  },
];

export const DashboardSidebar = () => {
  const location = useLocation();

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
                        data-active={location.pathname === item.href}
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
