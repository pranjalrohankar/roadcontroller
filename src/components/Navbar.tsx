"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Role } from "@/types";
import {
  Building2,
  Bot,
  PlusCircle,
  Globe,
  UserCheck,
  ChevronDown,
  Layers,
  Sparkles,
  ShieldCheck,
  Phone,
  FileCheck2,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    t,
    setIsReportModalOpen,
    setIsAiDrawerOpen,
    setActiveTab,
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const availableRoles: { id: Role; label: string; icon: string }[] = [
    { id: "Citizen", label: t.roles.Citizen, icon: "👤" },
    { id: "Industry", label: t.roles.Industry, icon: "🏭" },
    { id: "Officer_PWD", label: t.roles.Officer_PWD, icon: "🏗️" },
    { id: "Officer_MIDC", label: t.roles.Officer_MIDC, icon: "⚙️" },
    { id: "Officer_NHAI", label: t.roles.Officer_NHAI, icon: "🛣️" },
    { id: "Officer_PMRDA", label: t.roles.Officer_PMRDA, icon: "🏙️" },
    { id: "Officer_GP", label: t.roles.Officer_GP, icon: "🏛️" },
    { id: "Collector_Admin", label: t.roles.Collector_Admin, icon: "👑" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-800 shadow-sm">
      {/* Top Government-Grade Institutional Bar */}
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800 px-4 py-1 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>CHAKAN DEVELOPMENT FORUM</span>
            <span className="text-slate-500 font-normal">|</span>
            <span className="text-slate-300 font-normal">चाकण विकास मंच</span>
          </div>
          <span className="hidden lg:inline text-slate-400 text-[11px]">
            — {t.neutralityDisclaimer}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-300">
          <span className="hidden sm:inline text-slate-400">
            📍 Pune District, Maharashtra
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-medium">
            🚨 Helpline: 1033 / 112
          </span>
        </div>
      </div>

      {/* Main Executive Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div
          onClick={() => setActiveTab("master-gis")}
          className="flex items-center gap-3.5 cursor-pointer group flex-shrink-0"
        >
          <div className="w-11 h-11 rounded-lg bg-[#0f2b48] border border-slate-700 flex items-center justify-center text-white shadow-sm group-hover:bg-[#1a3d60] transition-colors">
            <Building2 className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-tight group-hover:text-blue-900 transition-colors">
                {language === "mr" ? "चाकण पायाभूत विकास व पारदर्शकता पोर्टल" : "Chakan Development & Transparency Portal"}
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Side Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Assistant Button */}
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-semibold transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Chakan Infra AI</span>
            <span className="sm:hidden">AI Desk</span>
          </button>

          {/* Submit Grievance / Report Problem Button */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#047857] hover:bg-[#065f46] text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.nav.reportIssueBtn}</span>
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-medium transition-colors"
              title={t.roles.switchRolePrompt}
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-700" />
              <span className="hidden md:inline max-w-[140px] truncate">
                {t.roles[role]}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-fade-in text-slate-800">
                <div className="px-3.5 py-2 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {t.roles.switchRolePrompt}
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {availableRoles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setRole(r.id);
                        setActiveTab("role-dashboard");
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        role === r.id
                          ? "bg-blue-50 text-blue-900 font-bold border-l-4 border-blue-700"
                          : "text-slate-700"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span>{r.icon}</span>
                        <span className="truncate">{r.label}</span>
                      </span>
                      {role === r.id && (
                        <span className="w-2 h-2 rounded-full bg-blue-700"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 border border-slate-300 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLanguage("mr")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                language === "mr"
                  ? "bg-[#0f2b48] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              मराठी
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                language === "en"
                  ? "bg-[#0f2b48] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
