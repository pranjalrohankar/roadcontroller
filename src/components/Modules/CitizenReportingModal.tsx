"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { CitizenReportCategory, Authority } from "@/types";
import { initialRoadsData } from "@/data/roadsData";
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
  Compass,
  Check,
  Search,
  Loader2,
  Info,
  Layers,
} from "lucide-react";
import confetti from "canvas-confetti";
import type { Map as LeafletMap, Marker as LeafletMarker, CircleMarker as LeafletCircleMarker, LayerGroup as LeafletLayerGroup } from "leaflet";

const landmarkPoints = [
  { name: "Chakan Manik Chowk Hub", nameMr: "चाकण माणिक चौक केंद्र", coords: [18.7615, 73.8588] as [number, number], badge: "NHAI", color: "text-red-700 border-red-300 bg-red-50" },
  { name: "Chakan ST Bus Stand", nameMr: "चाकण एसटी बसस्थानक", coords: [18.7590, 73.8570] as [number, number], badge: "NHAI", color: "text-red-700 border-red-300 bg-red-50" },
  { name: "Ambethan Chowk", nameMr: "आंबेठाण चौक", coords: [18.7595, 73.8385] as [number, number], badge: "PWD", color: "text-emerald-700 border-emerald-300 bg-emerald-50" },
  { name: "Kharabwadi Phata (MIDC Gate 1)", nameMr: "खराबवाडी फाटा (एमआयडीसी गेट १)", coords: [18.7554, 73.8152] as [number, number], badge: "PWD", color: "text-emerald-700 border-emerald-300 bg-emerald-50" },
  { name: "MIDC Phase 2 (Mercedes & Mahindra Spine)", nameMr: "एमआयडीसी फेज २ (मर्सिडीज व महिंद्रा स्पाइन)", coords: [18.7752, 73.8012] as [number, number], badge: "MIDC", color: "text-orange-700 border-orange-300 bg-orange-50" },
  { name: "MIDC Phase 1 Auto Cluster (Bajaj Area)", nameMr: "एमआयडीसी फेज १ ऑटो क्लस्टर (बजाज परिसर)", coords: [18.7650, 73.8350] as [number, number], badge: "MIDC", color: "text-orange-700 border-orange-300 bg-orange-50" },
  { name: "Mahalunge Industrial Junction", nameMr: "महाळुंगे इंडस्ट्रियल जंक्शन", coords: [18.7610, 73.8245] as [number, number], badge: "MIDC", color: "text-orange-700 border-orange-300 bg-orange-50" },
  { name: "Vasuli Phata & Logistics Hub", nameMr: "वासुली फाटा व लॉजिस्टिक्स हब", coords: [18.7890, 73.7840] as [number, number], badge: "MIDC", color: "text-orange-700 border-orange-300 bg-orange-50" },
  { name: "Nighoje Industrial Sector", nameMr: "निघोजे इंडस्ट्रियल सेक्टर", coords: [18.7250, 73.8180] as [number, number], badge: "MIDC", color: "text-orange-700 border-orange-300 bg-orange-50" },
  { name: "Talegaon MIDC Junction (SH-55)", nameMr: "तळेगाव एमआयडीसी चौक (SH-५५)", coords: [18.7380, 73.7150] as [number, number], badge: "PWD", color: "text-emerald-700 border-emerald-300 bg-emerald-50" },
  { name: "Sudumbre Feeder Link", nameMr: "सुदुंबरे फीडर रस्ता", coords: [18.7420, 73.7250] as [number, number], badge: "PWD", color: "text-emerald-700 border-emerald-300 bg-emerald-50" },
  { name: "Kuruli Ring Bypass Junction", nameMr: "कुरुळी रिंग बायपास चौक", coords: [18.7380, 73.8640] as [number, number], badge: "PMRDA", color: "text-blue-700 border-blue-300 bg-blue-50" },
  { name: "Nanekarwadi Industrial Area", nameMr: "नाणेकरवाडी औद्योगिक परिसर", coords: [18.7320, 73.8390] as [number, number], badge: "PMRDA", color: "text-blue-700 border-blue-300 bg-blue-50" },
  { name: "Sara City Mega Township", nameMr: "सारा सिटी टाऊनशिप", coords: [18.7485, 73.8490] as [number, number], badge: "GP", color: "text-purple-700 border-purple-300 bg-purple-50" },
  { name: "Medankarwadi Township", nameMr: "मेदनकरवाडी परिसर", coords: [18.7490, 73.8560] as [number, number], badge: "GP", color: "text-purple-700 border-purple-300 bg-purple-50" },
  { name: "Kadachiwadi Rural Link", nameMr: "कडाचीवाडी रस्ता", coords: [18.7410, 73.8680] as [number, number], badge: "GP", color: "text-purple-700 border-purple-300 bg-purple-50" },
  { name: "Chimbali Phata (NH-60)", nameMr: "चिमबळी फाटा (NH-६०)", coords: [18.7180, 73.8580] as [number, number], badge: "NHAI", color: "text-red-700 border-red-300 bg-red-50" },
  { name: "Moshi Gateway & Toll Plaza", nameMr: "मोशी प्रवेशद्वार व टोल नाका", coords: [18.6850, 73.8550] as [number, number], badge: "NHAI", color: "text-red-700 border-red-300 bg-red-50" },
  { name: "Bhosari Industrial Border", nameMr: "भोसरी औद्योगिक सीमा", coords: [18.6300, 73.8480] as [number, number], badge: "NHAI", color: "text-red-700 border-red-300 bg-red-50" },
  { name: "Rajgurunagar (Khed) ST Stand", nameMr: "राजगुरुनगर (खेड) बसस्थानक", coords: [18.8400, 73.8900] as [number, number], badge: "NHAI", color: "text-red-700 border-red-300 bg-red-50" },
  { name: "Peth Ghat & Manchar Sector", nameMr: "पेठ घाट व मंचर पट्टा", coords: [18.9400, 73.9350] as [number, number], badge: "NHAI", color: "text-red-700 border-red-300 bg-red-50" },
  { name: "Pabal Phata Junction (SH-55)", nameMr: "पाबळ फाटा चौक (SH-५५)", coords: [18.7650, 73.9450] as [number, number], badge: "PWD", color: "text-emerald-700 border-emerald-300 bg-emerald-50" },
  { name: "Shikrapur Nagar Highway Junction", nameMr: "शिक्रापूर नगर महामार्ग चौक", coords: [18.7200, 74.0500] as [number, number], badge: "PWD", color: "text-emerald-700 border-emerald-300 bg-emerald-50" },
  { name: "Alandi Devachi Pilgrim Link (SH-112)", nameMr: "आळंदी देवाची तीर्थक्षेत्र रस्ता (SH-११२)", coords: [18.6780, 73.8960] as [number, number], badge: "PWD", color: "text-emerald-700 border-emerald-300 bg-emerald-50" },
];

