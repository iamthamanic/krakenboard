import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnalyticsTabsNav } from "@/components/analytics/AnalyticsTabsNav";
import { DateRangeSelector } from "@/components/social/DateRangeSelector";
import { SmartTable, type SmartTableColumn } from "@/components/smart-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  fetchOperationsDrivers,
  fetchOperationsOrders,
  fetchOperationsSummary,
  type OperationsDriverRow,
  type OperationsOrderRow,
} from "@/lib/krakenboard-api";
import {
  ANALYTICS_TIME_RANGES,
  buildDateParams,
  formatCurrency,
  formatDurationFromSeconds,
  type AnalyticsDateRange,
} from "@/pages/analytics/utils";
import { useEffect, useMemo, useState } from "react";

type OperationsView = "intern" | "extern";
type InternTab = "auftraege" | "fahrer" | "agents";
type ExternTab = "aufsteller" | "iso-bewertung";
type ExternAufstellerRow = {
  id: string;
  name: string;
  location: string;
  status: string;
};
type ExternIsoRow = {
  id: string;
  standard: string;
  status: string;
  compliance: string;
};

const PAGE_SIZE_OPTIONS = [25, 50, 100];

const externAufstellerRows: ExternAufstellerRow[] = [
  { id: "AUF-001", name: "Schmidt Logistik GmbH", location: "Hamburg", status: "Aktiv" },
  { id: "AUF-002", name: "Müller Transport AG", location: "München", status: "Aktiv" },
  { id: "AUF-003", name: "Weber Spedition", location: "Berlin", status: "Inaktiv" },
];

const externIsoRows: ExternIsoRow[] = [
  { id: "ISO-001", standard: "ISO 9001", status: "Erfüllt", compliance: "96%" },
  { id: "ISO-002", standard: "ISO 14001", status: "Erfüllt", compliance: "89%" },
  { id: "ISO-003", standard: "ISO 45001", status: "Teilweise", compliance: "71%" },
];

