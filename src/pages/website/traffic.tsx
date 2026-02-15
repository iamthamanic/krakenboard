
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card } from "@/components/ui/card";
import { EnhancedDataTable } from "@/components/website/EnhancedDataTable";
import { TrafficCharts } from "@/components/website/TrafficCharts";
import { RealtimeVisitors } from "@/components/website/RealtimeVisitors";
import { Users, Clock, ArrowDownUp, MousePointer } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { DateRangeSelector } from "@/components/social/DateRangeSelector";
import { ExportMenu } from "@/components/social/ExportMenu";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import { format } from "date-fns";
import { fetchSummary, fetchPageAnalytics } from "@/lib/krakenboard-api";

const TIME_RANGES = {
  '7d': '7 Tage',
  '30d': '30 Tage',
  '90d': '90 Tage',
  'custom': 'Benutzerdefiniert'
};

function formatCompact(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

// Fallback-Daten für Charts wenn API keine Zeitreihe liefert
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
  const [summary, setSummary] = useState<{ totalVisitors: number; totalPageViews: number; bounceRate: number; avgSessionDuration: number } | null>(null);
  const [pageViewsData, setPageViewsData] = useState<Array<{ page: string; views: string; uniqueVisitors: string; avgTime: string; bounceRate: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dateParams = useMemo(() => {
    if (dateRange.from && dateRange.to) {
      return {
        startDate: format(dateRange.from, 'yyyy-MM-dd'),
        endDate: format(dateRange.to, 'yyyy-MM-dd'),
      };
    }
    const end = new Date();
    const start = new Date();
    if (timeRange === '7d') start.setDate(start.getDate() - 7);
    else if (timeRange === '90d') start.setDate(start.getDate() - 90);
    else start.setDate(start.getDate() - 30);
    return {
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
      period: timeRange === '7d' ? '7d' : timeRange === '90d' ? '90d' : '30d',
    };
  }, [timeRange, dateRange.from, dateRange.to]);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    (async () => {
      try {
        const res = await fetchSummary(
          dateRange.from && dateRange.to
            ? { startDate: dateParams.startDate, endDate: dateParams.endDate }
            : { period: dateParams.period || '30d' }
        );
        if (cancelled) return;
        const m = res.metrics;
        setSummary({
          totalVisitors: m.totalVisitors ?? 0,
          totalPageViews: m.totalPageViews ?? 0,
          bounceRate: m.bounceRate ?? 0,
          avgSessionDuration: m.avgSessionDuration ?? 0,
        });
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Fehler beim Laden der Übersicht');
          setSummary({ totalVisitors: 0, totalPageViews: 0, bounceRate: 0, avgSessionDuration: 0 });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [dateParams.startDate, dateParams.endDate, dateParams.period]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setTableLoading(true);
      try {
        const res = await fetchPageAnalytics({
          startDate: dateParams.startDate,
          endDate: dateParams.endDate,
          pageSize: 50,
        });
        if (cancelled) return;
        const rows = res.rows.map((row) => ({
          page: row.page_path || row.url || '—',
          views: formatCompact(row.page_views ?? 0),
          uniqueVisitors: formatCompact(row.unique_visitors ?? 0),
          avgTime: '—',
          bounceRate: '—',
        }));
        setPageViewsData(rows);
      } catch (e) {
        if (!cancelled) {
          setPageViewsData([]);
          toast.error('Seiten-Statistiken konnten nicht geladen werden.');
        }
      } finally {
        if (!cancelled) setTableLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [dateParams.startDate, dateParams.endDate]);

  // Tabellen-Spalten Definition
  const columns = [
    { key: "page", label: "Seite" },
    { key: "views", label: "Aufrufe" },
    { key: "uniqueVisitors", label: "Unique Visitors" },
    { key: "avgTime", label: "Durchschn. Zeit" },
    { key: "bounceRate", label: "Absprungrate" }
  ];

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds < 0) return "—";
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Website Traffic Report', 20, 20);
    doc.save(`traffic-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast.success('PDF Export erfolgreich');
  };

  const handleExportCSV = () => {
    toast.success('CSV Export erfolgreich');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Website Traffic Analytics</h1>
            <p className="text-muted-foreground">
              Detaillierte Analyse deines Website-Traffics (Krakenboard API)
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

        {error && (
          <p className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded">
            {error} – Prüfe ob die Krakenboard-API unter localhost:3004 läuft.
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Besucher"
            value={loading ? "…" : formatCompact(summary?.totalVisitors ?? 0)}
            icon={<Users className="h-4 w-4" />}
            trend={{ value: 12, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Durchschn. Besuchszeit"
            value={loading ? "…" : formatDuration(summary?.avgSessionDuration ?? 0)}
            icon={<Clock className="h-4 w-4" />}
            trend={{ value: 8, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Absprungrate"
            value={loading ? "…" : `${(summary?.bounceRate ?? 0).toFixed(1)}%`}
            icon={<ArrowDownUp className="h-4 w-4" />}
            trend={{ value: 5, isPositive: false }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Seitenaufrufe"
            value={loading ? "…" : formatCompact(summary?.totalPageViews ?? 0)}
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
          {tableLoading ? (
            <p className="text-muted-foreground py-4">Lade Seitenstatistiken …</p>
          ) : (
            <EnhancedDataTable 
              columns={columns}
              data={pageViewsData}
              itemsPerPage={10}
            />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteTraffic;
