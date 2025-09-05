<<<<<<< HEAD
import { useState, useEffect, useCallback } from "react";
import { KPICard } from "@/components/KPICard";
import { DateSelector } from "@/components/DateSelector";
import { CompactDateSelector } from "@/components/sections/CompactDateSelector";
import { ArrowLeft, MousePointer, Eye, Navigation, Activity, Maximize2, Monitor, Smartphone, Tablet, Bug, AlertTriangle, Home, Package, Phone, Users, FileText, BookOpen, ArrowRight, ChevronDown, Settings, Loader2, RotateCcw, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

interface UXSectionProps {
  onBack: () => void;
}

// Funzione per convertire i path dai dati reali
const convertTopPathsToUserPaths = (topPaths: Record<string, number>) => {
  return Object.entries(topPaths)
    .map(([pathString, occurrences], index) => {
      // Converte "/ > /search > /" in ["Home", "Search", "Home"]
      const pathSteps = pathString.split(' > ').map(step => {
        switch (step) {
          case '/': return 'Home';
          case '/search': return 'Search';
          case '/bag': return 'Bag';
          case '/login': return 'Login';
          case '/orders': return 'Orders';
          case '/profile': return 'Profile';
          case '/portal': return 'Portal';
          case '/portal/auth': return 'Portal Auth';
          case '/terms': return 'Terms';
          default:
            if (step.startsWith('/portal/order/')) return 'Order Details';
            return step.replace('/', '').charAt(0).toUpperCase() + step.replace('/', '').slice(1) || 'Unknown';
        }
      });

      // Calcola il completion rate basato sulla posizione nella lista (i primi hanno rate più alti)
      const completionRate = Math.max(20, 95 - (index * 8));
      
      // Determina la dimensione basata sulle occorrenze
      let size: "large" | "medium" | "small";
      if (occurrences > 100) size = "large";
      else if (occurrences > 50) size = "medium";
      else size = "small";

      return {
        id: index + 1,
        path: pathSteps,
        occurrences,
        completionRate,
        size
      };
    })
    .slice(0, 10); // Prendi solo i primi 10 path più frequenti
};

// Funzione per ottenere l'icona appropriata per ogni step
const getStepIcon = (stepName: string) => {
  switch (stepName) {
    case 'Home': return Home;
    case 'Search': return Package;
    case 'Bag': return Package;
    case 'Login': return Users;
    case 'Orders': return FileText;
    case 'Profile': return Users;
    case 'Portal': return Settings;
    case 'Portal Auth': return Settings;
    case 'Terms': return BookOpen;
    case 'Order Details': return FileText;
    default: return Navigation;
  }
};

// Funzione per ottenere il colore dell'icona
const getStepColor = (stepName: string) => {
  switch (stepName) {
    case 'Home': return 'text-orange-500';
    case 'Search': return 'text-amber-600';
    case 'Bag': return 'text-green-500';
    case 'Login': return 'text-purple-500';
    case 'Orders': return 'text-blue-500';
    case 'Profile': return 'text-pink-500';
    case 'Portal': return 'text-indigo-500';
    case 'Portal Auth': return 'text-indigo-400';
    case 'Terms': return 'text-gray-500';
    case 'Order Details': return 'text-cyan-500';
    default: return 'text-gray-400';
  }
};

const pathMetrics = [
  { title: "Pagine per Sessione", value: "4.1", color: "blue" },
  { title: "Tempo Medio", value: "2:34", color: "green" },
  { title: "Completamento Percorso", value: "74%", color: "orange" },
];

// Interfaccia per i pesi delle metriche
interface WeightConfig {
  scroll_depth: number;
  session_duration: number;
  pages_per_session: number;
  successful_interactions: number;
  funnel_step_completion_rate: number;
  rage_clicks: number;
  console_errors: number;
  exit_on_error: number;
  fast_bounce: number;
}

// Configurazione di default dei pesi
const DEFAULT_WEIGHTS: WeightConfig = {
  scroll_depth: 10,
  session_duration: 15,
  pages_per_session: 10,
  successful_interactions: 20,
  funnel_step_completion_rate: 15,
  rage_clicks: 10,
  console_errors: 5,
  exit_on_error: 10,
  fast_bounce: 5,
};

export function UXSection({ onBack }: UXSectionProps) {
  const [distributionTab, setDistributionTab] = useState<"device" | "os" | "browser">("device");
  const [heatmapDevice, setHeatmapDevice] = useState<"desktop" | "mobile" | "tablet">("desktop");
  const [isHeatmapFullscreen, setIsHeatmapFullscreen] = useState(false);
  const [isWeightConfigOpen, setIsWeightConfigOpen] = useState(false);
  const [weights, setWeights] = useState<WeightConfig>(DEFAULT_WEIGHTS);
  const [originalWeights, setOriginalWeights] = useState<WeightConfig>(DEFAULT_WEIGHTS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    data,
    loading,
    error,
    availableDates,
    selectedDate,
    periodType,
    customDateRange,
    setSelectedDate,
    setPeriodType,
    setCustomDateRange,
    refreshData
  } = useAnalyticsData();

  // Inizializza i pesi dai dati quando disponibili, ma usa sempre i DEFAULT_WEIGHTS come base
  useEffect(() => {
    // Usa sempre i DEFAULT_WEIGHTS come valori di base corretti
    setWeights(DEFAULT_WEIGHTS);
    setOriginalWeights(DEFAULT_WEIGHTS);
    
    // Se ci sono dati API e sono diversi dai default, mostra che ci sono modifiche non salvate
    if (data?.ux?.session_quality_score?.weights) {
      const apiWeights = data.ux.session_quality_score.weights;
      const apiWeightsConverted: WeightConfig = {
        scroll_depth: Math.abs(apiWeights.scroll_depth * 100),
        session_duration: Math.abs(apiWeights.session_duration * 100),
        pages_per_session: Math.abs(apiWeights.pages_per_session * 100),
        successful_interactions: Math.abs(apiWeights.successful_interactions * 100),
        funnel_step_completion_rate: Math.abs(apiWeights.funnel_step_completion_rate * 100),
        rage_clicks: Math.abs(apiWeights.rage_clicks * 100),
        console_errors: Math.abs(apiWeights.console_errors * 100),
        exit_on_error: Math.abs(apiWeights.exit_on_error * 100),
        fast_bounce: Math.abs(apiWeights.fast_bounce * 100),
      };
      
      // Se i pesi API sono diversi dai default, usa i default ma non impostare come "originali"
      const apiTotal = Object.values(apiWeightsConverted).reduce((sum, weight) => sum + weight, 0);
      if (apiTotal !== 100) {
        // I pesi API non sono validi, mantieni i DEFAULT_WEIGHTS
        console.log('Pesi API non validi (totale:', apiTotal, '%), usando DEFAULT_WEIGHTS');
      }
    }
  }, [data]);

  // Calcola la somma totale dei pesi
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  const isValidTotal = totalWeight === 100;

  // Gestisce il cambiamento di un peso
  const handleWeightChange = (key: keyof WeightConfig, value: string) => {
    const numValue = Math.max(0, Math.min(30, parseInt(value) || 0));
    const newWeights = { ...weights, [key]: numValue };
    setWeights(newWeights);
    setHasUnsavedChanges(JSON.stringify(newWeights) !== JSON.stringify(originalWeights));
  };

  // Salva la configurazione
  const handleSaveWeights = () => {
    if (!isValidTotal) return;
    setOriginalWeights(weights);
    setHasUnsavedChanges(false);
    setIsWeightConfigOpen(false);
    // Qui potresti aggiungere una chiamata API per salvare i pesi
    console.log('Pesi salvati:', weights);
  };

  // Reset ai valori originali
  const handleResetWeights = () => {
    setWeights(originalWeights);
    setHasUnsavedChanges(false);
  };

  // Reset ai valori di default
  const handleResetToDefault = () => {
    setWeights(DEFAULT_WEIGHTS);
    setHasUnsavedChanges(JSON.stringify(DEFAULT_WEIGHTS) !== JSON.stringify(originalWeights));
  };

  // Calculate data from analytics
  const deviceData = data ? Object.entries(data.distributions.device_type).map(([name, count]) => ({
    name: name === 'Unknown' ? 'Altri' : name,
    value: Math.round((count / data.total_sessions_yesterday) * 100)
  })) : [];

  const osData = data ? Object.entries(data.distributions.os).map(([name, count]) => ({
    name: name === 'Mac OS X' ? 'macOS' : name || 'Altri',
    value: Math.round((count / data.total_sessions_yesterday) * 100)
  })) : [];

  const browserData = data ? Object.entries(data.distributions.browser).map(([name, count]) => ({
    name: name === 'Mobile Safari' ? 'Safari' : name === 'Microsoft Edge' ? 'Edge' : name || 'Altri',
    value: Math.round((count / data.total_sessions_yesterday) * 100)
  })) : [];

  const regionData = data ? Object.entries(data.distributions.region).map(([name, count]) => ({
    name: name === 'Lombardy' ? 'Lombardia' :
          name === 'Emilia-Romagna' ? 'Emilia-Romagna' :
          name === 'Tuscany' ? 'Toscana' :
          name === 'Piedmont' ? 'Piemonte' :
          name || 'Altri',
    value: Math.round((count / data.total_sessions_yesterday) * 100)
  })).slice(0, 7) : [];

  // Funzione per calcolare le percentuali basate sui pesi correnti
  const calculateQualityPercentages = useCallback(() => {
    // Usa i dati di distribuzione esistenti invece dei samples
    if (!data?.ux?.session_quality_score?.classification?.distribution) return null;
    
    const distribution = data.ux.session_quality_score.classification.distribution;
    const totalSessions = distribution.good + distribution.neutral + distribution.bad;
    
    if (totalSessions === 0) return null;
    
    // Simula il ricalcolo dei punteggi basato sui nuovi pesi
    // In un'implementazione reale, questo dovrebbe ricalcolare i punteggi per ogni sessione
    // Per ora, applichiamo una trasformazione proporzionale basata sui pesi
    const originalWeights = data.ux.session_quality_score.weights;
    const currentWeights = weights;
    
    // Calcola il fattore di scala per ogni categoria basato sui cambiamenti dei pesi
    const positiveWeightChange = (
      (currentWeights.scroll_depth / 100) +
      (currentWeights.session_duration / 100) +
      (currentWeights.pages_per_session / 100) +
      (currentWeights.successful_interactions / 100) +
      (currentWeights.funnel_step_completion_rate / 100)
    ) / (
      Math.abs(originalWeights.scroll_depth) +
      Math.abs(originalWeights.session_duration) +
      Math.abs(originalWeights.pages_per_session) +
      Math.abs(originalWeights.successful_interactions) +
      Math.abs(originalWeights.funnel_step_completion_rate)
    );
    
    const negativeWeightChange = (
      (currentWeights.rage_clicks / 100) +
      (currentWeights.console_errors / 100) +
      (currentWeights.exit_on_error / 100) +
      (currentWeights.fast_bounce / 100)
    ) / (
      Math.abs(originalWeights.rage_clicks) +
      Math.abs(originalWeights.console_errors) +
      Math.abs(originalWeights.exit_on_error) +
      Math.abs(originalWeights.fast_bounce)
    );
    
    // Applica la trasformazione alle percentuali originali
    const originalPercentages = data.ux.session_quality_score.classification.percentages;
    
    // Calcola l'effetto del cambiamento dei pesi
    const goodAdjustment = (positiveWeightChange - 1) * 10 - (negativeWeightChange - 1) * 5;
    const badAdjustment = -(positiveWeightChange - 1) * 5 + (negativeWeightChange - 1) * 10;
    
    let newGood = Math.max(0, Math.min(100, originalPercentages.good + goodAdjustment));
    let newBad = Math.max(0, Math.min(100, originalPercentages.bad + badAdjustment));
    let newNeutral = Math.max(0, 100 - newGood - newBad);
    
    // Normalizza per assicurarsi che la somma sia 100
    const total = newGood + newNeutral + newBad;
    if (total > 0) {
      newGood = Math.round((newGood / total) * 100 * 10) / 10;
      newBad = Math.round((newBad / total) * 100 * 10) / 10;
      newNeutral = Math.round((100 - newGood - newBad) * 10) / 10;
    }
    
    return {
      good: newGood,
      neutral: newNeutral,
      bad: newBad
    };
  }, [data, weights]);

  const qualityPercentages = calculateQualityPercentages();
  
  const qualityScores = qualityPercentages ? [
    {
      name: "Good",
      value: qualityPercentages.good,
      color: "analytics-green"
    },
    {
      name: "Neutral",
      value: qualityPercentages.neutral,
      color: "analytics-orange"
    },
    {
      name: "Bad",
      value: qualityPercentages.bad,
      color: "analytics-red"
    },
  ] : [];

  const totalClicks = data ? Object.values(data.clickmap_global).reduce((sum, clicks) => sum + clicks, 0) : 0;

  const getDistributionData = () => {
    switch (distributionTab) {
      case "os": return osData;
      case "browser": return browserData;
      default: return deviceData;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-analytics-blue" />
          <span className="ml-2 text-muted-foreground">Caricamento dati UX...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Errore nel caricamento dei dati UX: {error}
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              className="ml-2"
            >
              Riprova
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          availableDates={availableDates}
          disabled={loading}
        />
      </div>

      {/* Compact Date Selector */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <CompactDateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          periodType={periodType}
          onPeriodTypeChange={setPeriodType}
          customDateRange={customDateRange}
          onCustomDateRangeChange={setCustomDateRange}
          availableDates={availableDates}
          disabled={loading}
        />
      </div>

      {/* 1. Quality Scores */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold font-mono">QUALITY SCORE</h3>
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-2 px-2 py-1 bg-analytics-blue/10 border border-analytics-blue/30 rounded text-xs">
                <div className="w-2 h-2 bg-analytics-blue rounded-full animate-pulse"></div>
                <span className="text-analytics-blue font-medium">Pesi modificati</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsWeightConfigOpen(!isWeightConfigOpen)}
            className="flex items-center space-x-2 px-3 py-2 bg-dashboard-surface/80 border border-dashboard-border text-sm font-medium text-muted-foreground hover:bg-dashboard-surface-hover/80 hover:text-foreground transition-all duration-150 apple-button"
          >
            <Settings className="h-4 w-4" />
            <span>Configura Pesi</span>
          </button>
        </div>

        {isWeightConfigOpen && (
          <div className="mb-8 bg-background/8 rounded-lg border border-border p-8 shadow-lg">
            <div className="mb-8">
              <h4 className="text-xl font-bold mb-2">Configurazione Pesi Metriche</h4>
              <p className="text-muted-foreground">Seleziona un valore da 0% a 30% per ogni variabile</p>
            </div>

            {/* Indicatore somma totale */}
            <div className="mb-6 p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Somma Totale Pesi:</span>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-bold text-lg",
                    isValidTotal ? "text-analytics-green" : "text-analytics-red"
                  )}>
                    {totalWeight}%
                  </span>
                  {!isValidTotal && <AlertCircle className="h-4 w-4 text-analytics-red" />}
                </div>
              </div>
              <Progress
                value={Math.min(totalWeight, 100)}
                className={cn(
                  "h-2",
                  totalWeight > 100 ? "bg-red-100" : ""
                )}
              />
              {!isValidTotal && (
                <p className="text-sm text-analytics-red mt-2">
                  {totalWeight > 100
                    ? `Riduci di ${totalWeight - 100}% per raggiungere il 100%`
                    : `Aggiungi ${100 - totalWeight}% per raggiungere il 100%`
                  }
                </p>
              )}
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
                      value={weights.scroll_depth}
                      onChange={(e) => handleWeightChange('scroll_depth', e.target.value)}
                      className="h-10 text-base pr-8 bg-muted/50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  </div>
                  <p className="text-sm text-analytics-green">Positive (+{weights.scroll_depth}%)</p>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Successful Interactions</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={weights.successful_interactions}
                      onChange={(e) => handleWeightChange('successful_interactions', e.target.value)}
                      className="h-10 text-base pr-8 bg-muted/50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  </div>
                  <p className="text-sm text-analytics-green">Positive (+{weights.successful_interactions}%)</p>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Console Errors</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={weights.console_errors}
                      onChange={(e) => handleWeightChange('console_errors', e.target.value)}
                      className="h-10 text-base pr-8 bg-muted/50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  </div>
                  <p className="text-sm text-red-500">Negative (-{weights.console_errors}%)</p>
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
                      value={weights.session_duration}
                      onChange={(e) => handleWeightChange('session_duration', e.target.value)}
                      className="h-10 text-base pr-8 bg-muted/50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  </div>
                  <p className="text-sm text-analytics-green">Positive (+{weights.session_duration}%)</p>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Funnel Step Completion Rate</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={weights.funnel_step_completion_rate}
                      onChange={(e) => handleWeightChange('funnel_step_completion_rate', e.target.value)}
                      className="h-10 text-base pr-8 bg-muted/50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  </div>
                  <p className="text-sm text-analytics-green">Positive (+{weights.funnel_step_completion_rate}%)</p>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Exit On Error</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={weights.exit_on_error}
                      onChange={(e) => handleWeightChange('exit_on_error', e.target.value)}
                      className="h-10 text-base pr-8 bg-muted/50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  </div>
                  <p className="text-sm text-red-500">Negative (-{weights.exit_on_error}%)</p>
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
                      value={weights.pages_per_session}
                      onChange={(e) => handleWeightChange('pages_per_session', e.target.value)}
                      className="h-10 text-base pr-8 bg-muted/50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  </div>
                  <p className="text-sm text-analytics-green">Positive (+{weights.pages_per_session}%)</p>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Rage Clicks</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={weights.rage_clicks}
                      onChange={(e) => handleWeightChange('rage_clicks', e.target.value)}
                      className="h-10 text-base pr-8 bg-muted/50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  </div>
                  <p className="text-sm text-red-500">Negative (-{weights.rage_clicks}%)</p>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Fast Bounce</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={weights.fast_bounce}
                      onChange={(e) => handleWeightChange('fast_bounce', e.target.value)}
                      className="h-10 text-base pr-8 bg-muted/50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  </div>
                  <p className="text-sm text-red-500">Negative (-{weights.fast_bounce}%)</p>
                </div>
              </div>
            </div>

            {/* Alert per modifiche non salvate */}
            {hasUnsavedChanges && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Hai modifiche non salvate. Salva o annulla per continuare.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-between items-center pt-6 border-t border-border">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetToDefault}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Default
                </Button>
                {hasUnsavedChanges && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetWeights}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Annulla Modifiche
                  </Button>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsWeightConfigOpen(false)}>
                  Chiudi
                </Button>
                <Button
                  onClick={handleSaveWeights}
                  disabled={!isValidTotal}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Salva Configurazione
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {hasUnsavedChanges && (
            <div className="mb-4 p-3 bg-analytics-blue/5 border border-analytics-blue/20 rounded-lg">
              <p className="text-sm text-analytics-blue">
                <strong>Anteprima:</strong> Le percentuali mostrate riflettono la configurazione dei pesi corrente.
                Salva per applicare definitivamente le modifiche.
              </p>
            </div>
          )}
          {qualityScores.map((score, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono">{score.name}</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-bold font-mono text-${score.color}`}>{score.value}%</span>
                  {hasUnsavedChanges && (
                    <span className="text-xs text-muted-foreground">(aggiornato)</span>
                  )}
                </div>
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
          value={totalClicks.toLocaleString()}
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
              src="/images/test.png"
              alt="Heatmap Placeholder"
              className="max-w-full max-h-full object-contain"
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

      {/* 3. Analisi Path Utenti - Dynamic Data */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono">ANALISI PATH UTENTI</h3>
        
        {/* Path Metrics above */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-dashboard-surface/30 border border-dashboard-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-muted-foreground">Pagine per Sessione</span>
              <Navigation className="h-4 w-4 text-analytics-blue" />
            </div>
            <span className="font-bold text-2xl font-mono text-analytics-blue">
              {data?.averages?.avg_session_duration ? Math.round((data.averages.avg_session_duration / 60) * 10) / 10 : '2.4'}
            </span>
          </div>
          <div className="bg-dashboard-surface/30 border border-dashboard-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-muted-foreground">Tempo Medio</span>
              <Activity className="h-4 w-4 text-analytics-green" />
            </div>
            <span className="font-bold text-2xl font-mono text-analytics-green">
              {data?.averages?.avg_session_duration ?
                `${Math.floor(data.averages.avg_session_duration / 60)}m ${Math.round(data.averages.avg_session_duration % 60)}s` :
                '2m 34s'
              }
            </span>
          </div>
          <div className="bg-dashboard-surface/30 border border-dashboard-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-muted-foreground">Completamento Percorso</span>
              <Eye className="h-4 w-4 text-analytics-orange" />
            </div>
            <span className="font-bold text-2xl font-mono text-analytics-orange">
              {data?.funnel?.conversion_rate ? Math.round(data.funnel.conversion_rate * 100) : '68'}%
            </span>
          </div>
        </div>

        {/* Top 3 Percorsi - Visualizzazione Step-by-Step */}
        {data?.top_paths && (
          <div className="space-y-16">
            {Object.entries(data.top_paths).slice(0, 3).map(([pathString, occurrences], index) => {
              const pathSteps = pathString.split(' > ').map(step => {
                switch (step) {
                  case '/': return 'Home';
                  case '/search': return 'Search';
                  case '/bag': return 'Bag';
                  case '/login': return 'Login';
                  case '/orders': return 'Orders';
                  case '/profile': return 'Profile';
                  case '/portal': return 'Portal';
                  case '/portal/auth': return 'Portal Auth';
                  case '/terms': return 'Terms';
                  default:
                    if (step.startsWith('/portal/order/')) return 'Order Details';
                    return step.replace('/', '').charAt(0).toUpperCase() + step.replace('/', '').slice(1) || 'Unknown';
                }
              });

              const percentage = Math.round((occurrences / (data?.total_sessions_yesterday || 1)) * 100);
              const completionRate = Math.max(20, 95 - (index * 15));

              // Dimensioni diverse per i primi 3
              const sizes = [
                { blockSize: "w-48 h-40 p-8", iconSize: "h-12 w-12", textSize: "text-lg", arrowSize: "h-8 w-8" },
                { blockSize: "w-36 h-32 p-6", iconSize: "h-9 w-9", textSize: "text-base", arrowSize: "h-6 w-6" },
                { blockSize: "w-28 h-24 p-4", iconSize: "h-7 w-7", textSize: "text-sm", arrowSize: "h-5 w-5" }
              ];

              const size = sizes[index];

              return (
                <div key={index} className="mb-16">
                  <h4 className="text-lg font-mono text-foreground mb-8 text-center">
                    {index === 0 ? 'Percorso Principale' :
                     index === 1 ? 'Secondo Percorso' :
                     'Terzo Percorso'} ({percentage}% utenti - {occurrences} sessioni)
                  </h4>
                  <div className="flex items-center justify-center gap-6 flex-wrap">
                    {pathSteps.map((stepName, stepIndex) => {
                      const StepIcon = getStepIcon(stepName);
                      const iconColor = getStepColor(stepName);
                      const stepPercentage = Math.round(completionRate * Math.pow(0.7, stepIndex));

                      return (
                        <div key={stepIndex} className="flex items-center">
                          <div className={cn(
                            "border-2 border-white flex flex-col items-center justify-center rounded-2xl",
                            size.blockSize
                          )}>
                            <StepIcon className={cn(size.iconSize, iconColor, "mb-3")} />
                            <span className={cn(size.textSize, "font-semibold text-blue-400 mb-1")}>{stepName}</span>
                            <span className={cn("text-blue-400 font-medium",
                              index === 0 ? "text-base" : index === 1 ? "text-sm" : "text-xs"
                            )}>
                              {stepPercentage}%
                            </span>
                          </div>
                          {stepIndex < pathSteps.length - 1 && (
                            <div className="relative group flex flex-col items-center mx-4">
                              <ArrowRight className={cn(size.arrowSize, "text-gray-600 mb-2")} />
                              <span className={cn("font-semibold text-gray-700",
                                index === 0 ? "text-lg" : index === 1 ? "text-base" : "text-sm"
                              )}>
                                {Math.round(stepPercentage * 0.7)}%
                              </span>
                              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-popover border border-border px-3 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <div className="font-mono text-analytics-blue">{Math.round(stepPercentage * 0.7)}%</div>
                                <div className="text-xs text-muted-foreground">
                                  {Math.round(occurrences * (stepPercentage * 0.7) / 100)} utenti
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Top 10 Lista Completa */}
        {data?.top_paths && (
          <div className="border-t border-dashboard-border pt-8 mt-8">
            <h4 className="text-lg font-mono text-foreground mb-6">Top 10 Percorsi Completi</h4>
            <div className="space-y-3">
              {Object.entries(data.top_paths).slice(0, 5).map(([pathString, occurrences], index) => {
                const percentage = Math.round((occurrences / (data?.total_sessions_yesterday || 1)) * 100);
                return (
                  <div key={index} className="flex items-center gap-3 text-sm bg-dashboard-surface/30 p-4 border border-dashboard-border rounded-lg">
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full font-bold text-white",
                      index < 3 ? "bg-analytics-blue" : "bg-muted-foreground"
                    )}>
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      {pathString.split(' > ').map((step, stepIndex, array) => (
                        <div key={stepIndex} className="flex items-center">
                          <span className="bg-analytics-blue/20 text-analytics-blue px-3 py-1 text-xs font-medium rounded">
                            {step === '/' ? 'Home' :
                             step === '/search' ? 'Search' :
                             step === '/bag' ? 'Bag' :
                             step === '/login' ? 'Login' :
                             step === '/orders' ? 'Orders' :
                             step === '/profile' ? 'Profile' :
                             step === '/portal' ? 'Portal' :
                             step === '/portal/auth' ? 'Portal Auth' :
                             step === '/terms' ? 'Terms' :
                             step.startsWith('/portal/order/') ? 'Order Details' :
                             step.replace('/', '').charAt(0).toUpperCase() + step.replace('/', '').slice(1) || 'Unknown'}
                          </span>
                          {stepIndex < array.length - 1 && <ArrowRight className="h-3 w-3 mx-2 text-muted-foreground" />}
                        </div>
                      ))}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-analytics-blue">{occurrences} sessioni</div>
                      <div className="text-xs text-muted-foreground">{percentage}% del traffico</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Fallback per dati mancanti */}
        {!data?.top_paths && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Dati sui percorsi utente non disponibili per questa data.</p>
          </div>
        )}
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
=======
import { useState, useEffect, useCallback } from "react";
import { KPICard } from "@/components/KPICard";
import { DateSelector } from "@/components/DateSelector";
import { CompactDateSelector } from "@/components/sections/CompactDateSelector";
import { ArrowLeft, MousePointer, Eye, Navigation, Activity, Maximize2, Monitor, Smartphone, Tablet, Bug, AlertTriangle, Home, Package, Phone, Users, FileText, BookOpen, ArrowRight, ChevronDown, Settings, Loader2, RotateCcw, Save, AlertCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

interface UXSectionProps {
  onBack: () => void;
}

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

// Interfaccia per i pesi delle metriche
interface WeightConfig {
  scroll_depth: number;
  session_duration: number;
  pages_per_session: number;
  successful_interactions: number;
  funnel_step_completion_rate: number;
  rage_clicks: number;
  console_errors: number;
  exit_on_error: number;
  fast_bounce: number;
}

// Configurazione di default dei pesi
const DEFAULT_WEIGHTS: WeightConfig = {
  scroll_depth: 10,
  session_duration: 15,
  pages_per_session: 10,
  successful_interactions: 20,
  funnel_step_completion_rate: 15,
  rage_clicks: 10,
  console_errors: 5,
  exit_on_error: 10,
  fast_bounce: 5,
};

export function UXSection({ onBack }: UXSectionProps) {
  const [distributionTab, setDistributionTab] = useState<"device" | "os" | "browser">("device");
  const [heatmapDevice, setHeatmapDevice] = useState<"desktop" | "mobile" | "tablet">("desktop");
  const [isHeatmapFullscreen, setIsHeatmapFullscreen] = useState(false);
  const [isWeightConfigOpen, setIsWeightConfigOpen] = useState(false);
  const [weights, setWeights] = useState<WeightConfig>(DEFAULT_WEIGHTS);
  const [originalWeights, setOriginalWeights] = useState<WeightConfig>(DEFAULT_WEIGHTS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    data,
    loading,
    error,
    availableDates,
    selectedDate,
    periodType,
    customDateRange,
    setSelectedDate,
    setPeriodType,
    setCustomDateRange,
    refreshData
  } = useAnalyticsData();

  // Inizializza i pesi dai dati quando disponibili, ma usa sempre i DEFAULT_WEIGHTS come base
  useEffect(() => {
    // Usa sempre i DEFAULT_WEIGHTS come valori di base corretti
    setWeights(DEFAULT_WEIGHTS);
    setOriginalWeights(DEFAULT_WEIGHTS);
    
    // Se ci sono dati API e sono diversi dai default, mostra che ci sono modifiche non salvate
    if (data?.ux?.session_quality_score?.weights) {
      const apiWeights = data.ux.session_quality_score.weights;
      const apiWeightsConverted: WeightConfig = {
        scroll_depth: Math.abs(apiWeights.scroll_depth * 100),
        session_duration: Math.abs(apiWeights.session_duration * 100),
        pages_per_session: Math.abs(apiWeights.pages_per_session * 100),
        successful_interactions: Math.abs(apiWeights.successful_interactions * 100),
        funnel_step_completion_rate: Math.abs(apiWeights.funnel_step_completion_rate * 100),
        rage_clicks: Math.abs(apiWeights.rage_clicks * 100),
        console_errors: Math.abs(apiWeights.console_errors * 100),
        exit_on_error: Math.abs(apiWeights.exit_on_error * 100),
        fast_bounce: Math.abs(apiWeights.fast_bounce * 100),
      };
      
      // Se i pesi API sono diversi dai default, usa i default ma non impostare come "originali"
      const apiTotal = Object.values(apiWeightsConverted).reduce((sum, weight) => sum + weight, 0);
      if (apiTotal !== 100) {
        // I pesi API non sono validi, mantieni i DEFAULT_WEIGHTS
        console.log('Pesi API non validi (totale:', apiTotal, '%), usando DEFAULT_WEIGHTS');
      }
    }
  }, [data]);

  // Calcola la somma totale dei pesi
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  const isValidTotal = totalWeight === 100;

  // Gestisce il cambiamento di un peso
  const handleWeightChange = (key: keyof WeightConfig, value: string) => {
    const numValue = Math.max(0, Math.min(30, parseInt(value) || 0));
    const newWeights = { ...weights, [key]: numValue };
    setWeights(newWeights);
    setHasUnsavedChanges(JSON.stringify(newWeights) !== JSON.stringify(originalWeights));
  };

  // Salva la configurazione
  const handleSaveWeights = () => {
    if (!isValidTotal) return;
    setOriginalWeights(weights);
    setHasUnsavedChanges(false);
    setIsWeightConfigOpen(false);
    // Qui potresti aggiungere una chiamata API per salvare i pesi
    console.log('Pesi salvati:', weights);
  };

  // Reset ai valori originali
  const handleResetWeights = () => {
    setWeights(originalWeights);
    setHasUnsavedChanges(false);
  };

  // Reset ai valori di default
  const handleResetToDefault = () => {
    setWeights(DEFAULT_WEIGHTS);
    setHasUnsavedChanges(JSON.stringify(DEFAULT_WEIGHTS) !== JSON.stringify(originalWeights));
  };

  // Calculate data from analytics
  const deviceData = data ? Object.entries(data.distributions.device_type).map(([name, count]) => ({
    name: name === 'Unknown' ? 'Altri' : name,
    value: Math.round((count / data.total_sessions_yesterday) * 100)
  })) : [];

  const osData = data ? Object.entries(data.distributions.os).map(([name, count]) => ({
    name: name === 'Mac OS X' ? 'macOS' : name || 'Altri',
    value: Math.round((count / data.total_sessions_yesterday) * 100)
  })) : [];

  const browserData = data ? Object.entries(data.distributions.browser).map(([name, count]) => ({
    name: name === 'Mobile Safari' ? 'Safari' : name === 'Microsoft Edge' ? 'Edge' : name || 'Altri',
    value: Math.round((count / data.total_sessions_yesterday) * 100)
  })) : [];

  const regionData = data ? Object.entries(data.distributions.region).map(([name, count]) => ({
    name: name === 'Lombardy' ? 'Lombardia' :
          name === 'Emilia-Romagna' ? 'Emilia-Romagna' :
          name === 'Tuscany' ? 'Toscana' :
          name === 'Piedmont' ? 'Piemonte' :
          name || 'Altri',
    value: Math.round((count / data.total_sessions_yesterday) * 100)
  })).slice(0, 7) : [];

  // Funzione per calcolare le percentuali basate sui pesi correnti
  const calculateQualityPercentages = useCallback(() => {
    // Usa i dati di distribuzione esistenti invece dei samples
    if (!data?.ux?.session_quality_score?.classification?.distribution) return null;
    
    const distribution = data.ux.session_quality_score.classification.distribution;
    const totalSessions = distribution.good + distribution.neutral + distribution.bad;
    
    if (totalSessions === 0) return null;
    
    // Simula il ricalcolo dei punteggi basato sui nuovi pesi
    // In un'implementazione reale, questo dovrebbe ricalcolare i punteggi per ogni sessione
    // Per ora, applichiamo una trasformazione proporzionale basata sui pesi
    const originalWeights = data.ux.session_quality_score.weights;
    const currentWeights = weights;
    
    // Calcola il fattore di scala per ogni categoria basato sui cambiamenti dei pesi
    const positiveWeightChange = (
      (currentWeights.scroll_depth / 100) +
      (currentWeights.session_duration / 100) +
      (currentWeights.pages_per_session / 100) +
      (currentWeights.successful_interactions / 100) +
      (currentWeights.funnel_step_completion_rate / 100)
    ) / (
      Math.abs(originalWeights.scroll_depth) +
      Math.abs(originalWeights.session_duration) +
      Math.abs(originalWeights.pages_per_session) +
      Math.abs(originalWeights.successful_interactions) +
      Math.abs(originalWeights.funnel_step_completion_rate)
    );
    
    const negativeWeightChange = (
      (currentWeights.rage_clicks / 100) +
      (currentWeights.console_errors / 100) +
      (currentWeights.exit_on_error / 100) +
      (currentWeights.fast_bounce / 100)
    ) / (
      Math.abs(originalWeights.rage_clicks) +
      Math.abs(originalWeights.console_errors) +
      Math.abs(originalWeights.exit_on_error) +
      Math.abs(originalWeights.fast_bounce)
    );
    
    // Applica la trasformazione alle percentuali originali
    const originalPercentages = data.ux.session_quality_score.classification.percentages;
    
    // Calcola l'effetto del cambiamento dei pesi
    const goodAdjustment = (positiveWeightChange - 1) * 10 - (negativeWeightChange - 1) * 5;
    const badAdjustment = -(positiveWeightChange - 1) * 5 + (negativeWeightChange - 1) * 10;
    
    let newGood = Math.max(0, Math.min(100, originalPercentages.good + goodAdjustment));
    let newBad = Math.max(0, Math.min(100, originalPercentages.bad + badAdjustment));
    let newNeutral = Math.max(0, 100 - newGood - newBad);
    
    // Normalizza per assicurarsi che la somma sia 100
    const total = newGood + newNeutral + newBad;
    if (total > 0) {
      newGood = Math.round((newGood / total) * 100 * 10) / 10;
      newBad = Math.round((newBad / total) * 100 * 10) / 10;
      newNeutral = Math.round((100 - newGood - newBad) * 10) / 10;
    }
    
    return {
      good: newGood,
      neutral: newNeutral,
      bad: newBad
    };
  }, [data, weights]);

  const qualityPercentages = calculateQualityPercentages();
  
  const qualityScores = qualityPercentages ? [
    {
      name: "Good",
      value: qualityPercentages.good,
      color: "analytics-green"
    },
    {
      name: "Neutral",
      value: qualityPercentages.neutral,
      color: "analytics-orange"
    },
    {
      name: "Bad",
      value: qualityPercentages.bad,
      color: "analytics-red"
    },
  ] : [];

  const totalClicks = data ? Object.values(data.clickmap_global).reduce((sum, clicks) => sum + clicks, 0) : 0;

  // Generate sample problematic sessions from error examples (duplicated from TechSection)
  const problematicSessions = data && data.ux.frustration.examples.with_errors ?
    data.ux.frustration.examples.with_errors.slice(0, 5).map((sessionId, index) => ({
      id: sessionId,
      type: "Video",
      issue: index < 3 ? "Con errori" : "Rage clicks",
      severity: index < 3 ? "high" as const : "medium" as const,
      browser: ["Chrome", "Safari", "Firefox", "Chrome", "Edge"][index],
      device: ["Desktop", "Mobile", "Desktop", "Mobile", "Tablet"][index]
    })) : [];

  const getDistributionData = () => {
    switch (distributionTab) {
      case "os": return osData;
      case "browser": return browserData;
      default: return deviceData;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-analytics-blue" />
          <span className="ml-2 text-muted-foreground">Caricamento dati UX...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Errore nel caricamento dei dati UX: {error}
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              className="ml-2"
            >
              Riprova
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
                <div className="px-3 py-1 bg-analytics-blue/20 text-analytics-blue text-xs border border-analytics-blue/30">
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
            <div className="text-sm text-muted-foreground">{path.occurrences} occorrenze</div>
            <div className="flex items-center space-x-2">
              <Progress value={path.completionRate} className="flex-1 h-1" />
              <span className="text-xs text-analytics-green">{path.completionRate}%</span>
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
            <h2 className="text-3xl font-bold text-foreground tracking-tight">ANALISI UX</h2>
            <p className="text-muted-foreground">Esperienza utente e heatmaps</p>
          </div>
        </div>
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          availableDates={availableDates}
          disabled={loading}
        />
      </div>

      {/* Compact Date Selector */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <CompactDateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          periodType={periodType}
          onPeriodTypeChange={setPeriodType}
          customDateRange={customDateRange}
          onCustomDateRangeChange={setCustomDateRange}
          availableDates={availableDates}
          disabled={loading}
        />
      </div>

      {/* 1. Quality Scores */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold">QUALITY SCORE</h3>
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-2 px-2 py-1 bg-analytics-blue/10 border border-analytics-blue/30 rounded text-xs">
                <div className="w-2 h-2 bg-analytics-blue rounded-full animate-pulse"></div>
                <span className="text-analytics-blue font-medium">Pesi modificati</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsWeightConfigOpen(!isWeightConfigOpen)}
            className="flex items-center space-x-2 px-3 py-2 bg-dashboard-surface/80 border border-dashboard-border text-sm font-medium text-muted-foreground hover:bg-dashboard-surface-hover/80 hover:text-foreground transition-all duration-150 apple-button"
          >
            <Settings className="h-4 w-4" />
            <span>Configura Pesi</span>
          </button>
        </div>

        {isWeightConfigOpen && (
          <div className="mb-8 bg-background/8 rounded-lg border border-border p-8 shadow-lg">
            <div className="mb-8">
              <h4 className="text-xl font-bold mb-2">Configurazione Pesi Metriche</h4>
              <p className="text-muted-foreground">Seleziona un valore da 0% a 30% per ogni variabile</p>
            </div>

            {/* Indicatore somma totale */}
            <div className="mb-6 p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Somma Totale Pesi:</span>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-bold text-lg",
                    isValidTotal ? "text-analytics-green" : "text-analytics-red"
                  )}>
                    {totalWeight}%
                  </span>
                  {!isValidTotal && <AlertCircle className="h-4 w-4 text-analytics-red" />}
                </div>
              </div>
              <Progress
                value={Math.min(totalWeight, 100)}
                className={cn(
                  "h-2",
                  totalWeight > 100 ? "bg-red-100" : ""
                )}
              />
              {!isValidTotal && (
                <p className="text-sm text-analytics-red mt-2">
                  {totalWeight > 100
                    ? `Riduci di ${totalWeight - 100}% per raggiungere il 100%`
                    : `Aggiungi ${100 - totalWeight}% per raggiungere il 100%`
                  }
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8">
              {/* First Column */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Scroll Depth</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={weights.scroll_depth}
                      onChange={(e) => handleWeightChange('scroll_depth', e.target.value)}
                      className="h-10 text-base pr-8 bg-muted/50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  </div>
                  <p className="text-sm text-analytics-green">Positive (+{weights.scroll_depth}%)</p>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Successful Interactions</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={weights.successful_interactions}
                      onChange={(e) => handleWeightChange('successful_interactions', e.target.value)}
                      className="h-10 text-base pr-8 bg-muted/50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  </div>
                  <p className="text-sm text-analytics-green">Positive (+{weights.successful_interactions}%)</p>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Console Errors</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={weights.console_errors}
                      onChange={(e) => handleWeightChange('console_errors', e.target.value)}
                      className="h-10 text-base pr-8 bg-muted/50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  </div>
                  <p className="text-sm text-red-500">Negative (-{weights.console_errors}%)</p>
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
                      value={weights.session_duration}
                      onChange={(e) => handleWeightChange('session_duration', e.target.value)}
                      className="h-10 text-base pr-8 bg-muted/50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  </div>
                  <p className="text-sm text-analytics-green">Positive (+{weights.session_duration}%)</p>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Funnel Step Completion Rate</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={weights.funnel_step_completion_rate}
                      onChange={(e) => handleWeightChange('funnel_step_completion_rate', e.target.value)}
                      className="h-10 text-base pr-8 bg-muted/50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  </div>
                  <p className="text-sm text-analytics-green">Positive (+{weights.funnel_step_completion_rate}%)</p>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Exit On Error</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={weights.exit_on_error}
                      onChange={(e) => handleWeightChange('exit_on_error', e.target.value)}
                      className="h-10 text-base pr-8 bg-muted/50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  </div>
                  <p className="text-sm text-red-500">Negative (-{weights.exit_on_error}%)</p>
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
                      value={weights.pages_per_session}
                      onChange={(e) => handleWeightChange('pages_per_session', e.target.value)}
                      className="h-10 text-base pr-8 bg-muted/50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  </div>
                  <p className="text-sm text-analytics-green">Positive (+{weights.pages_per_session}%)</p>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Rage Clicks</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={weights.rage_clicks}
                      onChange={(e) => handleWeightChange('rage_clicks', e.target.value)}
                      className="h-10 text-base pr-8 bg-muted/50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  </div>
                  <p className="text-sm text-red-500">Negative (-{weights.rage_clicks}%)</p>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Fast Bounce</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={weights.fast_bounce}
                      onChange={(e) => handleWeightChange('fast_bounce', e.target.value)}
                      className="h-10 text-base pr-8 bg-muted/50"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                  </div>
                  <p className="text-sm text-red-500">Negative (-{weights.fast_bounce}%)</p>
                </div>
              </div>
            </div>

            {/* Alert per modifiche non salvate */}
            {hasUnsavedChanges && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Hai modifiche non salvate. Salva o annulla per continuare.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-between items-center pt-6 border-t border-border">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetToDefault}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Default
                </Button>
                {hasUnsavedChanges && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetWeights}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Annulla Modifiche
                  </Button>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsWeightConfigOpen(false)}>
                  Chiudi
                </Button>
                <Button
                  onClick={handleSaveWeights}
                  disabled={!isValidTotal}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Salva Configurazione
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {hasUnsavedChanges && (
            <div className="mb-4 p-3 bg-analytics-blue/5 border border-analytics-blue/20 rounded-lg">
              <p className="text-sm text-analytics-blue">
                <strong>Anteprima:</strong> Le percentuali mostrate riflettono la configurazione dei pesi corrente.
                Salva per applicare definitivamente le modifiche.
              </p>
            </div>
          )}
          {qualityScores.map((score, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">{score.name}</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-bold text-${score.color}`}>{score.value}%</span>
                  {hasUnsavedChanges && (
                    <span className="text-xs text-muted-foreground">(aggiornato)</span>
                  )}
                </div>
              </div>
              <Progress value={score.value} className="h-2" />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Click Analytics & Heatmap - Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Heatmap - Takes 2/3 of width on desktop */}
        <div className="xl:col-span-2 bg-dashboard-surface/60 border border-dashboard-border shadow-card p-4 md:p-6 dashboard-card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-lg font-semibold">HEATMAP INTERATTIVA</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <div className="flex bg-dashboard-surface border border-dashboard-border overflow-hidden">
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
                        "text-xs px-2 md:px-3 py-2 border-0 whitespace-nowrap",
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
                className="text-xs hidden sm:block"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className={cn(
            "border border-dashboard-border bg-gradient-to-br from-analytics-blue/10 via-analytics-green/10 to-analytics-orange/10 overflow-auto",
            isHeatmapFullscreen ? "fixed inset-4 z-50 h-[calc(100vh-2rem)]" : "h-[500px]"
          )}>
            <div className="w-full h-full flex items-center justify-center">
              <img
                src="/images/test.png"
                alt="Heatmap Placeholder"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
          
          {isHeatmapFullscreen && (
            <Button
              variant="ghost"
              onClick={() => setIsHeatmapFullscreen(false)}
              className="fixed top-8 right-8 z-50"
            >
              ✕ CHIUDI
            </Button>
          )}
        </div>
        
        {/* Click Analytics - Takes 1/3 of width on desktop, vertical layout */}
        <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-4 md:p-6 dashboard-card container-safe">
          <h3 className="text-lg font-semibold mb-6">CLICK ANALYTICS</h3>
          <div className="space-y-6">
            <KPICard
              title="CLICK TOTALI SITO"
              value={totalClicks.toLocaleString()}
              subtitle="nelle ultime 24 ore"
              icon={MousePointer}
              color="blue"
              className="h-auto"
            />
            
            {/* Additional click metrics can be added here */}
            <div className="space-y-4">
              <div className="text-sm font-medium text-muted-foreground">
                BREAKDOWN CLICK
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Home Page</span>
                  <span className="font-bold text-analytics-blue">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Products</span>
                  <span className="font-bold text-analytics-green">32%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Contact</span>
                  <span className="font-bold text-analytics-orange">23%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Analisi Path Utenti - New Design */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6">ANALISI PATH UTENTI</h3>
        
        {/* Path Metrics above */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-dashboard-surface/30 border border-dashboard-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Pagine per Sessione</span>
              <Navigation className="h-4 w-4 text-analytics-blue" />
            </div>
            <span className="font-bold text-2xl text-analytics-blue">2.4</span>
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
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 overflow-x-auto">
            <div className="border-2 border-primary p-4 lg:p-8 w-32 lg:w-48 h-24 lg:h-40 flex flex-col items-center justify-center rounded-2xl min-w-[8rem]">
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
            <div className="border-2 border-primary p-8 w-48 h-40 flex flex-col items-center justify-center rounded-2xl">
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
            <div className="border-2 border-primary p-8 w-48 h-40 flex flex-col items-center justify-center rounded-2xl">
              <Phone className="h-12 w-12 text-pink-500 mb-3" />
              <span className="text-lg font-semibold text-blue-400 mb-1">Contatti</span>
              <span className="text-base text-blue-400 font-medium">25%</span>
            </div>
          </div>
        </div>

        {/* Percorso Informativo - Blocchi medi */}
        <div className="mb-16">
          <h4 className="text-lg font-mono text-foreground mb-8 text-center">Percorso Informativo (18% utenti)</h4>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-4 overflow-x-auto">
            <div className="border-2 border-primary p-6 w-36 h-30 flex flex-col items-center justify-center rounded-2xl">
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
            <div className="border-2 border-primary p-6 w-36 h-30 flex flex-col items-center justify-center rounded-2xl">
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
            <div className="border-2 border-primary p-6 w-36 h-30 flex flex-col items-center justify-center rounded-2xl">
              <FileText className="h-9 w-9 text-green-500 mb-2" />
              <span className="text-base font-semibold text-blue-400 mb-1">Blog</span>
              <span className="text-sm text-blue-400 font-medium">45%</span>
            </div>
          </div>
        </div>

        {/* Percorso Contenuti - Blocchi piccoli */}
        <div className="mb-16">
          <h4 className="text-lg font-mono text-foreground mb-8 text-center">Percorso Contenuti (15% utenti)</h4>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-4 overflow-x-auto">
            <div className="border-2 border-primary p-4 w-28 h-24 flex flex-col items-center justify-center rounded-2xl">
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
            <div className="border-2 border-primary p-4 w-28 h-24 flex flex-col items-center justify-center rounded-2xl">
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
            <div className="border-2 border-primary p-4 w-28 h-24 flex flex-col items-center justify-center rounded-2xl">
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
              <div className="flex items-center gap-2 text-sm bg-dashboard-surface/30 p-3 border border-dashboard-border mobile-scroll text-overflow-safe">
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

      {/* Sessioni Problematiche - Duplicated from TechSection */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono">SESSIONI PROBLEMATICHE</h3>
        <div className="space-y-3">
          {problematicSessions.map((session, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors border border-dashboard-border">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-mono text-muted-foreground">{session.id}</span>
                <span className={`text-sm font-medium font-mono ${
                  session.severity === 'high' ? 'text-analytics-red' : 'text-analytics-orange'
                }`}>
                  {session.issue}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://eu.posthog.com/project/48794/replay/${session.id}`, '_blank')}
                className="flex items-center space-x-1 text-xs"
              >
                <Play className="h-3 w-3" />
                <span>Video</span>
              </Button>
            </div>
          ))}
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
>>>>>>> 9d80c54135e1641109dff4efad49d7cdeb0d06de
}