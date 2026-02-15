import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnalyticsTabsNav } from "@/components/analytics/AnalyticsTabsNav";
import { DateRangeSelector } from "@/components/social/DateRangeSelector";
import { SmartTable, type SmartTableColumn } from "@/components/smart-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchEnrichedInteractions,
  type EnrichedInteractionRow,
} from "@/lib/krakenboard-api";
import {
  ANALYTICS_TIME_RANGES,
  buildDateParams,
  formatDateTime,
  type AnalyticsDateRange,
} from "@/pages/analytics/utils";
import { useEffect, useMemo, useState, type ReactNode } from "react";

const PAGE_SIZE_OPTIONS = [25, 50, 100];

type SourceSystem = "Tracking" | "Website" | "Google Ads" | "CRM" | "ERP";

type BoardColumn = {
  key: string;
  label: string;
  source: SourceSystem;
  value: (row: EnrichedInteractionRow) => unknown;
  render?: (value: unknown, row: EnrichedInteractionRow) => ReactNode;
  type?: "text" | "number";
};

function getProp(row: EnrichedInteractionRow, key: string): string {
  const raw = row.properties?.[key];
  if (typeof raw === "number") return String(raw);
  if (typeof raw === "string") return raw;
  return "";
}

function getFirstProp(row: EnrichedInteractionRow, keys: string[]): string {
  for (const key of keys) {
    const value = getProp(row, key);
    if (value) return value;
  }
  return "";
}

function toOrderNo(row: EnrichedInteractionRow): string {
  return (
    getFirstProp(row, ["order_no", "bestellnummer", "order_id"]) ||
    row.backoffice?.label ||
    ""
  );
}

function toTrafficType(row: EnrichedInteractionRow): string {
  const explicit = getProp(row, "trafficType");
  if (explicit) return explicit;
  const medium = row.session?.utmMedium?.toLowerCase() || "";
  if (["ppc", "paid", "cpc", "cpm"].includes(medium)) return "paid";
  if (row.session?.utmSource) return "organic";
  if (!row.session?.utmSource && !row.session?.referrer) return "direct";
  return "organic";
}

function toCurrency(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) return `${value.toFixed(2)} €`;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return `${parsed.toFixed(2)} €`;
  }
  return "—";
}

function isConversion(row: EnrichedInteractionRow): boolean {
  return row.eventType === "conversion" || toOrderNo(row) !== "";
}

