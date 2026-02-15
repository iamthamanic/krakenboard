import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnalyticsTabsNav } from "@/components/analytics/AnalyticsTabsNav";
import { DateRangeSelector } from "@/components/social/DateRangeSelector";
import { SmartTable, type SmartTableColumn } from "@/components/smart-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchFunnelAnalytics, type FunnelRow } from "@/lib/krakenboard-api";
import {
  ANALYTICS_TIME_RANGES,
  buildDateParams,
  formatCurrency,
  formatPercent,
  type AnalyticsDateRange,
} from "@/pages/analytics/utils";
import { useEffect, useMemo, useState } from "react";

type FunnelView = "paid" | "organic" | "custom";
type PaidTab = "anfrage" | "bestellung" | "jobs";
type OrganicTab = "anfrage" | "bestellung";

type FunnelColumn = {
  key: keyof FunnelRow;
  label: string;
  format?: "percent" | "currency" | "number";
};

const commonColumns: FunnelColumn[] = [
  { key: "funnel", label: "Funnel" },
  { key: "cr", label: "Conversion Rate %", format: "percent" },
  { key: "roi", label: "ROI", format: "number" },
  { key: "cac", label: "CAC €", format: "currency" },
  { key: "drop", label: "Drop Off %", format: "percent" },
  { key: "conv", label: "Conversions", format: "number" },
  { key: "adspend", label: "Ad Spend", format: "currency" },
  { key: "storniert", label: "Stornierungen", format: "number" },
];

const bestellungColumns: FunnelColumn[] = [
  ...commonColumns,
  { key: "bestellwert_avg", label: "Bestellwert Ø", format: "currency" },
  { key: "finalwert_avg", label: "Finalwert Ø", format: "currency" },
];

const anfrageColumns: FunnelColumn[] = [
  ...commonColumns,
  { key: "finalwert_avg", label: "Finalwert Ø", format: "currency" },
];

const PAGE_SIZE = 25;

function formatCell(value: unknown, format?: FunnelColumn["format"]) {
  if (typeof value !== "number") return value ?? "—";
  if (format === "currency") return formatCurrency(value);
  if (format === "percent") return formatPercent(value, 2);
  return new Intl.NumberFormat("de-DE").format(value);
}

const AnalyticsFunnelPage = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>({
    from: undefined,
    to: undefined,
  });
  const [view, setView] = useState<FunnelView>("paid");
  const [paidTab, setPaidTab] = useState<PaidTab>("anfrage");
  const [organicTab, setOrganicTab] = useState<OrganicTab>("anfrage");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<FunnelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dateParams = useMemo(() => buildDateParams(timeRange, dateRange), [timeRange, dateRange]);
  const activeTab: PaidTab | OrganicTab = view === "paid" ? paidTab : organicTab;
  const columns = view === "paid" && paidTab === "anfrage" ? anfrageColumns : bestellungColumns;
  const smartColumns = useMemo<SmartTableColumn<FunnelRow>[]>(
    () =>
      columns.map((column) => ({
        id: String(column.key),
        title: column.label,
        group: "Funnel",
        type:
          column.format === "currency" || column.format === "percent" || column.format === "number"
            ? "number"
            : "text",
        accessor: (row) => row[column.key],
        render: (value) => formatCell(value, column.format),
      })),
    [columns],
  );

  useEffect(() => {
    setPage(1);
  }, [view, paidTab, organicTab, search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const response = await fetchFunnelAnalytics({
          startDate: dateParams.startDate,
          endDate: dateParams.endDate,
          view,
          tab: activeTab as PaidTab,
        });
        if (cancelled) return;
        setRows(response.rows || []);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Fehler beim Laden der Funnel-Daten.");
          setRows([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dateParams.startDate, dateParams.endDate, view, activeTab]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(q)),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pagedRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Funnel-Baustein</h1>
            <p className="text-muted-foreground">Paid-, Organic- und Custom-Funnel als wiederverwendbarer Baustein.</p>
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

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {(["paid", "organic", "custom"] as FunnelView[]).map((key) => (
              <Button
                key={key}
                variant={view === key ? "default" : "outline"}
                size="sm"
                onClick={() => setView(key)}
              >
                {key === "paid" ? "Paid" : key === "organic" ? "Organic" : "Custom"}
              </Button>
            ))}
          </div>

          {view === "paid" && (
            <div className="flex flex-wrap gap-2">
              {(["anfrage", "bestellung", "jobs"] as PaidTab[]).map((key) => (
                <Button
                  key={key}
                  variant={paidTab === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPaidTab(key)}
                >
                  {key === "anfrage" ? "Anfrage" : key === "bestellung" ? "Bestellung" : "Jobs"}
                </Button>
              ))}
            </div>
          )}

          {view === "organic" && (
            <div className="flex flex-wrap gap-2">
              {(["anfrage", "bestellung"] as OrganicTab[]).map((key) => (
                <Button
                  key={key}
                  variant={organicTab === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOrganicTab(key)}
                >
                  {key === "anfrage" ? "Anfrage" : "Bestellung"}
                </Button>
              ))}
            </div>
          )}
        </div>

        <Input
          placeholder="Funnel durchsuchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:max-w-md"
        />

        {error && (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <SmartTable
          tableId={`analytics_funnel_${view}_${activeTab}`}
          columns={smartColumns}
          rows={pagedRows}
          loading={loading}
          loadingText="Lade Funnel-Daten..."
          emptyText="Keine Funnel-Daten gefunden."
          rowKey={(row) => row.id}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Seite {page} von {totalPages} | {filteredRows.length} Einträge
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

export default AnalyticsFunnelPage;
