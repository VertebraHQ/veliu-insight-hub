import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-analytics-blue mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! Pagina non trovata</p>
        <a href="/" className="text-analytics-blue hover:text-analytics-blue-light underline font-medium">
          Torna alla Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
