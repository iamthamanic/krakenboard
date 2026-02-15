import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnalyticsTabsNav } from "@/components/analytics/AnalyticsTabsNav";
import { DateRangeSelector } from "@/components/social/DateRangeSelector";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card } from "@/components/ui/card";
import {
  fetchAggregatedDashboard,
  fetchTrafficSources,
  fetchVisitorTrend,
  type AggregatedDashboardResponse,
  type TrafficSourcePoint,
  type VisitorTrendPoint,
} from "@/lib/krakenboard-api";
import {
  ANALYTICS_TIME_RANGES,
  buildDateParams,
  formatCompact,
  formatPercent,
  type AnalyticsDateRange,
} from "@/pages/analytics/utils";
import { Activity, ChartBar, MousePointer, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#14b8a6"];

const AnalyticsOverviewPage = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>({
    from: undefined,
    to: undefined,
  });
  const [dashboard, setDashboard] = useState<AggregatedDashboardResponse | null>(null);
  const [trend, setTrend] = useState<VisitorTrendPoint[]>([]);
  const [sources, setSources] = useState<TrafficSourcePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dateParams = useMemo(() => buildDateParams(timeRange, dateRange), [timeRange, dateRange]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const [dashboardRes, trendRes, sourcesRes] = await Promise.all([
          fetchAggregatedDashboard({
            startDate: dateParams.startDate,
            endDate: dateParams.endDate,
          }),
          fetchVisitorTrend(),
          fetchTrafficSources(),
        ]);
        if (cancelled) return;
        setDashboard(dashboardRes);
        setTrend(trendRes.trend || []);
        setSources(sourcesRes.sources || []);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Fehler beim Laden der Overview-Daten.");
          setDashboard(null);
          setTrend([]);
          setSources([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dateParams.startDate, dateParams.endDate]);

  const metrics = dashboard?.metrics;
  const trafficSourcesChart = sources
    .slice(0, 8)
    .map((s) => ({
      name: s.medium ? `${s.source} / ${s.medium}` : s.source,
      visitors: s.visitors || s.sessions || 0,
    }))
    .filter((s) => s.visitors > 0);
  const deviceData = [
    { name: "Desktop", value: dashboard?.deviceBreakdown.desktop || 0 },
    { name: "Mobile", value: dashboard?.deviceBreakdown.mobile || 0 },
    { name: "Tablet", value: dashboard?.deviceBreakdown.tablet || 0 },
  ].filter((d) => d.value > 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Master-Baustein</h1>
            <p className="text-muted-foreground">Konsolidierter KPI- und Trend-Baustein für My Board.</p>
          </div>
          <DateRangeSelector
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            dateRange={dateRange}
            setDateRange={setDateRange}
            timeRanges={ANALYTICS_TIME_RANGES}
          />
        </div>

        <AnalyticsTabsNav />

        {error && (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Visitors"
            value={loading ? "…" : formatCompact(metrics?.totalVisitors || 0)}
            icon={<Users className="h-4 w-4" />}
            description="Gesamtzeitraum"
          />
          <StatsCard
            title="Page Views"
            value={loading ? "…" : formatCompact(metrics?.totalPageViews || 0)}
            icon={<Activity className="h-4 w-4" />}
            description="Gesamtzeitraum"
          />
          <StatsCard
            title="Conversions"
            value={loading ? "…" : formatCompact(metrics?.conversions || 0)}
            icon={<MousePointer className="h-4 w-4" />}
            description="Gesamtzeitraum"
          />
          <StatsCard
            title="Bounce Rate"
            value={loading ? "…" : formatPercent(metrics?.bounceRate || 0, 1)}
            icon={<ChartBar className="h-4 w-4" />}
            description="Gesamtzeitraum"
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="p-4 xl:col-span-2">
            <h2 className="mb-4 text-lg font-semibold">Visitor Trend</h2>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="visitors" name="Visitors" stroke="#0ea5e9" dot={false} />
                  <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#10b981" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="mb-4 text-lg font-semibold">Device Aufteilung</h2>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceData.map((_, idx) => (
                      <Cell key={`device-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <h2 className="mb-4 text-lg font-semibold">Traffic Sources</h2>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficSourcesChart}>
                <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={72} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visitors" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsOverviewPage;
