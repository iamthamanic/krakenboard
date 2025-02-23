
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BarChart3, MousePointer, DollarSign, Target } from "lucide-react";

const GoogleMetrics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Metrics</h1>
          <p className="text-muted-foreground">
            Detaillierte Performance Metriken deiner Google Ads
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Impressionen"
            value="125,430"
            icon={<BarChart3 className="h-4 w-4" />}
            description="Letzte 30 Tage"
          />
          <StatsCard
            title="Klicks"
            value="4,321"
            icon={<MousePointer className="h-4 w-4" />}
            description="Letzte 30 Tage"
          />
          <StatsCard
            title="Cost per Click"
            value="€0.45"
            icon={<DollarSign className="h-4 w-4" />}
            description="Durchschnittlich"
          />
          <StatsCard
            title="Conversion Rate"
            value="2.8%"
            icon={<Target className="h-4 w-4" />}
            description="Durchschnittlich"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GoogleMetrics;
