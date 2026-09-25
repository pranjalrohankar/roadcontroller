"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { CitizenReportCategory, Authority } from "@/types";
import {
  X,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  ShieldCheck,
  LocateFixed,
  Navigation,
} from "lucide-react";
import confetti from "canvas-confetti";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

interface NearbyZone {
  name: string;
  nameMr: string;
  roadName: string;
  authority: Authority;
  center: [number, number];
}

const jurisdictionZones: NearbyZone[] = [
  // NHAI Corridors (NH-60 Spine)
  {
    name: "Chakan Central / Manik Chowk",
    nameMr: "चाकण मध्यवर्ती / माणिक चौक",
    roadName: "NH-60 Pune-Nashik National Highway",
    authority: "NHAI",
    center: [18.7615, 73.8588],
  },
  {
    name: "Chimbali Phata Highway Corridor",
    nameMr: "चिमबळी फाटा महामार्ग कॉरिडॉर",
    roadName: "NH-60 High-Speed Corridor",
    authority: "NHAI",
    center: [18.7180, 73.8580],
  },
  {
    name: "Alandi Phata & Moshi Flyover",
    nameMr: "आळंदी फाटा व मोशी उड्डाणपूल",
    roadName: "NH-60 Moshi Gateway",
    authority: "NHAI",
    center: [18.6850, 73.8550],
  },
  {
    name: "Khed / Rajgurunagar & Manchar Sector",
    nameMr: "खेड / राजगुरुनगर व मंचर पट्टा",
    roadName: "NH-60 Northern Sector",
    authority: "NHAI",
    center: [18.8400, 73.8900],
  },
  // PWD Corridors (SH-55 & SH-112)
  {
    name: "Kharabwadi Phata - Sudumbre",
    nameMr: "खराबवाडी फाटा ते सुदुंबरे",
    roadName: "SH-55 Chakan-Talegaon State Highway",
    authority: "PWD",
    center: [18.7512, 73.8150],
  },
  {
    name: "Talegaon Dabhade Highway Link",
    nameMr: "तळेगाव दाभाडे महामार्ग लिंक",
    roadName: "SH-55 Western Gateway",
    authority: "PWD",
    center: [18.7380, 73.7150],
  },
  {
    name: "Chakan - Shikrapur State Highway",
    nameMr: "चाकण - शिक्रापूर राज्य महामार्ग",
    roadName: "SH-112 Eastern State Highway",
    authority: "PWD",
    center: [18.7610, 73.8850],
  },
  {
    name: "Shikrapur Junction & Pabal Feeder",
    nameMr: "शिक्रापूर चौक व पाबळ फीडर",
    roadName: "SH-112 / Nagar Road Link",
    authority: "PWD",
    center: [18.7200, 74.0500],
  },
  // MIDC Industrial Corridors
  {
    name: "MIDC Phase 2 Spine Road (Mercedes & Mahindra)",
    nameMr: "एमआयडीसी फेज २ मुख्य रस्ता (मर्सिडीज व महिंद्रा)",
    roadName: "MIDC Phase 2 Industrial Spine",
    authority: "MIDC",
    center: [18.7752, 73.8012],
  },
  {
    name: "MIDC Phase 1 Kharabwadi Auto Cluster",
    nameMr: "एमआयडीसी फेज १ खराबवाडी ऑटो क्लस्टर",
    roadName: "MIDC Phase 1 Access Road (Bajaj Area)",
    authority: "MIDC",
    center: [18.7650, 73.8350],
  },
  {
    name: "MIDC Phase 3 Mahalunge Corridor",
    nameMr: "एमआयडीसी फेज ३ महाळुंगे कॉरिडॉर",
    roadName: "MIDC Phase 3 Industrial Highway",
    authority: "MIDC",
    center: [18.7610, 73.8245],
  },
  {
    name: "MIDC Phase 4 & Vasuli Industrial Ring",
    nameMr: "एमआयडीसी फेज ४ व वासुली रिंग",
    roadName: "MIDC Heavy Freight Link",
    authority: "MIDC",
    center: [18.7890, 73.7840],
  },
  // PMRDA Corridors
  {
    name: "Kuruli - Nanekarwadi 4-Lane Ring Bypass",
    nameMr: "कुरुळी - नाणेकरवाडी ४-पदरी रिंग बायपास",
    roadName: "PMRDA Outer Ring Bypass Road",
    authority: "PMRDA",
    center: [18.7380, 73.8450],
  },
  {
    name: "Moshi Ring Road Feeder & DP Link",
    nameMr: "मोशी रिंग रोड फीडर व डीपी रस्ता",
    roadName: "PMRDA DP Arterial Corridor",
    authority: "PMRDA",
    center: [18.7050, 73.8520],
  },
  // Gram Panchayat Corridors
  {
    name: "Sara City & Medankarwadi Township Link",
    nameMr: "सारा सिटी व मेदनकरवाडी टाऊनशिप रस्ता",
    roadName: "Medankarwadi Gram Panchayat Road",
    authority: "GramPanchayat",
    center: [18.7490, 73.8560],
  },
  {
    name: "Kadachiwadi Rural Link",
    nameMr: "कडाचीवाडी ग्रामीण पोहोच रस्ता",
    roadName: "Kadachiwadi Gram Panchayat Link",
    authority: "GramPanchayat",
    center: [18.7410, 73.8680],
  },
  {
    name: "Nanekarwadi Village Internal Arterial",
    nameMr: "नाणेकरवाडी गाव अंतर्गत रस्ता",
    roadName: "Nanekarwadi Rural Connector",
    authority: "GramPanchayat",
    center: [18.7320, 73.8390],
  },
];

