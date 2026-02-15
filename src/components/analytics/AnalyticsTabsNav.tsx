import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const TABS = [
  { label: "My Board", href: "/my-board" },
  { label: "Master-Baustein", href: "/blocks/master" },
  { label: "Funnel-Baustein", href: "/blocks/funnel" },
  { label: "Website-Baustein", href: "/blocks/website" },
  { label: "Operations-Baustein", href: "/blocks/operations" },
];

export function AnalyticsTabsNav() {
  const location = useLocation();

  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <div className="flex min-w-max items-center gap-1 p-1">
        {TABS.map((tab) => {
          const isActive = location.pathname === tab.href;
          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
