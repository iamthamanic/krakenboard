
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { FormInput, Activity, CheckCircle, AlertCircle } from "lucide-react";
import { DataTable } from "@/components/dashboard/DataTable";

const mockFormData = [
  {
    url: "/kontakt",
    fields: 5,
    submissions: 45,
    conversionRate: "8.2%",
    errorRate: "2.1%"
  },
  {
    url: "/newsletter",
    fields: 2,
    submissions: 128,
    conversionRate: "12.4%",
    errorRate: "1.8%"
  },
  {
    url: "/demo-anfrage",
    fields: 7,
    submissions: 23,
    conversionRate: "15.2%",
    errorRate: "3.5%"
  }
];

const formColumns = [
  { key: "url", label: "Formular URL" },
  { key: "fields", label: "Felder" },
  { key: "submissions", label: "Submissions" },
  { key: "conversionRate", label: "Conversion Rate" },
  { key: "errorRate", label: "Fehlerrate" }
];

const WebsiteForms = () => {
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

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Erkannte Formulare</h2>
          <DataTable 
            columns={formColumns}
            data={mockFormData}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteForms;
