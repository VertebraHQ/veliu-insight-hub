import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  availableDates?: string[];
  disabled?: boolean;
}

export function DateSelector({
  selectedDate,
  onDateChange,
  availableDates = [],
  disabled = false
}: DateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isDateAvailable = (date: Date) => {
    if (availableDates.length === 0) return true;
    const dateString = format(date, 'yyyy-MM-dd');
    return availableDates.includes(dateString);
  };

  return (
    <div className="flex flex-col space-y-2">
      <p className="text-sm font-medium text-foreground">Selettore Date</p>
      <div className="flex items-center space-x-2">
        <p className="text-xs text-muted-foreground">Seleziona data esatta:</p>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-40 justify-start text-left font-normal"
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, "dd/MM/yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(newDate) => {
                if (newDate && isDateAvailable(newDate)) {
                  onDateChange(newDate);
                  setIsOpen(false);
                }
              }}
              disabled={(date) => !isDateAvailable(date)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      {availableDates.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Date disponibili: {availableDates.length}
        </p>
      )}
    </div>
  );
}