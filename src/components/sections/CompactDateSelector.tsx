import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

export function CompactDateSelector() {
  const [selectedType, setSelectedType] = useState<"day" | "week" | "month" | "custom">("day");
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  // Generate last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();

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
    <div className="flex flex-col space-y-3">
      <p className="text-sm font-medium text-foreground font-mono">SELETTORE DATE</p>
      
      {/* Single Day Selector - Last 7 days */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground font-mono mr-2">Ultimi 7 giorni:</span>
        {last7Days.map((day, index) => (
          <Button
            key={index}
            variant={selectedType === "day" && format(selectedDay, "yyyy-MM-dd") === format(day, "yyyy-MM-dd") ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedType("day");
              setSelectedDay(day);
            }}
            className={cn(
              "h-8 w-16 text-xs font-mono px-2 py-1",
              selectedType === "day" && format(selectedDay, "yyyy-MM-dd") === format(day, "yyyy-MM-dd") && "bg-analytics-blue text-white border-analytics-blue"
            )}
          >
            {format(day, "dd/MM")}
          </Button>
        ))}
      </div>

      {/* Quick Selection Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant={selectedType === "week" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedType("week")}
          className={cn(
            "text-xs font-mono px-3 py-2",
            selectedType === "week" && "bg-analytics-blue text-white border-analytics-blue"
          )}
        >
          Ultima Settimana
        </Button>
        
        <Button
          variant={selectedType === "month" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedType("month")}
          className={cn(
            "text-xs font-mono px-3 py-2",
            selectedType === "month" && "bg-analytics-blue text-white border-analytics-blue"
          )}
        >
          Ultimo Mese
        </Button>

        {/* Custom Range Selector */}
        <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={selectedType === "custom" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("custom")}
              className={cn(
                "text-xs font-mono px-3 py-2 gap-1",
                selectedType === "custom" && "bg-analytics-blue text-white border-analytics-blue"
              )}
            >
              <CalendarIcon className="h-3 w-3" />
              Periodo Custom
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                setDateRange(range);
                if (range?.from && range?.to) {
                  setSelectedType("custom");
                  setIsCustomOpen(false);
                }
              }}
              numberOfMonths={2}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Current Selection Display */}
      <div className="text-xs text-muted-foreground font-mono">
        <span className="text-analytics-blue">Periodo selezionato:</span> {getDateDisplay()}
      </div>
    </div>
  );
}