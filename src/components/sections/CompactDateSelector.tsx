<<<<<<< HEAD
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface CompactDateSelectorProps {
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  periodType?: "daily" | "weekly" | "monthly" | "custom";
  onPeriodTypeChange?: (type: "daily" | "weekly" | "monthly" | "custom") => void;
  customDateRange?: { from: Date; to: Date } | null;
  onCustomDateRangeChange?: (range: { from: Date; to: Date } | null) => void;
  availableDates?: string[];
  disabled?: boolean;
}

export function CompactDateSelector({
  selectedDate = new Date(),
  onDateChange = () => {},
  periodType = "daily",
  onPeriodTypeChange = () => {},
  customDateRange = null,
  onCustomDateRangeChange = () => {},
  availableDates = [],
  disabled = false
}: CompactDateSelectorProps) {
  const [selectedType, setSelectedType] = useState<"day" | "week" | "month" | "custom">(
    periodType === "daily" ? "day" :
    periodType === "weekly" ? "week" :
    periodType === "monthly" ? "month" : "custom"
  );
  const [selectedDay, setSelectedDay] = useState<Date>(selectedDate);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    customDateRange ? { from: customDateRange.from, to: customDateRange.to } : undefined
  );
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  // Generate last 7 days, but only show available dates
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
  const availableDaysOnly = last7Days.filter(day => {
    const dateString = format(day, 'yyyy-MM-dd');
    return availableDates.length === 0 || availableDates.includes(dateString);
  });

  const getMonthAbbr = (date: Date) => {
    const months = ["GEN", "FEB", "MAR", "APR", "MAG", "GIU", "LUG", "AGO", "SET", "OTT", "NOV", "DIC"];
    return months[date.getMonth()];
  };

  const getDateDisplay = () => {
    switch (selectedType) {
      case "day":
        return format(selectedDay, "dd/MM");
      case "week":
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
        const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
        return `${format(weekStart, "dd/MM")} - ${format(weekEnd, "dd/MM")}`;
      case "month":
        const monthStart = startOfMonth(new Date());
        const monthEnd = endOfMonth(new Date());
        return `${format(monthStart, "dd/MM")} - ${format(monthEnd, "dd/MM")}`;
      case "custom":
        if (dateRange?.from && dateRange?.to) {
          return `${format(dateRange.from, "dd/MM")} - ${format(dateRange.to, "dd/MM")}`;
        }
        return "Seleziona range";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-lg font-semibold text-foreground font-mono">SELETTORE DATE</h3>
      
      <div className="flex items-center gap-6">
        {/* Day Boxes - Available dates only */}
        <div className="flex items-center gap-3">
          {availableDaysOnly.length > 0 ? (
            availableDaysOnly.map((day, index) => {
              const isSelected = selectedType === "day" && format(selectedDay, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (disabled) return;
                    setSelectedType("day");
                    setSelectedDay(day);
                    onDateChange(day);
                    onPeriodTypeChange("daily");
                  }}
                  disabled={disabled}
                  className={cn(
                    "flex flex-col items-center justify-center w-16 h-16 border-2 transition-all duration-200 hover:scale-105",
                    isSelected
                      ? "border-analytics-blue bg-analytics-blue/10"
                      : "border-dashboard-border bg-dashboard-surface/30 hover:border-analytics-blue/50"
                  )}
                >
                  <span className={cn(
                    "text-xl font-bold font-mono",
                    isSelected ? "text-analytics-blue" : "text-foreground"
                  )}>
                    {format(day, "dd")}
                  </span>
                  <span className={cn(
                    "text-xs font-mono",
                    isSelected ? "text-analytics-blue" : "text-muted-foreground"
                  )}>
                    {getMonthAbbr(day)}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="flex items-center justify-center w-full h-16 border-2 border-dashed border-analytics-red/30 bg-analytics-red/5">
              <span className="text-sm font-mono text-analytics-red">Nessuna data disponibile</span>
            </div>
          )}
        </div>

        {/* Quick Selection Buttons */}
        <div className="flex items-center gap-1 ml-6 bg-dashboard-surface border border-dashboard-border rounded-lg p-1">
          <button
            onClick={() => {
              if (disabled) return;
              setSelectedType("week");
              onPeriodTypeChange("weekly");
            }}
            disabled={disabled}
            className={cn(
              "px-4 py-2 text-sm font-medium font-mono rounded-md transition-all duration-200",
              selectedType === "week" 
                ? "bg-analytics-blue text-white shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-dashboard-surface-hover/50"
            )}
          >
            SETTIMANALE
          </button>
          
          <button
            onClick={() => {
              if (disabled) return;
              setSelectedType("month");
              onPeriodTypeChange("monthly");
            }}
            disabled={disabled}
            className={cn(
              "px-4 py-2 text-sm font-medium font-mono rounded-md transition-all duration-200 flex items-center gap-2",
              selectedType === "month" 
                ? "bg-analytics-blue text-white shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-dashboard-surface-hover/50"
            )}
          >
            MENSILE
          </button>

          {/* Custom Range Selector */}
          <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
            <PopoverTrigger asChild>
              <button
                onClick={() => {
                  if (disabled) return;
                  setSelectedType("custom");
                  onPeriodTypeChange("custom");
                }}
                disabled={disabled}
                className={cn(
                  "px-4 py-2 text-sm font-medium font-mono rounded-md transition-all duration-200 flex items-center gap-2",
                  selectedType === "custom" 
                    ? "bg-analytics-blue text-white shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-dashboard-surface-hover/50"
                )}
              >
                📅 CUSTOM
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  if (disabled) return;
                  setDateRange(range);
                  if (range?.from && range?.to) {
                    setSelectedType("custom");
                    onCustomDateRangeChange({ from: range.from, to: range.to });
                    onPeriodTypeChange("custom");
                    setIsCustomOpen(false);
                  }
                }}
                disabled={disabled ? () => true : undefined}
                numberOfMonths={2}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Current Selection Display */}
      <div className="text-sm text-muted-foreground font-mono">
        <span className="text-analytics-blue font-medium">Periodo selezionato:</span> {getDateDisplay()}
        {availableDates.length > 0 && (
          <div className="mt-1 text-xs">
            <span className="text-analytics-green">Date disponibili:</span> {availableDates.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
=======
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { CalendarDays } from "lucide-react";

interface CompactDateSelectorProps {
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  periodType?: "daily" | "weekly" | "monthly" | "custom";
  onPeriodTypeChange?: (type: "daily" | "weekly" | "monthly" | "custom") => void;
  customDateRange?: { from: Date; to: Date } | null;
  onCustomDateRangeChange?: (range: { from: Date; to: Date } | null) => void;
  availableDates?: string[];
  disabled?: boolean;
}

export function CompactDateSelector({
  selectedDate = new Date(),
  onDateChange = () => {},
  periodType = "daily",
  onPeriodTypeChange = () => {},
  customDateRange = null,
  onCustomDateRangeChange = () => {},
  availableDates = [],
  disabled = false
}: CompactDateSelectorProps) {
  const [selectedType, setSelectedType] = useState<"day" | "week" | "month" | "custom">(
    periodType === "daily" ? "day" :
    periodType === "weekly" ? "week" :
    periodType === "monthly" ? "month" : "custom"
  );
  const [selectedDay, setSelectedDay] = useState<Date>(selectedDate);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    customDateRange ? { from: customDateRange.from, to: customDateRange.to } : undefined
  );
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  // Generate last 7 days, but only show available dates
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
  const availableDaysOnly = last7Days.filter(day => {
    const dateString = format(day, 'yyyy-MM-dd');
    return availableDates.length === 0 || availableDates.includes(dateString);
  });

  const getMonthAbbr = (date: Date) => {
    const months = ["GEN", "FEB", "MAR", "APR", "MAG", "GIU", "LUG", "AGO", "SET", "OTT", "NOV", "DIC"];
    return months[date.getMonth()];
  };

  const getDateDisplay = () => {
    switch (selectedType) {
      case "day":
        return format(selectedDay, "dd/MM");
      case "week":
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
        const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
        return `${format(weekStart, "dd/MM")} - ${format(weekEnd, "dd/MM")}`;
      case "month":
        const monthStart = startOfMonth(new Date());
        const monthEnd = endOfMonth(new Date());
        return `${format(monthStart, "dd/MM")} - ${format(monthEnd, "dd/MM")}`;
      case "custom":
        if (dateRange?.from && dateRange?.to) {
          return `${format(dateRange.from, "dd/MM")} - ${format(dateRange.to, "dd/MM")}`;
        }
        return "Seleziona range";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-lg font-semibold text-foreground">SELETTORE DATE</h3>
      
      {/* Main Period Selector - Identical to reference image */}
      <div className="flex items-center bg-dashboard-surface/80 border border-dashboard-border rounded-lg overflow-hidden">
        <button
          onClick={() => {
            if (disabled) return;
            setSelectedType("day");
            onPeriodTypeChange("daily");
          }}
          disabled={disabled}
          className={cn(
            "px-6 py-3 text-sm font-semibold transition-all duration-200 flex-1 text-center",
            selectedType === "day" 
              ? "bg-primary text-primary-foreground" 
              : "bg-transparent text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground"
          )}
        >
          GIORNALIERO
        </button>
        
        <button
          onClick={() => {
            if (disabled) return;
            setSelectedType("week");
            onPeriodTypeChange("weekly");
          }}
          disabled={disabled}
          className={cn(
            "px-6 py-3 text-sm font-semibold transition-all duration-200 flex-1 text-center",
            selectedType === "week" 
              ? "bg-primary text-primary-foreground" 
              : "bg-transparent text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground"
          )}
        >
          SETTIMANALE
        </button>
        
        <button
          onClick={() => {
            if (disabled) return;
            setSelectedType("month");
            onPeriodTypeChange("monthly");
          }}
          disabled={disabled}
          className={cn(
            "px-6 py-3 text-sm font-semibold transition-all duration-200 flex-1 text-center",
            selectedType === "month" 
              ? "bg-primary text-primary-foreground" 
              : "bg-transparent text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground"
          )}
        >
          MENSILE
        </button>
        
        {/* Calendar Icon */}
        <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
          <PopoverTrigger asChild>
            <button
              onClick={() => {
                if (disabled) return;
                setSelectedType("custom");
                onPeriodTypeChange("custom");
              }}
              disabled={disabled}
              className="px-4 py-3 bg-transparent text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground transition-all duration-200 border-l border-dashboard-border"
            >
              <CalendarDays className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                if (disabled) return;
                setDateRange(range);
                if (range?.from && range?.to) {
                  setSelectedType("custom");
                  onCustomDateRangeChange({ from: range.from, to: range.to });
                  onPeriodTypeChange("custom");
                  setIsCustomOpen(false);
                }
              }}
              disabled={disabled ? () => true : undefined}
              numberOfMonths={2}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Day Selection - Only show for daily mode */}
      {selectedType === "day" && (
        <div className="flex items-center gap-3">
          {availableDaysOnly.length > 0 ? (
            availableDaysOnly.map((day, index) => {
              const isSelected = format(selectedDay, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (disabled) return;
                    setSelectedDay(day);
                    onDateChange(day);
                  }}
                  disabled={disabled}
                  className={cn(
                    "flex flex-col items-center justify-center w-16 h-16 border-2 transition-all duration-200 hover:scale-105",
                    isSelected
                      ? "border-analytics-blue bg-analytics-blue/10"
                      : "border-dashboard-border bg-dashboard-surface/30 hover:border-analytics-blue/50"
                  )}
                >
                  <span className={cn(
                    "text-xl font-bold",
                    isSelected ? "text-analytics-blue" : "text-foreground"
                  )}>
                    {format(day, "dd")}
                  </span>
                  <span className={cn(
                    "text-xs",
                    isSelected ? "text-analytics-blue" : "text-muted-foreground"
                  )}>
                    {getMonthAbbr(day)}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="flex items-center justify-center w-full h-16 border-2 border-dashed border-analytics-red/30 bg-analytics-red/5">
              <span className="text-sm text-analytics-red">Nessuna data disponibile</span>
            </div>
          )}
        </div>
      )}

      {/* Current Selection Display */}
      <div className="text-sm text-muted-foreground">
        <span className="text-analytics-blue font-medium">Periodo selezionato:</span> {getDateDisplay()}
        {availableDates.length > 0 && selectedType === "day" && (
          <div className="mt-1 text-xs">
            <span className="text-analytics-green">Date disponibili:</span> {availableDates.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
>>>>>>> 9d80c54135e1641109dff4efad49d7cdeb0d06de
}