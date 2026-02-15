/**
 * Krakenboard API client.
 * Uses Vite proxy in dev: /api -> http://localhost:3004
 */

const getBaseUrl = () =>
  import.meta.env.VITE_KRAKENBOARD_API_URL?.toString().replace(/\/$/, "") ?? "";

function apiUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const base = getBaseUrl();
  const pathWithLeading = path.startsWith("/") ? path : `/${path}`;
  const url = base ? `${base}${pathWithLeading}` : pathWithLeading;
  if (!params) return url;
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") search.set(k, String(v));
  });
  const q = search.toString();
  return q ? `${url}?${q}` : url;
}

async function fetchJson<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const res = await fetch(apiUrl(path, params));
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export interface SummaryMetrics {
  totalVisitors: number;
  totalPageViews: number;
  totalConversions: number;
  conversionRate: number;
  avgSessionDuration: number;
  bounceRate: number;
  totalEvents?: number;
}

export interface SummaryResponse {
  status: string;
  metrics: SummaryMetrics;
  period?: string;
  dateRange?: { startDate?: string; endDate?: string };
}

export async function fetchSummary(params?: {
  period?: string;
  startDate?: string;
  endDate?: string;
}): Promise<SummaryResponse> {
  const q: Record<string, string> = {};
  if (params?.period) q.period = params.period;
  if (params?.startDate) q.startDate = params.startDate;
  if (params?.endDate) q.endDate = params.endDate;
  return fetchJson<SummaryResponse>("/api/analytics/summary", q);
}

export interface PageAnalyticsRow {
  id: string;
  page_path: string;
  url: string;
  domain?: string;
  page_views: number;
  unique_visitors: number;
  sessions: number;
  entries?: number;
  form_name?: string;
  form_type?: string;
  form_interactions?: number;
  form_abort_rate?: number;
  scroll_depth?: number;
  bounce_rate?: number;
  load_time?: string;
  load_time_ms?: number;
  avg_session_duration?: number;
  avg_session_duration_formatted?: string;
  conversions?: number;
  conversion_rate?: number;
  revenue?: number;
  pages_per_session?: number;
}

