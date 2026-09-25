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
  Crosshair,
  Check,
  Loader2,
  Info,
} from "lucide-react";
import confetti from "canvas-confetti";
import type { Map as LeafletMap, Marker as LeafletMarker, CircleMarker as LeafletCircleMarker } from "leaflet";

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
    name: "Bhosari - Moshi Toll Plaza Link",
    nameMr: "भोसरी - मोशी टोल नाका लिंक",
    roadName: "NH-60 Southern Gateway",
    authority: "NHAI",
    center: [18.6650, 73.8580],
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
  {
    name: "Alandi - Chakan PWD Link Road",
    nameMr: "आळंदी - चाकण पीडब्ल्यूडी लिंक रोड",
    roadName: "SH PWD Feeder Corridor",
    authority: "PWD",
    center: [18.7100, 73.8750],
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
  {
    name: "MIDC Khalumbre Freight Link",
    nameMr: "एमआयडीसी खालुंब्रे अवजड वाहतूक मार्ग",
    roadName: "MIDC Industrial Connector",
    authority: "MIDC",
    center: [18.7720, 73.8190],
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
  {
    name: "Nighoje Village - MIDC Link",
    nameMr: "निघोजे गाव - एमआयडीसी लिंक रस्ता",
    roadName: "Nighoje Gram Panchayat Road",
    authority: "GramPanchayat",
    center: [18.7250, 73.8180],
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
  const [coordinates, setCoordinates] = useState<[number, number]>([18.7615, 73.8588]);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);

  const [fetchedMetadata, setFetchedMetadata] = useState<{
    landmark: string;
    landmarkMr: string;
    roadName: string;
    authority: Authority;
  }>({
    landmark: "Chakan Central / Manik Chowk (18.7615, 73.8588)",
    landmarkMr: "चाकण मध्यवर्ती / माणिक चौक (18.7615, 73.8588)",
    roadName: "NH-60 Pune-Nashik National Highway",
    authority: "NHAI",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const miniMapContainerRef = useRef<HTMLDivElement>(null);
  const miniMapInstanceRef = useRef<LeafletMap | null>(null);
  const pinMarkerRef = useRef<LeafletMarker | null>(null);
  const haloMarkerRef = useRef<LeafletCircleMarker | null>(null);

  // Update pin position, halo, and auto-fetch metadata
  const updatePinAndMetadata = (lat: number, lng: number, shouldFlyTo: boolean = false) => {
    setCoordinates([lat, lng]);
    const resolved = resolveLocationAndAuthority(lat, lng);
    setFetchedMetadata(resolved);

    if (pinMarkerRef.current) {
      pinMarkerRef.current.setLatLng([lat, lng]);
      pinMarkerRef.current.setPopupContent(`
        <div style="font-family: sans-serif; font-size: 11px; padding: 4px; line-height: 1.4;">
          <b style="color: #0f2b48;">📍 Pinned Location</b><br/>
          <span>${language === "mr" ? resolved.landmarkMr : resolved.landmark}</span><br/>
          <span style="font-size: 10px; color: #1d4ed8; font-weight: bold;">Authority: ${resolved.authority}</span>
        </div>
      `);
    }

    if (haloMarkerRef.current) {
      haloMarkerRef.current.setLatLng([lat, lng]);
    }

    if (shouldFlyTo && miniMapInstanceRef.current) {
      miniMapInstanceRef.current.flyTo([lat, lng], 15, { duration: 0.8 });
    }

    // Attempt reverse geocoding via OpenStreetMap Nominatim asynchronously (non-blocking)
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.display_name) {
          const road = data.address?.road || data.address?.suburb || data.address?.neighbourhood;
          const town = data.address?.town || data.address?.city || data.address?.village || "Chakan";
          if (road) {
            setFetchedMetadata((prev) => ({
              ...prev,
              landmark: `${road}, ${town} (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            }));
          }
        }
      })
      .catch(() => {
        // Fallback to zone resolution already set
      });
  };

  // Live GPS geolocation handler
  const handleFetchCurrentGpsLocation = () => {
    setIsMapPickerOpen(true);
    if (!navigator.geolocation) {
      setGpsStatus(
        language === "mr"
          ? "तुमच्या ब्राऊझरमध्ये GPS सपोर्ट उपलब्ध नाही. कृपया नकाशावर थेट टॅप करा."
          : "Geolocation is not supported by your browser. Please tap on the map to pin location."
      );
      return;
    }

    setIsLocating(true);
    setGpsStatus(
      language === "mr"
        ? "उपग्रहाद्वारे थेट GPS लोकेशन शोधत आहे..."
        : "Acquiring live satellite GPS coordinates..."
    );

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setIsLocating(false);
        setGpsStatus(
          language === "mr"
            ? `✓ GPS लोकेशन यशस्वी: (${lat.toFixed(4)}, ${lng.toFixed(4)}) अचूकता: ±${Math.round(pos.coords.accuracy)}m`
            : `✓ Live GPS Captured: (${lat.toFixed(4)}, ${lng.toFixed(4)}) Accuracy: ±${Math.round(pos.coords.accuracy)}m`
        );
        updatePinAndMetadata(lat, lng, true);
      },
      (err) => {
        setIsLocating(false);
        console.warn("GPS lookup error:", err);
        setGpsStatus(
          language === "mr"
            ? "GPS परवानगी मिळालेली नाही. कृपया खालील नकाशावर थेट टॅप करून पिन ठेवा."
            : "GPS permission not granted. Please click directly anywhere on the map to drop the pin."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Initialize interactive Leaflet map inside modal
  useEffect(() => {
    if (!isReportModalOpen || !isMapPickerOpen) return;

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
          zoom: 15,
          zoomControl: true,
          attributionControl: false,
        });

        // Google Satellite Hybrid tile layer (same as Master GIS Map)
        L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
          maxZoom: 20,
        }).addTo(map);

        // High-visibility SVG Pin Icon with crisp drop shadow and bottom-center anchor
        const pinSvgHtml = `
          <div style="position: relative; width: 44px; height: 54px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 16px; height: 6px; background: rgba(0,0,0,0.4); border-radius: 50%; filter: blur(1.5px);"></div>
            <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));">
              <path d="M20 0C8.954 0 0 8.954 0 20C0 35 20 50 20 50C20 50 40 35 40 20C40 8.954 31.046 0 20 0Z" fill="#DC2626" stroke="#FFFFFF" stroke-width="2.5"/>
              <circle cx="20" cy="19" r="8" fill="#FFFFFF"/>
              <circle cx="20" cy="19" r="4.5" fill="#DC2626"/>
            </svg>
            <div style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #0F172A; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 9999px; border: 1.5px solid #FFFFFF; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.4); pointer-events: none;">
              📍 PIN
            </div>
          </div>
        `;

        const pinIcon = L.divIcon({
          className: "report-modal-leaflet-pin",
          html: pinSvgHtml,
          iconSize: [44, 54],
          iconAnchor: [22, 54],
          popupAnchor: [0, -54],
        });

        // Pulsing circular base halo indicator
        const halo = L.circleMarker(coordinates, {
          radius: 16,
          color: "#DC2626",
          fillColor: "#EF4444",
          fillOpacity: 0.35,
          weight: 2.5,
        }).addTo(map);
        haloMarkerRef.current = halo;

        // Interactive Pin Marker
        const marker = L.marker(coordinates, {
          icon: pinIcon,
          draggable: true,
          zIndexOffset: 2000,
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 11px; padding: 4px; line-height: 1.4;">
            <b style="color: #0f2b48;">📍 Pinned Location</b><br/>
            <span>${language === "mr" ? fetchedMetadata.landmarkMr : fetchedMetadata.landmark}</span><br/>
            <span style="font-size: 10px; color: #1d4ed8; font-weight: bold;">Authority: ${fetchedMetadata.authority}</span>
          </div>
        `);

        pinMarkerRef.current = marker;
        miniMapInstanceRef.current = map;

        // When user clicks anywhere on map -> Immediately move pin & auto-fetch location & authority!
        map.on("click", (e: any) => {
          updatePinAndMetadata(e.latlng.lat, e.latlng.lng, false);
        });

        // When marker is dragged -> Auto-update location & authority!
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          updatePinAndMetadata(pos.lat, pos.lng, false);
        });

        // Invalidate map size multiple times to ensure full canvas paint
        setTimeout(() => map.invalidateSize(), 100);
        setTimeout(() => map.invalidateSize(), 300);
        setTimeout(() => map.invalidateSize(), 600);
      });
    }, 120);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (miniMapInstanceRef.current) {
        miniMapInstanceRef.current.remove();
        miniMapInstanceRef.current = null;
      }
    };
  }, [isReportModalOpen, isMapPickerOpen]);

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-[#0f2b48] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md font-bold flex-shrink-0">
              <MapPin className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">
                {language === "mr" ? "चाकण रस्ते तक्रार: नकाशावर थेट पिन व लोकेशन" : "Report Issue: Pin Directly on Map & Auto-Fetch Location"}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === "mr"
                  ? "नकाशावर कुठेही टॅप करा किंवा GPS वापरा — विभाग (Authority) आपोआप डिटेक्ट होईल"
                  : "Click anywhere on the map or use Live GPS to auto-fetch the responsible authority"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsReportModalOpen(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center mx-auto text-emerald-800">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              {language === "mr" ? "तक्रार यशस्वीरित्या नोंदवली गेली!" : "Grievance Successfully Geotagged!"}
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {language === "mr"
                ? `आपली तक्रार नकाशावरील GPS निर्देशकांनुसार ${fetchedMetadata.authority} विभागाकडे वर्ग करण्यात आली आहे.`
                : `Your grievance has been auto-dispatched to ${fetchedMetadata.authority} nodal engineering desk with verified map coordinates.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs text-slate-800 max-h-[82vh] overflow-y-auto">
            {/* STEP 1: INTERACTIVE MAP CANVAS WITH PIN & AUTO-FETCH CONTROLS */}
            <div className="bg-slate-50 border-2 border-blue-500 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-xs">
              {/* Section Label */}
              <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Crosshair className="w-4 h-4 text-rose-600" />
                <span>
                  {language === "mr"
                    ? "१. तक्रारीचे ठिकाण निवडा:"
                    : "1. Select Issue Location:"}
                </span>
              </span>

              {/* Two Location Mode Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {/* Live GPS Button */}
                <button
                  type="button"
                  onClick={handleFetchCurrentGpsLocation}
                  disabled={isLocating}
                  className="p-3.5 rounded-xl border-2 border-blue-300 bg-blue-50 hover:bg-blue-100 text-center space-y-1.5 transition-all active:scale-[0.97] disabled:opacity-70 group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform">
                    {isLocating ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <LocateFixed className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-blue-900 block">
                    {isLocating
                      ? (language === "mr" ? "शोधत आहे..." : "Locating...")
                      : (language === "mr" ? "📡 माझे GPS लोकेशन" : "📡 Use Live GPS")}
                  </span>
                  <span className="text-[10px] text-blue-700/80 block font-medium">
                    {language === "mr" ? "आपोआप स्थान शोधते" : "Auto-detect your location"}
                  </span>
                </button>

                {/* Select from Map Button */}
                <button
                  type="button"
                  onClick={() => setIsMapPickerOpen(true)}
                  className={`p-3.5 rounded-xl border-2 text-center space-y-1.5 transition-all active:scale-[0.97] group ${
                    isMapPickerOpen
                      ? "border-emerald-500 bg-emerald-100 ring-2 ring-emerald-400"
                      : "border-emerald-300 bg-emerald-50 hover:bg-emerald-100"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform">
                    <Navigation className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-emerald-900 block">
                    {language === "mr" ? "🗺️ नकाशावर निवडा" : "🗺️ Select from Map"}
                  </span>
                  <span className="text-[10px] text-emerald-700/80 block font-medium">
                    {language === "mr" ? "नकाशावर पिन ठेवा" : "Tap map to drop pin"}
                  </span>
                </button>
              </div>

              {isMapPickerOpen && (
                <div className="fixed inset-0 z-[70] bg-slate-900/80 backdrop-blur-sm flex flex-col animate-fade-in">
                  {/* Fullscreen Map Header */}
                  <div className="bg-[#0f2b48] text-white px-4 py-3 flex items-center justify-between flex-shrink-0 shadow-lg">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow">
                        <MapPin className="w-4 h-4 text-white animate-bounce" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold leading-tight">
                          {language === "mr" ? "नकाशावर ठिकाण निवडा" : "Select Location on Map"}
                        </h4>
                        <p className="text-[10px] text-slate-300">
                          {language === "mr" ? "पिन हलवा किंवा नकाशावर टॅप करा" : "Drag pin or tap anywhere on map"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMapPickerOpen(false)}
                      className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* GPS Status Strip (if active) */}
                  {gpsStatus && (
                    <div className="px-4 py-1.5 bg-blue-900/80 text-blue-100 text-[11px] font-medium flex items-center gap-1.5 flex-shrink-0">
                      <Info className="w-3.5 h-3.5 text-blue-300 flex-shrink-0" />
                      <span className="truncate">{gpsStatus}</span>
                    </div>
                  )}

                  {/* Full-screen Map Canvas */}
                  <div className="flex-1 relative">
                    <div
                      ref={miniMapContainerRef}
                      className="w-full h-full bg-slate-300 cursor-crosshair"
                    />

                    {/* Top-left instruction badge */}
                    <div className="absolute top-3 left-3 z-20 bg-slate-900/90 backdrop-blur-sm text-white text-[11px] font-bold px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2 border border-slate-600">
                      <MapPin className="w-4 h-4 text-rose-400 animate-pulse" />
                      <span>{language === "mr" ? "नकाशावर कुठेही क्लिक करा किंवा पिन ड्रॅग करा" : "Click anywhere or drag the pin 📍"}</span>
                    </div>

                    {/* Top-right coordinates badge */}
                    <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-sm text-slate-900 text-[11px] font-mono font-bold px-3 py-1.5 rounded-lg shadow-md border border-slate-300">
                      📍 {coordinates[0].toFixed(5)}, {coordinates[1].toFixed(5)}
                    </div>
                  </div>

                  {/* Bottom Bar: Live Authority Detection + Confirm */}
                  <div className="bg-white border-t-2 border-emerald-500 px-4 py-3 flex-shrink-0 space-y-2.5 shadow-[0_-4px_12px_rgba(0,0,0,0.15)]">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                            {language === "mr" ? "ऑटो-डिटेक्ट:" : "Auto-Detected:"}
                          </span>
                          <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${getAuthorityBadgeColor(fetchedMetadata.authority)}`}>
                            {fetchedMetadata.authority} ✓
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {language === "mr" ? fetchedMetadata.landmarkMr : fetchedMetadata.landmark}
                        </p>
                        <p className="text-[10px] text-blue-800 font-medium truncate">{fetchedMetadata.roadName}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsMapPickerOpen(false)}
                      className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.97]"
                    >
                      <Check className="w-5 h-5" />
                      <span>{language === "mr" ? "✓ हे ठिकाण निश्चित करा" : "✓ Confirm This Location"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* LIVE AUTO-FETCHED GIS METADATA CARD */}
              <div className="bg-white p-3.5 rounded-xl border-2 border-emerald-500 shadow-xs space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Auto-Fetched From Map Pin:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full border shadow-2xs ${getAuthorityBadgeColor(fetchedMetadata.authority)}`}>
                      Target Authority: {fetchedMetadata.authority} ✓
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-2 border-t border-slate-100 font-medium text-slate-700">
                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold">Detected Landmark:</span>
                    <span className="font-bold text-slate-900 truncate block">
                      {language === "mr" ? fetchedMetadata.landmarkMr : fetchedMetadata.landmark}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold">Road / Highway Asset:</span>
                    <span className="font-bold text-blue-900 truncate block">{fetchedMetadata.roadName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold">Pinned Coordinates:</span>
                    <span className="font-mono text-emerald-800 text-[11px] block font-bold">
                      {coordinates[0].toFixed(5)}, {coordinates[1].toFixed(5)}
                    </span>
                  </div>
                </div>

                {/* Optional Authority Manual Override */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-[11px]">
                  <span className="text-slate-600 font-medium">
                    {language === "mr" ? "विभाग बदलायचा असल्यास:" : "Need to assign different authority?"}
                  </span>
                  <select
                    value={fetchedMetadata.authority}
                    onChange={(e) =>
                      setFetchedMetadata((prev) => ({
                        ...prev,
                        authority: e.target.value as Authority,
                      }))
                    }
                    className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="NHAI">NHAI (राष्ट्रीय महामार्ग - NH-60)</option>
                    <option value="PWD">PWD (सार्वजनिक बांधकाम - SH-55/112)</option>
                    <option value="MIDC">MIDC (एमआयडीसी औद्योगिक रस्ते)</option>
                    <option value="PMRDA">PMRDA (पुणे महानगर विकास प्राधिकरण)</option>
                    <option value="GramPanchayat">Gram Panchayat (ग्रामपंचायत रस्ते)</option>
                  </select>
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
