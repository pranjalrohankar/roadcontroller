"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { RoadSegment, Authority } from "@/types";
import {
  Route,
  Search,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Phone,
  AlertTriangle,
} from "lucide-react";

export const RoadProgressTracker: React.FC = () => {
  const { roadSegments, t, language, setFocusOnMapLocation, setActiveTab } = useApp();
  const [search, setSearch] = useState("");
  const [authorityFilter, setAuthorityFilter] = useState("ALL");
  const [colorFilter, setColorFilter] = useState("ALL");

  const filteredRoads = roadSegments.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.nameMr.toLowerCase().includes(search.toLowerCase()) ||
      r.fromNode.toLowerCase().includes(search.toLowerCase()) ||
      r.toNode.toLowerCase().includes(search.toLowerCase());

    const matchesAuth = authorityFilter === "ALL" || r.authority === authorityFilter;
    const matchesColor = colorFilter === "ALL" || r.colorCode === colorFilter;

    return matchesSearch && matchesAuth && matchesColor;
  });

  const getColorPill = (color: string) => {
    switch (color) {
      case "Green":
        return {
          bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
          dot: "bg-emerald-600",
          label: language === "mr" ? "पूर्ण (Green)" : "Completed",
        };
      case "Yellow":
        return {
          bg: "bg-amber-100 text-amber-800 border-amber-300",
          dot: "bg-amber-600",
          label: language === "mr" ? "काम सुरू (Yellow)" : "Under Construction",
        };
      case "Red":
        return {
          bg: "bg-rose-100 text-rose-800 border-rose-300",
          dot: "bg-rose-600",
          label: language === "mr" ? "विलंब / खड्डे (Red)" : "Delayed / Critical",
        };
      case "Blue":
        return {
          bg: "bg-blue-100 text-blue-800 border-blue-300",
          dot: "bg-blue-600",
          label: language === "mr" ? "मंजूर (Blue)" : "Approved",
        };
      default:
        return {
          bg: "bg-slate-100 text-slate-700 border-slate-300",
          dot: "bg-slate-500",
          label: language === "mr" ? "सुरू नाही (Grey)" : "Not Started",
        };
    }
  };

  const getConditionColor = (cond: string) => {
    switch (cond) {
      case "Excellent":
        return "text-emerald-700 font-bold";
      case "Good":
        return "text-teal-700 font-semibold";
      case "Fair":
        return "text-amber-700 font-semibold";
      case "Poor":
        return "text-orange-700 font-bold";
      case "Critical Potholes":
        return "text-rose-700 font-bold";
      default:
        return "text-slate-600";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Route className="w-6 h-6 text-blue-800" />
            <span>{t.roads.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.roads.subtitle}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white px-3 py-2 rounded-lg flex items-center gap-2 border border-slate-300 text-xs w-full sm:w-64 shadow-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={t.roads.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-slate-900 focus:outline-none w-full placeholder-slate-400 font-medium"
            />
          </div>

          <select
            value={authorityFilter}
            onChange={(e) => setAuthorityFilter(e.target.value)}
            className="bg-white px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none font-medium shadow-xs"
          >
            <option value="ALL">{t.authorities.allAuthorities}</option>
            <option value="PWD">PWD</option>
            <option value="MIDC">MIDC</option>
            <option value="PMRDA">PMRDA</option>
            <option value="NHAI">NHAI</option>
            <option value="GramPanchayat">Gram Panchayat</option>
          </select>

          <select
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
            className="bg-white px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none font-medium shadow-xs"
          >
            <option value="ALL">{language === "mr" ? "सर्व रंग संकेत" : "All Status Colors"}</option>
            <option value="Green">Green (Completed)</option>
            <option value="Yellow">Yellow (Under Construction)</option>
            <option value="Red">Red (Delayed / Critical)</option>
            <option value="Blue">Blue (Approved)</option>
          </select>
        </div>
      </div>

      {/* Standardized Guide Card */}
      <div className="gov-panel rounded-xl p-4 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
        <span className="font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          {t.roads.statusColorGuide}
        </span>
        <span className="text-[11px] text-slate-500 font-medium">
          Audited under Chakan Infrastructure Monitoring Framework
        </span>
      </div>

      {/* Road Segment Cards */}
      <div className="space-y-4">
        {filteredRoads.map((road) => {
          const colorInfo = getColorPill(road.colorCode);
          return (
            <div
              key={road.id}
              className="gov-card rounded-2xl p-5 border border-slate-200 hover:border-blue-400 transition-all shadow-sm space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                    {road.id}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-blue-900 border border-slate-300">
                    {road.authority}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${colorInfo.bg}`}>
                    <span className={`w-2 h-2 rounded-full ${colorInfo.dot}`}></span>
                    <span>{colorInfo.label}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                  <span>
                    <b>{t.roads.length}:</b> {road.lengthKm} km
                  </span>
                  <span>•</span>
                  <span>
                    <b>{t.roads.lanes}:</b> {road.lanes} {language === "mr" ? "लेन" : "Lanes"}
                  </span>
                </div>
              </div>

              {/* Stretch Corridor */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === "mr" ? road.nameMr : road.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 font-medium">
                    <span className="text-emerald-700">
                      {language === "mr" ? road.fromNodeMr : road.fromNode}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-blue-700">
                      {language === "mr" ? road.toNodeMr : road.toNode}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full md:w-56 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">{t.project.progress}:</span>
                    <span className="text-emerald-700">{road.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${road.progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Engineering Audit Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block font-medium">{t.roads.condition}:</span>
                  <span className={getConditionColor(road.currentCondition)}>
                    {road.currentCondition}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">{t.project.contractor}:</span>
                  <span className="text-slate-900 font-bold truncate block">
                    {road.contractor}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">{t.roads.lastAudit}:</span>
                  <span className="text-slate-700 font-medium">📅 {road.lastInspectedDate}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{road.officerContact}</span>
                </div>

                <div className="flex items-center gap-2">
                  {road.criticalIssuesCount > 0 && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      {road.criticalIssuesCount} {t.roads.criticalIssues}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      if (road.coordinates && road.coordinates[0]) {
                        setFocusOnMapLocation(road.coordinates[0]);
                        setActiveTab("master-gis");
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#0f2b48] hover:bg-[#1a3d60] text-white font-semibold flex items-center gap-1 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{t.actions.viewOnMap}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
