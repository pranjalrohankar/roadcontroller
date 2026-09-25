"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { CitizenReportCategory, Authority } from "@/types";
import {
  X,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Send,
  Building2,
  Navigation,
  Compass,
  Sparkles,
  ShieldCheck,
  Layers,
} from "lucide-react";
import confetti from "canvas-confetti";

interface PredefinedHotspot {
  id: string;
  name: string;
  nameMr: string;
  roadName: string;
  authority: Authority;
  coordinates: [number, number];
  zone: string;
}

const chakanHotspots: PredefinedHotspot[] = [
  {
    id: "manik-chowk",
    name: "Manik Chowk & Chakan Talegaon Chowk (NH-60)",
    nameMr: "माणिक चौक व चाकण तळेगाव चौक (NH-६०)",
    roadName: "NH-60 Pune-Nashik National Highway",
    authority: "NHAI",
    coordinates: [18.7595, 73.8385],
    zone: "Central Chakan Junction",
  },
  {
    id: "sh55-kharabwadi",
    name: "Kharabwadi Phata to Sudumbre (SH-55)",
    nameMr: "खराबवाडी फाटा ते सुदुंबरे (SH-५५)",
    roadName: "SH-55 Chakan-Talegaon State Highway",
    authority: "PWD",
    coordinates: [18.7512, 73.815],
    zone: "Western Corridor",
  },
  {
    id: "midc-phase2-spine",
    name: "MIDC Phase 2 Spine Road (Mercedes & Mahindra)",
    nameMr: "एमआयडीसी फेज २ मुख्य रस्ता (मर्सिडीज व महिंद्रा)",
    roadName: "Phase 2 Auto Cluster Spine Road",
    authority: "MIDC",
    coordinates: [18.7752, 73.8012],
    zone: "Industrial Cluster",
  },
  {
    id: "kuruli-ring-road",
    name: "Kuruli - Nanekarwadi 4-Lane Ring Bypass",
    nameMr: "कुरुळी - नाणेकरवाडी ४-पदरी रिंग बायपास",
    roadName: "PMRDA Outer Ring Bypass",
    authority: "PMRDA",
    coordinates: [18.738, 73.845],
    zone: "Ring Road Sector",
  },
  {
    id: "sara-city-link",
    name: "Sara City & Medankarwadi Internal Link",
    nameMr: "सारा सिटी व मेदनकरवाडी अंतर्गत पोहोच रस्ता",
    roadName: "Medankarwadi Village Road",
    authority: "GramPanchayat",
    coordinates: [18.749, 73.856],
    zone: "Residential Township",
  },
  {
    id: "sh112-shikrapur",
    name: "Chakan - Shikrapur Road SH-112 (Near HPCL)",
    nameMr: "चाकण - शिक्रापूर रस्ता SH-११२ (HPCL जवळ)",
    roadName: "SH-112 Chakan-Shikrapur State Highway",
    authority: "PWD",
    coordinates: [18.761, 73.864],
    zone: "Eastern Highway",
  },
  {
    id: "chimbali-phata",
    name: "Chimbali Phata High-Speed Flyover Junction",
    nameMr: "चिमबळी फाटा उड्डाणपूल चौक",
    roadName: "NH-60 Chimbali Highway Junction",
    authority: "NHAI",
    coordinates: [18.718, 73.858],
    zone: "Southern Highway Gate",
  },
  {
    id: "midc-phase3-mahalunge",
    name: "Mahalunge MIDC Phase 3 Auto Hub",
    nameMr: "महाळुंगे एमआयडीसी फेज ३ ऑटो हब",
    roadName: "MIDC Phase 3 Main Link",
    authority: "MIDC",
    coordinates: [18.761, 73.8245],
    zone: "Auto Engineering Hub",
  },
  {
    id: "bhosari-moshi-link",
    name: "Moshi - Bhosari Toll Feeder Link",
    nameMr: "मोशी - भोसरी टोल फीडर रस्ता",
    roadName: "State Highway Moshi-Bhosari Gateway",
    authority: "PWD",
    coordinates: [18.705, 73.852],
    zone: "Pimpri Gateway",
  },
  {
    id: "kadachiwadi-gp",
    name: "Kadachiwadi Rural Link Road",
    nameMr: "कडाचीवाडी ग्रामपंचायत रस्ता",
    roadName: "Gram Panchayat Rural Link",
    authority: "GramPanchayat",
    coordinates: [18.741, 73.868],
    zone: "Rural Connector",
  },
];

