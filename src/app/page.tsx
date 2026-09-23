"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { ModuleNav } from "@/components/ModuleNav";
import { StatsTicker } from "@/components/StatsTicker";
import { MasterGisMap } from "@/components/Map/MasterGisMap";
import { ProjectDrawer } from "@/components/Map/ProjectDrawer";
import { ProjectTracker } from "@/components/Modules/ProjectTracker";
import { CitizenReportsFeed } from "@/components/Modules/CitizenReportsFeed";
import { CitizenReportingModal } from "@/components/Modules/CitizenReportingModal";
import { DailyUpdatesView } from "@/components/Modules/DailyUpdatesView";
import { AnalyticsDashboard } from "@/components/Modules/AnalyticsDashboard";
import { AiAssistantDrawer } from "@/components/Modules/AiAssistantDrawer";
import { EmergencyContactsModal } from "@/components/UI/EmergencyContactsModal";
import { PhoneCall, Building2 } from "lucide-react";

export default function Home() {
  const { activeTab, setActiveTab, t, language } = useApp();
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const renderActiveModule = () => {
    switch (activeTab) {
      case "master-gis":
        return <MasterGisMap />;
      case "projects":
        return <ProjectTracker />;
      case "citizen-reports":
        return <CitizenReportsFeed />;
      case "updates":
        return <DailyUpdatesView />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "ai-assistant":
        return (
          <div className="py-6">
            <AiAssistantDrawer />
            <MasterGisMap />
          </div>
        );
      default:
        return <MasterGisMap />;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Institutional Header */}
      <Navbar />

      {/* Streamlined Core Module Navigation Bar */}
      <ModuleNav />

      {/* Real-Time KPIs Stats Bar */}
      <StatsTicker />

      {/* Main Module Content */}
      <div className="flex-1 w-full bg-slate-50">
        {renderActiveModule()}
      </div>

      {/* Slide-over Project Dossier Drawer */}
      <ProjectDrawer />

      {/* Citizen Grievance Modal */}
      <CitizenReportingModal />

      {/* AI Assistant Drawer */}
      <AiAssistantDrawer />

      {/* Emergency Directory Modal */}
      {isEmergencyModalOpen && (
        <div id="emergency-modal-backdrop">
          <EmergencyContactsModal
            isOpen={isEmergencyModalOpen}
            onClose={() => setIsEmergencyModalOpen(false)}
          />
        </div>
      )}

      {/* Institutional Civic Footer */}
      <footer className="bg-[#0f2b48] text-white py-10 px-4 sm:px-6 lg:px-8 mt-auto border-t border-slate-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-100 text-sm sm:text-base">
                {t.platformName}
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Chakan Development Forum (CDF) & MIDC Industries Transparency Initiative
              </p>
            </div>
          </div>

          {/* Quick Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="text-amber-300 hover:text-amber-200 flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t.nav.emergencyHelp}</span>
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={() => setActiveTab("updates")}
              className="hover:text-amber-300 transition-colors text-slate-200"
            >
              {language === "mr" ? "दैनिक कामे व GR" : "Daily Updates & Circulars"}
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={() => setActiveTab("projects")}
              className="hover:text-amber-300 transition-colors text-slate-200"
            >
              {language === "mr" ? "विकासकामे ट्रॅकर" : "Project Tracker"}
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={() => setActiveTab("analytics")}
              className="hover:text-amber-300 transition-colors text-slate-200"
            >
              {language === "mr" ? "पारदर्शकता अहवाल" : "War Room Analytics"}
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 Chakan Development Forum. Built for Infrastructure Transparency & Civic Accountability.
          </span>
          <span className="text-emerald-400 font-semibold">
            Certified Non-Partisan & Open Civic Data Initiative
          </span>
        </div>
      </footer>
    </main>
  );
}
