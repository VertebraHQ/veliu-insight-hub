import { useState } from "react";
import { KPICard } from "@/components/KPICard";
import { DateSelector } from "@/components/DateSelector";
import { CompactDateSelector } from "@/components/sections/CompactDateSelector";
import { ArrowLeft, MousePointer, Eye, Navigation, Activity, Maximize2, Monitor, Smartphone, Tablet, Bug, AlertTriangle, Home, Package, Phone, Users, FileText, BookOpen, ArrowRight, ChevronDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface UXSectionProps {
  onBack: () => void;
}

const deviceData = [
  { name: 'Desktop', value: 60 },
  { name: 'Mobile', value: 30 },
  { name: 'Tablet', value: 10 },
];

const osData = [
  { name: 'Windows', value: 45 },
  { name: 'macOS', value: 25 },
  { name: 'Android', value: 20 },
  { name: 'iOS', value: 10 },
];

const browserData = [
  { name: 'Chrome', value: 50 },
  { name: 'Safari', value: 25 },
  { name: 'Firefox', value: 15 },
  { name: 'Edge', value: 10 },
];

const regionData = [
  { name: 'Lombardia', value: 35 },
  { name: 'Lazio', value: 18 },
  { name: 'Veneto', value: 12 },
  { name: 'Emilia-Romagna', value: 10 },
  { name: 'Toscana', value: 8 },
  { name: 'Piemonte', value: 7 },
  { name: 'Altri', value: 10 },
];

const qualityScores = [
  { name: "Good", value: 35, color: "analytics-green" },
  { name: "Neutral", value: 25, color: "analytics-orange" },
  { name: "Bad", value: 40, color: "analytics-red" },
];

const userPaths = [
  { 
    id: 1, 
    path: ["Home", "Prodotti", "Checkout"], 
    occurrences: 145, 
    completionRate: 78,
    size: "large"
  },
  { 
    id: 2, 
    path: ["Home", "Chi siamo", "Contatti"], 
    occurrences: 89, 
    completionRate: 92,
    size: "medium"
  },
  { 
    id: 3, 
    path: ["Blog", "Prodotti", "Home"], 
    occurrences: 67, 
    completionRate: 45,
    size: "medium"
  },
  { 
    id: 4, 
    path: ["Prodotti", "Carrello", "Checkout"], 
    occurrences: 56, 
    completionRate: 85,
    size: "small"
  },
  { 
    id: 5, 
    path: ["Home", "Blog", "Home"], 
    occurrences: 34, 
    completionRate: 67,
    size: "small"
  },
];

const pathMetrics = [
  { title: "Pagine per Sessione", value: "4.1", color: "blue" },
  { title: "Tempo Medio", value: "2:34", color: "green" },
  { title: "Completamento Percorso", value: "74%", color: "orange" },
];

export function UXSection({ onBack }: UXSectionProps) {
  const [distributionTab, setDistributionTab] = useState<"device" | "os" | "browser">("device");
  const [heatmapDevice, setHeatmapDevice] = useState<"desktop" | "mobile" | "tablet">("desktop");
  const [isHeatmapFullscreen, setIsHeatmapFullscreen] = useState(false);
  const [isWeightConfigOpen, setIsWeightConfigOpen] = useState(false);

  const getDistributionData = () => {
    switch (distributionTab) {
      case "os": return osData;
      case "browser": return browserData;
      default: return deviceData;
    }
  };

  const renderPathBlock = (path: any) => {
    const sizeClasses = {
      large: "col-span-2 row-span-2 p-6",
      medium: "col-span-1 row-span-1 p-4",
      small: "col-span-1 row-span-1 p-3"
    };

    return (
      <div key={path.id} className={cn(
        "bg-dashboard-surface/60 border border-dashboard-border dashboard-card relative group",
        sizeClasses[path.size as keyof typeof sizeClasses]
      )}>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {path.path.map((step: string, index: number) => (
              <div key={index} className="flex items-center">
                <div className="px-3 py-1 bg-analytics-blue/20 text-analytics-blue text-xs font-mono border border-analytics-blue/30">
                  {step}
                </div>
                {index < path.path.length - 1 && (
                  <div className="relative mx-2 group/arrow">
                    <div className="text-muted-foreground">→</div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card border px-2 py-1 text-xs opacity-0 group-hover/arrow:opacity-100 transition-opacity">
                      68%<br/>
                      <span className="text-xs text-muted-foreground">{Math.round(path.occurrences * 0.68)} utenti</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground font-mono">{path.occurrences} occorrenze</div>
            <div className="flex items-center space-x-2">
              <Progress value={path.completionRate} className="flex-1 h-1" />
              <span className="text-xs font-mono text-analytics-green">{path.completionRate}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-foreground font-mono tracking-tight">ANALISI UX</h2>
            <p className="text-muted-foreground font-mono">Esperienza utente e heatmaps</p>
          </div>
        </div>
        <DateSelector />
      </div>

      {/* Compact Date Selector */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <CompactDateSelector />
      </div>

      {/* 1. Quality Scores */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold font-mono">QUALITY SCORE</h3>
          <Popover open={isWeightConfigOpen} onOpenChange={setIsWeightConfigOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center space-x-2 px-3 py-2 bg-dashboard-surface/80 border border-dashboard-border text-sm font-medium text-muted-foreground hover:bg-dashboard-surface-hover/80 hover:text-foreground transition-all duration-150 apple-button">
                <Settings className="h-4 w-4" />
                <span>Configura Pesi</span>
              </button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[900px] p-0 border border-border shadow-2xl z-50" 
              align="end"
              alignOffset={-500}
              sideOffset={8}
            >
              <div className="bg-background/12 rounded-lg p-8">
                <div className="mb-8">
                  <h4 className="text-xl font-bold mb-2">Configurazione Pesi Metriche</h4>
                  <p className="text-muted-foreground">Seleziona un valore da 0% a 30% per ogni variabile</p>
                </div>
                
                <div className="grid grid-cols-3 gap-8 mb-8">
                  {/* First Column */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Scroll Depth</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          min="0" 
                          max="30" 
                          defaultValue="10" 
                          className="h-10 text-base pr-8"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                      </div>
                      <p className="text-sm text-analytics-blue">Positive (10%)</p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Successful Interactions</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          min="0" 
                          max="30" 
                          defaultValue="20" 
                          className="h-10 text-base pr-8"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                      </div>
                      <p className="text-sm text-analytics-blue">Positive (20%)</p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Console Errors</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          min="0" 
                          max="30" 
                          defaultValue="5" 
                          className="h-10 text-base pr-8"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                      </div>
                      <p className="text-sm text-red-500">Negative (-5%)</p>
                    </div>
                  </div>

                  {/* Second Column */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Session Duration</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          min="0" 
                          max="30" 
                          defaultValue="15" 
                          className="h-10 text-base pr-8"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                      </div>
                      <p className="text-sm text-analytics-blue">Positive (15%)</p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Funnel Step Completion Rate</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          min="0" 
                          max="30" 
                          defaultValue="15" 
                          className="h-10 text-base pr-8"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                      </div>
                      <p className="text-sm text-analytics-blue">Positive (15%)</p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Exit On Error</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          min="0" 
                          max="30" 
                          defaultValue="15" 
                          className="h-10 text-base pr-8"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                      </div>
                      <p className="text-sm text-red-500">Negative (-15%)</p>
                    </div>
                  </div>

                  {/* Third Column */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Pages Per Session</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          min="0" 
                          max="30" 
                          defaultValue="10" 
                          className="h-10 text-base pr-8"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                      </div>
                      <p className="text-sm text-analytics-blue">Positive (10%)</p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Rage Clicks</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          min="0" 
                          max="30" 
                          defaultValue="10" 
                          className="h-10 text-base pr-8"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                      </div>
                      <p className="text-sm text-red-500">Negative (-10%)</p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Fast Bounce</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          min="0" 
                          max="30" 
                          defaultValue="10" 
                          className="h-10 text-base pr-8"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                      </div>
                      <p className="text-sm text-red-500">Negative (-10%)</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-6 border-t border-border">
                  <Button variant="outline" onClick={() => setIsWeightConfigOpen(false)}>
                    Annulla
                  </Button>
                  <Button onClick={() => setIsWeightConfigOpen(false)}>
                    Salva Configurazione
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-4">
          {qualityScores.map((score, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono">{score.name}</span>
                <span className={`font-bold font-mono text-${score.color}`}>{score.value}%</span>
              </div>
              <Progress value={score.value} className="h-2" />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Click Analytics & Heatmap */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono">CLICK ANALYTICS</h3>
        <KPICard
          title="CLICK TOTALI SITO"
          value="3,540"
          subtitle="nelle ultime 24 ore"
          icon={MousePointer}
          color="blue"
        />
      </div>

      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold font-mono">HEATMAP INTERATTIVA</h3>
          <div className="flex items-center space-x-2">
            <div className="flex bg-dashboard-surface border border-dashboard-border">
              {[
                { id: "desktop", icon: Monitor, label: "Desktop" },
                { id: "mobile", icon: Smartphone, label: "Mobile" },
                { id: "tablet", icon: Tablet, label: "Tablet" }
              ].map((device) => {
                const Icon = device.icon;
                return (
                  <Button
                    key={device.id}
                    variant={heatmapDevice === device.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setHeatmapDevice(device.id as any)}
                    className={cn(
                      "font-mono text-xs px-3 py-2 border-0",
                      heatmapDevice === device.id && "bg-analytics-blue text-white"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                  </Button>
                );
              })}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsHeatmapFullscreen(!isHeatmapFullscreen)}
              className="font-mono text-xs"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className={cn(
          "border border-dashboard-border bg-gradient-to-br from-analytics-blue/10 via-analytics-green/10 to-analytics-orange/10 overflow-auto",
          isHeatmapFullscreen ? "fixed inset-4 z-50 h-[calc(100vh-2rem)]" : "h-[700px]"
        )}>
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src="/lovable-uploads/d0679451-ad4a-45d9-b37b-4c675eff3885.png" 
              alt="VELIU Analytics Interface" 
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
        
        {isHeatmapFullscreen && (
          <Button
            variant="ghost"
            onClick={() => setIsHeatmapFullscreen(false)}
            className="fixed top-8 right-8 z-50 font-mono"
          >
            ✕ CHIUDI
          </Button>
        )}
      </div>

      {/* 3. Analisi Path Utenti - New Design */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono">ANALISI PATH UTENTI</h3>
        
        {/* Path Metrics above */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-dashboard-surface/30 border border-dashboard-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-muted-foreground">Pagine per Sessione</span>
              <Navigation className="h-4 w-4 text-analytics-blue" />
            </div>
            <span className="font-bold text-2xl font-mono text-analytics-blue">2.4</span>
          </div>
          <div className="bg-dashboard-surface/30 border border-dashboard-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-muted-foreground">Tempo Medio</span>
              <Activity className="h-4 w-4 text-analytics-green" />
            </div>
            <span className="font-bold text-2xl font-mono text-analytics-green">2m 34s</span>
          </div>
          <div className="bg-dashboard-surface/30 border border-dashboard-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-muted-foreground">Completamento Percorso</span>
              <Eye className="h-4 w-4 text-analytics-orange" />
            </div>
            <span className="font-bold text-2xl font-mono text-analytics-orange">68%</span>
          </div>
        </div>

        {/* Percorso Principale - Blocchi grandi */}
        <div className="mb-16">
          <h4 className="text-lg font-mono text-foreground mb-8 text-center">Percorso Principale (25% utenti)</h4>
          <div className="flex items-center justify-center gap-6">
            <div className="border-2 border-white p-8 w-48 h-40 flex flex-col items-center justify-center rounded-2xl">
              <Home className="h-12 w-12 text-orange-500 mb-3" />
              <span className="text-lg font-semibold text-blue-400 mb-1">Homepage</span>
              <span className="text-base text-blue-400 font-medium">100%</span>
            </div>
            <div className="relative group flex flex-col items-center">
              <ArrowRight className="h-8 w-8 text-gray-600 mb-2" />
              <span className="text-lg font-semibold text-gray-700">68%</span>
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-popover border border-border px-3 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="font-mono text-analytics-blue">68%</div>
                <div className="text-xs text-muted-foreground">850 utenti</div>
              </div>
            </div>
            <div className="border-2 border-white p-8 w-48 h-40 flex flex-col items-center justify-center rounded-2xl">
              <Package className="h-12 w-12 text-amber-600 mb-3" />
              <span className="text-lg font-semibold text-blue-400 mb-1">Prodotti</span>
              <span className="text-base text-blue-400 font-medium">68%</span>
            </div>
            <div className="relative group flex flex-col items-center">
              <ArrowRight className="h-8 w-8 text-gray-600 mb-2" />
              <span className="text-lg font-semibold text-gray-700">37%</span>
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-popover border border-border px-3 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="font-mono text-analytics-blue">37%</div>
                <div className="text-xs text-muted-foreground">315 utenti</div>
              </div>
            </div>
            <div className="border-2 border-white p-8 w-48 h-40 flex flex-col items-center justify-center rounded-2xl">
              <Phone className="h-12 w-12 text-pink-500 mb-3" />
              <span className="text-lg font-semibold text-blue-400 mb-1">Contatti</span>
              <span className="text-base text-blue-400 font-medium">25%</span>
            </div>
          </div>
        </div>

        {/* Percorso Informativo - Blocchi medi */}
        <div className="mb-16">
          <h4 className="text-lg font-mono text-foreground mb-8 text-center">Percorso Informativo (18% utenti)</h4>
          <div className="flex items-center justify-center gap-4">
            <div className="border-2 border-white p-6 w-36 h-30 flex flex-col items-center justify-center rounded-2xl">
              <Home className="h-9 w-9 text-orange-500 mb-2" />
              <span className="text-base font-semibold text-blue-400 mb-1">Homepage</span>
              <span className="text-sm text-blue-400 font-medium">100%</span>
            </div>
            <div className="relative group flex flex-col items-center">
              <ArrowRight className="h-6 w-6 text-gray-600 mb-2" />
              <span className="text-base font-semibold text-gray-700">75%</span>
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-popover border border-border px-3 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="font-mono text-analytics-blue">75%</div>
                <div className="text-xs text-muted-foreground">675 utenti</div>
              </div>
            </div>
            <div className="border-2 border-white p-6 w-36 h-30 flex flex-col items-center justify-center rounded-2xl">
              <Users className="h-9 w-9 text-purple-500 mb-2" />
              <span className="text-base font-semibold text-blue-400 mb-1">Chi Siamo</span>
              <span className="text-sm text-blue-400 font-medium">75%</span>
            </div>
            <div className="relative group flex flex-col items-center">
              <ArrowRight className="h-6 w-6 text-gray-600 mb-2" />
              <span className="text-base font-semibold text-gray-700">45%</span>
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-popover border border-border px-3 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="font-mono text-analytics-blue">45%</div>
                <div className="text-xs text-muted-foreground">405 utenti</div>
              </div>
            </div>
            <div className="border-2 border-white p-6 w-36 h-30 flex flex-col items-center justify-center rounded-2xl">
              <FileText className="h-9 w-9 text-green-500 mb-2" />
              <span className="text-base font-semibold text-blue-400 mb-1">Blog</span>
              <span className="text-sm text-blue-400 font-medium">45%</span>
            </div>
          </div>
        </div>

        {/* Percorso Contenuti - Blocchi piccoli */}
        <div className="mb-16">
          <h4 className="text-lg font-mono text-foreground mb-8 text-center">Percorso Contenuti (15% utenti)</h4>
          <div className="flex items-center justify-center gap-4">
            <div className="border-2 border-white p-4 w-28 h-24 flex flex-col items-center justify-center rounded-2xl">
              <Home className="h-7 w-7 text-orange-500 mb-1" />
              <span className="text-sm font-semibold text-blue-400 mb-1">Homepage</span>
              <span className="text-xs text-blue-400 font-medium">100%</span>
            </div>
            <div className="relative group flex flex-col items-center">
              <ArrowRight className="h-5 w-5 text-gray-600 mb-1" />
              <span className="text-sm font-semibold text-gray-700">80%</span>
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-popover border border-border px-3 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="font-mono text-analytics-blue">80%</div>
                <div className="text-xs text-muted-foreground">600 utenti</div>
              </div>
            </div>
            <div className="border-2 border-white p-4 w-28 h-24 flex flex-col items-center justify-center rounded-2xl">
              <FileText className="h-7 w-7 text-green-500 mb-1" />
              <span className="text-sm font-semibold text-blue-400 mb-1">Blog</span>
              <span className="text-xs text-blue-400 font-medium">80%</span>
            </div>
            <div className="relative group flex flex-col items-center">
              <ArrowRight className="h-5 w-5 text-gray-600 mb-1" />
              <span className="text-sm font-semibold text-gray-700">35%</span>
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-popover border border-border px-3 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="font-mono text-analytics-blue">35%</div>
                <div className="text-xs text-muted-foreground">210 utenti</div>
              </div>
            </div>
            <div className="border-2 border-white p-4 w-28 h-24 flex flex-col items-center justify-center rounded-2xl">
              <BookOpen className="h-7 w-7 text-red-500 mb-1" />
              <span className="text-sm font-semibold text-blue-400 mb-1">Articolo</span>
              <span className="text-xs text-blue-400 font-medium">35%</span>
            </div>
          </div>
        </div>

        {/* Menu a tendina per altri percorsi */}
        <div className="border-t border-dashboard-border pt-6">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer text-lg font-mono text-foreground hover:text-analytics-blue transition-colors">
              <span>Vedi gli altri percorsi</span>
              <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm bg-dashboard-surface/30 p-3 border border-dashboard-border">
                <span className="font-mono text-foreground min-w-[20px]">4°</span>
                <span className="bg-analytics-blue/20 text-analytics-blue px-2 py-1 text-xs">Homepage</span>
                <ArrowRight className="h-3 w-3" />
                <span className="bg-analytics-blue/20 text-analytics-blue px-2 py-1 text-xs">Servizi</span>
                <ArrowRight className="h-3 w-3" />
                <span className="bg-analytics-blue/20 text-analytics-blue px-2 py-1 text-xs">Preventivo</span>
                <span className="ml-auto text-muted-foreground text-xs">12% utenti</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-dashboard-surface/30 p-3 border border-dashboard-border">
                <span className="font-mono text-foreground min-w-[20px]">5°</span>
                <span className="bg-analytics-blue/20 text-analytics-blue px-2 py-1 text-xs">Homepage</span>
                <ArrowRight className="h-3 w-3" />
                <span className="bg-analytics-blue/20 text-analytics-blue px-2 py-1 text-xs">Portfolio</span>
                <ArrowRight className="h-3 w-3" />
                <span className="bg-analytics-blue/20 text-analytics-blue px-2 py-1 text-xs">Progetto</span>
                <span className="ml-auto text-muted-foreground text-xs">8% utenti</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-dashboard-surface/30 p-3 border border-dashboard-border">
                <span className="font-mono text-foreground min-w-[20px]">6°</span>
                <span className="bg-analytics-blue/20 text-analytics-blue px-2 py-1 text-xs">Homepage</span>
                <ArrowRight className="h-3 w-3" />
                <span className="bg-analytics-blue/20 text-analytics-blue px-2 py-1 text-xs">FAQ</span>
                <ArrowRight className="h-3 w-3" />
                <span className="bg-analytics-blue/20 text-analytics-blue px-2 py-1 text-xs">Supporto</span>
                <span className="ml-auto text-muted-foreground text-xs">5% utenti</span>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* Pattern Comportamentali */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono text-analytics-red">PATTERN COMPORTAMENTALI</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dashboard-surface/30 border border-dashboard-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-muted-foreground">Utenti che abbandonano dopo errori</span>
              <Bug className="h-4 w-4 text-analytics-red" />
            </div>
            <span className="font-bold text-2xl font-mono text-analytics-green">0.0%</span>
          </div>
          <div className="bg-dashboard-surface/30 border border-dashboard-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-muted-foreground">Tempo medio prima della frustrazione</span>
              <AlertTriangle className="h-4 w-4 text-analytics-orange" />
            </div>
            <span className="font-bold text-2xl font-mono text-analytics-blue">10s</span>
          </div>
          <div className="bg-dashboard-surface/30 border border-dashboard-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-muted-foreground">Engagement ratio nelle sessioni problematiche</span>
              <Activity className="h-4 w-4 text-analytics-green" />
            </div>
            <span className="font-bold text-2xl font-mono text-analytics-orange">21.3%</span>
          </div>
        </div>
      </div>

      {/* 4. Device/OS/Browser Distribution */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono">DISTRIBUZIONE DEVICE/OS/BROWSER</h3>
        <div className="space-y-6">
          <div className="flex bg-dashboard-surface border border-dashboard-border">
            {[
              { id: "device", label: "DEVICE" },
              { id: "os", label: "OS" },
              { id: "browser", label: "BROWSER" }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={distributionTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setDistributionTab(tab.id as any)}
                className={cn(
                  "font-mono text-xs px-6 py-2 border-0",
                  distributionTab === tab.id && "bg-analytics-blue text-white"
                )}
              >
                {tab.label}
              </Button>
            ))}
          </div>
          
          <div className="space-y-4">
            {getDistributionData().map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono">{item.name}</span>
                  <span className="font-bold text-analytics-blue font-mono">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Distribution */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono">DISTRIBUZIONE REGIONI ITALIA</h3>
        <div className="space-y-4">
          {regionData.map((region, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono">{region.name}</span>
                <span className="font-bold text-analytics-blue font-mono">{region.value}%</span>
              </div>
              <Progress value={region.value} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}