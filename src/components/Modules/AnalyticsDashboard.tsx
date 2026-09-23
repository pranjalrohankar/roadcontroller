"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  BarChart3,
  TrendingUp,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Download,
} from "lucide-react";

export const AnalyticsDashboard: React.FC = () => {
  const { projects, citizenReports, t, language } = useApp();

  const authorities = ["PWD", "NHAI", "MIDC", "PMRDA", "GramPanchayat"];

  const deptData = authorities.map((auth) => {
    const authProjects = projects.filter((p) => p.authority === auth);
    const totalBudget = authProjects.reduce((acc, p) => acc + p.budgetCr, 0);
    const totalSpent = authProjects.reduce((acc, p) => acc + p.spentCr, 0);
    const avgProgress =
      authProjects.length > 0
        ? Math.round(
            authProjects.reduce((acc, p) => acc + p.progressPercent, 0) / authProjects.length
          )
        : 0;

    return {
      auth,
      count: authProjects.length,
      totalBudget,
      totalSpent,
      avgProgress,
    };
  });

  const delayFactors = [
    { cause: "Utility & MSEDCL Electric Pole Shifting", causeMr: "महावितरण वीज खांब व केबल स्थलांतर", percent: 38 },
    { cause: "Land Compensation & Court Disputes", causeMr: "भूसंपादन व न्यायालयीन दावे", percent: 28 },
    { cause: "Heavy Traffic Diversion Hurdles", causeMr: "वाहतूक वळवण्यातील अडथळे", percent: 18 },
    { cause: "Inter-departmental PMRDA/NHAI Clearances", causeMr: "विभागीय मंजुऱ्या व समन्वय", percent: 16 },
  ];

  const handleExportReport = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-800" />
            <span>{t.analytics.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.analytics.subtitle}
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-2 border border-slate-300 shadow-xs transition-colors self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-blue-700" />
          <span>{t.actions.exportData}</span>
        </button>
      </div>

      {/* Department Breakdown Scorecard */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>📊</span>
          <span>{t.analytics.authorityComparison}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {deptData.map((d) => (
            <div
              key={d.auth}
              className="gov-card rounded-2xl p-5 border border-slate-200 space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                  {d.auth}
                </span>
                <span className="text-xs text-slate-500 font-semibold">{d.count} Capital Works</span>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-500">Execution Velocity:</span>
                  <span className="text-emerald-700 font-bold text-sm">{d.avgProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${d.avgProgress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block font-medium">Sanctioned:</span>
                  <span className="font-bold text-slate-900">₹{d.totalBudget.toFixed(1)} Cr</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block font-medium">Disbursed:</span>
                  <span className="font-bold text-blue-700">₹{d.totalSpent.toFixed(1)} Cr</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delay Factor & Resolution Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        <div className="gov-card rounded-2xl p-5 border border-slate-200 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-700" />
            <span>{t.analytics.delayFactorAnalysis}</span>
          </h3>

          <div className="space-y-3">
            {delayFactors.map((df, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-700 font-medium">
                  <span>{language === "mr" ? df.causeMr : df.cause}</span>
                  <span className="font-bold text-rose-700">{df.percent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="bg-rose-600 h-full rounded-full"
                    style={{ width: `${df.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="gov-card rounded-2xl p-5 border border-slate-200 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span>{t.analytics.grievanceResolutionRate}</span>
          </h3>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700 font-medium">
            <div className="flex justify-between items-center">
              <span>Total Grievances Registered:</span>
              <span className="font-bold text-slate-900 text-sm">{citizenReports.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Resolved with Photo Proof:</span>
              <span className="font-bold text-emerald-800 text-sm">
                {citizenReports.filter((r) => r.status === "Resolved").length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Average Resolution SLA:</span>
              <span className="font-bold text-blue-800">4.2 Days</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Public Accountability Trust Score:</span>
              <span className="font-bold text-amber-800">94.6%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
