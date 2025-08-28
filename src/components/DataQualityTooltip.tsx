import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DataQualityTooltipProps {
  value: string;
}

export function DataQualityTooltip({ value }: DataQualityTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="flex items-center space-x-2">
          <span className="text-3xl font-bold text-card-foreground font-mono">{value}</span>
          <Info className="h-4 w-4 text-muted-foreground hover:text-analytics-blue transition-colors" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs z-50 bg-popover border border-border shadow-lg backdrop-blur-md">
          <div className="space-y-2 text-xs">
            <p className="font-medium">Data Quality Complessiva</p>
            <p>Indica la qualità generale dei dati raccolti, basata su completezza, accuratezza e affidabilità delle informazioni analitiche.</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}