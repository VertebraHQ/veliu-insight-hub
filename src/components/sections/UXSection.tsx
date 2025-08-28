import { useState } from "react";
import { KPICard } from "@/components/KPICard";
import { DateSelector } from "@/components/DateSelector";
import { NavigationGraph } from "@/components/NavigationGraph";
import { ArrowLeft, MousePointer, Eye, Navigation, Activity, Maximize2, Monitor, Smartphone, Tablet, Bug, AlertTriangle, Home, Package, Phone, Users, FileText, BookOpen, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

      {/* 1. Quality Scores */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono">QUALITY SCORE</h3>
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

      {/* 3. Analisi Path Utenti - Navigation Graph */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono">ANALISI PATH UTENTI</h3>
        
        {/* Path Metrics above */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-dashboard-surface/30 border border-dashboard-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-muted-foreground">Pagine per Sessione</span>
              <Navigation className="h-4 w-4 text-analytics-blue" />
            </div>
            <span className="font-bold text-2xl font-mono text-analytics-blue">4.1</span>
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
            <span className="font-bold text-2xl font-mono text-analytics-orange">74%</span>
          </div>
        </div>

        {/* Navigation Graph */}
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground font-mono mb-2">
              Mappa interattiva dei percorsi di navigazione
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              Le frecce più spesse indicano maggior traffico tra le pagine. I numeri mostrano il volume di utenti.
            </p>
          </div>
          <NavigationGraph />
        </div>
      </div>

      {/* 4. Behavioral Patterns */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono">PATTERN COMPORTAMENTALI</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-analytics-green/10 border border-analytics-green/20">
              <div className="p-2 bg-analytics-green">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold font-mono text-analytics-green">Alta Conversione</div>
                <div className="text-sm text-muted-foreground font-mono">Percorso Home → Prodotti → Contatti</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-analytics-orange/10 border border-analytics-orange/20">
              <div className="p-2 bg-analytics-orange">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold font-mono text-analytics-orange">Media Conversione</div>
                <div className="text-sm text-muted-foreground font-mono">Percorso Blog → Servizi</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-analytics-red/10 border border-analytics-red/20">
              <div className="p-2 bg-analytics-red">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold font-mono text-analytics-red">Abbandono Elevato</div>
                <div className="text-sm text-muted-foreground font-mono">Pagina Prodotti senza proseguimento</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-analytics-blue/10 border border-analytics-blue/20">
              <div className="p-2 bg-analytics-blue">
                <Bug className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold font-mono text-analytics-blue">Anomalie Rilevate</div>
                <div className="text-sm text-muted-foreground font-mono">Tempo di permanenza elevato su Chi Siamo</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Distribution Analysis */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold font-mono">DISTRIBUZIONE DATI</h3>
          <div className="flex bg-dashboard-surface border border-dashboard-border">
            {[
              { id: "device", label: "Device" },
              { id: "os", label: "OS" },
              { id: "browser", label: "Browser" }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={distributionTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setDistributionTab(tab.id as any)}
                className={cn(
                  "font-mono text-xs px-4 py-2 border-0",
                  distributionTab === tab.id && "bg-analytics-blue text-white"
                )}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {getDistributionData().map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono">{item.name}</span>
                <span className="font-bold font-mono text-analytics-blue">{item.value}%</span>
              </div>
              <Progress value={item.value} className="h-2" />
            </div>
          ))}
        </div>
      </div>

      {/* 6. Regional Distribution */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono">DISTRIBUZIONE GEOGRAFICA</h3>
        <div className="space-y-3">
          {regionData.map((region, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono">{region.name}</span>
                <span className="font-bold font-mono text-analytics-green">{region.value}%</span>
              </div>
              <Progress value={region.value} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}