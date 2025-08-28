import { useState } from "react";
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
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={cn("min-h-screen bg-background transition-colors duration-200")}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-dashboard-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-8 w-8 text-analytics-blue" />
            <h1 className="text-2xl font-bold text-foreground font-mono tracking-tight">VELIU ANALYTICS</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentSection === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onSectionChange(item.id)}
                    className={cn(
                      "flex items-center space-x-2",
                      currentSection === item.id && "bg-analytics-blue text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </nav>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="h-9 w-9"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-b border-dashboard-border bg-card">
        <div className="container px-6 py-2">
          <div className="flex space-x-1 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentSection === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "flex items-center space-x-2 whitespace-nowrap",
                    currentSection === item.id && "bg-analytics-blue text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container px-6 py-6">
        {children}
      </main>
    </div>
  );
}