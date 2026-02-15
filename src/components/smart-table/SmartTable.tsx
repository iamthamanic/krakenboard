import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Filter,
  GripVertical,
  Info,
  RotateCcw,
  SlidersHorizontal,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type SmartTableAlign = "left" | "center" | "right";
export type SmartTableColumnType = "text" | "number";

export type SmartTableColumn<Row> = {
  id: string;
  title: string;
  accessor: (row: Row) => unknown;
  render?: (value: unknown, row: Row) => React.ReactNode;
  tooltip?: string;
  group?: string;
  tag?: string;
  align?: SmartTableAlign;
  type?: SmartTableColumnType;
  sortable?: boolean;
  filterable?: boolean;
  ruleable?: boolean;
  headerClassName?: string;
  cellClassName?: string;
};

type SortDirection = "asc" | "desc" | null;

type SortState = {
  columnId: string | null;
  direction: SortDirection;
};

type FilterOperator =
  | "contains"
  | "not_contains"
  | "eq"
  | "neq"
  | "starts"
  | "ends"
  | "gt"
  | "lt"
  | "gte"
  | "lte";

type FilterClause = {
  op: FilterOperator;
  value: string;
};

type RuleStyle = {
  textColor?: string;
  bgColor?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
};

type RuleClause = {
  op: FilterOperator;
  value: string;
  style: RuleStyle;
};

type FilterState = Record<string, FilterClause | undefined>;
type RuleState = Record<string, RuleClause | undefined>;
type TooltipState = Record<string, string | undefined>;
type SearchState = Record<string, string | undefined>;
type DropIndicator = {
  columnId: string;
  side: "before" | "after";
};

type SmartTableProps<Row> = {
  tableId: string;
  columns: SmartTableColumn<Row>[];
  rows: Row[];
  rowKey?: (row: Row, index: number) => string;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
  defaultVisibleColumnIds?: string[];
  disableColumnManager?: boolean;
  className?: string;
};

const FILTER_OPERATORS: Array<{ value: FilterOperator; label: string }> = [
  { value: "contains", label: "enthält" },
  { value: "not_contains", label: "enthält nicht" },
  { value: "eq", label: "gleich (=)" },
  { value: "neq", label: "ungleich (≠)" },
  { value: "starts", label: "beginnt mit" },
  { value: "ends", label: "endet mit" },
  { value: "gt", label: "größer (>)" },
  { value: "gte", label: "größer/gleich (≥)" },
  { value: "lt", label: "kleiner (<)" },
  { value: "lte", label: "kleiner/gleich (≤)" },
];

const DEFAULT_RULE_STYLE: RuleStyle = {
  textColor: "#111827",
  bgColor: "#fef3c7",
  bold: false,
  italic: false,
  underline: false,
  strike: false,
};

function storageKey(tableId: string, suffix: string): string {
  return `krakenboard:smart-table:${tableId}:${suffix}`;
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function normalizeStringArray(input: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(input)) {
    return fallback;
  }
  return input.filter((value): value is string => typeof value === "string");
}

