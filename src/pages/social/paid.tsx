
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BarChart3, CreditCard, DollarSign, Target } from "lucide-react";
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

const SocialPaid = () => {
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
    doc.text('Paid Social Media Report', 20, 20);
    // Hier weitere PDF Export Logik implementieren
    doc.save(`paid-social-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
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
            <h1 className="text-3xl font-bold tracking-tight">Paid Social Media Campaigns</h1>
            <p className="text-muted-foreground">
              Übersicht über deine bezahlten Social Media Kampagnen
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
