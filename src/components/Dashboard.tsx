import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { HomeSection } from "@/components/sections/HomeSection";
import { UXSection } from "@/components/sections/UXSection";
import { TechSection } from "@/components/sections/TechSection";

export function Dashboard() {
  const [currentSection, setCurrentSection] = useState("home");

  const renderSection = () => {
    switch (currentSection) {
      case "ux":
        return <UXSection onBack={() => setCurrentSection("home")} />;
      case "tech":
        return <TechSection onBack={() => setCurrentSection("home")} />;
      default:
        return <HomeSection onSectionChange={setCurrentSection} />;
    }
  };

  return (
    <DashboardLayout currentSection={currentSection} onSectionChange={setCurrentSection}>
      {renderSection()}
    </DashboardLayout>
  );
}