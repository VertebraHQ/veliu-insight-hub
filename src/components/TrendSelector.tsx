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
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPeriodType("weekly")}
          className={cn(
            "text-xs px-4 py-3 h-auto rounded-none border border-dashboard-border bg-dashboard-surface",
            periodType === "weekly" 
              ? "bg-primary text-primary-foreground border-primary" 
              : "hover:bg-dashboard-surface-hover text-muted-foreground"
          )}
        >
          SETTIMANALE
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPeriodType("monthly")}
          className={cn(
            "text-xs px-4 py-3 h-auto rounded-none border border-dashboard-border bg-dashboard-surface",
            periodType === "monthly" 
              ? "bg-primary text-primary-foreground border-primary" 
              : "hover:bg-dashboard-surface-hover text-muted-foreground"
          )}
        >
          MENSILE
        </Button>
        <Popover open={isCustomDateOpen} onOpenChange={setIsCustomDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPeriodType("custom")}
              className={cn(
                "text-xs px-3 py-3 h-auto rounded-none border border-dashboard-border bg-dashboard-surface",
                periodType === "custom" 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "hover:bg-dashboard-surface-hover text-muted-foreground"
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
        <div className="text-xs text-muted-foreground">
          {format(customDateRange.from, "dd/MM")} - {format(customDateRange.to, "dd/MM")}
        </div>
      )}
    </div>
  );
}