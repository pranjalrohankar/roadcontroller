"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { ShieldCheck } from "lucide-react";

export const Legend: React.FC = () => {
  const { language } = useApp();

  const authorities = [
    {
      code: "NHAI",
      label: language === "mr" ? "NHAI (राष्ट्रीय महामार्ग ६०)" : "NHAI: Highway 60",
      sub: language === "mr" ? "भोसरी - चाकण - मंचर (४० किमी)" : "Bhosari - Chakan - Manchar (40 km)",
      color: "#ef4444",
      bg: "bg-red-600",
    },
    {
      code: "PWD",
      label: language === "mr" ? "PWD (राज्य महामार्ग ५५ / ११२)" : "PWD: State Highways (SH-55)",
      sub: language === "mr" ? "तळेगाव - चाकण - शिक्रापूर (४३ किमी)" : "Talegaon - Chakan - Shikrapur (43 km)",
      color: "#10b981",
      bg: "bg-emerald-600",
    },
    {
      code: "MIDC",
      label: language === "mr" ? "MIDC (औद्योगिक मुख्य रस्ते)" : "MIDC: Industrial Arterial Roads",
      sub: language === "mr" ? "फेज १ ते ४ व वासुली-महाळुंगे (२६ किमी)" : "Phases 1-4, Vasuli, Mahalunge (26 km)",
      color: "#f97316",
      bg: "bg-orange-600",
    },
    {
      code: "PMRDA",
      label: language === "mr" ? "PMRDA (पुणे मेट्रो रिंग रस्ते)" : "PMRDA: Ring Bypass Roads",
      sub: language === "mr" ? "कुरुळी - नाणेकरवाडी बायपास (१२ किमी)" : "Kuruli - Nanekarwadi Bypass (12 km)",
      color: "#3b82f6",
      bg: "bg-blue-600",
    },
    {
      code: "GramPanchayat",
      label: language === "mr" ? "ग्रामपंचायत (ग्रामीण अंतर्गत रस्ते)" : "Gram Panchayat: Rural Links",
      sub: language === "mr" ? "मेदनकरवाडी, सारा सिटी रस्ते (४ किमी)" : "Medankarwadi, Sara City Links (4 km)",
      color: "#a855f7",
      bg: "bg-purple-600",
    },
  ];

  return (
    <div className="gov-panel p-3 rounded-2xl text-xs space-y-2 shadow-xl border border-slate-300 bg-white/95 backdrop-blur-md">
      <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
        <span>{language === "mr" ? "शासकीय विभाग रंग संकेत" : "Authority Road Color Codes"}</span>
      </h4>

      <div className="space-y-1.5">
        {authorities.map((a) => (
          <div key={a.code} className="flex items-start gap-2 text-slate-800">
            <span
              className={`w-3.5 h-3.5 rounded-md ${a.bg} border border-black/20 shadow-xs flex-shrink-0 mt-0.5`}
            ></span>
            <div className="min-w-0">
              <span className="font-bold block text-[11px] leading-tight text-slate-900 truncate">
                {a.label}
              </span>
              <span className="text-[10px] text-slate-500 block leading-tight truncate">
                {a.sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
