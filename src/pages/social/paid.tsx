
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BarChart3, CreditCard, DollarSign, Target } from "lucide-react";

const SocialPaid = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paid Social Media Campaigns</h1>
          <p className="text-muted-foreground">
            Übersicht über deine bezahlten Social Media Kampagnen
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Gesamtausgaben"
            value="€2,450"
            icon={<DollarSign className="h-4 w-4" />}
            description="Dieser Monat"
          />
          <StatsCard
            title="Durchschn. CPC"
            value="€0.42"
            icon={<CreditCard className="h-4 w-4" />}
            description="Alle Kampagnen"
          />
          <StatsCard
            title="Conversions"
            value="1,234"
            icon={<Target className="h-4 w-4" />}
            description="Dieser Monat"
          />
          <StatsCard
            title="ROAS"
            value="324%"
            icon={<BarChart3 className="h-4 w-4" />}
            description="Durchschnittlicher Return"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SocialPaid;
