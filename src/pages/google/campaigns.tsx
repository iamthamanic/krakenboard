
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BarChart3, Target, DollarSign, TrendingUp } from "lucide-react";
import { DateRangeSelector } from "@/components/social/DateRangeSelector";
import { ExportMenu } from "@/components/social/ExportMenu";
import { useState } from "react";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import { format } from "date-fns";

const TIME_RANGES = {
  '7d': '7 Tage',
  '30d': '30 Tage',
  '90d': '90 Tage',
  'custom': 'Benutzerdefiniert'
};

const GoogleCampaigns = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Campaign Performance Report', 20, 20);
    // Hier weitere PDF Export Logik implementieren
    doc.save(`campaign-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast.success('PDF Export erfolgreich');
  };

  const handleExportCSV = () => {
    // CSV Export Logik hier implementieren
    toast.success('CSV Export erfolgreich');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaign Overview</h1>
            <p className="text-muted-foreground">
              Übersicht über deine Google Ads Kampagnen
            </p>
          </div>
          <div className="flex items-center gap-4">
            <DateRangeSelector
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              dateRange={dateRange}
              setDateRange={setDateRange}
              timeRanges={TIME_RANGES}
            />
            <ExportMenu
              onExportPDF={handleExportPDF}
              onExportCSV={handleExportCSV}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Aktive Kampagnen"
            value="12"
            icon={<BarChart3 className="h-4 w-4" />}
            trend={{ value: 2, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Durchschn. CPC"
            value="€0.42"
            icon={<DollarSign className="h-4 w-4" />}
            trend={{ value: 5, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Conversion Rate"
            value="3.2%"
            icon={<Target className="h-4 w-4" />}
            trend={{ value: 0.5, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="ROAS"
            value="285%"
            icon={<TrendingUp className="h-4 w-4" />}
            trend={{ value: 15, isPositive: true }}
            description="vs. letzter Monat"
          />
        </div>

        {/* Hier können weitere Kampagnen-Details hinzugefügt werden */}
      </div>
    </DashboardLayout>
  );
};

export default GoogleCampaigns;
