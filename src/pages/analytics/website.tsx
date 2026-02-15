import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnalyticsTabsNav } from "@/components/analytics/AnalyticsTabsNav";
import { DateRangeSelector } from "@/components/social/DateRangeSelector";
import { SmartTable, type SmartTableColumn } from "@/components/smart-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  fetchAggregatedDashboard,
  fetchMetrics,
  fetchPageAnalytics,
  fetchTrafficSources,
  fetchVisitorTrend,
  type AggregatedDashboardResponse,
  type MetricsResponse,
  type PageAnalyticsRow,
  type TrafficSourcePoint,
  type VisitorTrendPoint,
} from "@/lib/krakenboard-api";
import {
  ANALYTICS_TIME_RANGES,
  buildDateParams,
  formatCompact,
  formatDurationFromSeconds,
  formatPercent,
  type AnalyticsDateRange,
} from "@/pages/analytics/utils";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
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
const PAGE_SIZE_OPTIONS = [25, 50, 100];

const AnalyticsWebsitePage = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>({
    from: undefined,
    to: undefined,
  });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [dashboard, setDashboard] = useState<AggregatedDashboardResponse | null>(null);
  const [trend, setTrend] = useState<VisitorTrendPoint[]>([]);
  const [sources, setSources] = useState<TrafficSourcePoint[]>([]);
  const [rows, setRows] = useState<PageAnalyticsRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [chartsLoading, setChartsLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dateParams = useMemo(() => buildDateParams(timeRange, dateRange), [timeRange, dateRange]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    setChartsLoading(true);
    setError(null);

    (async () => {
      try {
        const [metricsRes, dashboardRes, trendRes, sourcesRes] = await Promise.all([
          fetchMetrics({
            startDate: dateParams.startDate,
            endDate: dateParams.endDate,
          }),
          fetchAggregatedDashboard({
            startDate: dateParams.startDate,
            endDate: dateParams.endDate,
          }),
          fetchVisitorTrend(),
          fetchTrafficSources(),
        ]);
        if (cancelled) return;
        setMetrics(metricsRes);
        setDashboard(dashboardRes);
        setTrend(trendRes.trend || []);
        setSources(sourcesRes.sources || []);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Fehler beim Laden der Website-Charts.");
          setMetrics(null);
          setDashboard(null);
          setTrend([]);
          setSources([]);
        }
      } finally {
        if (!cancelled) setChartsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dateParams.startDate, dateParams.endDate]);

  useEffect(() => {
    let cancelled = false;
    setTableLoading(true);

    (async () => {
      try {
        const response = await fetchPageAnalytics({
          startDate: dateParams.startDate,
          endDate: dateParams.endDate,
          page,
          pageSize,
          search,
        });
        if (cancelled) return;
        setRows(response.rows || []);
        setTotal(response.total || 0);
        setTotalPages(Math.max(1, response.totalPages || 1));
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Fehler beim Laden der Website-Tabelle.");
          setRows([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) setTableLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dateParams.startDate, dateParams.endDate, page, pageSize, search]);

  const deviceData = [
    { name: "Desktop", value: metrics?.deviceBreakdown.desktop || 0 },
    { name: "Mobile", value: metrics?.deviceBreakdown.mobile || 0 },
    { name: "Tablet", value: metrics?.deviceBreakdown.tablet || 0 },
  ].filter((d) => d.value > 0);
  const browserData = (dashboard?.progressCards.browsers || [])
    .slice(0, 8)
    .map((b) => ({ name: b.name, value: b.value }))
    .filter((b) => b.value > 0);
  const sourceData = sources
    .slice(0, 8)
    .map((s) => ({
      name: s.medium ? `${s.source} / ${s.medium}` : s.source,
      visitors: s.visitors || s.sessions || 0,
    }))
    .filter((s) => s.visitors > 0);

  const tableColumns = useMemo<SmartTableColumn<PageAnalyticsRow>[]>(
    () => [
      {
        id: "site_url",
        title: "Site URL",
        group: "Website",
        accessor: (row) => row.page_path || row.url || "—",
      },
      {
        id: "formular",
        title: "Formular",
        group: "Website",
        accessor: (row) => row.form_name || "—",
      },
      {
        id: "formular_typ",
        title: "Formular Typ",
        group: "Website",
        accessor: (row) => row.form_type || "—",
      },
      {
        id: "domain",
        title: "Domain",
        group: "Website",
        accessor: (row) => row.domain || "—",
      },
      {
        id: "als_entry",
        title: "als Entry",
        group: "Traffic",
        type: "number",
        accessor: (row) => row.entries ?? row.page_views ?? 0,
      },
      {
        id: "visitors",
        title: "Visitors",
        group: "Traffic",
        type: "number",
        accessor: (row) => row.unique_visitors ?? 0,
      },
      {
        id: "conversions",
        title: "Conversions",
        group: "Traffic",
        type: "number",
        accessor: (row) => row.conversions ?? 0,
      },
      {
        id: "conversion_rate",
        title: "Conversionrate %",
        group: "Performance",
        type: "number",
        accessor: (row) => row.conversion_rate ?? 0,
        render: (value) => formatPercent(Number(value ?? 0), 2),
      },
      {
        id: "scroll_depth",
        title: "Scrolltiefe %",
        group: "Performance",
        type: "number",
        accessor: (row) => row.scroll_depth ?? 0,
        render: (value) => formatPercent(Number(value ?? 0), 1),
      },
      {
        id: "pages_per_session",
        title: "Pages / Session",
        group: "Performance",
        type: "number",
        accessor: (row) => row.pages_per_session ?? 0,
        render: (value) => Number(value ?? 0).toFixed(2),
      },
      {
        id: "bounce_rate",
        title: "Bounce Rate %",
        group: "Performance",
        type: "number",
        accessor: (row) => row.bounce_rate ?? 0,
        render: (value) => formatPercent(Number(value ?? 0), 1),
      },
      {
        id: "load_time",
        title: "Ladezeit",
        group: "Performance",
        accessor: (row) => row.load_time || "00:00:00",
      },
      {
        id: "form_abort_rate",
        title: "Form-Abbruch %",
        group: "Performance",
        type: "number",
        accessor: (row) => row.form_abort_rate ?? 0,
        render: (value) => formatPercent(Number(value ?? 0), 1),
      },
      {
        id: "avg_session_duration",
        title: "Sitzungsdauer",
        group: "Performance",
        accessor: (row) => row.avg_session_duration_formatted || "00:00:00",
      },
      {
        id: "sessions",
        title: "Sessions",
        group: "Traffic",
        type: "number",
        accessor: (row) => row.sessions ?? 0,
      },
      {
        id: "revenue",
        title: "Umsatz €",
        group: "Business",
        type: "number",
        accessor: (row) => row.revenue ?? 0,
        render: (value) => Number(value ?? 0).toFixed(2),
      },
    ],
    [],
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Website-Baustein</h1>
            <p className="text-muted-foreground">Website-KPIs, Trends und Seitentabelle als Board-Baustein.</p>
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
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Visitors</p>
            <p className="mt-1 text-2xl font-bold">
              {chartsLoading ? "…" : formatCompact(metrics?.totalVisitors || 0)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Page Views</p>
            <p className="mt-1 text-2xl font-bold">
              {chartsLoading ? "…" : formatCompact(metrics?.totalPageViews || 0)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="mt-1 text-2xl font-bold">
              {chartsLoading ? "…" : formatPercent(metrics?.conversionRate || 0, 2)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Avg. Session</p>
            <p className="mt-1 text-2xl font-bold">
              {chartsLoading ? "…" : formatDurationFromSeconds(metrics?.avgSessionDuration || 0)}
            </p>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="p-4 xl:col-span-2">
            <h2 className="mb-4 text-lg font-semibold">Visitor Trend</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visitors" stroke="#0ea5e9" dot={false} />
                  <Line type="monotone" dataKey="sessions" stroke="#10b981" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-4">
            <h2 className="mb-4 text-lg font-semibold">Devices</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deviceData} dataKey="value" nameKey="name" outerRadius={100}>
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

        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="p-4">
            <h2 className="mb-4 text-lg font-semibold">Traffic Sources</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData}>
                  <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={70} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visitors" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="mb-4 text-lg font-semibold">Browser (Top 8)</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={browserData} dataKey="value" nameKey="name" outerRadius={100}>
                    {browserData.map((_, idx) => (
                      <Cell key={`browser-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Input
            placeholder="Website-Tabelle durchsuchen..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full md:max-w-md"
          />
          <select
            value={pageSize}
            onChange={(e) => {
              setPage(1);
              setPageSize(Number(e.target.value));
            }}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} pro Seite
              </option>
            ))}
          </select>
        </div>

        <SmartTable
          tableId="analytics_website_pages"
          columns={tableColumns}
          rows={rows}
          loading={tableLoading}
          loadingText="Lade Website-Tabelle..."
          emptyText="Keine Website-Daten gefunden."
          rowKey={(row) => row.id}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Seite {page} von {totalPages} | {total} Einträge
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Zurück
            </Button>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Weiter
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsWebsitePage;
