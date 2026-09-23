"use client";

import React, { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import { MapLayerControls } from "./MapLayerControls";
import { Legend } from "./Legend";
import {
  Search,
  Compass,
  RotateCcw,
  Layers,
  MapPin,
  X,
  ShieldCheck,
  Route,
  Sparkles,
  Building2,
  PlusCircle,
  CheckCircle2,
  Clock,
  Radio,
  Check,
  ChevronRight,
  Filter,
} from "lucide-react";
import type { Map as LeafletMap } from "leaflet";
import { Authority, JurisdictionArea, MapLayerConfig, CitizenReport } from "@/types";

export const MasterGisMap: React.FC = () => {
  const {
    projects,
    roadSegments,
    trafficPoints,
    citizenReports,
    jurisdictions,
    selectedJurisdiction,
    setSelectedJurisdiction,
    mapLayers,
    toggleMapLayer,
    setSelectedProject,
    setIsProjectDrawerOpen,
    setIsReportModalOpen,
    setActiveTab,
    t,
    language,
    focusOnMapLocation,
    setFocusOnMapLocation,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const layerGroupRef = useRef<any>(null);
  const [mapTheme, setMapTheme] = useState<"streets" | "satellite" | "dark">("streets");
  const [showLayerDrawer, setShowLayerDrawer] = useState<boolean>(false);
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [showLiveTicker, setShowLiveTicker] = useState<boolean>(true);
  const [tickerFilter, setTickerFilter] = useState<"ALL" | "PENDING" | "RESOLVED">("ALL");

  // Chakan central coordinates
  const chakanCenter: [number, number] = [18.7600, 73.8450];

  // Authority Color Mapping
  const getAuthorityColor = (authority: Authority) => {
    switch (authority) {
      case "NHAI":
        return { stroke: "#ef4444", dark: "#b91c1c", bg: "bg-red-600", text: "text-red-700", name: "NHAI (राष्ट्रीय महामार्ग)" };
      case "PWD":
        return { stroke: "#10b981", dark: "#047857", bg: "bg-emerald-600", text: "text-emerald-700", name: "PWD (सार्वजनिक बांधकाम)" };
      case "MIDC":
        return { stroke: "#f97316", dark: "#c2410c", bg: "bg-orange-600", text: "text-orange-700", name: "MIDC (औद्योगिक रस्ते)" };
      case "PMRDA":
        return { stroke: "#3b82f6", dark: "#1d4ed8", bg: "bg-blue-600", text: "text-blue-700", name: "PMRDA (पुणे मेट्रो विकास)" };
      case "GramPanchayat":
        return { stroke: "#a855f7", dark: "#7e22ce", bg: "bg-purple-600", text: "text-purple-700", name: "ग्रामपंचायत (ग्रामीण रस्ते)" };
      default:
        return { stroke: "#64748b", dark: "#334155", bg: "bg-slate-600", text: "text-slate-700", name: "Other" };
    }
  };

  // Top Authority Checkbox Items (Unified & Non-Duplicate)
  const authorityCheckboxes: {
    key: keyof MapLayerConfig;
    name: string;
    nameMr: string;
    code: string;
    color: string;
    bg: string;
  }[] = [
    {
      key: "nhaiRoads",
      name: "NHAI (NH-60)",
      nameMr: "NHAI (NH-६०)",
      code: "NHAI",
      color: "#ef4444",
      bg: "bg-red-600",
    },
    {
      key: "pwdRoads",
      name: "PWD (SH-55/112)",
      nameMr: "PWD (SH-५५/११२)",
      code: "PWD",
      color: "#10b981",
      bg: "bg-emerald-600",
    },
    {
      key: "midcRoads",
      name: "MIDC Industrial",
      nameMr: "MIDC औद्योगिक",
      code: "MIDC",
      color: "#f97316",
      bg: "bg-orange-600",
    },
    {
      key: "pmrdaRoads",
      name: "PMRDA Ring",
      nameMr: "PMRDA रिंग",
      code: "PMRDA",
      color: "#3b82f6",
      bg: "bg-blue-600",
    },
    {
      key: "gpRoads",
      name: "Gram Panchayat",
      nameMr: "ग्रामपंचायत",
      code: "GP",
      color: "#a855f7",
      bg: "bg-purple-600",
    },
    {
      key: "jurisdictionAreas",
      name: "Highlighted Wards",
      nameMr: "प्रभाग क्षेत्रे",
      code: "AREAS",
      color: "#f59e0b",
      bg: "bg-amber-500",
    },
  ];

  // Cardinal Anchor Landmarks & Key Authority Corridors
  const quickJumpLocations = [
    {
      name: "Chakan Central (Manik Chowk)",
      nameMr: "चाकण माणिक चौक",
      coords: [18.7615, 73.8588] as [number, number],
      badge: "HUB",
      badgeColor: "bg-slate-900 text-white",
    },
    {
      name: "Bhosari / Moshi (South - NH60)",
      nameMr: "भोसरी / मोशी (NH-६०)",
      coords: [18.6650, 73.8580] as [number, number],
      badge: "NHAI",
      badgeColor: "bg-red-600 text-white",
    },
    {
      name: "Manchar & Khed (North - NH60)",
      nameMr: "मंचर व खेड (NH-६०)",
      coords: [18.9300, 73.9350] as [number, number],
      badge: "NHAI",
      badgeColor: "bg-red-600 text-white",
    },
    {
      name: "Shikrapur Junction (East - SH55)",
      nameMr: "शिक्रापूर चौक (SH-५५)",
      coords: [18.7200, 74.0500] as [number, number],
      badge: "PWD",
      badgeColor: "bg-emerald-600 text-white",
    },
    {
      name: "Talegaon Dabhade (West - SH55)",
      nameMr: "तळेगाव दाभाडे (SH-५५)",
      coords: [18.7380, 73.7150] as [number, number],
      badge: "PWD",
      badgeColor: "bg-emerald-600 text-white",
    },
    {
      name: "MIDC Phase 1 & 2 (Vasuli)",
      nameMr: "एमआयडीसी फेज १ व २ वासुली",
      coords: [18.7680, 73.8050] as [number, number],
      badge: "MIDC",
      badgeColor: "bg-orange-600 text-white",
    },
    {
      name: "Kuruli Ring Bypass",
      nameMr: "कुरुळी रिंग बायपास",
      coords: [18.7380, 73.8640] as [number, number],
      badge: "PMRDA",
      badgeColor: "bg-blue-600 text-white",
    },
    {
      name: "Medankarwadi / Sara City",
      nameMr: "मेदनकरवाडी / सारा सिटी",
      coords: [18.7485, 73.8490] as [number, number],
      badge: "GP",
      badgeColor: "bg-purple-600 text-white",
    },
  ];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: chakanCenter,
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: "topright" }).addTo(map);

      // Free OpenStreetMap Tiles - No API Keys Required
      let tileUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
      let tileOptions: any = {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      };

      if (mapTheme === "satellite") {
        tileUrl = "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
        tileOptions = {
          maxZoom: 20,
          attribution: "Google Satellite Maps",
        };
      } else if (mapTheme === "dark") {
        tileUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
        tileOptions = {
          maxZoom: 19,
          className: "map-dark-tiles",
        };
      }

      L.tileLayer(tileUrl, tileOptions).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = layerGroup;

      renderLayers(L, map, layerGroup);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapTheme]);

  // Re-render layers on state change
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    import("leaflet").then((L) => {
      if (!mapInstanceRef.current || !layerGroupRef.current) return;
      renderLayers(L, mapInstanceRef.current, layerGroupRef.current);
    });
  }, [
    mapLayers,
    projects,
    roadSegments,
    trafficPoints,
    citizenReports,
    jurisdictions,
    selectedJurisdiction,
    searchQuery,
  ]);

  // Fly to target location
  useEffect(() => {
    if (focusOnMapLocation && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(focusOnMapLocation, 14, { duration: 1.2 });
      setFocusOnMapLocation(null);
    }
  }, [focusOnMapLocation]);

  const renderLayers = (L: any, map: LeafletMap, layerGroup: any) => {
    layerGroup.clearLayers();

    // 1. Highlighted Ward Area Polygons
    if (mapLayers.jurisdictionAreas && jurisdictions) {
      jurisdictions.forEach((area) => {
        const isSelected = selectedJurisdiction?.id === area.id;

        const poly = L.polygon(area.polygon, {
          color: isSelected ? "#ea580c" : "#b45309",
          weight: isSelected ? 2.5 : 1.5,
          fillColor: "#fbbf24",
          fillOpacity: isSelected ? 0.22 : 0.08,
          dashArray: isSelected ? "6, 4" : "4, 4",
        }).addTo(layerGroup);

        poly.bindTooltip(
          `<b>${language === "mr" ? area.nameMr : area.name}</b><br/>${area.wardLabel}<br/><span class="text-xs text-amber-800 font-bold">${area.activeIssuesCount} Active Issues • ₹${area.totalBudgetCr} Cr Budget</span>`,
          { sticky: true }
        );

        poly.bindPopup(`
          <div class="p-3 text-slate-900 font-sans max-w-xs">
            <span class="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
              ${language === "mr" ? area.wardLabelMr : area.wardLabel}
            </span>
            <h4 class="font-bold text-sm text-slate-900 mt-1">${language === "mr" ? area.nameMr : area.name}</h4>
            <div class="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p><b>Responsible Authority:</b> <span class="font-bold text-blue-900">${area.authority}</span></p>
              <p><b>Active Issues:</b> <span class="font-bold text-rose-600">${area.activeIssuesCount}</span> | <b>Resolved:</b> <span class="font-bold text-emerald-600">${area.resolvedIssuesCount}</span></p>
              <p><b>Sanctioned Budget:</b> <span class="font-bold text-slate-900">₹${area.totalBudgetCr} Cr</span></p>
              <p><b>Estimated Timeline:</b> ${area.aiActionBrief.timelineDays} Days</p>
            </div>
            <div class="mt-2 text-[11px] text-slate-600 border-t border-slate-100 pt-1.5">
              <p class="font-bold text-amber-900">${language === "mr" ? area.aiActionBrief.headlineMr : area.aiActionBrief.headline}</p>
            </div>
          </div>
        `);
      });
    }

    // 2. All 20 Road Segments Across Corridor
    roadSegments.forEach((seg) => {
      const authMatch =
        (seg.authority === "PWD" && mapLayers.pwdRoads) ||
        (seg.authority === "PMRDA" && mapLayers.pmrdaRoads) ||
        (seg.authority === "MIDC" && mapLayers.midcRoads) ||
        (seg.authority === "NHAI" && mapLayers.nhaiRoads) ||
        (seg.authority === "GramPanchayat" && mapLayers.gpRoads);

      if (authMatch) {
        const authStyle = getAuthorityColor(seg.authority);
        let strokeColor = authStyle.stroke;

        let lineWeight = 6;
        if (seg.highwayCode === "NH-60") lineWeight = 8;
        if (seg.highwayCode === "SH-55") lineWeight = 7;
        if (seg.authority === "GramPanchayat") lineWeight = 5;

        // Base halo glow
        L.polyline(seg.coordinates, {
          color: "#ffffff",
          weight: lineWeight + 3.5,
          opacity: 0.85,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(layerGroup);

        const poly = L.polyline(seg.coordinates, {
          color: strokeColor,
          weight: lineWeight,
          opacity: 0.95,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(layerGroup);

        poly.bindPopup(`
          <div class="p-3.5 text-slate-900 font-sans max-w-xs">
            <div class="flex items-center justify-between gap-2 mb-1.5 border-b border-slate-200 pb-1">
              <span class="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">${seg.id}</span>
              <div class="flex items-center gap-1">
                ${
                  seg.highwayCode
                    ? `<span class="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-900 text-white">${seg.highwayCode}</span>`
                    : ""
                }
                <span class="text-[10px] font-bold px-2 py-0.5 rounded text-white" style="background-color: ${authStyle.stroke};">
                  ${seg.authority}
                </span>
              </div>
            </div>
            
            <h4 class="font-bold text-sm text-slate-900 leading-snug">${language === "mr" ? seg.nameMr : seg.name}</h4>

            <div class="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-700">
              <p><b>Responsible Authority:</b> <span class="font-bold" style="color: ${authStyle.dark}">${seg.authority}</span></p>
              <p><b>Stretch:</b> ${language === "mr" ? seg.fromNodeMr : seg.fromNode} ➔ ${language === "mr" ? seg.toNodeMr : seg.toNode}</p>
              <p><b>Length:</b> ${seg.lengthKm} km | <b>Lanes:</b> ${seg.lanes} Lanes</p>
              <p><b>Status:</b> ${seg.workStatus} (${seg.progressPercent}%)</p>
              <p><b>Condition:</b> <span class="font-semibold text-slate-900">${seg.currentCondition}</span></p>
            </div>

            <div class="mt-2 text-[11px] text-slate-600 space-y-0.5 border-t border-slate-100 pt-1.5">
              <p><b>Contractor:</b> ${seg.contractor}</p>
              <p class="text-blue-900 font-medium">📞 ${seg.officerContact}</p>
            </div>
          </div>
        `);
      }
    });

    // 3. Water Network
    if (mapLayers.waterNetwork) {
      const waterCoords: [number, number][] = [
        [18.8100, 73.8320],
        [18.7810, 73.8450],
        [18.7650, 73.8520],
        [18.7450, 73.8650],
      ];
      L.polyline(waterCoords, {
        color: "#0284c7",
        weight: 3.5,
        dashArray: "6, 6",
        opacity: 0.9,
      })
        .bindTooltip("💧 24 MLD Bhama Askhed Industrial Water Grid", { sticky: true })
        .addTo(layerGroup);
    }

    // 4. Stormwater Drainage Network
    if (mapLayers.drainageNetwork) {
      const drainCoords: [number, number][] = [
        [18.7550, 73.8550],
        [18.7485, 73.8490],
        [18.7350, 73.8400],
        [18.7200, 73.8350],
      ];
      L.polyline(drainCoords, {
        color: "#4f46e5",
        weight: 3.5,
        dashArray: "4, 6",
        opacity: 0.85,
      })
        .bindTooltip("🚰 Underground Stormwater Drainage System", { sticky: true })
        .addTo(layerGroup);
    }

    // 5. Civic Issue Pins (Pending vs Resolved Badges)
    if (mapLayers.citizenComplaints) {
      citizenReports.forEach((rep) => {
        const isResolved = rep.status === "Resolved";
        const authStyle = getAuthorityColor(rep.assignedAuthority);

        const iconHtml = `
          <div class="relative flex items-center justify-center w-7 h-7 cursor-pointer group">
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-md border-2 border-white transition-transform group-hover:scale-125" style="background-color: ${isResolved ? "#10b981" : "#ea580c"};">
              ${isResolved ? "✓" : "⚠️"}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-civic-dot",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        L.marker(rep.coordinates, { icon: customIcon })
          .bindPopup(`
            <div class="p-3 text-slate-900 font-sans max-w-xs">
              <div class="flex items-center justify-between text-[11px] mb-1">
                <span class="font-bold px-2 py-0.5 rounded text-white text-[10px]" style="background-color: ${authStyle.stroke};">${rep.assignedAuthority}</span>
                <span class="font-bold text-xs ${isResolved ? "text-emerald-700" : "text-amber-700"}">${rep.status}</span>
              </div>
              <h4 class="font-bold text-xs text-slate-900 mt-1 leading-snug">${language === "mr" ? rep.titleMr : rep.title}</h4>
              <p class="text-[11px] text-slate-600 mt-1">📍 ${language === "mr" ? rep.landmarkMr : rep.landmark}</p>
              ${rep.workDoneSummary ? `<div class="mt-2 p-1.5 rounded bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-900"><b>Work Done:</b> ${language === "mr" ? rep.workDoneSummaryMr : rep.workDoneSummary}</div>` : ""}
              <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 text-xs">
                <span class="text-emerald-700 font-bold">▲ ${rep.upvotes} Citizen Reports</span>
                <span class="text-slate-500 text-[10px]">${rep.reportedAt.split(" ")[0]}</span>
              </div>
            </div>
          `)
          .addTo(layerGroup);
      });
    }

    // 6. Active Projects
    if (mapLayers.ongoingProjects) {
      projects.forEach((proj) => {
        const authStyle = getAuthorityColor(proj.authority);

        const iconHtml = `
          <div class="flex flex-col items-center cursor-pointer group">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md border-2 border-white transition-transform group-hover:scale-110" style="background-color: ${authStyle.stroke};">
              🏗️
            </div>
            <span class="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-slate-900 text-white mt-0.5 shadow whitespace-nowrap">
              ${proj.progressPercent}%
            </span>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-proj-pin",
          iconSize: [32, 40],
          iconAnchor: [16, 36],
        });

        const marker = L.marker(proj.coordinates, { icon: customIcon }).addTo(layerGroup);

        marker.on("click", () => {
          setSelectedProject(proj);
          setIsProjectDrawerOpen(true);
        });

        marker.bindTooltip(
          `<b>[${proj.authority}] ${proj.id}</b>: ${language === "mr" ? proj.nameMr : proj.name} (${proj.progressPercent}%)`,
          { sticky: true }
        );
      });
    }
  };

  const handleLandmarkJump = (coords: [number, number]) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, 14, { duration: 1.2 });
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(chakanCenter, 12, { duration: 1.2 });
    }
    setSelectedJurisdiction(null);
  };

  // Filtered reports for the live demo ticker
  const filteredLiveReports = citizenReports.filter((r) => {
    if (tickerFilter === "RESOLVED") return r.status === "Resolved";
    if (tickerFilter === "PENDING") return r.status !== "Resolved";
    return true;
  });

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[640px] bg-slate-100 overflow-hidden flex flex-col font-sans">
      {/* Top Controls Toolbar */}
      <div className="absolute top-3 left-3 right-3 sm:left-6 sm:right-6 z-30 flex flex-col gap-2 pointer-events-none">
        {/* Row 1: Search Bar & Map Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Search Bar */}
          <div className="pointer-events-auto w-full sm:w-80 md:w-96 rounded-2xl px-3 py-2 flex items-center gap-2 shadow-lg border border-slate-300 bg-white/95 backdrop-blur-md">
            <Search className="w-4 h-4 text-slate-500 ml-1 flex-shrink-0" />
            <input
              type="text"
              placeholder={language === "mr" ? "रस्ते, चौक, विभाग शोधा (उदा. NH-60, SH-55, भोसरी)..." : "Search roads, junctions, authorities (e.g. NH-60, SH-55, Bhosari)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-500 focus:outline-none font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Action Controls */}
          <div className="pointer-events-auto flex items-center gap-1.5 ml-auto">
            {/* Toggle Live Demo Ticker */}
            <button
              onClick={() => setShowLiveTicker(!showLiveTicker)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ${
                showLiveTicker ? "bg-emerald-800 text-white border-emerald-800" : "bg-white/95 text-slate-700 border-slate-300"
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${showLiveTicker ? "text-emerald-300 animate-pulse" : "text-slate-500"}`} />
              <span>{language === "mr" ? "थेट तक्रार अपडेट्स" : "Live Issue Feed"}</span>
            </button>

            {/* Toggle Legend */}
            <button
              onClick={() => setShowLegend(!showLegend)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ${
                showLegend ? "bg-blue-900 text-white border-blue-900" : "bg-white/95 text-slate-700 border-slate-300"
              }`}
            >
              <span>{language === "mr" ? "रंग सूची" : "Color Legend"}</span>
            </button>

            {/* Toggle Layer Controls */}
            <button
              onClick={() => setShowLayerDrawer(!showLayerDrawer)}
              className={`p-2 rounded-xl border shadow-md transition-all flex items-center gap-1.5 ${
                showLayerDrawer ? "bg-blue-900 text-white border-blue-900" : "bg-white/95 text-slate-700 border-slate-300"
              }`}
              title="All Layers"
            >
              <Layers className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetView}
              className="p-2 rounded-xl bg-white/95 text-slate-700 hover:text-blue-900 hover:bg-slate-50 border border-slate-300 shadow-md transition-all"
              title={t.map.resetView}
            >
              <RotateCcw className="w-4 h-4 text-blue-700" />
            </button>

            <select
              value={mapTheme}
              onChange={(e) => setMapTheme(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none bg-white/95 shadow-md"
            >
              <option value="streets">Civic Street Map</option>
              <option value="satellite">Satellite Imagery</option>
              <option value="dark">Dark Theme</option>
            </select>
          </div>
        </div>

        {/* Row 2: SINGLE DEDICATED AUTHORITY CHECKBOX STRIP (NO DUPLICATES) */}
        <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto max-w-full px-3 py-1.5 rounded-2xl border border-slate-300 shadow-md bg-white/95 backdrop-blur-md scrollbar-none">
          <span className="text-[11px] font-extrabold text-slate-700 px-1 flex items-center gap-1 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            {language === "mr" ? "विभाग चेकबॉक्स:" : "Authority Checkboxes:"}
          </span>

          {authorityCheckboxes.map((item) => {
            const isChecked = Boolean(mapLayers[item.key]);

            return (
              <button
                key={item.key}
                onClick={() => toggleMapLayer(item.key)}
                className={`text-[11px] px-2.5 py-1 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-xs border ${
                  isChecked
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-100/90 text-slate-600 border-slate-200 hover:bg-slate-200"
                }`}
              >
                {/* Checkbox box indicator */}
                <span
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-bold border ${
                    isChecked
                      ? "bg-white text-slate-900 border-white"
                      : "bg-white text-transparent border-slate-300"
                  }`}
                >
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>

                {/* Authority color square */}
                <span
                  className={`w-2.5 h-2.5 rounded-sm ${item.bg} border border-black/20`}
                ></span>

                <span>{language === "mr" ? item.nameMr : item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Row 3: Region Fast-Jump Strip */}
        <div className="pointer-events-auto hidden md:flex items-center gap-1.5 overflow-x-auto max-w-full px-3 py-1 rounded-xl border border-slate-200 shadow-sm bg-white/85 backdrop-blur-md scrollbar-none">
          <span className="text-[10px] font-bold text-slate-500 px-1 flex items-center gap-1 whitespace-nowrap">
            <Compass className="w-3 h-3 text-blue-700" />
            {language === "mr" ? "हद्द जंप:" : "Jump:"}
          </span>
          {quickJumpLocations.map((lm, idx) => (
            <button
              key={idx}
              onClick={() => handleLandmarkJump(lm.coords)}
              className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-900 border border-slate-200 font-medium transition-all whitespace-nowrap flex items-center gap-1"
            >
              <span className={`text-[8px] font-extrabold px-1 py-0.1 rounded ${lm.badgeColor}`}>
                {lm.badge}
              </span>
              <span>{language === "mr" ? lm.nameMr : lm.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LIVE DEMO UPDATES TICKER / FEED (PENDING VS RESOLVED WITH AUTHORITY) */}
      {/* ========================================================================= */}
      {showLiveTicker && (
        <div className="absolute top-40 left-3 sm:left-6 z-20 w-80 sm:w-88 max-h-[calc(100vh-250px)] overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-md border border-slate-300 shadow-2xl p-3.5 space-y-2.5 pointer-events-auto animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                {language === "mr" ? "थेट तक्रार निवारण अपडेट्स" : "Live Issue Resolution Stream"}
              </span>
            </div>
            <button
              onClick={() => setShowLiveTicker(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Filter Pills (All / Pending / Resolved) */}
          <div className="flex items-center gap-1 text-[10px] font-bold">
            <button
              onClick={() => setTickerFilter("ALL")}
              className={`px-2 py-1 rounded-lg transition-all ${
                tickerFilter === "ALL" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({citizenReports.length})
            </button>
            <button
              onClick={() => setTickerFilter("RESOLVED")}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                tickerFilter === "RESOLVED" ? "bg-emerald-700 text-white shadow-xs" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Resolved ({citizenReports.filter((r) => r.status === "Resolved").length})</span>
            </button>
            <button
              onClick={() => setTickerFilter("PENDING")}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                tickerFilter === "PENDING" ? "bg-amber-700 text-white shadow-xs" : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Pending ({citizenReports.filter((r) => r.status !== "Resolved").length})</span>
            </button>
          </div>

          {/* Issue Stream Cards */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {filteredLiveReports.map((item) => {
              const isResolved = item.status === "Resolved";
              const authStyle = getAuthorityColor(item.assignedAuthority);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo(item.coordinates, 15, { duration: 1 });
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all hover:shadow-md ${
                    isResolved
                      ? "bg-emerald-50/70 border-emerald-200 hover:border-emerald-400"
                      : "bg-amber-50/70 border-amber-200 hover:border-amber-400"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className="text-[9px] font-extrabold px-1.5 py-0.2 rounded text-white shadow-xs"
                      style={{ backgroundColor: authStyle.stroke }}
                    >
                      {item.assignedAuthority}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                        isResolved ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                      }`}
                    >
                      {isResolved ? "RESOLVED ✓" : "IN PROGRESS"}
                    </span>
                  </div>

                  <h5 className="font-bold text-slate-900 text-[11px] leading-tight line-clamp-2">
                    {language === "mr" ? item.titleMr : item.title}
                  </h5>

                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                    📍 {language === "mr" ? item.landmarkMr : item.landmark}
                  </p>

                  {item.workDoneSummary && (
                    <p className="text-[10px] text-emerald-900 font-medium mt-1 bg-white/80 p-1 rounded border border-emerald-200 line-clamp-2">
                      <b>Work Done:</b> {language === "mr" ? item.workDoneSummaryMr : item.workDoneSummary}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-black/5 text-[9px] text-slate-500">
                    <span className="font-bold text-slate-700">▲ {item.upvotes} Citizens Impacted</span>
                    <span className="text-blue-700 font-semibold hover:underline flex items-center gap-0.5">
                      View on Map ➔
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Layer Controls (Top Right Drawer) */}
      {showLayerDrawer && (
        <div className="absolute top-36 right-3 sm:right-6 z-30 w-72 max-h-[calc(100vh-240px)] overflow-y-auto animate-fade-in pointer-events-auto">
          <MapLayerControls />
        </div>
      )}

      {/* Floating Color Legend (Bottom Left, Non-Duplicate) */}
      {showLegend && (
        <div className="absolute bottom-16 left-3 sm:left-6 z-20 w-64 sm:w-72 hidden sm:block animate-fade-in pointer-events-auto">
          <Legend />
        </div>
      )}

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Bottom Floating Action Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-2xl border border-slate-300">
          <button
            onClick={handleResetView}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 shadow-sm transition-all"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-700" />
            <span>Center Chakan Hub</span>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Report Issue</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 shadow-sm transition-all"
          >
            <Route className="w-3.5 h-3.5 text-emerald-700" />
            <span>Project Tracking</span>
          </button>

          <button
            onClick={() => setActiveTab("updates")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 shadow-sm transition-all"
          >
            <Radio className="w-3.5 h-3.5 text-indigo-700" />
            <span>Daily Updates & News</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-300" />
            <span>War Room Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};
