
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangeSelectorProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
  dateRange: {
    from: Date | undefined;
    to?: Date | undefined;
  };
  setDateRange: (range: { from: Date | undefined; to?: Date | undefined; }) => void;
  timeRanges: Record<string, string>;
}

export const DateRangeSelector = ({
  timeRange,
  setTimeRange,
  dateRange,
  setDateRange,
  timeRanges
}: DateRangeSelectorProps) => {
  return (
    <>
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
            {Object.entries(timeRanges).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
  );
};