const AnalyticsOperationsPage = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>({
    from: undefined,
    to: undefined,
  });
  const [view, setView] = useState<OperationsView>("intern");
  const [internTab, setInternTab] = useState<InternTab>("auftraege");
  const [externTab, setExternTab] = useState<ExternTab>("aufsteller");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [orders, setOrders] = useState<OperationsOrderRow[]>([]);
  const [drivers, setDrivers] = useState<OperationsDriverRow[]>([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [driversTotal, setDriversTotal] = useState(0);
  const [ordersPages, setOrdersPages] = useState(1);
  const [driversPages, setDriversPages] = useState(1);
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dateParams = useMemo(() => buildDateParams(timeRange, dateRange), [timeRange, dateRange]);
  const activeInternTab = view === "intern" ? internTab : null;

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [view, internTab, externTab]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const summaryRes = await fetchOperationsSummary({
          startDate: dateParams.startDate,
          endDate: dateParams.endDate,
        });
        if (!cancelled) setSummary(summaryRes.data || null);
      } catch {
        if (!cancelled) setSummary(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dateParams.startDate, dateParams.endDate]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        if (view === "intern" && activeInternTab === "auftraege") {
          const response = await fetchOperationsOrders({
            page,
            pageSize,
            search,
            startDate: dateParams.startDate,
            endDate: dateParams.endDate,
          });
          if (cancelled) return;
          setOrders(response.rows || []);
          setOrdersTotal(response.pagination?.total || 0);
          setOrdersPages(Math.max(1, response.pagination?.totalPages || 1));
          setDrivers([]);
          setDriversTotal(0);
          setDriversPages(1);
        } else if (view === "intern" && activeInternTab === "fahrer") {
          const response = await fetchOperationsDrivers({
            page,
            pageSize,
            search,
            startDate: dateParams.startDate,
            endDate: dateParams.endDate,
          });
          if (cancelled) return;
          setDrivers(response.rows || []);
          setDriversTotal(response.pagination?.total || 0);
          setDriversPages(Math.max(1, response.pagination?.totalPages || 1));
          setOrders([]);
          setOrdersTotal(0);
          setOrdersPages(1);
        } else {
          setOrders([]);
          setDrivers([]);
          setOrdersTotal(0);
          setDriversTotal(0);
          setOrdersPages(1);
          setDriversPages(1);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Fehler beim Laden der Operations-Daten.");
          setOrders([]);
          setDrivers([]);
          setOrdersTotal(0);
          setDriversTotal(0);
          setOrdersPages(1);
          setDriversPages(1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [view, activeInternTab, page, pageSize, search, dateParams.startDate, dateParams.endDate]);

  const orderRevenue = orders.reduce((sum, row) => sum + (row.umsatz || 0), 0);
  const orderProfit = orders.reduce((sum, row) => sum + (row.gewinn || 0), 0);
  const orderAvg = orders.length
    ? orders.reduce((sum, row) => sum + (row.bestellwert || 0), 0) / orders.length
    : 0;
  const driverSigns = drivers.reduce((sum, row) => sum + (row.schilder || 0), 0);
  const driverMaterial = drivers.reduce((sum, row) => sum + (row.sondermaterial || 0), 0);
  const driverHours = drivers.reduce((sum, row) => sum + (row.arbeitszeit || 0), 0);

  const totalPages = view === "intern" && internTab === "auftraege" ? ordersPages : driversPages;
  const totalRows = view === "intern" && internTab === "auftraege" ? ordersTotal : driversTotal;
  const orderColumns = useMemo<SmartTableColumn<OperationsOrderRow>[]>(
    () => [
      { id: "bestellnummer", title: "Bestellnummer", group: "Aufträge", accessor: (row) => row.bestellnummer },
      { id: "kundennummer", title: "Kundennummer", group: "Aufträge", accessor: (row) => row.kundennummer },
      { id: "kundenname", title: "Kundenname", group: "Aufträge", accessor: (row) => row.kundenname },
      { id: "auftragsstatus", title: "Auftragsstatus", group: "Aufträge", accessor: (row) => row.auftragsstatus },
      { id: "aufsteller", title: "Aufsteller", group: "Aufträge", accessor: (row) => row.aufsteller },
      { id: "auftragsort", title: "Auftragsort", group: "Aufträge", accessor: (row) => row.auftragsort },
      {
        id: "auftragsverarbeitung",
        title: "Auftragsverarbeitung",
        group: "Aufträge",
        accessor: (row) => row.auftragsverarbeitung,
      },
      { id: "label", title: "Label", group: "Aufträge", accessor: (row) => row.label },
      {
        id: "bestellwert",
        title: "Bestellwert",
        group: "Finanzen",
        type: "number",
        accessor: (row) => row.bestellwert,
        render: (value) => formatCurrency(Number(value ?? 0)),
      },
      {
        id: "finalwert",
        title: "Finalwert",
        group: "Finanzen",
        type: "number",
        accessor: (row) => row.finalwert,
        render: (value) => formatCurrency(Number(value ?? 0)),
      },
      {
        id: "umsatz",
        title: "Umsatz",
        group: "Finanzen",
        type: "number",
        accessor: (row) => row.umsatz,
        render: (value) => formatCurrency(Number(value ?? 0)),
      },
      {
        id: "gewinn",
        title: "Gewinn",
        group: "Finanzen",
        type: "number",
        accessor: (row) => row.gewinn,
        render: (value) => formatCurrency(Number(value ?? 0)),
      },
    ],
    [],
  );
  const driverColumns = useMemo<SmartTableColumn<OperationsDriverRow>[]>(
    () => [
      { id: "vorname", title: "Vorname", group: "Fahrer", accessor: (row) => row.vorname },
      { id: "nachname", title: "Nachname", group: "Fahrer", accessor: (row) => row.nachname },
      { id: "einsatzgebiet", title: "Einsatzgebiet", group: "Fahrer", accessor: (row) => row.einsatzgebiet },
      {
        id: "schilder",
        title: "Schilder",
        group: "Fahrer",
        type: "number",
        accessor: (row) => row.schilder,
      },
      {
        id: "sondermaterial",
        title: "Sondermaterial",
        group: "Fahrer",
        type: "number",
        accessor: (row) => row.sondermaterial,
      },
      {
        id: "arbeitszeit",
        title: "Arbeitszeit (h)",
        group: "Fahrer",
        type: "number",
        accessor: (row) => row.arbeitszeit,
        render: (value) => Number(value ?? 0).toFixed(1),
      },
      { id: "position", title: "Position", group: "Fahrer", accessor: (row) => row.position },
    ],
    [],
  );
  const aufstellerColumns = useMemo<SmartTableColumn<ExternAufstellerRow>[]>(
    () => [
      { id: "id", title: "ID", group: "Extern", accessor: (row) => row.id },
      { id: "name", title: "Name", group: "Extern", accessor: (row) => row.name },
      { id: "location", title: "Standort", group: "Extern", accessor: (row) => row.location },
      { id: "status", title: "Status", group: "Extern", accessor: (row) => row.status },
    ],
    [],
  );
  const isoColumns = useMemo<SmartTableColumn<ExternIsoRow>[]>(
    () => [
      { id: "id", title: "ID", group: "Extern", accessor: (row) => row.id },
      { id: "standard", title: "Standard", group: "Extern", accessor: (row) => row.standard },
      { id: "status", title: "Status", group: "Extern", accessor: (row) => row.status },
      { id: "compliance", title: "Compliance", group: "Extern", accessor: (row) => row.compliance },
    ],
    [],
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Operations-Baustein</h1>
            <p className="text-muted-foreground">Interne und externe Operations-Ansichten als wiederverwendbarer Baustein.</p>
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
            <Button variant={view === "intern" ? "default" : "outline"} size="sm" onClick={() => setView("intern")}>
              Intern
            </Button>
            <Button variant={view === "extern" ? "default" : "outline"} size="sm" onClick={() => setView("extern")}>
              Extern
            </Button>
          </div>

          {view === "intern" && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={internTab === "auftraege" ? "default" : "outline"}
                size="sm"
                onClick={() => setInternTab("auftraege")}
              >
                Aufträge
              </Button>
              <Button
                variant={internTab === "fahrer" ? "default" : "outline"}
                size="sm"
                onClick={() => setInternTab("fahrer")}
              >
                Fahrer
              </Button>
              <Button
                variant={internTab === "agents" ? "default" : "outline"}
                size="sm"
                onClick={() => setInternTab("agents")}
              >
                Agents
              </Button>
            </div>
          )}

          {view === "extern" && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={externTab === "aufsteller" ? "default" : "outline"}
                size="sm"
                onClick={() => setExternTab("aufsteller")}
              >
                Aufsteller
              </Button>
              <Button
                variant={externTab === "iso-bewertung" ? "default" : "outline"}
                size="sm"
                onClick={() => setExternTab("iso-bewertung")}
              >
                ISO Bewertung
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {view === "intern" && internTab === "auftraege" && (
            <>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Gesamtaufträge</p>
                <p className="mt-1 text-2xl font-bold">{ordersTotal}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Umsatz</p>
                <p className="mt-1 text-2xl font-bold">{formatCurrency(orderRevenue)}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Gewinn</p>
                <p className="mt-1 text-2xl font-bold">{formatCurrency(orderProfit)}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Bestellwert Ø</p>
                <p className="mt-1 text-2xl font-bold">{formatCurrency(orderAvg)}</p>
              </Card>
            </>
          )}

          {view === "intern" && internTab === "fahrer" && (
            <>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Fahrer</p>
                <p className="mt-1 text-2xl font-bold">{driversTotal}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Schilder</p>
                <p className="mt-1 text-2xl font-bold">{driverSigns}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Sondermaterial</p>
                <p className="mt-1 text-2xl font-bold">{driverMaterial}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Arbeitszeit</p>
                <p className="mt-1 text-2xl font-bold">{formatDurationFromSeconds(driverHours * 3600)}</p>
              </Card>
            </>
          )}

          {summary && view === "extern" && (
            <>
              <Card className="p-4 md:col-span-2 xl:col-span-4">
                <p className="text-sm text-muted-foreground">
                  Operations Summary API verbunden ({Object.keys(summary).length} Felder verfügbar)
                </p>
              </Card>
            </>
          )}
        </div>

        {error && (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        {view === "intern" && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Input
              placeholder="Operations durchsuchen..."
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
        )}

        {view === "intern" && internTab === "auftraege" && (
          <SmartTable
            tableId="analytics_operations_orders"
            columns={orderColumns}
            rows={orders}
            loading={loading}
            loadingText="Lade Auftragsdaten..."
            emptyText="Keine Aufträge gefunden."
            rowKey={(row) => row.id}
          />
        )}

        {view === "intern" && internTab === "fahrer" && (
          <SmartTable
            tableId="analytics_operations_drivers"
            columns={driverColumns}
            rows={drivers}
            loading={loading}
            loadingText="Lade Fahrerdaten..."
            emptyText="Keine Fahrer gefunden."
            rowKey={(row) => row.id}
          />
        )}

        {view === "intern" && internTab === "agents" && (
          <Card className="p-6 text-sm text-muted-foreground">
            Agents-Tab ist aktuell noch nicht final umgesetzt.
          </Card>
        )}

        {view === "extern" && externTab === "aufsteller" && (
          <SmartTable
            tableId="analytics_operations_extern_aufsteller"
            columns={aufstellerColumns}
            rows={externAufstellerRows}
            rowKey={(row) => row.id}
          />
        )}

        {view === "extern" && externTab === "iso-bewertung" && (
          <SmartTable
            tableId="analytics_operations_extern_iso"
            columns={isoColumns}
            rows={externIsoRows}
            rowKey={(row) => row.id}
          />
        )}

        {view === "intern" && (internTab === "auftraege" || internTab === "fahrer") && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Seite {page} von {totalPages} | {totalRows} Einträge
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
        )}
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsOperationsPage;
