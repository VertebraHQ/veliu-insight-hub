import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
        {/* Day Boxes - Last 7 days */}
        <div className="flex items-center gap-3">
          {last7Days.map((day, index) => {
            const isSelected = selectedType === "day" && format(selectedDay, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedType("day");
                  setSelectedDay(day);
                }}
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
          })}
        </div>

        {/* Quick Selection Buttons */}
        <div className="flex items-center gap-3 ml-6">
          <Button
            variant={selectedType === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("week")}
            className={cn(
              "text-sm font-mono px-4 py-2",
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
              "text-sm font-mono px-4 py-2",
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
                  "text-sm font-mono px-4 py-2 gap-2",
                  selectedType === "custom" && "bg-analytics-blue text-white border-analytics-blue"
                )}
              >
                📅 Periodo Custom
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
      </div>

      {/* Current Selection Display */}
      <div className="text-sm text-muted-foreground font-mono">
        <span className="text-analytics-blue font-medium">Periodo selezionato:</span> {getDateDisplay()}
      </div>
    </div>
  );
}