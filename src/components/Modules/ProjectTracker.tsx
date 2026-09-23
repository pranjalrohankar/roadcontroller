"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Project, Authority, ProjectStatus } from "@/types";
import {
  Search,
  Building2,
  MapPin,
  ArrowUpRight,
  AlertOctagon,
  Clock,
  CheckCircle2,
  Award,
  Calendar,
  AlertTriangle,
  TrendingUp,
  FileCheck2,
  HardHat,
  Banknote,
  Wrench,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const ProjectTracker: React.FC = () => {
  const {
    projects,
    setSelectedProject,
    setIsProjectDrawerOpen,
    t,
    language,
    setFocusOnMapLocation,
    setActiveTab,
  } = useApp();

  const [search, setSearch] = useState("");
  const [selectedAuthority, setSelectedAuthority] = useState<string>("ALL");
  const [activeCategoryTab, setActiveCategoryTab] = useState<"ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Category filters
  const pendingProjects = projects.filter(
    (p) => p.status === "Delayed" || p.status === "Proposed" || p.status === "On Hold" || p.status === "Tender Released"
  );
  const inProgressProjects = projects.filter(
    (p) => p.status === "In Progress" || p.status === "25% Completed" || p.status === "50% Completed" || p.status === "75% Completed" || p.status === "Work Started"
  );
  const completedProjects = projects.filter((p) => p.status === "Completed");

  const getFilteredList = () => {
    let baseList = projects;
    if (activeCategoryTab === "PENDING") baseList = pendingProjects;
    else if (activeCategoryTab === "IN_PROGRESS") baseList = inProgressProjects;
    else if (activeCategoryTab === "COMPLETED") baseList = completedProjects;

    return baseList.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.nameMr.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.contractor.toLowerCase().includes(search.toLowerCase()) ||
        p.locationName.toLowerCase().includes(search.toLowerCase()) ||
        (p.responsibleAgency && p.responsibleAgency.toLowerCase().includes(search.toLowerCase())) ||
        (p.pendingReason && p.pendingReason.toLowerCase().includes(search.toLowerCase()));

      const matchesAuth = selectedAuthority === "ALL" || p.authority === selectedAuthority;

      return matchesSearch && matchesAuth;
    });
  };

  const filteredProjects = getFilteredList();

  const getAuthorityBadge = (auth: Authority) => {
    switch (auth) {
      case "PWD":
        return "bg-emerald-50 text-emerald-800 border-emerald-300";
      case "PMRDA":
        return "bg-blue-50 text-blue-800 border-blue-300";
      case "MIDC":
        return "bg-orange-50 text-orange-800 border-orange-300";
      case "NHAI":
        return "bg-red-50 text-red-800 border-red-300";
      case "GramPanchayat":
        return "bg-purple-50 text-purple-800 border-purple-300";
    }
  };

  const getStatusBadge = (st: ProjectStatus) => {
    switch (st) {
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Delayed":
      case "On Hold":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "In Progress":
      case "50% Completed":
      case "75% Completed":
      case "25% Completed":
      case "Work Started":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#0f2b48]" />
            <span>
              {language === "mr"
                ? "चाकण पायाभूत विकासकामे: प्रगती व गुणवत्ता ट्रॅकर"
                : "Chakan Infrastructure Progress & Quality Tracker"}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {language === "mr"
              ? "प्रलंबित कारणे, सुरू कामांमधील अडचणी, अंदाजित कालावधी आणि पूर्ण कामांचे गुणवत्ता ऑडिट व निधी खर्च"
              : "Official public ledger tracking pending bottlenecks, active startup obstacles, estimated ETAs, and verified quality audits"}
          </p>
        </div>

        {/* Global Summary Metric Cards */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Approved</span>
            <span className="font-bold text-slate-900">₹695.5 Cr</span>
          </div>
          <div className="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-rose-700 block text-[10px] uppercase font-bold">Pending / Delayed</span>
            <span className="font-bold text-rose-800">{pendingProjects.length} Projects</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-amber-700 block text-[10px] uppercase font-bold">In Progress</span>
            <span className="font-bold text-amber-800">{inProgressProjects.length} Active</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-emerald-700 block text-[10px] uppercase font-bold">Completed & Audited</span>
            <span className="font-bold text-emerald-800">{completedProjects.length} Verified</span>
          </div>
        </div>
      </div>

      {/* Main Status Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveCategoryTab("ALL")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategoryTab === "ALL"
                ? "bg-[#0f2b48] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white"
            }`}
          >
            <span>{language === "mr" ? "सर्व प्रकल्प" : "All Projects"}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-700/50 text-slate-200 font-mono">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveCategoryTab("PENDING")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategoryTab === "PENDING"
                ? "bg-rose-700 text-white shadow-xs"
                : "text-rose-700 hover:bg-rose-50"
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{language === "mr" ? "प्रलंबित / अडकलेले" : "Pending & Bottlenecks"}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-900/40 text-rose-100 font-mono">
              {pendingProjects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveCategoryTab("IN_PROGRESS")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategoryTab === "IN_PROGRESS"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-amber-800 hover:bg-amber-50"
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>{language === "mr" ? "सुरू कामे (In Progress)" : "In Progress & Active Works"}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-900/40 text-amber-100 font-mono">
              {inProgressProjects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveCategoryTab("COMPLETED")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategoryTab === "COMPLETED"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-emerald-800 hover:bg-emerald-50"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{language === "mr" ? "पूर्ण व प्रमाणित (Completed)" : "Completed & Quality Certified"}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-900/40 text-emerald-100 font-mono">
              {completedProjects.length}
            </span>
          </button>
        </div>

        {/* Search, Authority & View Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-300 text-xs w-full sm:w-56 shadow-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={language === "mr" ? "प्रकल्प, एजन्सी, कारण शोधा..." : "Search project, agency, reason..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-slate-900 focus:outline-none w-full placeholder-slate-400 font-medium text-xs"
            />
          </div>

          <select
            value={selectedAuthority}
            onChange={(e) => setSelectedAuthority(e.target.value)}
            className="bg-white px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none font-medium shadow-xs"
          >
            <option value="ALL">{t.authorities.allAuthorities}</option>
            <option value="PWD">PWD (सार्वजनिक बांधकाम)</option>
            <option value="PMRDA">PMRDA (पीएमआरडीए)</option>
            <option value="MIDC">MIDC (एमआयडीसी)</option>
            <option value="NHAI">NHAI (राष्ट्रीय महामार्ग)</option>
            <option value="GramPanchayat">Gram Panchayat (ग्रामपंचायत)</option>
          </select>

          <div className="flex bg-slate-200 border border-slate-300 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === "table" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((p) => {
            const isPending = p.status === "Delayed" || p.status === "Proposed" || p.status === "On Hold" || p.status === "Tender Released";
            const isCompleted = p.status === "Completed";
            const isInProgress = !isPending && !isCompleted;

            return (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedProject(p);
                  setIsProjectDrawerOpen(true);
                }}
                className={`gov-card rounded-2xl p-5 hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between group shadow-sm relative ${
                  isPending ? "border-rose-200 bg-rose-50/20" : isCompleted ? "border-emerald-200 bg-emerald-50/20" : "border-slate-200"
                }`}
              >
                <div className="space-y-3.5">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                      {p.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getAuthorityBadge(p.authority)}`}>
                        {p.authority}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </div>
                  </div>

                  {/* Title & Location */}
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
                      {language === "mr" ? p.nameMr : p.name}
                    </h3>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                      <span className="truncate">{language === "mr" ? p.locationNameMr : p.locationName}</span>
                    </p>
                  </div>

                  {/* SPECIFIC VIEW 1: PENDING PROJECTS (Reason for Pending, Responsible Agency, Approved Budget) */}
                  {isPending && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 space-y-2 text-xs">
                      <div className="flex items-start gap-1.5 text-rose-900 font-semibold">
                        <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-rose-700 block">
                            {language === "mr" ? "प्रलंबित असण्याचे मुख्य कारण:" : "Reason for Pending / Delay:"}
                          </span>
                          <span className="text-slate-900 font-medium">
                            {language === "mr" ? p.pendingReasonMr || p.pendingReason : p.pendingReason || "Awaiting inter-departmental clearances."}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-rose-200/60 text-[11px]">
                        <div>
                          <span className="text-rose-700 font-bold block">
                            {language === "mr" ? "जबाबदार प्राधिकरण / एजन्सी:" : "Responsible Agency:"}
                          </span>
                          <span className="font-semibold text-slate-800">
                            {p.responsibleAgency || p.authority}
                          </span>
                        </div>
                        <div>
                          <span className="text-rose-700 font-bold block">
                            {language === "mr" ? "मंजूर निधी (Approved Budget):" : "Approved Budget:"}
                          </span>
                          <span className="font-bold text-slate-900 text-xs">
                            ₹{p.approvedBudgetCr || p.budgetCr} Cr
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SPECIFIC VIEW 2: IN PROGRESS (Progress Status, Startup Problems/Obstacles, Estimated Time) */}
                  {isInProgress && (
                    <div className="space-y-2.5">
                      {/* Progress Bar & Current Stage */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-600 flex items-center gap-1 font-bold">
                            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                            {p.currentWorkStage ? (language === "mr" ? p.currentWorkStageMr || p.currentWorkStage : p.currentWorkStage) : t.project.progress}
                          </span>
                          <span className="text-emerald-700 font-bold">{p.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${p.progressPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Startup Obstacles / Problems faced during process */}
                      {p.processStartObstacles && (
                        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 text-[11px] space-y-1">
                          <span className="font-bold text-amber-900 flex items-center gap-1">
                            <Wrench className="w-3 h-3 text-amber-700" />
                            {language === "mr" ? "सुरुवातीस आलेल्या अडचणी / अडथळे:" : "Startup Obstacles & Site Challenges:"}
                          </span>
                          <p className="text-slate-700 font-medium">
                            {language === "mr" ? p.processStartObstaclesMr || p.processStartObstacles : p.processStartObstacles}
                          </p>
                        </div>
                      )}

                      {/* Estimated Time to Work / Remaining */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                        <div>
                          <span className="text-slate-500 text-[10px] block font-bold">
                            {language === "mr" ? "अंदाजित काम कालावधी:" : "Estimated Work ETA:"}
                          </span>
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-700" />
                            {p.estimatedRemainingDays ? `${p.estimatedRemainingDays} Days Left` : p.expectedCompletionDate}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block font-bold">
                            {language === "mr" ? "नियोजित पूर्ण तारीख:" : "Target Completion:"}
                          </span>
                          <span className="font-semibold text-slate-700">{p.expectedCompletionDate}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SPECIFIC VIEW 3: COMPLETED (Quality Checks Done, Budget Used vs Approved, Period of Work) */}
                  {isCompleted && (
                    <div className="space-y-2.5">
                      {/* Quality Checks & Audits Done */}
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900 flex items-center gap-1">
                            <Award className="w-4 h-4 text-emerald-700" />
                            {language === "mr" ? "गुणवत्ता तपासणी अहवाल:" : "Quality Checks Done:"}
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[10px] font-bold">
                            PASSED 100%
                          </span>
                        </div>
                        {p.qualityChecksDone && p.qualityChecksDone.length > 0 ? (
                          <div className="space-y-1.5 pt-0.5">
                            {p.qualityChecksDone.map((qc, qIdx) => (
                              <div key={qIdx} className="text-[11px] text-emerald-950">
                                <span className="font-bold">{language === "mr" ? qc.testNameMr || qc.testName : qc.testName}: </span>
                                <span>{language === "mr" ? qc.resultMr || qc.result : qc.result}</span>
                                <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                                  Auditor: {qc.agency} • Status: {qc.status}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-emerald-950 font-medium text-[11px] leading-snug">
                            Third-party civil core stability and compressive load tests passed.
                          </p>
                        )}
                      </div>

                      {/* Budget Used vs Approved & Period of Work */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                        <div>
                          <span className="text-slate-500 text-[10px] block font-bold">
                            {language === "mr" ? "वापरलेला निधी / मंजूर:" : "Budget Used / Approved:"}
                          </span>
                          <span className="font-bold text-emerald-800">
                            ₹{p.budgetUsedCr || p.budgetCr} Cr / ₹{p.budgetCr} Cr
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block font-bold">
                            {language === "mr" ? "कामाचा प्रत्यक्ष कालावधी:" : "Period of Work:"}
                          </span>
                          <span className="font-semibold text-slate-800 flex items-center gap-1 text-[11px]">
                            <Calendar className="w-3 h-3 text-slate-600" />
                            {p.workPeriodFormatted || "Nov 2024 – Jan 2026"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#0f2b48] font-semibold">
                  <span className="flex items-center gap-1 group-hover:underline font-bold">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>{language === "mr" ? "तपशील अहवाल पहा" : "View Full Dossier"}</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFocusOnMapLocation(p.coordinates);
                      setActiveTab("master-gis");
                    }}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <MapPin className="w-3 h-3 text-blue-700" />
                    <span>{t.actions.viewOnMap}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
                <tr>
                  <th className="px-4 py-3.5">ID</th>
                  <th className="px-4 py-3.5">Project Name</th>
                  <th className="px-4 py-3.5">Authority / Agency</th>
                  <th className="px-4 py-3.5">Status & Category</th>
                  <th className="px-4 py-3.5">Key Status Details (Reason / Obstacle / Quality)</th>
                  <th className="px-4 py-3.5">Approved Budget / Used</th>
                  <th className="px-4 py-3.5">ETA / Work Period</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProjects.map((p) => {
                  const isPending = p.status === "Delayed" || p.status === "Proposed" || p.status === "On Hold" || p.status === "Tender Released";
                  const isCompleted = p.status === "Completed";

                  return (
                    <tr
                      key={p.id}
                      onClick={() => {
                        setSelectedProject(p);
                        setIsProjectDrawerOpen(true);
                      }}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{p.id}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-900 max-w-xs">
                        {language === "mr" ? p.nameMr : p.name}
                        <div className="text-[11px] text-slate-500 font-normal truncate">{p.locationName}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${getAuthorityBadge(p.authority)}`}>
                          {p.responsibleAgency || p.authority}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${getStatusBadge(p.status)}`}>
                          {p.status}
                        </span>
                        <div className="text-[11px] font-bold text-emerald-700 mt-1">{p.progressPercent}%</div>
                      </td>
                      <td className="px-4 py-3.5 max-w-sm">
                        {isPending ? (
                          <div className="text-rose-800 text-[11px]">
                            <span className="font-bold">Pending Reason: </span>
                            <span>{p.pendingReason || "Inter-departmental clearance"}</span>
                          </div>
                        ) : isCompleted ? (
                          <div className="text-emerald-800 text-[11px]">
                            <span className="font-bold">Quality Check: </span>
                            <span>{p.qualityChecksDone && p.qualityChecksDone.length > 0 ? `${p.qualityChecksDone[0].agency} (${p.qualityChecksDone[0].status})` : "COEP Lab Verified"}</span>
                          </div>
                        ) : (
                          <div className="text-amber-800 text-[11px]">
                            <span className="font-bold">Stage: </span>
                            <span>{p.currentWorkStage || "Paving in progress"}</span>
                            {p.processStartObstacles && (
                              <div className="text-slate-600 text-[10px]">Obstacle: {p.processStartObstacles}</div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        {isCompleted ? (
                          <span>₹{p.budgetUsedCr || p.budgetCr} / ₹{p.budgetCr} Cr</span>
                        ) : (
                          <span>₹{p.approvedBudgetCr || p.budgetCr} Cr</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 text-[11px]">
                        {isCompleted ? p.workPeriodFormatted || p.expectedCompletionDate : (
                          p.estimatedRemainingDays ? `${p.estimatedRemainingDays} Days Left` : p.expectedCompletionDate
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button className="px-3 py-1 rounded bg-[#0f2b48] text-white font-semibold text-[11px] hover:bg-[#1a3d60] transition-colors">
                          View Dossier
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
