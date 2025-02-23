
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BarChart3, Target, DollarSign, Percent } from "lucide-react";

const GoogleCampaigns = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Google Ads Kampagnen</h1>
          <p className="text-muted-foreground">
            Übersicht über deine aktiven Google Ads Kampagnen
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Aktive Kampagnen"
            value="12"
            icon={<BarChart3 className="h-4 w-4" />}
            description="Gesamt aktiv"
          />
          <StatsCard
            title="Conversions"
            value="543"
            icon={<Target className="h-4 w-4" />}
            description="Dieser Monat"
          />
          <StatsCard
            title="Budget"
            value="€15,750"
            icon={<DollarSign className="h-4 w-4" />}
            description="Monatliches Budget"
          />
          <StatsCard
            title="CTR"
            value="3.2%"
            icon={<Percent className="h-4 w-4" />}
            description="Durchschnittliche CTR"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GoogleCampaigns;
