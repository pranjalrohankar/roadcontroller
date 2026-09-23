"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { SplitSquareVertical, Camera, MapPin } from "lucide-react";

export const BeforeAfterViewer: React.FC = () => {
  const { t, language } = useApp();
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [selectedCase, setSelectedCase] = useState<number>(0);

  const cases = [
    {
      id: "BA-01",
      title: "Chakan - Talegaon SH-55 (Manik Chowk to Kharabwadi)",
      titleMr: "चाकण - तळेगाव रस्ता (माणिक चौक ते खराबवाडी)",
      location: "Chakan SH-55 Highway",
      beforeDate: "Oct 2023 (Pothole Crisis)",
      beforeDateMr: "ऑक्टोबर २०२३ (खड्डे व दुरवस्था)",
      afterDate: "Sept 2026 (Modernized 4-Lane Concrete)",
      afterDateMr: "सप्टेंबर २०२६ (आधुनिक ४-पदरी काँक्रिटीकरण)",
      beforeImg: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80",
      afterImg: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80",
      summary: "Transformation from chronic monsoon waterlogging and severe 3-foot potholes to heavy-duty 40 N/mm2 PQC concrete carriageway with stormwater culverts.",
      summaryMr: "पावसाळ्यात साचणाऱ्या पाण्याचे डबके आणि खोल खड्ड्यांचे रूपांतर ४-पदरी मजबूत सिमेंट काँक्रिट रस्त्यात आणि बाजूच्या बंदिस्त गटारात.",
    },
    {
      id: "BA-02",
      title: "MIDC Phase 2 to 4 Heavy Freight Corridor (Vasuli - Mahalunge)",
      titleMr: "MIDC फेज २ ते ४ अवजड मालवाहतूक कॉरिडॉर (वासुली - महाळुंगे)",
      location: "MIDC Phase 2 Industrial Belt",
      beforeDate: "Jan 2024 (Unpaved Mud Track)",
      beforeDateMr: "जानेवारी २०२४ (कच्चा रस्ता व धुळ)",
      afterDate: "Aug 2026 (Dedicated 8-Lane Freight Grid)",
      afterDateMr: "ऑगस्ट २०२६ (८-पदरी अवजड कॉरिडॉर)",
      beforeImg: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80",
      afterImg: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80",
      summary: "Upgraded to 100-ton capacity industrial trailer standard with high-mast smart LED lighting and lay-by truck terminal bays.",
      summaryMr: "१०० टन वजनाच्या ट्रेलरसाठी सक्षम काँक्रिट रस्ता, हाय-मास्ट पथदिवे आणि ट्रक पार्किंग बे सह सुसज्ज.",
    },
    {
      id: "BA-03",
      title: "NH-60 Kuruli Pedestrian Subway & Grade Improvement",
      titleMr: "NH-६० कुरुळी पादचारी भुयारी मार्ग व ६-पदरी महामार्ग",
      location: "NH-60 Pune-Nashik Highway",
      beforeDate: "Dec 2023 (Accident Blackspot)",
      beforeDateMr: "डिसेंबर २०२३ (अपघात प्रवण क्षेत्र)",
      afterDate: "July 2026 (Crash Barriers & Pedestrian Subway)",
      afterDateMr: "जुलै २०२६ (भुयारी मार्ग व सुरक्षा बॅरिअर)",
      beforeImg: "https://images.unsplash.com/photo-1584463699026-7f4142f36d4a?auto=format&fit=crop&w=1200&q=80",
      afterImg: "https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=1200&q=80",
      summary: "Eliminated fatal pedestrian accidents on the highway by building illuminated underground subway and continuous metallic crash barriers.",
      summaryMr: "महामार्गावरील जीवघेणे अपघात रोखण्यासाठी सुरक्षित पादचारी भुयारी मार्ग आणि काँक्रिट सर्व्हिस रस्त्याची उभारणी.",
    },
  ];

  const currentCase = cases[selectedCase];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <SplitSquareVertical className="w-6 h-6 text-blue-800" />
          <span>{t.beforeAfter.title}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {t.beforeAfter.subtitle}
        </p>
      </div>

      {/* Case Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {cases.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => setSelectedCase(idx)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
              selectedCase === idx
                ? "bg-[#0f2b48] text-white border-[#0f2b48] shadow-sm"
                : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === "mr" ? c.titleMr : c.title}</span>
          </button>
        ))}
      </div>

      {/* Split Comparison Box */}
      <div className="gov-card rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {language === "mr" ? currentCase.titleMr : currentCase.title}
            </h3>
            <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-700" />
              <span>{currentCase.location}</span>
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 self-start">
            {t.beforeAfter.sliderHint}
          </span>
        </div>

        {/* Visual Slider */}
        <div className="relative w-full h-80 sm:h-[420px] rounded-xl overflow-hidden select-none border border-slate-300 shadow-inner">
          <img
            src={currentCase.afterImg}
            alt="After"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={currentCase.beforeImg}
              alt="Before"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: "100%", height: "100%" }}
            />
            <div className="absolute top-4 left-4 bg-slate-900/90 text-white font-bold text-xs px-3 py-1.5 rounded shadow">
              {t.beforeAfter.beforeLabel} ({language === "mr" ? currentCase.beforeDateMr : currentCase.beforeDate})
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-emerald-800 text-white font-bold text-xs px-3 py-1.5 rounded shadow">
            {t.beforeAfter.afterLabel} ({language === "mr" ? currentCase.afterDateMr : currentCase.afterDate})
          </div>

          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-2xl"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold text-xs shadow-xl border-2 border-slate-900">
              ⬌
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          />
        </div>

        {/* Summary Box */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
          <span className="font-bold text-slate-900 block text-xs">
            {language === "mr" ? "पायाभूत सुविधा विकासाचा परिणाम (Impact Analysis):" : "Transformation Impact:"}
          </span>
          <p className="leading-relaxed">
            {language === "mr" ? currentCase.summaryMr : currentCase.summary}
          </p>
        </div>
      </div>
    </div>
  );
};
