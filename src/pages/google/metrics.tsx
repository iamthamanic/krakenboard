
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BarChart3, MousePointer, DollarSign, Target, Calendar, Download, FileDown } from "lucide-react";
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

const GoogleMetrics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const handleExportPDF = () => {
    // PDF Export Logik hier implementieren
    toast.success('PDF Export erfolgreich');
  };

  const handleExportCSV = () => {
    // CSV Export Logik hier implementieren
    toast.success('CSV Export erfolgreich');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Performance Metrics</h1>
              <p className="text-muted-foreground">
                Detaillierte Performance Metriken deiner Google Ads
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
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Impressionen"
            value="125,430"
            icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
            description="Letzte 30 Tage"
          />
          <StatsCard
            title="Klicks"
            value="4,321"
            icon={<MousePointer className="h-4 w-4 text-muted-foreground" />}
            description="Letzte 30 Tage"
          />
          <StatsCard
            title="Cost per Click"
            value="€0.45"
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            description="Durchschnittlich"
          />
          <StatsCard
            title="Conversion Rate"
            value="2.8%"
            icon={<Target className="h-4 w-4 text-muted-foreground" />}
            description="Durchschnittlich"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GoogleMetrics;
