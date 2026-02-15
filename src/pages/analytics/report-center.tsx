import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnalyticsTabsNav } from "@/components/analytics/AnalyticsTabsNav";
import { Card } from "@/components/ui/card";

const AnalyticsReportCenterPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Report Center</h1>
          <p className="text-muted-foreground">
            Shell-Seite für künftige Filter- und Trefferansichten.
          </p>
        </div>

        <AnalyticsTabsNav />

        <Card className="p-4 text-sm text-muted-foreground">
          Report-Filters coming soon.
        </Card>
        <Card className="p-6 text-sm text-muted-foreground">
          Report hits table coming soon.
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsReportCenterPage;
