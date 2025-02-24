import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { FormInput, Activity, CheckCircle, AlertCircle, Calendar, Download, FileDown } from "lucide-react";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

const TIME_RANGES = {
  '7d': '7 Tage',
  '30d': '30 Tage',
  '90d': '90 Tage',
  'custom': 'Benutzerdefiniert'
};

const mockFormData = [
  {
    url: "/kontakt",
    fields: 5,
    submissions: 45,
    conversionRate: "8.2%",
    errorRate: "2.1%"
  },
  {
    url: "/newsletter",
    fields: 2,
    submissions: 128,
    conversionRate: "12.4%",
    errorRate: "1.8%"
  },
  {
    url: "/demo-anfrage",
    fields: 7,
    submissions: 23,
    conversionRate: "15.2%",
    errorRate: "3.5%"
  }
];

const formColumns = [
  { key: "url", label: "Formular URL" },
  { key: "fields", label: "Felder" },
  { key: "submissions", label: "Submissions" },
  { key: "conversionRate", label: "Conversion Rate" },
  { key: "errorRate", label: "Fehlerrate" }
];

const WebsiteForms = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const handleExportPDF = () => {
    toast.success('PDF Export erfolgreich');
  };

  const handleExportCSV = () => {
    toast.success('CSV Export erfolgreich');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Form Analytics</h1>
            <p className="text-muted-foreground">
              Analyse aller erkannten Formulare und deren Performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            {timeRange === 'custom' ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd.MM.yyyy", { locale: de })} -{" "}
                          {format(dateRange.to, "dd.MM.yyyy", { locale: de })}
                        </>
                      ) : (
                        format(dateRange.from, "dd.MM.yyyy", { locale: de })
                      )
                    ) : (
                      "Zeitraum wählen"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                    numberOfMonths={2}
                    locale={de}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Zeitraum wählen" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TIME_RANGES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Accordion type="single" collapsible className="w-[200px]">
              <AccordionItem value="export">
                <AccordionTrigger className="hover:no-underline px-4 py-2 bg-background border rounded-md">
                  Export
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2 pt-2">
                    <Button onClick={handleExportPDF} variant="ghost" className="justify-start">
                      <FileDown className="mr-2 h-4 w-4" />
                      Als PDF exportieren
                    </Button>
                    <Button onClick={handleExportCSV} variant="ghost" className="justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Als CSV exportieren
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Aktive Formulare"
            value="18"
            icon={<FormInput className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 2, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Formular Submissions"
            value="234"
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 15, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Erfolgsrate"
            value="89%"
            icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 5, isPositive: true }}
            description="vs. letzter Monat"
          />
          <StatsCard
            title="Fehlerrate"
            value="11%"
            icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 3, isPositive: false }}
            description="vs. letzter Monat"
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Erkannte Formulare</h2>
          <DataTable 
            columns={formColumns}
            data={mockFormData}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteForms;
