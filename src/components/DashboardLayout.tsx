import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, BarChart3, TrendingUp, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const navigation = [
  { id: "home", label: "Dashboard", icon: BarChart3 },
  { id: "ux", label: "UX", icon: Users },
  { id: "tech", label: "Tech", icon: Zap },
];

export function DashboardLayout({ children, currentSection, onSectionChange }: DashboardLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(true); // Dark mode as default

  // Set dark mode on component mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <div className={cn("min-h-screen bg-background transition-colors duration-200")}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-dashboard-border bg-background/95 backdrop-blur">
        <div className="container flex h-20 items-center justify-between px-8">
          <div className="flex items-center space-x-6">
            <BarChart3 className="h-10 w-10 text-analytics-blue" />
            <h1 className="text-3xl font-black text-foreground tracking-wider">VELIU ANALYTICS</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={cn(
                      "flex items-center space-x-3 px-6 py-3 border border-dashboard-border text-sm font-medium tracking-wide transition-all duration-150",
                      currentSection === item.id 
                        ? "bg-analytics-blue text-white border-analytics-blue" 
                        : "bg-dashboard-surface/40 text-muted-foreground hover:bg-dashboard-surface-hover/60 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center h-12 w-12 border border-dashboard-border bg-dashboard-surface/40 text-muted-foreground hover:bg-dashboard-surface-hover/60 hover:text-foreground transition-all duration-150"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-b border-dashboard-border bg-background">
        <div className="container px-8 py-4">
          <div className="flex space-x-2 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 border border-dashboard-border text-sm font-medium whitespace-nowrap transition-all duration-150",
                    currentSection === item.id 
                      ? "bg-analytics-blue text-white border-analytics-blue" 
                      : "bg-dashboard-surface/40 text-muted-foreground hover:bg-dashboard-surface-hover/60"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container px-8 py-12">
        {children}
      </main>
    </div>
  );
}