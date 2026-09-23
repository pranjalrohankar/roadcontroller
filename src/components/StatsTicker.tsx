"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Flame,
  Gauge,
} from "lucide-react";

export const StatsTicker: React.FC = () => {
  const { language, projects, citizenReports, trafficPoints } = useApp();

  const totalSanctionedCr = projects.reduce((acc, p) => acc + p.budgetCr, 0);
  const totalSpentCr = projects.reduce((acc, p) => acc + p.spentCr, 0);
  const delayedCount = projects.filter((p) => p.status === "Delayed").length;
  const inProgressCount = projects.filter((p) => p.status !== "Completed" && p.status !== "Proposed").length;

  const totalReports = citizenReports.length;
  const resolvedReports = citizenReports.filter((r) => r.status === "Resolved").length;
  const resolutionPercentage = Math.round((resolvedReports / Math.max(1, totalReports)) * 100);

  const criticalTrafficCount = trafficPoints.filter((tp) => tp.severity === "Critical").length;

  return (
    <div className="bg-white border-b border-slate-200 py-3 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
        {/* KPI 1: Total Sanctioned Budget */}
        <div className="gov-card rounded-xl p-3 flex flex-col justify-between hover:border-slate-300 transition-all bg-slate-50/50">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wide leading-tight">
              {language === "mr" ? "मंजूर निधी" : "Sanctioned Budget"}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1">
              <span>₹{totalSanctionedCr.toFixed(1)}</span>
              <span className="text-xs text-slate-500 font-semibold">{language === "mr" ? "कोटी" : "Cr"}</span>
            </p>
            <span className="text-[10px] text-slate-400 font-medium block">Total 8 Capital Works</span>
          </div>
        </div>

        {/* KPI 2: Budget Spent */}
        <div className="gov-card rounded-xl p-3 flex flex-col justify-between hover:border-slate-300 transition-all bg-slate-50/50">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wide leading-tight">
              {language === "mr" ? "वितरित निधी" : "Budget Disbursed"}
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-base sm:text-lg font-extrabold text-blue-800 tracking-tight flex items-baseline gap-1">
              <span>₹{totalSpentCr.toFixed(1)}</span>
              <span className="text-xs text-slate-500 font-semibold">{language === "mr" ? "कोटी" : "Cr"}</span>
            </p>
            <span className="text-[10px] text-blue-600 font-bold block">
              {Math.round((totalSpentCr / totalSanctionedCr) * 100)}% Utilized
            </span>
          </div>
        </div>

        {/* KPI 3: Projects in Progress */}
        <div className="gov-card rounded-xl p-3 flex flex-col justify-between hover:border-slate-300 transition-all bg-slate-50/50">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wide leading-tight">
              {language === "mr" ? "सक्रिय कामे" : "Active Projects"}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Gauge className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1">
              <span>{inProgressCount}</span>
              <span className="text-xs text-slate-500 font-semibold">/ {projects.length} Active</span>
            </p>
            <span className="text-[10px] text-amber-700 font-bold block">On-Ground Execution</span>
          </div>
        </div>

        {/* KPI 4: Delayed / Bottleneck Projects */}
        <div className="gov-card rounded-xl p-3 flex flex-col justify-between hover:border-rose-300 transition-all bg-rose-50/30 border-rose-200">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-[11px] font-bold text-rose-800 uppercase tracking-wide leading-tight">
              {language === "mr" ? "विलंब / अडकलेले" : "Delayed Projects"}
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-base sm:text-lg font-extrabold text-rose-700 tracking-tight flex items-baseline gap-1.5">
              <span>{delayedCount}</span>
              <span className="text-xs font-bold text-rose-800">Delayed</span>
            </p>
            <span className="text-[10px] text-rose-600 font-semibold block truncate">
              {language === "mr" ? "भूसंपादन / एनओसी प्रलंबित" : "Land / NOC Pending"}
            </span>
          </div>
        </div>

        {/* KPI 5: Citizen Grievances Resolved */}
        <div className="gov-card rounded-xl p-3 flex flex-col justify-between hover:border-slate-300 transition-all bg-slate-50/50">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wide leading-tight">
              {language === "mr" ? "तक्रार निवारण" : "Grievance Resolution"}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-base sm:text-lg font-extrabold text-emerald-700 tracking-tight flex items-baseline gap-1">
              <span>{resolutionPercentage}%</span>
              <span className="text-xs text-slate-500 font-semibold">({resolvedReports}/{totalReports})</span>
            </p>
            <span className="text-[10px] text-emerald-700 font-bold block">Verified by Citizens</span>
          </div>
        </div>

        {/* KPI 6: Active Traffic Chokepoints */}
        <div className="gov-card rounded-xl p-3 flex flex-col justify-between hover:border-amber-300 transition-all bg-amber-50/30 border-amber-200">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-900 uppercase tracking-wide leading-tight">
              {language === "mr" ? "वाहतूक कोंडी" : "Traffic Chokepoints"}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-base sm:text-lg font-extrabold text-amber-900 tracking-tight flex items-baseline gap-1.5">
              <span>{criticalTrafficCount}</span>
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">Critical</span>
            </p>
            <span className="text-[10px] text-amber-800 font-semibold block truncate">
              {language === "mr" ? "माणिक चौक / चाकण चौक" : "Manik Chowk & Bypass"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
