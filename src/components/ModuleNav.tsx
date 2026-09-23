"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  Map,
  Folders,
  AlertTriangle,
  Newspaper,
  BarChart3,
  Bot,
} from "lucide-react";

export const ModuleNav: React.FC = () => {
  const { activeTab, setActiveTab, t, projects, citizenReports, language } = useApp();

  const activeReportsCount = citizenReports.filter((r) => r.status !== "Resolved").length;

  const modules = [
    {
      id: "master-gis",
      label: language === "mr" ? "नकाशा (Master GIS)" : "Master GIS Map",
      icon: Map,
      badge: "LIVE GIS",
    },
    {
      id: "projects",
      label: language === "mr" ? "विकासकामे व प्रगती (Progress)" : "Project Progress Tracker",
      icon: Folders,
      count: projects.length,
    },
    {
      id: "citizen-reports",
      label: language === "mr" ? "तक्रारी व गुणवत्ता (Reports)" : "Citizen Reports & Quality",
      icon: AlertTriangle,
      count: activeReportsCount,
    },
    {
      id: "updates",
      label: language === "mr" ? "दैनिक अपडेट्स व GR (Updates)" : "Daily Updates & News Releases",
      icon: Newspaper,
      badge: "NEW",
    },
    {
      id: "analytics",
      label: language === "mr" ? "पारदर्शकता अहवाल (Analytics)" : "War Room Analytics",
      icon: BarChart3,
    },
    {
      id: "ai-assistant",
      label: language === "mr" ? "चाकण AI सहाय्यक" : "Chakan Infra AI",
      icon: Bot,
      isAi: true,
    },
  ];

  return (
    <nav className="bg-slate-100/90 border-b border-slate-200 px-3 sm:px-6 py-2 overflow-x-auto scrollbar-none shadow-2xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-max">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeTab === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveTab(m.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
                  isActive
                    ? "bg-[#0f2b48] text-white shadow-sm font-bold"
                    : "text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200"
                } ${m.isAi && !isActive ? "text-indigo-900 bg-indigo-50/80 border border-indigo-200" : ""}`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-amber-400" : m.isAi ? "text-indigo-600" : "text-slate-500"
                  }`}
                />
                <span>{m.label}</span>

                {/* Dynamic Badges */}
                {m.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 font-bold rounded ${
                      m.badge === "NEW" ? "bg-amber-500 text-slate-900" : "bg-emerald-600 text-white"
                    }`}
                  >
                    {m.badge}
                  </span>
                )}
                {m.count !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-slate-700 text-slate-100" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {m.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