function resolveLocationAndAuthority(lat: number, lng: number): {
  landmark: string;
  landmarkMr: string;
  roadName: string;
  authority: Authority;
} {
  let closest = jurisdictionZones[0];
  let minDistance = Infinity;

  for (const zone of jurisdictionZones) {
    const dLat = lat - zone.center[0];
    const dLng = lng - zone.center[1];
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = zone;
    }
  }

  return {
    landmark: `${closest.name} (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    landmarkMr: `${closest.nameMr} (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    roadName: closest.roadName,
    authority: closest.authority,
  };
}

export const CitizenReportingModal: React.FC = () => {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    addCitizenReport,
    language,
  } = useApp();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CitizenReportCategory>("Potholes");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [coordinates, setCoordinates] = useState<[number, number]>([18.7600, 73.8450]);
  const [fetchedMetadata, setFetchedMetadata] = useState<{
    landmark: string;
    landmarkMr: string;
    roadName: string;
    authority: Authority;
  }>({
    landmark: "Chakan Central / Manik Chowk (18.7600, 73.8450)",
    landmarkMr: "चाकण मध्यवर्ती / माणिक चौक (18.7600, 73.8450)",
    roadName: "NH-60 Pune-Nashik National Highway",
    authority: "NHAI",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const miniMapContainerRef = useRef<HTMLDivElement>(null);
  const miniMapInstanceRef = useRef<LeafletMap | null>(null);
  const pinMarkerRef = useRef<LeafletMarker | null>(null);

  // Initialize interactive Leaflet map inside modal
  useEffect(() => {
    if (!isReportModalOpen) return;

    let isMounted = true;
    let timer: NodeJS.Timeout;

    timer = setTimeout(() => {
      if (!miniMapContainerRef.current) return;

      import("leaflet").then((L) => {
        if (!isMounted || !miniMapContainerRef.current) return;

        // Clean up previous instance if any
        if (miniMapInstanceRef.current) {
          miniMapInstanceRef.current.remove();
          miniMapInstanceRef.current = null;
        }

        const map = L.map(miniMapContainerRef.current, {
          center: coordinates,
          zoom: 13,
          zoomControl: true,
          attributionControl: false,
        });

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map);

        // Custom pulsing animated pin icon
        const pinIcon = L.divIcon({
          className: "custom-map-pin",
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 28px; height: 28px; background: rgba(239, 68, 68, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="background: #ef4444; color: white; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold;">
                📍
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker(coordinates, { icon: pinIcon, draggable: true }).addTo(map);
        pinMarkerRef.current = marker;
        miniMapInstanceRef.current = map;

        const updatePin = (lat: number, lng: number) => {
          marker.setLatLng([lat, lng]);
          setCoordinates([lat, lng]);
          const resolved = resolveLocationAndAuthority(lat, lng);
          setFetchedMetadata(resolved);
        };

        // On Click on Map -> Move Pin & Auto-Fetch Authority
        map.on("click", (e: any) => {
          updatePin(e.latlng.lat, e.latlng.lng);
        });

        // On Marker Drag -> Move Pin & Auto-Fetch Authority
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          updatePin(pos.lat, pos.lng);
        });

        // Trigger resize for proper tile rendering in modal
        setTimeout(() => {
          map.invalidateSize();
        }, 200);
      });
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (miniMapInstanceRef.current) {
        miniMapInstanceRef.current.remove();
        miniMapInstanceRef.current = null;
      }
    };
  }, [isReportModalOpen]);

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

  const handleCenterChakan = () => {
    if (miniMapInstanceRef.current && pinMarkerRef.current) {
      const defaultCoord: [number, number] = [18.7600, 73.8450];
      miniMapInstanceRef.current.setView(defaultCoord, 14);
      pinMarkerRef.current.setLatLng(defaultCoord);
      setCoordinates(defaultCoord);
      const resolved = resolveLocationAndAuthority(defaultCoord[0], defaultCoord[1]);
      setFetchedMetadata(resolved);
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
      landmark: language === "mr" ? fetchedMetadata.landmarkMr : fetchedMetadata.landmark,
      landmarkMr: fetchedMetadata.landmarkMr,
      coordinates,
      photoUrl: photoUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80",
      reportedBy: "Citizen Geotagged Reporter",
      status: "Reported",
      assignedAuthority: fetchedMetadata.authority,
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
                  ? "नकाशावर थेट क्लिक करून पिन करा — संबंधित विभाग व रस्ता आपोआप डिटेक्ट होईल"
                  : "Click & pin anywhere directly on the map — location & authority are auto-fetched"}
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
                ? `आपली तक्रार नकाशावरील GPS निर्देशकांनुसार ${fetchedMetadata.authority} विभागाकडे वर्ग करण्यात आली आहे.`
                : `Your grievance has been auto-dispatched to ${fetchedMetadata.authority} nodal engineering desk with verified map coordinates.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs text-slate-800 max-h-[85vh] overflow-y-auto">
            {/* STEP 1: DIRECT INTERACTIVE MAP PIN PICKER */}
            <div className="bg-slate-50 border-2 border-blue-300 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>
                    {language === "mr"
                      ? "१. नकाशावर थेट क्लिक करून पिन करा (Direct Map Pin):"
                      : "1. Click / Pin Directly on Map (Auto-Detects Authority):"}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleCenterChakan}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-[10px] font-bold text-slate-700 flex items-center gap-1 shadow-2xs transition-colors"
                >
                  <LocateFixed className="w-3 h-3 text-blue-700" />
                  <span>Center Chakan</span>
                </button>
              </div>

              {/* Map Canvas */}
              <div className="relative rounded-xl overflow-hidden border-2 border-blue-400 shadow-sm">
                <div
                  ref={miniMapContainerRef}
                  className="w-full h-52 bg-slate-200 z-10 cursor-crosshair"
                />
                <div className="absolute top-2 left-2 z-20 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                  <span>👆 Tap anywhere on the map to place/move the pin</span>
                </div>
              </div>

              {/* LIVE AUTO-FETCHED GIS METADATA CARD */}
              <div className="bg-white p-3.5 rounded-xl border border-blue-300 shadow-xs space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Auto-Detected from Map Pin:
                  </span>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border shadow-2xs ${getAuthorityBadgeColor(fetchedMetadata.authority)}`}>
                    Target Authority: {fetchedMetadata.authority}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-2 border-t border-slate-100 font-medium text-slate-700">
                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold">Detected Landmark:</span>
                    <span className="font-bold text-slate-900 truncate block">
                      {language === "mr" ? fetchedMetadata.landmarkMr : fetchedMetadata.landmark}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold">Road / Corridor Asset:</span>
                    <span className="font-bold text-blue-900 truncate block">{fetchedMetadata.roadName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold">Pinned Coordinates:</span>
                    <span className="font-mono text-slate-800 text-[10px] block font-bold">
                      {coordinates[0].toFixed(5)}, {coordinates[1].toFixed(5)}
                    </span>
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
                    ? `तक्रार ${fetchedMetadata.authority} विभागाकडे दाखल करा`
                    : `Submit Geotagged Grievance to ${fetchedMetadata.authority} Desk`}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
