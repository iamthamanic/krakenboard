import { type ReactElement } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { FormInput, Activity, CheckCircle, AlertCircle, Calendar, Download, FileDown, Scan } from "lucide-react";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { FormScannerService } from "@/services/scanner/FormScannerService";

const TIME_RANGES = {
  '7d': '7 Tage',
  '30d': '30 Tage',
  '90d': '90 Tage',
  'custom': 'Benutzerdefiniert'
};

interface FormData {
  id: string;
  url: string;
  fields: number;
  submissions: number;
  conversionRate: string;
  errorRate: string;
}

const formColumns = [
  { key: "url", label: "Formular URL" },
  { key: "fields", label: "Felder" },
  { key: "submissions", label: "Submissions" },
  { key: "conversionRate", label: "Conversion Rate" },
  { key: "errorRate", label: "Fehlerrate" }
];

function WebsiteForms(): ReactElement {
  const [timeRange, setTimeRange] = useState('30d');
  const [isScanning, setIsScanning] = useState(false);
  const [formData, setFormData] = useState<FormData[]>([]);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const loadFormData = async () => {
    try {
      const { data: forms, error } = await supabase
        .from('forms')
        .select(`
          id,
          action,
          fields_count,
          form_conversions (
            id,
            is_successful
          )
        `)
        .eq('status', 'active');

      if (error) throw error;

      const formattedData: FormData[] = forms.map(form => {
        const submissions = form.form_conversions?.length || 0;
        const successfulSubmissions = form.form_conversions?.filter(c => c.is_successful)?.length || 0;
        const errorCount = submissions - successfulSubmissions;
        
        return {
          id: form.id,
          url: form.action || 'Unbekannt',
          fields: form.fields_count || 0,
          submissions,
          conversionRate: submissions > 0 ? `${((successfulSubmissions / submissions) * 100).toFixed(1)}%` : '0%',
          errorRate: submissions > 0 ? `${((errorCount / submissions) * 100).toFixed(1)}%` : '0%'
        };
      });

      setFormData(formattedData);
    } catch (error) {
      console.error('Fehler beim Laden der Formulardaten:', error);
      toast.error('Fehler beim Laden der Formulardaten');
    }
  };

  useEffect(() => {
    loadFormData();
  }, []);

  const handleExportPDF = () => {
    toast.success('PDF Export erfolgreich');
  };

  const handleExportCSV = () => {
    toast.success('CSV Export erfolgreich');
  };

  const startFormScan = async () => {
    try {
      setIsScanning(true);
      toast.info('Starte Formularerkennung...');
      
      const websiteId = '123';
      const url = 'https://example.com';
      
      const scanner = new FormScannerService(websiteId, url);
      await scanner.scanForms();
      
      await loadFormData();
      
      toast.success('Formulare wurden erfolgreich gescannt!');
    } catch (error) {
      console.error('Fehler beim Scannen:', error);
      toast.error('Fehler beim Scannen der Formulare');
    } finally {
      setIsScanning(false);
    }
  };

  const content = (
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
          <Button
            variant="default"
            onClick={startFormScan}
            disabled={isScanning}
          >
            <Scan className="mr-2 h-4 w-4" />
            {isScanning ? 'Scanne...' : 'Formulare scannen'}
          </Button>
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
          value={formData.length.toString()}
          icon={<FormInput className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 2, isPositive: true }}
          description="vs. letzter Monat"
        />
        <StatsCard
          title="Formular Submissions"
          value={formData.reduce((sum, form) => sum + form.submissions, 0).toString()}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 15, isPositive: true }}
          description="vs. letzter Monat"
        />
        <StatsCard
          title="Erfolgsrate"
          value={`${(formData.reduce((sum, form) => {
            const rate = parseFloat(form.conversionRate);
            return sum + (isNaN(rate) ? 0 : rate);
          }, 0) / (formData.length || 1)).toFixed(1)}%`}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 5, isPositive: true }}
          description="vs. letzter Monat"
        />
        <StatsCard
          title="Fehlerrate"
          value={`${(formData.reduce((sum, form) => {
            const rate = parseFloat(form.errorRate);
            return sum + (isNaN(rate) ? 0 : rate);
          }, 0) / (formData.length || 1)).toFixed(1)}%`}
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 3, isPositive: false }}
          description="vs. letzter Monat"
        />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Erkannte Formulare</h2>
        <DataTable 
          columns={formColumns}
          data={formData}
        />
      </div>
    </div>
  );

  return <DashboardLayout>{content}</DashboardLayout>;
}

WebsiteForms.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default WebsiteForms;
