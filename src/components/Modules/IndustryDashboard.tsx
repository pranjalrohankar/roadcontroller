"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  Factory,
  Truck,
  ArrowUpRight,
} from "lucide-react";

export const IndustryDashboard: React.FC = () => {
  const { t, language, setActiveTab, setFocusOnMapLocation } = useApp();

  const industrialCorridors = [
    {
      name: "Phase 2 Auto Cluster (Mercedes & Mahindra Ring)",
      nameMr: "फेज २ ऑटो क्लस्टर (मर्सिडीज व महिंद्रा रिंग)",
      trafficCondition: "Smooth (8-Lane Operational)",
      avgSpeed: "48 km/h",
      dailyTrailers: "4,200",
      potholeStatus: "Zero Potholes (PQC Concrete)",
      coords: [18.7752, 73.8012] as [number, number],
    },
    {
      name: "Phase 1 to Talegaon Toll Feeder (Bajaj Corridor)",
      nameMr: "फेज १ ते तळेगाव टोल फीडर (बजाज कॉरिडॉर)",
      trafficCondition: "Congested (+28 min delay)",
      avgSpeed: "18 km/h",
      dailyTrailers: "6,800",
      potholeStatus: "Culvert Work in Progress",
      coords: [18.7595, 73.8385] as [number, number],
    },
    {
      name: "Mahalunge - HPCL Petroleum & Chemical Link",
      nameMr: "महाळुंगे - एचपीसीएल पेट्रोलियम व केमिकल लिंक",
      trafficCondition: "Moderate Traffic",
      avgSpeed: "35 km/h",
      dailyTrailers: "2,900",
      potholeStatus: "Completed",
      coords: [18.7610, 73.8245] as [number, number],
    },
  ];

  const midcPhases = [
    { name: "MIDC Phase 1 (Kharabwadi)", units: 480, uptime: "99.4%", infraScore: "82/100" },
    { name: "MIDC Phase 2 (Vasuli)", units: 320, uptime: "98.9%", infraScore: "88/100" },
    { name: "MIDC Phase 3 (Mahalunge)", units: 290, uptime: "99.1%", infraScore: "79/100" },
    { name: "MIDC Phase 4 (Nighoje)", units: 180, uptime: "97.5%", infraScore: "71/100" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-orange-100 text-orange-900 border border-orange-200">
            FMPCCI & MIDC INDUSTRIAL CELL
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Factory className="w-6 h-6 text-orange-700" />
          <span>{t.industry.title}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          {t.industry.subtitle}
        </p>
      </div>

      {/* Logistics Impact KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="gov-card rounded-2xl p-4.5 bg-rose-50/70 border-rose-200 space-y-1">
          <span className="text-xs text-rose-900 font-bold">{t.industry.logisticsDelayCost}</span>
          <p className="text-xl font-bold text-slate-900">₹ 14.8 Cr / Month</p>
          <p className="text-[11px] text-slate-600 font-medium">Calculated on idling & demurrage costs</p>
        </div>

        <div className="gov-card rounded-2xl p-4.5 space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Daily Heavy Freight Trailers</span>
          <p className="text-xl font-bold text-emerald-800">18,500+ Trucks</p>
          <p className="text-[11px] text-slate-600 font-medium">Inbound & Outbound auto components</p>
        </div>

        <div className="gov-card rounded-2xl p-4.5 space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Water Grid Supply Uptime</span>
          <p className="text-xl font-bold text-blue-800">99.8% (24 MLD Grid)</p>
          <p className="text-[11px] text-slate-600 font-medium">Bhama Askhed pipeline operational</p>
        </div>

        <div className="gov-card rounded-2xl p-4.5 space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Dedicated Truck Bays</span>
          <p className="text-xl font-bold text-amber-800">500 / 600 Occupied</p>
          <p className="text-[11px] text-slate-600 font-medium">Vasuli automated freight terminal</p>
        </div>
      </div>

      {/* Industrial Freight Corridors */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-orange-700" />
          <span>{t.industry.freightCorridors}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {industrialCorridors.map((c, idx) => (
            <div
              key={idx}
              className="gov-card rounded-2xl p-5 border border-slate-200 space-y-3.5 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <h4 className="font-bold text-sm text-slate-900">
                  {language === "mr" ? c.nameMr : c.name}
                </h4>
                <div className="text-xs text-slate-700 space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-medium">
                  <p className="flex justify-between">
                    <span className="text-slate-500">Transit Status:</span>
                    <span className="font-bold text-emerald-800">{c.trafficCondition}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-500">Average Transit Speed:</span>
                    <span className="font-bold text-slate-900">{c.avgSpeed}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-500">Daily Freight Volume:</span>
                    <span className="text-slate-800">{c.dailyTrailers} Trailers</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-500">Pavement Standard:</span>
                    <span className="text-emerald-800 font-semibold">{c.potholeStatus}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setFocusOnMapLocation(c.coords);
                  setActiveTab("master-gis");
                }}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-300"
              >
                <span>Inspect Corridor on GIS Map</span>
                <ArrowUpRight className="w-4 h-4 text-blue-700" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Industrial Phase Breakdown */}
      <div className="space-y-4 pt-2">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>⚙️</span>
          <span>{t.industry.industrialZonesTitle}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {midcPhases.map((ph, idx) => (
            <div key={idx} className="gov-card rounded-2xl p-4.5 border border-slate-200 space-y-2">
              <h4 className="font-bold text-sm text-slate-900">{ph.name}</h4>
              <div className="text-xs text-slate-700 space-y-1 font-medium">
                <p className="flex justify-between">
                  <span className="text-slate-500">Registered Units:</span>
                  <span className="font-bold text-slate-900">{ph.units}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500">Utility Uptime:</span>
                  <span className="font-bold text-emerald-800">{ph.uptime}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500">CDF Infra Score:</span>
                  <span className="font-bold text-amber-800">{ph.infraScore}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