export const CitizenReportingModal: React.FC = () => {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    addCitizenReport,
    t,
    language,
  } = useApp();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CitizenReportCategory>("Potholes");
  const [selectedHotspot, setSelectedHotspot] = useState<PredefinedHotspot>(chakanHotspots[0]);
  const [customLocationName, setCustomLocationName] = useState("");
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-derived values
  const currentLandmark = useCustomLocation
    ? customLocationName || "Custom Chakan Point"
    : language === "mr"
    ? selectedHotspot.nameMr
    : selectedHotspot.name;

  const currentAuthority: Authority = selectedHotspot.authority;
  const currentCoordinates = selectedHotspot.coordinates;

  if (!isReportModalOpen) return null;

  const categories: { key: CitizenReportCategory; labelEn: string; labelMr: string; icon: string }[] = [
    { key: "Potholes", labelEn: "Potholes & Road Damage", labelMr: "खड्डे व रस्त्याची दुरवस्था", icon: "🕳️" },
    { key: "Traffic", labelEn: "Traffic Bottleneck", labelMr: "वाहतूक कोंडी", icon: "🚦" },
    { key: "Waterlogging", labelEn: "Waterlogging & Drainage", labelMr: "पाणी साचणे व ड्रेनेज", icon: "🌊" },
    { key: "Garbage", labelEn: "Garbage Dumping", labelMr: "कचरा व अस्वच्छता", icon: "🗑️" },
    { key: "Illegal Parking", labelEn: "Illegal Trailer Parking", labelMr: "अवैध अवजड पार्किंग", icon: "🚛" },
    { key: "Street Light Failure", labelEn: "Street Light Failure", labelMr: "पथदिवे बंद असणे", icon: "💡" },
    { key: "Signal Issue", labelEn: "Signal Malfunction", labelMr: "सिग्नल बिघाड", icon: "🔴" },
    { key: "Water Supply Issue", labelEn: "Water Pipeline Burst", labelMr: "पाणीपुरवठा पाईपलाईन गळती", icon: "💧" },
    { key: "Encroachment", labelEn: "Road Encroachment", labelMr: "रस्त्यावरील अतिक्रमण", icon: "🚧" },
    { key: "Other", labelEn: "Other Infrastructure Issue", labelMr: "इतर पायाभूत समस्या", icon: "⚠️" },
  ];

  const getAuthorityBadgeColor = (auth: Authority) => {
    switch (auth) {
      case "PWD":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "PMRDA":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "MIDC":
        return "bg-orange-100 text-orange-900 border-orange-300";
      case "NHAI":
        return "bg-red-100 text-red-900 border-red-300";
      case "GramPanchayat":
        return "bg-purple-100 text-purple-900 border-purple-300";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    addCitizenReport({
      title,
      titleMr: title,
      category,
      categoryMr: categories.find((c) => c.key === category)?.labelMr || category,
      description,
      descriptionMr: description,
      landmark: currentLandmark,
      landmarkMr: currentLandmark,
      coordinates: currentCoordinates,
      photoUrl: photoUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80",
      reportedBy: "Citizen Geotagged Reporter",
      status: "Reported",
      assignedAuthority: currentAuthority,
    });

    try {
      confetti({
        particleCount: 70,
        spread: 60,
      });
    } catch {}

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsReportModalOpen(false);
      setTitle("");
      setDescription("");
      setPhotoUrl("");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#0f2b48] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {language === "mr" ? "चाकण रस्ते व पायाभूत तक्रार नोंदवा" : "Report Infrastructure Issue in Chakan"}
              </h3>
              <p className="text-xs text-slate-300">
                {language === "mr"
                  ? "नकाशावरून ठिकाण निवडा — संबंधित विभाग (Authority) स्वयंचलित कनेक्ट होईल"
                  : "Pick location from GIS Map — target authority is auto-detected & dispatched"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsReportModalOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-800">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              {language === "mr" ? "तक्रार यशस्वीरित्या नोंदवली गेली!" : "Grievance Successfully Geotagged!"}
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              {language === "mr"
                ? `आपली तक्रार ${currentAuthority} विभागाकडे GPS निर्देशांकांसह वर्ग करण्यात आली आहे.`
                : `Your grievance has been auto-dispatched to ${currentAuthority} nodal engineering desk with verified GPS coordinates.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs text-slate-800 max-h-[85vh] overflow-y-auto">
            {/* STEP 1: SELECT ON MAP / LOCATION AUTO-DETECTOR */}
            <div className="bg-slate-50 border-2 border-blue-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-700" />
                  <span>
                    {language === "mr"
                      ? "१. नकाशावरून ठिकाण निवडा (Select on Map):"
                      : "1. Select Location on GIS Map (Auto-Detects Authority):"}
                  </span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Auto-Fetch Enabled
                </span>
              </div>

              {/* Hotspot Dropdown & Grid */}
              <div className="space-y-2">
                <select
                  value={selectedHotspot.id}
                  onChange={(e) => {
                    const found = chakanHotspots.find((h) => h.id === e.target.value);
                    if (found) {
                      setSelectedHotspot(found);
                      setUseCustomLocation(false);
                    }
                  }}
                  className="w-full bg-white border border-blue-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs shadow-2xs"
                >
                  {chakanHotspots.map((h) => (
                    <option key={h.id} value={h.id}>
                      📍 {h.name} ➔ [{h.authority} Authority]
                    </option>
                  ))}
                </select>

                {/* Quick Map Pins Strip */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {chakanHotspots.slice(0, 5).map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => {
                        setSelectedHotspot(h);
                        setUseCustomLocation(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                        selectedHotspot.id === h.id
                          ? "bg-blue-800 text-white border-blue-900 shadow-2xs scale-102"
                          : "bg-white text-slate-700 hover:bg-slate-100 border-slate-300"
                      }`}
                    >
                      <span>📍</span>
                      <span className="truncate max-w-[130px]">{h.id.replace("-", " ")}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AUTO-FETCHED AUTHORITY & GEO-COORDINATES SUMMARY CARD */}
              <div className="bg-white p-3 rounded-xl border border-blue-300 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Auto-Fetched GIS Metadata:
                  </span>
                  <span className={`text-xs font-extrabold px-3 py-0.5 rounded-full border ${getAuthorityBadgeColor(currentAuthority)}`}>
                    Target Authority: {currentAuthority}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1 border-t border-slate-100 font-medium text-slate-700">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Corridor Network:</span>
                    <span className="font-bold text-slate-900 truncate block">{selectedHotspot.roadName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">GPS Geotag:</span>
                    <span className="font-mono text-slate-800 text-[10px] block">{currentCoordinates[0].toFixed(4)}, {currentCoordinates[1].toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Jurisdiction Zone:</span>
                    <span className="font-bold text-blue-900 block">{selectedHotspot.zone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2: ISSUE CATEGORY */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">
                {language === "mr" ? "२. समस्येचा प्रवर्ग निवडा *" : "2. Select Issue Category *"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 ${
                      category === cat.key
                        ? "bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{language === "mr" ? cat.labelMr : cat.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 3: TITLE */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                {language === "mr" ? "३. समस्येचे शीर्षक / थोडक्यात नाव *" : "3. Brief Issue Title *"}
              </label>
              <input
                type="text"
                required
                placeholder={language === "mr" ? "उदा. चौकात डांबरीकरणाचे मोठे खड्डे" : "e.g. Severe deep potholes causing trailer slowdown"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 font-medium"
              />
            </div>

            {/* STEP 4: DESCRIPTION */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                {language === "mr" ? "४. समस्येचे सविस्तर वर्णन *" : "4. Detailed Problem Description *"}
              </label>
              <textarea
                required
                rows={3}
                placeholder={
                  language === "mr"
                    ? "समस्येचे सविस्तर वर्णन करा (कधीपासून त्रास आहे, अपघात धोका, वाहनांचे होणारे नुकसान इ.)..."
                    : "Provide detailed description of the road problem, duration, and safety hazards..."
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 font-medium"
              />
            </div>

            {/* STEP 5: PHOTO URL (OPTIONAL) */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                {language === "mr" ? "५. फोटो लिंक (पर्यायी)" : "5. Site Photo URL (Optional)"}
              </label>
              <input
                type="text"
                placeholder="Paste Image URL (Optional)"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 text-xs focus:outline-none font-medium"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#047857] hover:bg-[#065f46] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>
                  {language === "mr"
                    ? `तक्रार ${currentAuthority} विभागाकडे दाखल करा`
                    : `Submit Geotagged Grievance to ${currentAuthority} Desk`}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
