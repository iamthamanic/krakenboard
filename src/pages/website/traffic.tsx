
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Globe, Users, LineChart, FormInput } from "lucide-react";

const WebsiteTrafficPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Traffic</h1>
          <p className="text-muted-foreground">Übersicht über Ihre Website-Besucher und Aktivitäten.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Gesamtbesucher"
            value="24.7K"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 12, isPositive: true }}
            description="vs. letzten Monat"
          />
          <StatsCard
            title="Aktuelle Besucher"
            value="342"
            icon={<Globe className="h-4 w-4 text-muted-foreground" />}
            description="In den letzten 5 Minuten"
          />
          <StatsCard
            title="Durchschn. Besuchszeit"
            value="4:23"
            icon={<LineChart className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 8, isPositive: true }}
            description="vs. letzten Monat"
          />
          <StatsCard
            title="Aktive Formulare"
            value="18"
            icon={<FormInput className="h-4 w-4 text-muted-foreground" />}
            description="Auf allen Seiten"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteTrafficPage;