function parseNumberLoose(input: unknown): number | null {
  if (typeof input === "number") {
    return Number.isFinite(input) ? input : null;
  }
  const s = String(input ?? "").trim();
  if (!s) {
    return null;
  }
  const normalized = s
    .replace(/[^0-9,.-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(/,(?=\d{1,2}(\D|$))/g, ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function matchesOperator(
  op: FilterOperator,
  rawValue: unknown,
  needleValue: string,
): boolean {
  const val = String(rawValue ?? "");
  const needle = String(needleValue ?? "");
  const a = val.toLocaleLowerCase();
  const b = needle.toLocaleLowerCase();

  if (op === "gt" || op === "lt" || op === "gte" || op === "lte") {
    const left = parseNumberLoose(rawValue);
    const right = parseNumberLoose(needle);
    if (left === null || right === null) {
      return false;
    }
    if (op === "gt") return left > right;
    if (op === "lt") return left < right;
    if (op === "gte") return left >= right;
    return left <= right;
  }

  if (op === "contains") return a.includes(b);
  if (op === "not_contains") return !a.includes(b);
  if (op === "starts") return a.startsWith(b);
  if (op === "ends") return a.endsWith(b);
  if (op === "eq") {
    const left = parseNumberLoose(val);
    const right = parseNumberLoose(needle);
    if (left !== null && right !== null) {
      return left === right;
    }
    return a === b;
  }
  if (op === "neq") {
    const left = parseNumberLoose(val);
    const right = parseNumberLoose(needle);
    if (left !== null && right !== null) {
      return left !== right;
    }
    return a !== b;
  }

  return true;
}

function compareValues(a: unknown, b: unknown): number {
  const an = parseNumberLoose(a);
  const bn = parseNumberLoose(b);

  if (an !== null && bn !== null) {
    return an - bn;
  }

  const as = String(a ?? "").toLocaleLowerCase();
  const bs = String(b ?? "").toLocaleLowerCase();
  if (as < bs) return -1;
  if (as > bs) return 1;
  return 0;
}

function defaultDisplay(value: unknown): React.ReactNode {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  if (typeof value === "boolean") {
    return value ? "Ja" : "Nein";
  }
  return String(value);
}

function alignmentClass(align?: SmartTableAlign): string {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
}

function IconActionButton({
  active,
  icon,
  label,
}: {
  active?: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span
      aria-label={label}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded border",
        active
          ? "border-[#cfe0ec] bg-[#eaf1f6] text-[#275073]"
          : "border-transparent text-muted-foreground hover:border-[#cfe0ec] hover:bg-[#eaf1f6] hover:text-[#275073]",
      )}
    >
      {icon}
    </span>
  );
}

function SmartTooltipPopover({
  value,
  fallback,
  tag,
  onSave,
  onReset,
}: {
  value?: string;
  fallback?: string;
  tag?: string;
  onSave: (next: string) => void;
  onReset: () => void;
}) {
  const [draft, setDraft] = useState(value ?? fallback ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(value ?? fallback ?? "");
    }
  }, [value, fallback, open]);

  const hasText = Boolean((value ?? fallback ?? "").trim());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" aria-label="Tooltip konfigurieren">
          <IconActionButton active={hasText} icon={<Info size={14} />} label="Tooltip" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 space-y-3 p-3">
        <p className="text-xs font-medium text-muted-foreground">Smart Tooltip</p>
        {tag && (
          <div className="flex items-center">
            <Badge variant="secondary" className="border border-border bg-white text-[10px] uppercase text-foreground">
              {tag}
            </Badge>
          </div>
        )}
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Tooltip-Text eingeben..."
          className="min-h-20"
        />
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onReset();
              setOpen(false);
            }}
          >
            Zurücksetzen
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              onSave(draft.trim());
              setOpen(false);
            }}
          >
            Speichern
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ColumnFilterPopover({
  clause,
  onApply,
  onReset,
}: {
  clause?: FilterClause;
  onApply: (next: FilterClause | undefined) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [localOp, setLocalOp] = useState<FilterOperator>(clause?.op ?? "contains");
  const [localValue, setLocalValue] = useState(clause?.value ?? "");

  useEffect(() => {
    if (open) {
      setLocalOp(clause?.op ?? "contains");
      setLocalValue(clause?.value ?? "");
    }
  }, [clause, open]);

  const active = Boolean(clause?.value?.trim());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" aria-label="Spaltenfilter">
          <IconActionButton active={active} icon={<Filter size={14} />} label="Filter" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 space-y-3 p-3">
        <p className="text-xs font-medium text-muted-foreground">Spaltenfilter</p>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Operator</label>
          <select
            value={localOp}
            onChange={(event) => setLocalOp(event.target.value as FilterOperator)}
            className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
          >
            {FILTER_OPERATORS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Wert</label>
          <Input
            value={localValue}
            onChange={(event) => setLocalValue(event.target.value)}
            placeholder="Filterwert..."
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onReset();
              setOpen(false);
            }}
          >
            Zurücksetzen
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              const trimmed = localValue.trim();
              if (!trimmed) {
                onApply(undefined);
              } else {
                onApply({ op: localOp, value: trimmed });
              }
              setOpen(false);
            }}
          >
            Anwenden
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ColumnRulePopover({
  rule,
  onSave,
  onReset,
}: {
  rule?: RuleClause;
  onSave: (next: RuleClause | undefined) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [localOp, setLocalOp] = useState<FilterOperator>(rule?.op ?? "eq");
  const [localValue, setLocalValue] = useState(rule?.value ?? "");
  const [style, setStyle] = useState<RuleStyle>(rule?.style ?? DEFAULT_RULE_STYLE);

  useEffect(() => {
    if (open) {
      setLocalOp(rule?.op ?? "eq");
      setLocalValue(rule?.value ?? "");
      setStyle(rule?.style ?? DEFAULT_RULE_STYLE);
    }
  }, [rule, open]);

  const active = Boolean(rule?.value?.trim());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" aria-label="Spaltenregeln">
          <IconActionButton active={active} icon={<Wrench size={14} />} label="Regel" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 space-y-3 p-3">
        <p className="text-xs font-medium text-muted-foreground">Spaltenregel</p>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Wenn Wert</label>
          <div className="grid grid-cols-[1fr,1fr] gap-2">
            <select
              value={localOp}
              onChange={(event) => setLocalOp(event.target.value as FilterOperator)}
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
            >
              {FILTER_OPERATORS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Input
              value={localValue}
              onChange={(event) => setLocalValue(event.target.value)}
              placeholder="Vergleichswert..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Dann style</label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2 text-xs">
              Textfarbe
              <input
                type="color"
                value={style.textColor ?? "#111827"}
                onChange={(event) =>
                  setStyle((current) => ({ ...current, textColor: event.target.value }))
                }
                className="h-8 w-full rounded border border-input bg-background p-1"
              />
            </label>
            <label className="flex items-center gap-2 text-xs">
              Hintergrund
              <input
                type="color"
                value={style.bgColor ?? "#fef3c7"}
                onChange={(event) =>
                  setStyle((current) => ({ ...current, bgColor: event.target.value }))
                }
                className="h-8 w-full rounded border border-input bg-background p-1"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(style.bold)}
                onChange={(event) =>
                  setStyle((current) => ({ ...current, bold: event.target.checked }))
                }
              />
              Fett
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(style.italic)}
                onChange={(event) =>
                  setStyle((current) => ({ ...current, italic: event.target.checked }))
                }
              />
              Kursiv
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(style.underline)}
                onChange={(event) =>
                  setStyle((current) => ({ ...current, underline: event.target.checked }))
                }
              />
              Unterstrichen
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(style.strike)}
                onChange={(event) =>
                  setStyle((current) => ({ ...current, strike: event.target.checked }))
                }
              />
              Durchgestrichen
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onReset();
              setOpen(false);
            }}
          >
            Zurücksetzen
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              const trimmed = localValue.trim();
              if (!trimmed) {
                onSave(undefined);
              } else {
                onSave({
                  op: localOp,
                  value: trimmed,
                  style,
                });
              }
              setOpen(false);
            }}
          >
            Speichern
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function SmartTable<Row>({
  tableId,
  columns,
  rows,
  rowKey,
  loading = false,
  loadingText = "Lade Daten...",
  emptyText = "Keine Einträge gefunden.",
  defaultVisibleColumnIds,
  disableColumnManager = false,
  className,
}: SmartTableProps<Row>) {
  const columnIds = useMemo(() => columns.map((column) => column.id), [columns]);
  const initialVisible = useMemo(() => {
    const preferred =
      defaultVisibleColumnIds?.filter((id) => columnIds.includes(id)) ?? [];
    return preferred.length > 0 ? preferred : columnIds;
  }, [columnIds, defaultVisibleColumnIds]);

  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(() => {
    const stored = readStorage<unknown>(storageKey(tableId, "visible"), initialVisible);
    const normalized = normalizeStringArray(stored);
    return normalized.length > 0 ? normalized : initialVisible;
  });
  const [filters, setFilters] = useState<FilterState>(() =>
    readStorage<FilterState>(storageKey(tableId, "filters"), {}),
  );
  const [rules, setRules] = useState<RuleState>(() =>
    readStorage<RuleState>(storageKey(tableId, "rules"), {}),
  );
  const [tooltips, setTooltips] = useState<TooltipState>(() =>
    readStorage<TooltipState>(storageKey(tableId, "tooltips"), {}),
  );
  const [columnSearch, setColumnSearch] = useState<SearchState>(() =>
    readStorage<SearchState>(storageKey(tableId, "search"), {}),
  );
  const [sort, setSort] = useState<SortState>(() =>
    readStorage<SortState>(storageKey(tableId, "sort"), {
      columnId: null,
      direction: null,
    }),
  );
  const [draggingColumnId, setDraggingColumnId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);
  const [stickyColumnIds, setStickyColumnIds] = useState<string[]>(() => {
    const stored = readStorage<unknown>(storageKey(tableId, "sticky"), []);
    return normalizeStringArray(stored);
  });
  const headerCellRefs = useRef<Record<string, HTMLTableCellElement | null>>({});
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const stickyIds = useMemo(() => normalizeStringArray(stickyColumnIds), [stickyColumnIds]);

  useEffect(() => {
    const normalized = visibleColumnIds.filter((id) => columnIds.includes(id));
    if (normalized.length === 0) {
      setVisibleColumnIds(initialVisible);
      return;
    }
    if (
      normalized.length !== visibleColumnIds.length ||
      normalized.some((id, idx) => id !== visibleColumnIds[idx])
    ) {
      setVisibleColumnIds(normalized);
    }
  }, [columnIds, initialVisible, visibleColumnIds]);

  useEffect(() => {
    setStickyColumnIds((current) =>
      normalizeStringArray(current).filter((id) => columnIds.includes(id)),
    );
  }, [columnIds]);

  useEffect(() => {
    window.localStorage.setItem(storageKey(tableId, "visible"), JSON.stringify(visibleColumnIds));
  }, [tableId, visibleColumnIds]);

  useEffect(() => {
    window.localStorage.setItem(storageKey(tableId, "filters"), JSON.stringify(filters));
  }, [tableId, filters]);

  useEffect(() => {
    window.localStorage.setItem(storageKey(tableId, "rules"), JSON.stringify(rules));
  }, [tableId, rules]);

  useEffect(() => {
    window.localStorage.setItem(storageKey(tableId, "tooltips"), JSON.stringify(tooltips));
  }, [tableId, tooltips]);

  useEffect(() => {
    window.localStorage.setItem(storageKey(tableId, "search"), JSON.stringify(columnSearch));
  }, [tableId, columnSearch]);

  useEffect(() => {
    window.localStorage.setItem(storageKey(tableId, "sort"), JSON.stringify(sort));
  }, [tableId, sort]);

  useEffect(() => {
    window.localStorage.setItem(storageKey(tableId, "sticky"), JSON.stringify(stickyIds));
  }, [tableId, stickyIds]);

  const columnById = useMemo(
    () => new Map(columns.map((column) => [column.id, column] as const)),
    [columns],
  );

  const visibleColumns = useMemo(() => {
    const selected = visibleColumnIds
      .map((id) => columnById.get(id))
      .filter(Boolean) as SmartTableColumn<Row>[];
    if (selected.length > 0) {
      return selected;
    }
    return columns;
  }, [columnById, columns, visibleColumnIds]);

  useEffect(() => {
    const measure = () => {
      setColumnWidths((previous) => {
        const next: Record<string, number> = {};
        visibleColumns.forEach((column) => {
          const node = headerCellRefs.current[column.id];
          next[column.id] = node?.offsetWidth ?? previous[column.id] ?? 170;
        });

        const prevKeys = Object.keys(previous);
        const nextKeys = Object.keys(next);
        if (prevKeys.length !== nextKeys.length) {
          return next;
        }
        const changed = nextKeys.some((key) => previous[key] !== next[key]);
        return changed ? next : previous;
      });
    };

    const raf = window.requestAnimationFrame(measure);
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => measure());
      visibleColumns.forEach((column) => {
        const node = headerCellRefs.current[column.id];
        if (node) {
          observer?.observe(node);
        }
      });
    }

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
    };
  }, [visibleColumns]);

  const stickyOffsets = useMemo(() => {
    let left = 0;
    const map: Record<string, number> = {};
    visibleColumns.forEach((column) => {
      if (stickyIds.includes(column.id)) {
        map[column.id] = left;
        left += columnWidths[column.id] ?? 170;
      }
    });
    return map;
  }, [visibleColumns, stickyIds, columnWidths]);

  const groupedColumns = useMemo(() => {
    const groups = new Map<string, SmartTableColumn<Row>[]>();
    columns.forEach((column) => {
      const group = column.group || "Allgemein";
      const list = groups.get(group);
      if (list) {
        list.push(column);
      } else {
        groups.set(group, [column]);
      }
    });
    return Array.from(groups.entries());
  }, [columns]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      for (const [columnId, clause] of Object.entries(filters)) {
        if (!clause?.value) {
          continue;
        }
        const column = columnById.get(columnId);
        if (!column) {
          continue;
        }
        const value = column.accessor(row);
        if (!matchesOperator(clause.op, value, clause.value)) {
          return false;
        }
      }

      for (const [columnId, term] of Object.entries(columnSearch)) {
        const trimmed = String(term ?? "").trim();
        if (!trimmed) {
          continue;
        }
        const column = columnById.get(columnId);
        if (!column) {
          continue;
        }
        const value = column.accessor(row);
        if (!String(value ?? "").toLocaleLowerCase().includes(trimmed.toLocaleLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [rows, filters, columnSearch, columnById]);

  const sortedRows = useMemo(() => {
    if (!sort.columnId || !sort.direction) {
      return filteredRows;
    }
    const column = columnById.get(sort.columnId);
    if (!column) {
      return filteredRows;
    }
    return [...filteredRows].sort((a, b) => {
      const result = compareValues(column.accessor(a), column.accessor(b));
      return sort.direction === "asc" ? result : -result;
    });
  }, [filteredRows, sort, columnById]);

  const activeFilterCount = useMemo(
    () =>
      Object.values(filters).reduce(
        (count, clause) => count + (clause?.value ? 1 : 0),
        0,
      ),
    [filters],
  );
  const activeSearchCount = useMemo(
    () =>
      Object.values(columnSearch).reduce(
        (count, value) => count + (value?.trim() ? 1 : 0),
        0,
      ),
    [columnSearch],
  );

  const toggleSort = (columnId: string) => {
    setSort((current) => {
      if (current.columnId !== columnId) {
        return { columnId, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { columnId, direction: "desc" };
      }
      if (current.direction === "desc") {
        return { columnId: null, direction: null };
      }
      return { columnId, direction: "asc" };
    });
  };

  const toggleColumn = (columnId: string, checked: boolean) => {
    setVisibleColumnIds((current) => {
      if (checked) {
        if (current.includes(columnId)) return current;
        return [...current, columnId];
      }
      if (current.length <= 1) return current;
      return current.filter((id) => id !== columnId);
    });
  };

  const toggleStickyColumn = (columnId: string, checked: boolean) => {
    setStickyColumnIds((current) => {
      const safeCurrent = normalizeStringArray(current);
      if (checked) {
        if (safeCurrent.includes(columnId)) return safeCurrent;
        return [...safeCurrent, columnId];
      }
      return safeCurrent.filter((id) => id !== columnId);
    });
  };

  const moveColumn = (fromId: string, toId: string, side: "before" | "after") => {
    setVisibleColumnIds((current) => {
      if (!current.includes(fromId) || !current.includes(toId)) {
        return current;
      }

      const withoutDragged = current.filter((id) => id !== fromId);
      const targetIndex = withoutDragged.indexOf(toId);
      if (targetIndex < 0) {
        return current;
      }

      const insertIndex = side === "before" ? targetIndex : targetIndex + 1;
      withoutDragged.splice(insertIndex, 0, fromId);
      return withoutDragged;
    });
  };

  const getCellRuleStyle = (columnId: string, rawValue: unknown) => {
    const rule = rules[columnId];
    if (!rule?.value) {
      return undefined;
    }
    if (!matchesOperator(rule.op, rawValue, rule.value)) {
      return undefined;
    }

    const textDecoration: string[] = [];
    if (rule.style.underline) textDecoration.push("underline");
    if (rule.style.strike) textDecoration.push("line-through");

    return {
      color: rule.style.textColor,
      background: rule.style.bgColor,
      fontWeight: rule.style.bold ? 700 : undefined,
      fontStyle: rule.style.italic ? "italic" : undefined,
      textDecoration: textDecoration.length > 0 ? textDecoration.join(" ") : undefined,
    } as const;
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{sortedRows.length} Zeilen</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary">{activeFilterCount} Filter aktiv</Badge>
          )}
          {activeSearchCount > 0 && (
            <Badge variant="secondary">{activeSearchCount} Spaltensuche aktiv</Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {(activeFilterCount > 0 || activeSearchCount > 0) && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="gap-1"
              onClick={() => {
                setFilters({});
                setColumnSearch({});
              }}
            >
              <RotateCcw size={14} />
              Filter reset
            </Button>
          )}

          {!disableColumnManager && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" size="sm" variant="outline" className="gap-2">
                  <SlidersHorizontal size={14} />
                  Spalten
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                {groupedColumns.map(([group, groupColumns], index) => (
                  <div key={group}>
                    {index > 0 && <DropdownMenuSeparator />}
                    <DropdownMenuLabel>{group}</DropdownMenuLabel>
                    {groupColumns.map((column) => {
                      const checked = visibleColumnIds.includes(column.id);
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          checked={checked}
                          onCheckedChange={(next) =>
                            toggleColumn(column.id, next === true)
                          }
                          onSelect={(event) => event.preventDefault()}
                        >
                          {column.title}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => {
                const canSort = column.sortable !== false;
                const canFilter = column.filterable !== false;
                const canRule = column.ruleable !== false;
                const sortState =
                  sort.columnId === column.id ? sort.direction : null;
                const isDropTarget =
                  Boolean(draggingColumnId) &&
                  dropIndicator?.columnId === column.id &&
                  draggingColumnId !== column.id;
                const isSticky = stickyIds.includes(column.id);
                return (
                  <TableHead
                    key={column.id}
                    ref={(node) => {
                      headerCellRefs.current[column.id] = node;
                    }}
                    className={cn(
                      "relative min-w-[170px] border-r border-border align-top text-center last:border-r-0",
                      isDropTarget && "bg-sky-50",
                      column.headerClassName,
                    )}
                    onDragOver={(event) => {
                      if (!draggingColumnId) return;
                      event.preventDefault();
                      const rect = event.currentTarget.getBoundingClientRect();
                      const side =
                        event.clientX < rect.left + rect.width / 2
                          ? "before"
                          : "after";
                      setDropIndicator({ columnId: column.id, side });
                      event.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      if (draggingColumnId) {
                        const side =
                          dropIndicator?.columnId === column.id
                            ? dropIndicator.side
                            : "before";
                        moveColumn(draggingColumnId, column.id, side);
                      }
                      setDraggingColumnId(null);
                      setDropIndicator(null);
                    }}
                    style={{
                      position: isSticky ? "sticky" : undefined,
                      left: isSticky ? `${stickyOffsets[column.id] ?? 0}px` : undefined,
                      zIndex: isSticky ? 45 : undefined,
                      background: isSticky ? "hsl(var(--background))" : undefined,
                      boxShadow:
                        isDropTarget && dropIndicator
                          ? dropIndicator.side === "before"
                            ? "inset 4px 0 0 #0284c7"
                            : "inset -4px 0 0 #0284c7"
                          : undefined,
                    }}
                  >
                    <label
                      className="absolute right-1 top-1 z-20 inline-flex items-center"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSticky}
                        onChange={(event) =>
                          toggleStickyColumn(column.id, event.target.checked)
                        }
                        title="Sticky Spalte"
                        aria-label="Sticky Spalte"
                        className="h-3 w-3 cursor-pointer rounded-[2px] border border-border accent-sky-600"
                      />
                    </label>

                    <div className="flex flex-col items-center gap-2">
                      <button
                        type="button"
                        disabled={!canSort}
                        className={cn(
                          "flex min-w-0 items-center justify-center gap-2 text-center",
                          canSort ? "cursor-pointer" : "cursor-default",
                        )}
                        onClick={() => {
                          if (canSort) toggleSort(column.id);
                        }}
                      >
                        <span className="truncate">{column.title}</span>
                        {canSort &&
                          (sortState === "asc" ? (
                            <ArrowUp size={14} className="mt-[1px]" />
                          ) : sortState === "desc" ? (
                            <ArrowDown size={14} className="mt-[1px]" />
                          ) : (
                            <ArrowUpDown size={14} className="mt-[1px] text-muted-foreground" />
                          ))}
                      </button>

                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          aria-label="Spalte verschieben"
                          className="inline-flex h-7 w-7 items-center justify-center rounded border border-transparent text-muted-foreground hover:border-border hover:bg-muted/60"
                          draggable
                          onDragStart={(event) => {
                            setDraggingColumnId(column.id);
                            setDropIndicator(null);
                            event.dataTransfer.effectAllowed = "move";
                            event.dataTransfer.setData("text/plain", column.id);
                          }}
                          onDragEnd={() => {
                            setDraggingColumnId(null);
                            setDropIndicator(null);
                          }}
                        >
                          <GripVertical size={14} />
                        </button>
                        <SmartTooltipPopover
                          value={tooltips[column.id]}
                          fallback={column.tooltip}
                          tag={column.tag}
                          onSave={(next) =>
                            setTooltips((current) => ({ ...current, [column.id]: next }))
                          }
                          onReset={() =>
                            setTooltips((current) => ({ ...current, [column.id]: undefined }))
                          }
                        />

                        {canFilter && (
                          <ColumnFilterPopover
                            clause={filters[column.id]}
                            onApply={(next) =>
                              setFilters((current) => ({ ...current, [column.id]: next }))
                            }
                            onReset={() =>
                              setFilters((current) => ({ ...current, [column.id]: undefined }))
                            }
                          />
                        )}

                        {canRule && (
                          <ColumnRulePopover
                            rule={rules[column.id]}
                            onSave={(next) =>
                              setRules((current) => ({ ...current, [column.id]: next }))
                            }
                            onReset={() =>
                              setRules((current) => ({ ...current, [column.id]: undefined }))
                            }
                          />
                        )}
                      </div>
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
            <TableRow>
              {visibleColumns.map((column) => {
                const isSticky = stickyIds.includes(column.id);
                return (
                  <TableHead
                    key={`${column.id}:search`}
                    className="h-auto border-r border-border p-2 last:border-r-0"
                    style={{
                      position: isSticky ? "sticky" : undefined,
                      left: isSticky ? `${stickyOffsets[column.id] ?? 0}px` : undefined,
                      zIndex: isSticky ? 35 : undefined,
                      background: isSticky ? "hsl(var(--background))" : undefined,
                    }}
                  >
                    <Input
                      value={columnSearch[column.id] ?? ""}
                      onChange={(event) =>
                        setColumnSearch((current) => ({
                          ...current,
                          [column.id]: event.target.value,
                        }))
                      }
                      placeholder="Suchen..."
                      className="h-8 text-xs"
                    />
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={Math.max(1, visibleColumns.length)}
                  className="text-center text-muted-foreground"
                >
                  {loadingText}
                </TableCell>
              </TableRow>
            ) : sortedRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={Math.max(1, visibleColumns.length)}
                  className="text-center text-muted-foreground"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              sortedRows.map((row, index) => {
                const key = rowKey
                  ? rowKey(row, index)
                  : String((row as { id?: string })?.id ?? index);
                return (
                  <TableRow
                    key={key}
                    className={cn(index % 2 === 1 && "bg-muted/20")}
                  >
                    {visibleColumns.map((column) => {
                      const rawValue = column.accessor(row);
                      const cellStyle = getCellRuleStyle(column.id, rawValue);
                      const rendered = column.render
                        ? column.render(rawValue, row)
                        : defaultDisplay(rawValue);
                      const isSticky = stickyIds.includes(column.id);
                      const stickyBackground =
                        index % 2 === 1
                          ? "hsl(var(--muted) / 0.2)"
                          : "hsl(var(--background))";

                      return (
                        <TableCell
                          key={`${key}:${column.id}`}
                          style={{
                            position: isSticky ? "sticky" : undefined,
                            left: isSticky ? `${stickyOffsets[column.id] ?? 0}px` : undefined,
                            zIndex: isSticky ? 20 : undefined,
                            background: isSticky
                              ? (cellStyle?.background as string | undefined) ?? stickyBackground
                              : undefined,
                            ...cellStyle,
                          }}
                          className={cn(
                            "border-r border-border last:border-r-0",
                            alignmentClass(column.align),
                            column.cellClassName,
                          )}
                        >
                          {rendered}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