export interface PageAnalyticsResponse {
  rows: PageAnalyticsRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function fetchPageAnalytics(params?: {
  domain?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<PageAnalyticsResponse> {
  const q: Record<string, string | number> = {};
  if (params?.domain) q.domain = params.domain;
  if (params?.startDate) q.startDate = params.startDate;
  if (params?.endDate) q.endDate = params.endDate;
  if (params?.page != null) q.page = params.page;
  if (params?.pageSize != null) q.pageSize = params.pageSize;
  if (params?.search) q.search = params.search;
  return fetchJson<PageAnalyticsResponse>("/api/analytics/pages", q);
}

export interface AggregatedDashboardMetric {
  totalVisitors: number;
  totalEvents: number;
  totalPageViews: number;
  totalSessions: number;
  totalClicks: number;
  conversions: number;
  averageSessionDuration: number;
  bounceRate: number;
  pagesPerSession: string | number;
  uniqueDomains: number;
}

export interface NameValuePercentage {
  name: string;
  value: number;
  percentage: number;
}

export interface AggregatedDashboardResponse {
  metrics: AggregatedDashboardMetric;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  progressCards: {
    browsers: NameValuePercentage[];
    operatingSystems: NameValuePercentage[];
    devices: NameValuePercentage[];
    trafficSources: NameValuePercentage[];
    topPages: NameValuePercentage[];
    domains?: NameValuePercentage[];
  };
}

export async function fetchAggregatedDashboard(params?: {
  domain?: string;
  startDate?: string;
  endDate?: string;
}): Promise<AggregatedDashboardResponse> {
  const q: Record<string, string> = {};
  if (params?.domain) q.domain = params.domain;
  if (params?.startDate) q.startDate = params.startDate;
  if (params?.endDate) q.endDate = params.endDate;
  return fetchJson<AggregatedDashboardResponse>("/api/analytics/aggregated-dashboard", q);
}

export interface MetricsResponse {
  totalVisitors: number;
  totalPageViews: number;
  totalEvents: number;
  totalConversions: number;
  conversionRate: number;
  avgSessionDuration: number;
  bounceRate: number;
  avgPagesPerSession: number;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  topSources?: Array<{
    source: string;
    visitors: number;
  }>;
}

export async function fetchMetrics(params?: {
  domain?: string;
  startDate?: string;
  endDate?: string;
}): Promise<MetricsResponse> {
  const q: Record<string, string> = {};
  if (params?.domain) q.domain = params.domain;
  if (params?.startDate) q.startDate = params.startDate;
  if (params?.endDate) q.endDate = params.endDate;
  return fetchJson<MetricsResponse>("/api/analytics/metrics", q);
}

export interface VisitorTrendPoint {
  date: string;
  visitors: number;
  sessions: number;
}

export interface VisitorTrendResponse {
  trend: VisitorTrendPoint[];
}

export async function fetchVisitorTrend(params?: {
  domain?: string;
}): Promise<VisitorTrendResponse> {
  const q: Record<string, string> = {};
  if (params?.domain) q.domain = params.domain;
  return fetchJson<VisitorTrendResponse>("/api/analytics/visitor-trend", q);
}

export interface TrafficSourcePoint {
  source: string;
  medium: string;
  sessions: number;
  visitors: number;
}

export interface TrafficSourcesResponse {
  sources: TrafficSourcePoint[];
}

export async function fetchTrafficSources(params?: {
  domain?: string;
}): Promise<TrafficSourcesResponse> {
  const q: Record<string, string> = {};
  if (params?.domain) q.domain = params.domain;
  return fetchJson<TrafficSourcesResponse>("/api/analytics/traffic-sources", q);
}

export interface EnrichedInteractionRow {
  id: string;
  visitorId: string | null;
  sessionId: string | null;
  eventType: string;
  eventName: string;
  url: string | null;
  timestamp: string;
  createdAt: string;
  properties: Record<string, unknown>;
  domain: string | null;
  visitor: {
    browser: string | null;
    os: string | null;
    deviceType: string | null;
    firstSeen: string | null;
    lastSeen: string | null;
  };
  session: {
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
    utmTerm: string | null;
    landingPage: string | null;
    referrer: string | null;
    gclid: string | null;
  };
  backoffice: {
    auftragsstatus: string;
    label: string;
    finalwert: number;
    auftragsverarbeitung: string;
    kundenname: string;
  } | null;
}

export interface EnrichedInteractionsResponse {
  rows: EnrichedInteractionRow[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  meta?: {
    enriched: boolean;
    ordersFound: number;
    source?: string;
  };
}

export async function fetchEnrichedInteractions(params?: {
  page?: number;
  pageSize?: number;
  domain?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  enrichBackoffice?: boolean;
}): Promise<EnrichedInteractionsResponse> {
  const q: Record<string, string | number> = {};
  if (params?.page != null) q.page = params.page;
  if (params?.pageSize != null) q.pageSize = params.pageSize;
  if (params?.domain) q.domain = params.domain;
  if (params?.startDate) q.startDate = params.startDate;
  if (params?.endDate) q.endDate = params.endDate;
  if (params?.search) q.search = params.search;
  if (typeof params?.enrichBackoffice === "boolean") {
    q.enrichBackoffice = params.enrichBackoffice ? "true" : "false";
  }
  return fetchJson<EnrichedInteractionsResponse>("/api/analytics/interactions/enriched", q);
}

export interface FunnelRow {
  id: string;
  funnel: string;
  cr: number;
  roi: number;
  cac: number;
  drop: number;
  conv: number;
  adspend: number;
  storniert: number;
  sessions: number;
  visitors: number;
  revenue: number;
  finalwert_avg: number;
  bestellwert_avg: number;
}

export interface FunnelAnalyticsResponse {
  rows: FunnelRow[];
  view: string;
  tab: string;
  total: number;
}

export async function fetchFunnelAnalytics(params?: {
  startDate?: string;
  endDate?: string;
  view?: "paid" | "organic" | "custom";
  tab?: "anfrage" | "bestellung" | "jobs";
}): Promise<FunnelAnalyticsResponse> {
  const q: Record<string, string> = {};
  if (params?.startDate) q.startDate = params.startDate;
  if (params?.endDate) q.endDate = params.endDate;
  if (params?.view) q.view = params.view;
  if (params?.tab) q.tab = params.tab;
  return fetchJson<FunnelAnalyticsResponse>("/api/analytics/funnel", q);
}

export interface OperationsOrderRow {
  id: string;
  bestellnummer: string;
  kundennummer: string;
  kundenname: string;
  auftragsstatus: string;
  aufsteller: string;
  auftragsort: string;
  auftragsverarbeitung: string;
  label: string;
  bestellwert: number;
  finalwert: number;
  umsatz: number;
  gewinn: number;
  auftragsdauer: number;
  bearbeitungsdauer: number;
}

export interface OperationsDriverRow {
  id: string;
  vorname: string;
  nachname: string;
  einsatzgebiet: string;
  schilder: number;
  sondermaterial: number;
  arbeitszeit: number;
  position: string;
}

export interface OperationsPaginatedResponse<T> {
  rows: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  warning?: string;
}

export async function fetchOperationsOrders(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}): Promise<OperationsPaginatedResponse<OperationsOrderRow>> {
  const q: Record<string, string | number> = {};
  if (params?.page != null) q.page = params.page;
  if (params?.pageSize != null) q.pageSize = params.pageSize;
  if (params?.search) q.search = params.search;
  if (params?.startDate) q.startDate = params.startDate;
  if (params?.endDate) q.endDate = params.endDate;
  if (params?.status) q.status = params.status;
  return fetchJson<OperationsPaginatedResponse<OperationsOrderRow>>("/api/analytics/operations/orders", q);
}

export async function fetchOperationsDrivers(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  groupId?: string;
}): Promise<OperationsPaginatedResponse<OperationsDriverRow>> {
  const q: Record<string, string | number> = {};
  if (params?.page != null) q.page = params.page;
  if (params?.pageSize != null) q.pageSize = params.pageSize;
  if (params?.search) q.search = params.search;
  if (params?.startDate) q.startDate = params.startDate;
  if (params?.endDate) q.endDate = params.endDate;
  if (params?.groupId) q.groupId = params.groupId;
  return fetchJson<OperationsPaginatedResponse<OperationsDriverRow>>("/api/analytics/operations/drivers", q);
}

export interface OperationsSummaryResponse {
  success: boolean;
  data: Record<string, unknown>;
}

export async function fetchOperationsSummary(params?: {
  startDate?: string;
  endDate?: string;
}): Promise<OperationsSummaryResponse> {
  const q: Record<string, string> = {};
  if (params?.startDate) q.dateFrom = params.startDate;
  if (params?.endDate) q.dateTo = params.endDate;
  return fetchJson<OperationsSummaryResponse>("/api/analytics/operations/summary", q);
}
