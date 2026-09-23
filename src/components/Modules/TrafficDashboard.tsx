"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { TrafficBottleneck, TrafficSeverity } from "@/types";
import {
  Activity,
  Flame,
  AlertTriangle,
  Navigation,
  Radio,
  MapPin,
  Truck,
} from "lucide-react";

export const TrafficDashboard: React.FC = () => {
  const { trafficPoints, t, language, setFocusOnMapLocation, setActiveTab } = useApp();
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");

  const filteredTraffic = trafficPoints.filter((tp) => {
    return selectedSeverity === "ALL" || tp.severity === selectedSeverity;
  });

  const getSeverityBadge = (sev: TrafficSeverity) => {
    switch (sev) {
      case "Critical":
        return {
          bg: "bg-rose-100 text-rose-800 border-rose-300",
          dot: "bg-rose-600",
        };
      case "High":
        return {
          bg: "bg-orange-100 text-orange-800 border-orange-300",
          dot: "bg-orange-600",
        };
      case "Medium":
        return {
          bg: "bg-amber-100 text-amber-800 border-amber-300",
          dot: "bg-amber-600",
        };
      case "Low":
        return {
          bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
          dot: "bg-emerald-600",
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-rose-700" />
            <span>{t.traffic.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.traffic.subtitle}
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-semibold">{t.traffic.trafficSeverity}:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-white px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none font-medium shadow-xs"
          >
            <option value="ALL">{language === "mr" ? "सर्व चोकपॉईंट्स" : "All Chokepoints"}</option>
            <option value="Critical">Critical (गंभीर कोंडी)</option>
            <option value="High">High (जास्त गर्दी)</option>
            <option value="Medium">Medium (मध्यम)</option>
            <option value="Low">Low (सुरळीत)</option>
          </select>
        </div>
      </div>

      {/* Traffic Summary Alert Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="gov-card rounded-2xl p-4.5 bg-rose-50/70 border-rose-200 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-rose-900 font-bold">
              {language === "mr" ? "चाकण माणिक चौक - सर्वाधिक गर्दी" : "Chakan Manik Chowk - High Delay"}
            </p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              +42 {language === "mr" ? "मिनिटे सरासरी विलंब" : "Mins Average Delay"}
            </p>
          </div>
        </div>

        <div className="gov-card rounded-2xl p-4.5 bg-amber-50/70 border-amber-200 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-amber-900 font-bold">
              {language === "mr" ? "MIDC जड वाहने निर्बंध वेळ" : "Heavy Freight Peak Window"}
            </p>
            <p className="text-xs font-bold text-slate-900 mt-0.5">08:00 - 11:30 AM & 05:30 - 09:30 PM</p>
          </div>
        </div>

        <div className="gov-card rounded-2xl p-4.5 bg-blue-50/70 border-blue-200 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 font-bold">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-blue-900 font-bold">
              {language === "mr" ? "सिग्नल समन्वय नियंत्रण" : "Signal Controller Sync"}
            </p>
            <p className="text-xs font-bold text-slate-900 mt-0.5">4/5 Junctions AI Synchronized</p>
          </div>
        </div>
      </div>

      {/* Traffic Bottleneck Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTraffic.map((tp) => {
          const sev = getSeverityBadge(tp.severity);
          return (
            <div
              key={tp.id}
              className="gov-card rounded-2xl p-5 border border-slate-200 hover:border-blue-400 transition-all shadow-sm space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                      {tp.id}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${sev.bg}`}>
                      <span className={`w-2 h-2 rounded-full ${sev.dot}`}></span>
                      <span>{tp.severity}</span>
                    </span>
                    {tp.isAccidentBlackspot && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                        ⚠️ Accident Blackspot
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {language === "mr" ? tp.nameMr : tp.name}
                  </h3>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[11px] text-slate-500 font-semibold block">{t.traffic.avgDelay}:</span>
                  <span className="text-lg font-bold text-rose-700">+{tp.avgDelayMinutes}m</span>
                </div>
              </div>

              {/* Information Grid */}
              <div className="space-y-2 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-slate-700">
                  <p>
                    <b className="text-slate-900 font-semibold">{t.traffic.peakWindow}:</b>{" "}
                    {language === "mr" ? tp.peakHoursMr : tp.peakHours}
                  </p>
                  <p>
                    <b className="text-slate-900 font-semibold">{t.traffic.primaryCause}:</b>{" "}
                    {language === "mr" ? tp.causeMr : tp.cause}
                  </p>
                  <p>
                    <b className="text-slate-900 font-semibold">{t.traffic.affectedCorridor}:</b>{" "}
                    {language === "mr" ? tp.affectedCorridorMr : tp.affectedCorridor}
                  </p>
                </div>

                {/* Bypass Route Box */}
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-emerald-900 text-xs flex items-start gap-2.5">
                  <Navigation className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-900 block">{t.traffic.alternateRecommendation}:</span>
                    <span className="text-[11px] text-slate-700 font-medium">
                      {language === "mr" ? tp.alternateRouteMr : tp.alternateRoute}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <span>
                    <b>Signal Controller:</b> {tp.signalStatus}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setFocusOnMapLocation(tp.location);
                    setActiveTab("master-gis");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#0f2b48] hover:bg-[#1a3d60] text-white font-semibold flex items-center gap-1 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{t.actions.viewOnMap}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
