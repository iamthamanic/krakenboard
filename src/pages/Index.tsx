
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Activity, Users, Globe, FormInput } from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Your analytics overview.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Visitors"
            value="24.7K"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 12, isPositive: true }}
            description="vs. last month"
          />
          <StatsCard
            title="Page Views"
            value="123.4K"
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 8, isPositive: true }}
            description="vs. last month"
          />
          <StatsCard
            title="Active Forms"
            value="18"
            icon={<FormInput className="h-4 w-4 text-muted-foreground" />}
            description="Across all pages"
          />
          <StatsCard
            title="Tracked Pages"
            value="42"
            icon={<Globe className="h-4 w-4 text-muted-foreground" />}
            description="Auto-detected"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
