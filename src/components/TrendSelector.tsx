import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { PeriodType, DateRange } from "@/hooks/useAnalyticsData";
import { DateRange as ReactDayPickerDateRange } from "react-day-picker";

interface TrendSelectorProps {
  periodType: PeriodType;
  onPeriodTypeChange: (type: PeriodType) => void;
  customDateRange: DateRange | null;
  onCustomDateRangeChange: (range: DateRange | null) => void;
  disabled?: boolean;
}

export function TrendSelector({
  periodType,
  onPeriodTypeChange,
  customDateRange,
  onCustomDateRangeChange,
  disabled = false
}: TrendSelectorProps) {
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<ReactDayPickerDateRange | undefined>(
    customDateRange ? { from: customDateRange.from, to: customDateRange.to } : undefined
  );

  const handlePeriodChange = (type: PeriodType) => {
    onPeriodTypeChange(type);
    if (type !== 'custom') {
      onCustomDateRangeChange(null);
    }
  };

  const handleCustomDateComplete = (range: ReactDayPickerDateRange | undefined) => {
    if (range?.from && range?.to) {
      onCustomDateRangeChange({
        from: range.from,
        to: range.to
      });
      setIsCustomDateOpen(false);
    }
    setTempDateRange(range);
  };

  const getPeriodDisplay = () => {
    const today = new Date();
    
    switch (periodType) {
      case "daily":
        return "Giornaliero";
      case "weekly":
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
        return `Settimana: ${format(weekStart, "dd/MM")} - ${format(weekEnd, "dd/MM")}`;
      case "monthly":
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        return `Mese: ${format(monthStart, "dd/MM")} - ${format(monthEnd, "dd/MM")}`;
      case "custom":
        if (customDateRange) {
          return `Custom: ${format(customDateRange.from, "dd/MM")} - ${format(customDateRange.to, "dd/MM")}`;
        }
        return "Custom: Seleziona periodo";
      default:
        return "";
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex bg-dashboard-surface border border-dashboard-border">
        <Button
          variant={periodType === "daily" ? "default" : "ghost"}
          size="sm"
          onClick={() => handlePeriodChange("daily")}
          disabled={disabled}
          className={cn(
            "text-xs px-4 py-2 border-0",
            periodType === "daily" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-accent-foreground"
          )}
        >
          GIORNALIERO
        </Button>
        <Button
          variant={periodType === "weekly" ? "default" : "ghost"}
          size="sm"
          onClick={() => handlePeriodChange("weekly")}
          disabled={disabled}
          className={cn(
            "text-xs px-4 py-2 border-0",
            periodType === "weekly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-accent-foreground"
          )}
        >
          SETTIMANALE
        </Button>
        <Button
          variant={periodType === "monthly" ? "default" : "ghost"}
          size="sm"
          onClick={() => handlePeriodChange("monthly")}
          disabled={disabled}
          className={cn(
            "text-xs px-4 py-2 border-0",
            periodType === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-accent-foreground"
          )}
        >
          MENSILE
        </Button>
        <Popover open={isCustomDateOpen} onOpenChange={setIsCustomDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={periodType === "custom" ? "default" : "ghost"}
              size="sm"
              onClick={() => handlePeriodChange("custom")}
              disabled={disabled}
              className={cn(
                "text-xs px-3 py-2 border-0",
                periodType === "custom" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-accent-foreground"
              )}
            >
              <CalendarIcon className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4 space-y-3">
              <div className="text-sm font-medium text-foreground">Seleziona Periodo Custom</div>
              <Calendar
                mode="range"
                selected={tempDateRange}
                onSelect={handleCustomDateComplete}
                numberOfMonths={2}
                className="p-3 pointer-events-auto"
              />
              <div className="text-xs text-muted-foreground">
                Seleziona data di inizio e fine per il periodo custom
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="text-xs text-muted-foreground min-w-0">
        <span className="font-medium text-analytics-blue">Periodo:</span> {getPeriodDisplay()}
      </div>
    </div>
  );
}