// Distance from point (px, py) to line segment (x1, y1) -> (x2, y2)
function distToSegmentSquared(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
  const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return (px - x1) * (px - x1) + (py - y1) * (py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * (x2 - x1);
  const projY = y1 + t * (y2 - y1);
  return (px - projX) * (px - projX) + (py - projY) * (py - projY);
}

function getMinDistanceToRoad(lat: number, lng: number, coordinates: [number, number][]): number {
  let minD2 = Infinity;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const p1 = coordinates[i];
    const p2 = coordinates[i + 1];
    const d2 = distToSegmentSquared(lat, lng, p1[0], p1[1], p2[0], p2[1]);
    if (d2 < minD2) minD2 = d2;
  }
  return Math.sqrt(minD2);
}

// Calculate the mathematically closest road segment from initialRoadsData
function resolveRoadAndAuthority(lat: number, lng: number): {
  landmark: string;
  landmarkMr: string;
  roadName: string;
  authority: Authority;
} {
  let closestRoad = initialRoadsData[0];
  let minDistance = Infinity;

  for (const road of initialRoadsData) {
    const dist = getMinDistanceToRoad(lat, lng, road.coordinates);
    if (dist < minDistance) {
      minDistance = dist;
      closestRoad = road;
    }
  }

  // Also find closest landmark point
  let closestLandmark = landmarkPoints[0];
  let minLmDist = Infinity;
  for (const lm of landmarkPoints) {
    const dLat = lat - lm.coords[0];
    const dLng = lng - lm.coords[1];
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist < minLmDist) {
      minLmDist = dist;
      closestLandmark = lm;
    }
  }

  return {
    landmark: `${closestLandmark.name} (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    landmarkMr: `${closestLandmark.nameMr} (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    roadName: `${closestRoad.name}`,
    authority: closestRoad.authority,
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
  const [mapSearch, setMapSearch] = useState<string>("");
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false);

  const [fetchedMetadata, setFetchedMetadata] = useState<{
    landmark: string;
    landmarkMr: string;
    roadName: string;
    authority: Authority;
  }>({
    landmark: "Chakan Manik Chowk Hub (18.7615, 73.8588)",
    landmarkMr: "चाकण माणिक चौक केंद्र (18.7615, 73.8588)",
    roadName: "NH-60: Chimbali Phata to Kuruli & Chakan Manik Chowk",
    authority: "NHAI",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const miniMapContainerRef = useRef<HTMLDivElement>(null);
  const miniMapInstanceRef = useRef<LeafletMap | null>(null);
  const pinMarkerRef = useRef<LeafletMarker | null>(null);
  const haloMarkerRef = useRef<LeafletCircleMarker | null>(null);
  const roadLayersRef = useRef<LeafletLayerGroup | null>(null);

  // Mutable ref so Leaflet event listeners always invoke the latest function closure
  const updateHandlerRef = useRef<(lat: number, lng: number, shouldFly: boolean) => void>(() => {});

  // Function to update coordinates, pin position, halo, and resolve GIS road/authority
  const updateLocationAndPin = (lat: number, lng: number, shouldFlyTo: boolean = false) => {
    setCoordinates([lat, lng]);
    setIsManualOverride(false);

    const resolved = resolveRoadAndAuthority(lat, lng);
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
  };

  // Keep ref up to date on every render
  useEffect(() => {
    updateHandlerRef.current = updateLocationAndPin;
  });

  // Live GPS geolocation handler
  const handleFetchCurrentGpsLocation = () => {
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
        ? "उपग्रहाद्वारे थेट GPS शोधत आहे..."
        : "Acquiring live satellite GPS coordinates..."
    );

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setIsLocating(false);
        setGpsStatus(
          language === "mr"
            ? `✓ थेट GPS लोकेशन: (${lat.toFixed(4)}, ${lng.toFixed(4)}) अचूकता: ±${Math.round(pos.coords.accuracy)}m`
            : `✓ Live GPS Captured: (${lat.toFixed(4)}, ${lng.toFixed(4)}) Accuracy: ±${Math.round(pos.coords.accuracy)}m`
        );
        updateLocationAndPin(lat, lng, true);
      },
      (err) => {
        setIsLocating(false);
        console.warn("GPS lookup error:", err);
        setGpsStatus(
          language === "mr"
            ? "GPS परवानगी मिळालेली नाही. कृपया खालील नकाशावर कुठेही टॅप करून लाल पिन ठेवा."
            : "GPS permission not granted. Please click directly anywhere on the map to place the pin."
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
          zoom: 14,
          zoomControl: true,
          attributionControl: false,
        });

        // OpenStreetMap free tile layer
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map);

        const roadLayerGroup = L.layerGroup().addTo(map);
        roadLayersRef.current = roadLayerGroup;

        // Render all 20 road networks on the modal map with their real colors
        initialRoadsData.forEach((road) => {
          let color = "#ef4444"; // NHAI
          if (road.authority === "PWD") color = "#10b981";
          if (road.authority === "MIDC") color = "#f97316";
          if (road.authority === "PMRDA") color = "#3b82f6";
          if (road.authority === "GramPanchayat") color = "#a855f7";

          // Base halo
          L.polyline(road.coordinates, {
            color: "#ffffff",
            weight: 7,
            opacity: 0.9,
            lineCap: "round",
          }).addTo(roadLayerGroup);

          const line = L.polyline(road.coordinates, {
            color: color,
            weight: 5,
            opacity: 0.95,
            lineCap: "round",
          }).addTo(roadLayerGroup);

          line.bindTooltip(`<b>${road.name}</b><br/>Authority: <b>${road.authority}</b>`, { sticky: true });

          // Clicking directly on any road polyline moves pin to click position & auto-detects
          line.on("click", (e: any) => {
            updateHandlerRef.current(e.latlng.lat, e.latlng.lng, false);
          });
        });

        // High-visibility SVG Pin Icon with crisp drop shadow and bottom-center anchor
        const pinSvgHtml = `
          <div style="position: relative; width: 44px; height: 54px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 16px; height: 6px; background: rgba(0,0,0,0.45); border-radius: 50%; filter: blur(1.5px);"></div>
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
          updateHandlerRef.current(e.latlng.lat, e.latlng.lng, false);
        });

        // When marker is dragged -> Auto-update location & authority!
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          updateHandlerRef.current(pos.lat, pos.lng, false);
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

  const handleCenterPreset = (lat: number, lng: number) => {
    updateLocationAndPin(lat, lng, true);
  };

  const handleSearchFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapSearch.trim()) return;
    const query = mapSearch.toLowerCase();
    const match = landmarkPoints.find(
      (z) =>
        z.name.toLowerCase().includes(query) ||
        z.nameMr.includes(query) ||
        z.badge.toLowerCase().includes(query)
    );
    if (match) {
      updateLocationAndPin(match.coords[0], match.coords[1], true);
      setGpsStatus(`✓ Moved pin to: ${match.name}`);
    } else {
      const roadMatch = initialRoadsData.find(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.nameMr.includes(query) ||
          r.authority.toLowerCase().includes(query)
      );
      if (roadMatch) {
        updateLocationAndPin(roadMatch.coordinates[0][0], roadMatch.coordinates[0][1], true);
        setGpsStatus(`✓ Moved pin to road: ${roadMatch.name}`);
      } else {
        setGpsStatus(`⚠️ No direct match for "${mapSearch}". Please click on the map to pin.`);
      }
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
                  ? "नकाशावर कुठेही टॅप करा किंवा GPS वापरा — विभाग (Authority) व रस्ता आपोआप डिटेक्ट होईल"
                  : "Click anywhere on the map or use Live GPS to auto-fetch the responsible road & authority"}
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
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Crosshair className="w-4 h-4 text-rose-600 animate-spin" />
                  <span>
                    {language === "mr"
                      ? "१. नकाशावर थेट क्लिक करून पिन ठेवा (Click to Pin 📍):"
                      : "1. Click Map or Use GPS to Drop Pin 📍:"}
                  </span>
                </span>

                {/* Primary Button: Detect Live GPS Location */}
                <button
                  type="button"
                  onClick={handleFetchCurrentGpsLocation}
                  disabled={isLocating}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-75"
                >
                  {isLocating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{language === "mr" ? "शोधत आहे..." : "Locating GPS..."}</span>
                    </>
                  ) : (
                    <>
                      <LocateFixed className="w-3.5 h-3.5 text-blue-200" />
                      <span>{language === "mr" ? "माझे GPS लोकेशन मिळवा" : "Detect My Live GPS"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Map Search & Quick Jump Presets */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={
                        language === "mr"
                          ? "रस्ता किंवा परिसर शोधा (उदा. Manik Chowk, Phase 2, Mahalunge, Talegaon, Sara City)..."
                          : "Search area to jump pin (e.g. Manik Chowk, MIDC Phase 2, Mahalunge, Talegaon, Sara City)..."
                      }
                      value={mapSearch}
                      onChange={(e) => setMapSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSearchFilter(e);
                        }
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium shadow-2xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSearchFilter}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-2xs"
                  >
                    {language === "mr" ? "जंप" : "Jump"}
                  </button>
                </div>

                {/* Quick Area Preset Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                    {language === "mr" ? "त्वरित हद्द:" : "Quick Corridors:"}
                  </span>
                  {landmarkPoints.slice(0, 10).map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleCenterPreset(preset.coords[0], preset.coords[1])}
                      className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-bold whitespace-nowrap transition-all hover:scale-105 shadow-2xs ${preset.color}`}
                    >
                      <span className="font-extrabold mr-1">[{preset.badge}]</span>
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live GPS / Action Feedback Status Strip */}
              {gpsStatus && (
                <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] font-medium flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                  <span className="truncate">{gpsStatus}</span>
                </div>
              )}

              {/* Map Canvas with High Visibility Pin Indicator */}
              <div className="relative rounded-xl overflow-hidden border-2 border-slate-400 shadow-md">
                <div
                  ref={miniMapContainerRef}
                  className="w-full h-64 sm:h-72 bg-slate-200 cursor-crosshair z-10"
                />

                {/* Top overlay instructions banner */}
                <div className="absolute top-2 left-2 z-20 bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 border border-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span>{language === "mr" ? "नकाशावर कुठेही क्लिक करून लाल पिन ठेवा" : "Click anywhere on map or roads to move Pin 📍"}</span>
                </div>

                {/* Bottom coordinates badge */}
                <div className="absolute bottom-2 right-2 z-20 bg-white/95 backdrop-blur-xs text-slate-900 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md shadow border border-slate-300">
                  GPS: {coordinates[0].toFixed(5)}, {coordinates[1].toFixed(5)}
                </div>
              </div>

              {/* LIVE AUTO-FETCHED GIS METADATA CARD */}
              <div className="bg-white p-3.5 rounded-xl border-2 border-emerald-500 shadow-xs space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Auto-Fetched From Map Pin:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full border shadow-2xs ${getAuthorityBadgeColor(fetchedMetadata.authority)}`}>
                      Target Authority: {fetchedMetadata.authority} ✓ {isManualOverride ? "(Manually Adjusted)" : ""}
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
                    onChange={(e) => {
                      setIsManualOverride(true);
                      setFetchedMetadata((prev) => ({
                        ...prev,
                        authority: e.target.value as Authority,
                      }));
                    }}
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
