"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { MapLayerConfig } from "@/types";
import {
  Layers,
  CheckSquare,
  Square,
} from "lucide-react";

export const MapLayerControls: React.FC = () => {
  const { mapLayers, toggleMapLayer, setAllMapLayers, t, language } = useApp();

  const layerItems: {
    key: keyof MapLayerConfig;
    label: string;
    icon: string;
  }[] = [
    { key: "jurisdictionAreas", label: language === "mr" ? "प्रभाग व हद्द क्षेत्रे (Saffron Wards)" : "Ward & Jurisdiction Zones (Saffron)", icon: "🟧" },
    { key: "nhaiRoads", label: t.map.layerNhai, icon: "🔴" },
    { key: "pwdRoads", label: t.map.layerPwd, icon: "🟢" },
    { key: "midcRoads", label: t.map.layerMidc, icon: "🟠" },
    { key: "pmrdaRoads", label: t.map.layerPmrda, icon: "🔵" },
    { key: "gpRoads", label: t.map.layerGp, icon: "🟣" },
    { key: "flyovers", label: t.map.layerFlyovers, icon: "🌉" },
    { key: "trafficSignals", label: t.map.layerSignals, icon: "🚦" },
    { key: "waterNetwork", label: t.map.layerWater, icon: "💧" },
    { key: "drainageNetwork", label: t.map.layerDrainage, icon: "🚰" },
    { key: "ongoingProjects", label: t.map.layerProjects, icon: "📍" },
    { key: "citizenComplaints", label: t.map.layerComplaints, icon: "⚠️" },
    { key: "industrialZones", label: t.map.layerIndustrial, icon: "🏗️" },
    { key: "futureProjects", label: t.map.layerFuture, icon: "📐" },
  ];

  return (
    <div className="gov-panel p-3.5 rounded-xl text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Layers className="w-4 h-4 text-blue-700" />
          <span>{t.map.layersTitle}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            onClick={() => setAllMapLayers(true)}
            className="text-blue-700 hover:underline font-semibold"
          >
            {language === "mr" ? "सर्व चालू" : "All On"}
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => setAllMapLayers(false)}
            className="text-slate-500 hover:underline"
          >
            {language === "mr" ? "सर्व बंद" : "All Off"}
          </button>
        </div>
      </div>

      <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
        {layerItems.map((item) => {
          const isChecked = mapLayers[item.key];
          return (
            <button
              key={item.key}
              onClick={() => toggleMapLayer(item.key)}
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-all text-left ${
                isChecked
                  ? "bg-slate-50 text-slate-900 font-semibold border border-slate-200"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-sm">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
              {isChecked ? (
                <CheckSquare className="w-4 h-4 text-blue-700 flex-shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-300 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
