
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card } from "@/components/ui/card";
import { EnhancedDataTable } from "@/components/website/EnhancedDataTable";
import { TrafficCharts } from "@/components/website/TrafficCharts";
import { RealtimeVisitors } from "@/components/website/RealtimeVisitors";
import { Users, Clock, ArrowDownUp, MousePointer } from "lucide-react";
import { useState } from "react";
import { DateRangeSelector } from "@/components/social/DateRangeSelector";
import { ExportMenu } from "@/components/social/ExportMenu";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import { format } from "date-fns";

const TIME_RANGES = {
  '7d': '7 Tage',
  '30d': '30 Tage',
  '90d': '90 Tage',
  'custom': 'Benutzerdefiniert'
};

// Beispieldaten für die Charts
const trafficData = [
  { date: '2024-01-01', visitors: 2400, pageviews: 4000 },
  { date: '2024-01-02', visitors: 1398, pageviews: 3000 },
  { date: '2024-01-03', visitors: 9800, pageviews: 12000 },
  { date: '2024-01-04', visitors: 3908, pageviews: 6000 },
  { date: '2024-01-05', visitors: 4800, pageviews: 7000 },
  { date: '2024-01-06', visitors: 3800, pageviews: 5000 },
  { date: '2024-01-07', visitors: 4300, pageviews: 6000 },
];

const trafficSources = [
  { name: 'Organische Suche', value: 45 },
  { name: 'Direkt', value: 25 },
  { name: 'Social Media', value: 20 },
  { name: 'Andere', value: 10 },
];

const deviceTypes = [
  { name: 'Desktop', value: 65 },
  { name: 'Mobile', value: 30 },
  { name: 'Tablet', value: 5 },
];

const WebsiteTraffic = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Beispieldaten für die Tabelle
  const pageViewsData = [
    { page: "/startseite", views: "12.4K", uniqueVisitors: "8.2K", avgTime: "2m 15s", bounceRate: "32%" },
    { page: "/produkte", views: "8.7K", uniqueVisitors: "5.9K", avgTime: "3m 45s", bounceRate: "28%" },
    { page: "/kontakt", views: "4.2K", uniqueVisitors: "3.1K", avgTime: "1m 30s", bounceRate: "45%" },
    { page: "/blog", views: "6.8K", uniqueVisitors: "4.5K", avgTime: "4m 20s", bounceRate: "25%" },
    { page: "/about", views: "3.1K", uniqueVisitors: "2.4K", avgTime: "1m 45s", bounceRate: "38%" },
    { page: "/services", views: "5.2K", uniqueVisitors: "3.8K", avgTime: "2m 30s", bounceRate: "30%" },
  ];

  // Tabellen-Spalten Definition
  const columns = [
    { key: "page", label: "Seite" },
    { key: "views", label: "Aufrufe" },
    { key: "uniqueVisitors", label: "Unique Visitors" },
    { key: "avgTime", label: "Durchschn. Zeit" },
    { key: "bounceRate", label: "Absprungrate" }
  ];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Website Traffic Report', 20, 20);
    doc.save(`traffic-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
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
            <h1 className="text-3xl font-bold tracking-tight">Website Traffic Analytics</h1>
            <p className="text-muted-foreground">
              Detaillierte Analyse deines Website-Traffics
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

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <TrafficCharts
              trafficData={trafficData}
              trafficSources={trafficSources}
              deviceTypes={deviceTypes}
            />
          </div>
          <div>
            <RealtimeVisitors />
          </div>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Top Seiten Performance</h2>
          <EnhancedDataTable 
            columns={columns}
            data={pageViewsData}
            itemsPerPage={5}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteTraffic;
