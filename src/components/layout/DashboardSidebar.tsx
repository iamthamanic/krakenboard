
import {
  BarChart,
  Globe,
  Home,
  Share2,
  MessageCircle,
  CreditCard,
  LineChart,
  FormInput,
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
    group: "Website Traffic",
    items: [
      { icon: Globe, label: "Website Traffic", href: "/website/traffic" },
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
    <Sidebar>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
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
        ))}
      </SidebarContent>
    </Sidebar>
  );
};
