import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function TrendSelector() {
  const [periodType, setPeriodType] = useState<"weekly" | "monthly" | "custom">("weekly");
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);

  return (
    <div className="flex items-center space-x-4">
      <div className="flex bg-dashboard-surface border border-dashboard-border">
        <Button
          variant={periodType === "weekly" ? "default" : "ghost"}
          size="sm"
          onClick={() => setPeriodType("weekly")}
          className={cn(
            "font-mono text-xs px-4 py-2 border-0",
            periodType === "weekly" && "bg-analytics-blue text-white"
          )}
        >
          SETTIMANALE
        </Button>
        <Button
          variant={periodType === "monthly" ? "default" : "ghost"}
          size="sm"
          onClick={() => setPeriodType("monthly")}
          className={cn(
            "font-mono text-xs px-4 py-2 border-0",
            periodType === "monthly" && "bg-analytics-blue text-white"
          )}
        >
          MENSILE
        </Button>
        <Popover open={isCustomDateOpen} onOpenChange={setIsCustomDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={periodType === "custom" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPeriodType("custom")}
              className={cn(
                "font-mono text-xs px-3 py-2 border-0",
                periodType === "custom" && "bg-analytics-blue text-white"
              )}
            >
              <CalendarIcon className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4 space-y-3">
              <div className="text-sm font-medium text-foreground">Seleziona Periodo Custom</div>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground">Data Inizio</label>
                  <Calendar
                    mode="single"
                    selected={customDateRange.from}
                    onSelect={(date) => setCustomDateRange(prev => ({ ...prev, from: date }))}
                    className="p-3 pointer-events-auto"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Data Fine</label>
                  <Calendar
                    mode="single"
                    selected={customDateRange.to}
                    onSelect={(date) => {
                      setCustomDateRange(prev => ({ ...prev, to: date }));
                      if (date && customDateRange.from) {
                        setIsCustomDateOpen(false);
                      }
                    }}
                    className="p-3 pointer-events-auto"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {periodType === "custom" && customDateRange.from && customDateRange.to && (
        <div className="text-xs text-muted-foreground font-mono">
          {format(customDateRange.from, "dd/MM")} - {format(customDateRange.to, "dd/MM")}
        </div>
      )}
    </div>
  );
}