const BOARD_COLUMNS: BoardColumn[] = [
  {
    key: "visitor_id",
    label: "Visitor ID",
    source: "Tracking",
    value: (row) => row.visitorId || "—",
  },
  {
    key: "event",
    label: "Event",
    source: "Tracking",
    value: (row) => row.eventName || row.eventType || "—",
  },
  {
    key: "conversion_date",
    label: "Conversion-Datum",
    source: "Tracking",
    value: (row) => formatDateTime(row.timestamp),
  },
  {
    key: "conversion",
    label: "Conversion",
    source: "Tracking",
    value: (row) => isConversion(row),
    render: (value) => (
      <Badge variant={value ? "default" : "secondary"}>{value ? "Ja" : "Nein"}</Badge>
    ),
  },
  {
    key: "traffic_type",
    label: "Traffic-Type",
    source: "Tracking",
    value: (row) => toTrafficType(row),
  },
  {
    key: "device_type",
    label: "Device-Type",
    source: "Tracking",
    value: (row) => row.visitor?.deviceType || "—",
  },
  {
    key: "source",
    label: "Quelle",
    source: "Website",
    value: (row) => row.session?.utmSource || getProp(row, "source") || "—",
  },
  {
    key: "referrer",
    label: "Referrer",
    source: "Website",
    value: (row) => row.session?.referrer || "—",
  },
  {
    key: "landing_page",
    label: "Einstiegsseite",
    source: "Website",
    value: (row) => row.session?.landingPage || "—",
  },
  {
    key: "conversion_page",
    label: "Conversionseite",
    source: "Website",
    value: (row) => row.url || "—",
  },
  {
    key: "form_type",
    label: "Formular Typ",
    source: "Website",
    value: (row) => getProp(row, "form_type") || "—",
  },
  {
    key: "domain",
    label: "Domain",
    source: "Website",
    value: (row) => row.domain || "—",
  },
  {
    key: "google_campaign",
    label: "Google Kampagne",
    source: "Google Ads",
    value: (row) => row.session?.utmCampaign || getProp(row, "campaign") || "—",
  },
  {
    key: "google_adgroup",
    label: "Ad Group",
    source: "Google Ads",
    value: (row) =>
      getFirstProp(row, ["ad_group", "adgroup", "google_ad_group", "utm_term"]) ||
      row.session?.utmTerm ||
      "—",
  },
  {
    key: "crm_lead_id",
    label: "CRM Lead ID",
    source: "CRM",
    value: (row) => getFirstProp(row, ["crm_lead_id", "crmLeadId", "lead_id"]) || "—",
  },
  {
    key: "crm_deal_id",
    label: "CRM Deal ID",
    source: "CRM",
    value: (row) => getFirstProp(row, ["crm_deal_id", "crmDealId", "deal_id"]) || "—",
  },
  {
    key: "crm_deal_value",
    label: "CRM Deal Value",
    source: "CRM",
    value: (row) => getFirstProp(row, ["crm_deal_value", "deal_value", "crmValue"]),
    render: (value) => toCurrency(value),
    type: "number",
  },
  {
    key: "erp_order_no",
    label: "ERP Bestellnummer",
    source: "ERP",
    value: (row) => toOrderNo(row) || "—",
  },
  {
    key: "erp_process",
    label: "ERP Auftragsverarbeitung",
    source: "ERP",
    value: (row) => row.backoffice?.auftragsverarbeitung || getProp(row, "process") || "Website",
  },
  {
    key: "erp_status",
    label: "ERP Auftragsstatus",
    source: "ERP",
    value: (row) => row.backoffice?.auftragsstatus || getProp(row, "status") || "—",
  },
  {
    key: "erp_customer",
    label: "ERP Kundenname",
    source: "ERP",
    value: (row) => row.backoffice?.kundenname || getProp(row, "kundenname") || "—",
  },
  {
    key: "erp_final_value",
    label: "ERP Final-Wert",
    source: "ERP",
    value: (row) => row.backoffice?.finalwert ?? getProp(row, "final_value"),
    render: (value) => toCurrency(value),
    type: "number",
  },
];

const DEFAULT_COLUMN_KEYS = [
  "visitor_id",
  "event",
  "conversion",
  "erp_order_no",
  "erp_status",
  "source",
  "google_campaign",
  "crm_lead_id",
  "erp_final_value",
  "domain",
];

const AnalyticsInteractionsPage = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>({
    from: undefined,
    to: undefined,
  });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [rows, setRows] = useState<EnrichedInteractionRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dateParams = useMemo(() => buildDateParams(timeRange, dateRange), [timeRange, dateRange]);

  const smartColumns = useMemo<SmartTableColumn<EnrichedInteractionRow>[]>(
    () =>
      BOARD_COLUMNS.map((column) => ({
        id: column.key,
        title: column.label,
        tag: column.source,
        group: column.source,
        type: column.type,
        accessor: column.value,
        render: column.render,
        tooltip: `${column.label} (${column.source})`,
      })),
    [],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const response = await fetchEnrichedInteractions({
          page,
          pageSize,
          search,
          startDate: dateParams.startDate,
          endDate: dateParams.endDate,
          enrichBackoffice: true,
        });
        if (cancelled) return;
        setRows(response.rows || []);
        setTotal(response.pagination?.total || 0);
        setTotalPages(Math.max(1, response.pagination?.totalPages || 1));
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Fehler beim Laden von My Board.");
          setRows([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, search, dateParams.startDate, dateParams.endDate]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Board</h1>
            <p className="text-muted-foreground">
              Konfigurierbare Interaktionen-Tabelle mit quellengebundenen Spalten (CRM, ERP, Tracking, Ads, Website).
            </p>
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

        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Suche (Lead, Bestellnummer, Quelle, Kampagne...)"
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

        {error && (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <SmartTable
          tableId="analytics_interactions"
          columns={smartColumns}
          rows={rows}
          loading={loading}
          loadingText="Lade My Board..."
          emptyText="Keine Einträge gefunden."
          defaultVisibleColumnIds={DEFAULT_COLUMN_KEYS}
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

export default AnalyticsInteractionsPage;
