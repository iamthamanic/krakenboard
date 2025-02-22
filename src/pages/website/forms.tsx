
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { FormInput, Activity, CheckCircle, AlertCircle } from "lucide-react";
import { translations, getStoredLanguage } from "@/lib/utils";

const WebsiteFormsPage = () => {
  const t = translations[getStoredLanguage()];
  
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Form Analytics</h1>
          <p className="text-muted-foreground">
            Analyse aller erkannten Formulare und deren Performance
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Aktive Formulare"
            value="18"
            icon={<FormInput className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 2, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Formular Submissions"
            value="234"
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 15, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Erfolgsrate"
            value="89%"
            icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 5, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Fehlerrate"
            value="11%"
            icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 3, isPositive: false }}
            description="vs. letzter Monat"
          />
        </div>

        {/* TODO: Implementierung der Formular-Liste mit Details wie:
          - Formularposition (URL)
          - Anzahl der Felder
          - Conversion Rate
          - Fehlerraten
          - Erfolgsseiten
        */}
      </div>
    </DashboardLayout>
  );
};

export default WebsiteFormsPage;
