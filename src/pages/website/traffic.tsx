
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, Clock, ArrowDownUp, MousePointer } from "lucide-react";

const WebsiteTraffic = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Traffic Analytics</h1>
          <p className="text-muted-foreground">
            Detaillierte Analyse deines Website-Traffics
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Besucher"
            value="24.7K"
            icon={<Users className="h-4 w-4" />}
            trend={{ value: 12, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Durchschn. Besuchszeit"
            value="2m 31s"
            icon={<Clock className="h-4 w-4" />}
            trend={{ value: 8, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Absprungrate"
            value="42.3%"
            icon={<ArrowDownUp className="h-4 w-4" />}
            trend={{ value: 5, isPositive: false }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Seitenaufrufe"
            value="89.4K"
            icon={<MousePointer className="h-4 w-4" />}
            trend={{ value: 15, isPositive: true }}
            description="vs. letzter Monat"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteTraffic;
