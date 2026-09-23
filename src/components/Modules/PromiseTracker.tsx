"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { PromiseItem, Authority } from "@/types";
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Hourglass,
} from "lucide-react";

export const PromiseTracker: React.FC = () => {
  const { promises, t, language } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredPromises = promises.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.titleMr.toLowerCase().includes(search.toLowerCase()) ||
      p.commitment.toLowerCase().includes(search.toLowerCase()) ||
      p.responsibleLeaderOrOfficer.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Fulfilled":
        return {
          bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
          icon: CheckCircle2,
          label: t.promises.statusFulfilled,
        };
      case "In Progress":
        return {
          bg: "bg-amber-100 text-amber-800 border-amber-300",
          icon: Clock,
          label: t.promises.statusInProgress,
        };
      case "Delayed / Overdue":
        return {
          bg: "bg-rose-100 text-rose-800 border-rose-300",
          icon: AlertTriangle,
          label: t.promises.statusDelayed,
        };
      default:
        return {
          bg: "bg-slate-100 text-slate-700 border-slate-300",
          icon: Hourglass,
          label: t.promises.statusStalled,
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-600" />
            <span>{t.promises.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.promises.subtitle}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white px-3 py-2 rounded-lg flex items-center gap-2 border border-slate-300 text-xs w-full sm:w-64 shadow-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search commitments or meetings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-slate-900 focus:outline-none w-full placeholder-slate-400 font-medium"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none font-medium shadow-xs"
          >
            <option value="ALL">{language === "mr" ? "सर्व आश्वासने" : "All Promises"}</option>
            <option value="Fulfilled">Fulfilled (पूर्ण झालेले)</option>
            <option value="In Progress">In Progress (सुरू असलेले)</option>
            <option value="Delayed / Overdue">Delayed / Overdue (मुदत उलटलेली)</option>
            <option value="Stalled">Stalled (ठप्प)</option>
          </select>
        </div>
      </div>

      {/* Promises Cards */}
      <div className="space-y-4">
        {filteredPromises.map((p) => {
          const st = getStatusBadge(p.status);
          const Icon = st.icon;
          return (
            <div
              key={p.id}
              className="gov-card rounded-2xl p-5 border border-slate-200 hover:border-blue-400 transition-all shadow-sm space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                    {p.id}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-blue-900 border border-slate-300">
                    {p.responsibleAuthority}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${st.bg}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{st.label}</span>
                  </span>
                </div>

                <div className="text-xs text-slate-600 font-semibold flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    <b>{t.promises.deadline}:</b> {p.deadline}
                  </span>
                </div>
              </div>

              {/* Title & Source */}
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {language === "mr" ? p.titleMr : p.title}
                </h3>
                <p className="text-xs text-blue-800 font-semibold mt-0.5 flex items-center gap-1">
                  <span>🏛️</span>
                  <span>{language === "mr" ? p.sourceMeetingMr : p.sourceMeeting}</span>
                  <span className="text-slate-500 font-normal">({p.announcementDate})</span>
                </p>
              </div>

              {/* Commitment Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div>
                  <span className="text-slate-500 block font-bold mb-1">{t.promises.commitment}:</span>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    "{language === "mr" ? p.commitmentMr : p.commitment}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-600">
                  <span>
                    <b>{language === "mr" ? "जबाबदार अधिकारी / अध्यक्ष:" : "Accountable Official:"}</b>{" "}
                    <span className="font-bold text-slate-900">{language === "mr" ? p.responsibleLeaderOrOfficerMr : p.responsibleLeaderOrOfficer}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{t.promises.progress}:</span>
                    <span className="font-bold text-emerald-700">{p.progressPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="text-xs text-slate-700 bg-amber-50/70 p-3 rounded-xl border border-amber-200 flex items-start gap-2">
                <span className="text-amber-800 font-bold">Audit Review Note:</span>
                <span>{language === "mr" ? p.notesMr : p.notes}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
