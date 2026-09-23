"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Project,
  RoadSegment,
  TrafficBottleneck,
  CitizenReport,
  PromiseItem,
  PublicDocument,
  TimeMachineSnapshot,
  MapLayerConfig,
  Role,
  Language,
  Authority,
  ProjectStatus,
  ReportStatus,
  IndustrialCompany,
  JurisdictionArea,
} from "@/types";
import { initialProjectsData } from "@/data/projectsData";
import { initialRoadsData } from "@/data/roadsData";
import { initialTrafficData } from "@/data/trafficData";
import { initialCitizenReportsData } from "@/data/citizenReportsData";
import { initialPromisesData } from "@/data/promisesData";
import { initialDocumentsData } from "@/data/documentsData";
import { initialTimeMachineData } from "@/data/timeMachineData";
import { initialCompaniesData } from "@/data/companiesData";
import { initialJurisdictionsData } from "@/data/jurisdictionsData";
import { translations } from "@/data/translations";

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: Role;
  setRole: (role: Role) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (p: Project | null) => void;
  updateProjectProgress: (
    projectId: string,
    newProgress: number,
    newStatus: ProjectStatus,
    author: string,
    authorRole: string,
    remarkEn: string,
    remarkMr: string
  ) => void;

  roadSegments: RoadSegment[];
  selectedRoadSegment: RoadSegment | null;
  setSelectedRoadSegment: (r: RoadSegment | null) => void;

  jurisdictions: JurisdictionArea[];
  selectedJurisdiction: JurisdictionArea | null;
  setSelectedJurisdiction: (j: JurisdictionArea | null) => void;

  companies: IndustrialCompany[];
  selectedCompany: IndustrialCompany | null;
  setSelectedCompany: (c: IndustrialCompany | null) => void;

  trafficPoints: TrafficBottleneck[];
  selectedTrafficPoint: TrafficBottleneck | null;
  setSelectedTrafficPoint: (tp: TrafficBottleneck | null) => void;

  citizenReports: CitizenReport[];
  addCitizenReport: (report: Omit<CitizenReport, "id" | "reportedAt" | "upvotes" | "userHasUpvoted">) => void;
  upvoteReport: (id: string) => void;
  updateReportStatus: (id: string, status: ReportStatus, officerRemarks: string, remarksMr?: string) => void;

  promises: PromiseItem[];
  documents: PublicDocument[];
  timeMachineSnapshots: TimeMachineSnapshot[];
  selectedTimePeriod: string;
  setSelectedTimePeriod: (periodId: string) => void;

  mapLayers: MapLayerConfig;
  toggleMapLayer: (layerKey: keyof MapLayerConfig) => void;
  setAllMapLayers: (state: boolean) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedAuthorityFilter: string;
  setSelectedAuthorityFilter: (auth: string) => void;

  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  isProjectDrawerOpen: boolean;
  setIsProjectDrawerOpen: (open: boolean) => void;
  isOfficerUpdateModalOpen: boolean;
  setIsOfficerUpdateModalOpen: (open: boolean) => void;

  focusOnMapLocation: [number, number] | null;
  setFocusOnMapLocation: (coords: [number, number] | null) => void;
}

const defaultMapLayers: MapLayerConfig = {
  pwdRoads: true,
  pmrdaRoads: true,
  midcRoads: true,
  nhaiRoads: true,
  gpRoads: true,
  jurisdictionAreas: true,
  companyCorridors: false,
  waterNetwork: true,
  drainageNetwork: true,
  trafficSignals: true,
  flyovers: true,
  ongoingProjects: true,
  citizenComplaints: true,
  industrialZones: true,
  futureProjects: false,
};


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<string>("master-gis");
  const [role, setRole] = useState<Role>("Citizen");
  const [language, setLanguage] = useState<Language>("mr"); // Default to Marathi for native context
  
  const [projects, setProjects] = useState<Project[]>(initialProjectsData);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const [roadSegments, setRoadSegments] = useState<RoadSegment[]>(initialRoadsData);
  const [selectedRoadSegment, setSelectedRoadSegment] = useState<RoadSegment | null>(null);

  const [jurisdictions, setJurisdictions] = useState<JurisdictionArea[]>(initialJurisdictionsData);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<JurisdictionArea | null>(null);

  const [companies, setCompanies] = useState<IndustrialCompany[]>(initialCompaniesData);
  const [selectedCompany, setSelectedCompany] = useState<IndustrialCompany | null>(null);
  
  const [trafficPoints, setTrafficPoints] = useState<TrafficBottleneck[]>(initialTrafficData);
  const [selectedTrafficPoint, setSelectedTrafficPoint] = useState<TrafficBottleneck | null>(null);
  
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>(initialCitizenReportsData);
  const [promises, setPromises] = useState<PromiseItem[]>(initialPromisesData);
  const [documents, setDocuments] = useState<PublicDocument[]>(initialDocumentsData);
  const [timeMachineSnapshots] = useState<TimeMachineSnapshot[]>(initialTimeMachineData);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("2026-CURRENT");
  
  const [mapLayers, setMapLayers] = useState<MapLayerConfig>(defaultMapLayers);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedAuthorityFilter, setSelectedAuthorityFilter] = useState<string>("ALL");
  
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [isProjectDrawerOpen, setIsProjectDrawerOpen] = useState<boolean>(false);
  const [isOfficerUpdateModalOpen, setIsOfficerUpdateModalOpen] = useState<boolean>(false);
  const [focusOnMapLocation, setFocusOnMapLocation] = useState<[number, number] | null>(null);

  // Load persisted state from localStorage if present
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("cdf_language");
      if (savedLang === "mr" || savedLang === "en") setLanguage(savedLang);

      const savedRole = localStorage.getItem("cdf_role");
      if (savedRole) setRole(savedRole as Role);

      const savedReports = localStorage.getItem("cdf_citizen_reports");
      if (savedReports) setCitizenReports(JSON.parse(savedReports));

      const savedProjects = localStorage.getItem("cdf_projects");
      if (savedProjects) setProjects(JSON.parse(savedProjects));
    } catch {
      // safe fallback
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem("cdf_language", lang);
    } catch {}
  };

  const changeRole = (newRole: Role) => {
    setRole(newRole);
    try {
      localStorage.setItem("cdf_role", newRole);
    } catch {}
  };

  const toggleMapLayer = (layerKey: keyof MapLayerConfig) => {
    setMapLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const setAllMapLayers = (state: boolean) => {
    setMapLayers({
      pwdRoads: state,
      pmrdaRoads: state,
      midcRoads: state,
      nhaiRoads: state,
      gpRoads: state,
      jurisdictionAreas: state,
      companyCorridors: false,
      waterNetwork: state,
      drainageNetwork: state,
      trafficSignals: state,
      flyovers: state,
      ongoingProjects: state,
      citizenComplaints: state,
      industrialZones: state,
      futureProjects: state,
    });
  };

  const updateProjectProgress = (
    projectId: string,
    newProgress: number,
    newStatus: ProjectStatus,
    author: string,
    authorRole: string,
    remarkEn: string,
    remarkMr: string
  ) => {
    setProjects((prev) => {
      const updated = prev.map((proj) => {
        if (proj.id === projectId) {
          const newUpdates = [
            {
              date: new Date().toISOString().split("T")[0],
              author,
              authorRole,
              text: remarkEn || "Progress updated by nodal officer.",
              textMr: remarkMr || "नोडल अधिकाऱ्यांमार्फत प्रगती अपडेट करण्यात आली.",
            },
            ...proj.updates,
          ];
          return {
            ...proj,
            progressPercent: newProgress,
            status: newStatus,
            updates: newUpdates,
          };
        }
        return proj;
      });
      try {
        localStorage.setItem("cdf_projects", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject((prev) =>
        prev
          ? {
              ...prev,
              progressPercent: newProgress,
              status: newStatus,
            }
          : null
      );
    }
  };

  const addCitizenReport = (newReportData: Omit<CitizenReport, "id" | "reportedAt" | "upvotes" | "userHasUpvoted">) => {
    const report: CitizenReport = {
      ...newReportData,
      id: `REP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      reportedAt: new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
      upvotes: 1,
      userHasUpvoted: true,
      status: "Reported",
    };

    setCitizenReports((prev) => {
      const updated = [report, ...prev];
      try {
        localStorage.setItem("cdf_citizen_reports", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const upvoteReport = (id: string) => {
    setCitizenReports((prev) => {
      const updated = prev.map((rep) => {
        if (rep.id === id) {
          const isUpvoted = rep.userHasUpvoted;
          return {
            ...rep,
            upvotes: isUpvoted ? Math.max(1, rep.upvotes - 1) : rep.upvotes + 1,
            userHasUpvoted: !isUpvoted,
          };
        }
        return rep;
      });
      try {
        localStorage.setItem("cdf_citizen_reports", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateReportStatus = (id: string, status: ReportStatus, officerRemarks: string, remarksMr?: string) => {
    setCitizenReports((prev) => {
      const updated = prev.map((rep) => {
        if (rep.id === id) {
          return {
            ...rep,
            status,
            officialRemarks: officerRemarks,
            officialRemarksMr: remarksMr || officerRemarks,
            resolvedAt: status === "Resolved" ? new Date().toLocaleString() : rep.resolvedAt,
          };
        }
        return rep;
      });
      try {
        localStorage.setItem("cdf_citizen_reports", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const currentTranslations = translations[language] || translations.mr;

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        role,
        setRole: changeRole,
        language,
        setLanguage: changeLanguage,
        t: currentTranslations,
        projects,
        selectedProject,
        setSelectedProject,
        updateProjectProgress,
        roadSegments,
        selectedRoadSegment,
        setSelectedRoadSegment,
        jurisdictions,
        selectedJurisdiction,
        setSelectedJurisdiction,
        companies,
        selectedCompany,
        setSelectedCompany,
        trafficPoints,
        selectedTrafficPoint,
        setSelectedTrafficPoint,
        citizenReports,
        addCitizenReport,
        upvoteReport,
        updateReportStatus,
        promises,
        documents,
        timeMachineSnapshots,
        selectedTimePeriod,
        setSelectedTimePeriod,
        mapLayers,
        toggleMapLayer,
        setAllMapLayers,
        searchQuery,
        setSearchQuery,
        selectedAuthorityFilter,
        setSelectedAuthorityFilter,
        isReportModalOpen,
        setIsReportModalOpen,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        isProjectDrawerOpen,
        setIsProjectDrawerOpen,
        isOfficerUpdateModalOpen,
        setIsOfficerUpdateModalOpen,
        focusOnMapLocation,
        setFocusOnMapLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
