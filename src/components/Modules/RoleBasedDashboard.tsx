"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Project, ProjectStatus, ReportStatus, Authority, Role } from "@/types";
import {
  UserCog,
  CheckCircle2,
  Edit3,
  ShieldCheck,
  Save,
  AlertTriangle,
  Building2,
  Factory,
  HardHat,
  Truck,
  TrendingUp,
  MapPin,
  Clock,
  Award,
  Send,
  PlusCircle,
  FileText,
  AlertOctagon,
  Sparkles,
  Layers,
  Flame,
  Check,
  Crown,
} from "lucide-react";
import confetti from "canvas-confetti";

export const RoleBasedDashboard: React.FC = () => {
  const {
    role,
    setRole,
    projects,
    citizenReports,
    updateProjectProgress,
    updateReportStatus,
    addCitizenReport,
    t,
    language,
    setFocusOnMapLocation,
    setActiveTab,
    setIsReportModalOpen,
  } = useApp();

  // Active editing project state
  const [activeEditingProj, setActiveEditingProj] = useState<Project | null>(null);
  const [newProgress, setNewProgress] = useState<number>(0);
  const [newStatus, setNewStatus] = useState<ProjectStatus>("In Progress");
  const [newStage, setNewStage] = useState<string>("");
  const [newObstacle, setNewObstacle] = useState<string>("");
  const [officerRemarksEn, setOfficerRemarksEn] = useState("");
  const [officerRemarksMr, setOfficerRemarksMr] = useState("");
  const [updateSavedToast, setUpdateSavedToast] = useState(false);

  // Active resolving grievance state
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [reportReplyStatus, setReportReplyStatus] = useState<ReportStatus>("Resolved");
  const [workDoneText, setWorkDoneText] = useState("");
  const [auditAgency, setAuditAgency] = useState("COEP Technological University");
  const [officerReplyRemark, setOfficerReplyRemark] = useState("");
  const [grievanceSavedToast, setGrievanceSavedToast] = useState(false);

  // Industry alert state
  const [industryAlertText, setIndustryAlertText] = useState("");
  const [industryPlantLocation, setIndustryPlantLocation] = useState("MIDC Phase 2 Spine Road");
  const [industryAlertSubmitted, setIndustryAlertSubmitted] = useState(false);

  // Collector Directive State
  const [collectorDirectiveTitle, setCollectorDirectiveTitle] = useState("");
  const [collectorDirectiveDept, setCollectorDirectiveDept] = useState<Authority>("PMRDA");
  const [collectorDirectiveText, setCollectorDirectiveText] = useState("");
  const [collectorDirectivePublished, setCollectorDirectivePublished] = useState(false);

  const availableRoles: { id: Role; label: string; icon: string; title: string; officerName: string }[] = [
    { id: "Citizen", label: "Citizen (नागरिक)", icon: "👤", title: "Public Citizen & Ward Representative", officerName: "Chakan Citizen Public Audit Desk" },
    { id: "Industry", label: "MIDC Industry Rep (उद्योग प्रतिनिधी)", icon: "🏭", title: "Infrastructure Head, Chakan MIDC Association", officerName: "Shri Nitin Deshmukh (FMPCCI)" },
    { id: "Officer_PWD", label: "PWD Executive Engineer (सार्वजनिक बांधकाम)", icon: "🏗️", title: "Executive Engineer, PWD North Pune", officerName: "Er. Ramesh Deshmukh" },
    { id: "Officer_MIDC", label: "MIDC Regional Officer (एमआयडीसी)", icon: "⚙️", title: "Regional Officer & Executive Engineer, MIDC", officerName: "Er. Prakash Jadhav" },
    { id: "Officer_NHAI", label: "NHAI Project Director (राष्ट्रीय महामार्ग)", icon: "🛣️", title: "Project Director, NHAI PIU Pune", officerName: "Er. Amit Gokhale" },
    { id: "Officer_PMRDA", label: "PMRDA Infrastructure Officer (पीएमआरडीए)", icon: "🏙️", title: "Chief Engineer, PMRDA Infra Cell", officerName: "Er. Vilas Patil" },
    { id: "Officer_GP", label: "Gram Panchayat Officer (ग्रामपंचायत)", icon: "🏛️", title: "Block Development Officer (BDO Khed)", officerName: "Smt. Vandana Shinde" },
    { id: "Collector_Admin", label: "District Collector / Admin (जिल्हाधिकारी प्रशासन)", icon: "👑", title: "District Collector & Magistrate, Pune", officerName: "Dr. Suhas Diwase, IAS" },
  ];

  const currentRoleMeta = availableRoles.find((r) => r.id === role) || availableRoles[0];

  const currentAuthority: Authority =
    role === "Officer_PWD"
      ? "PWD"
      : role === "Officer_MIDC"
      ? "MIDC"
      : role === "Officer_NHAI"
      ? "NHAI"
      : role === "Officer_PMRDA"
      ? "PMRDA"
      : role === "Officer_GP"
      ? "GramPanchayat"
      : "PWD";

  const isMasterAdmin = role === "Collector_Admin";
  const isIndustry = role === "Industry";
  const isCitizen = role === "Citizen";

  // Filter individual reports and projects
  const assignedProjects = projects.filter((p) => {
    if (isMasterAdmin || isIndustry || isCitizen) return true;
    return p.authority === currentAuthority;
  });

  const assignedGrievances = citizenReports.filter((r) => {
    if (isMasterAdmin || isCitizen) return true;
    if (isIndustry) return r.category === "Traffic" || r.category === "Potholes" || r.category === "Waterlogging";
    return r.assignedAuthority === currentAuthority;
  });

  const totalSanctionedBudget = assignedProjects.reduce((acc, p) => acc + (p.approvedBudgetCr || p.budgetCr), 0);
  const totalSpentBudget = assignedProjects.reduce((acc, p) => acc + (p.budgetUsedCr || p.spentCr), 0);
  const resolvedCount = assignedGrievances.filter((g) => g.status === "Resolved").length;

  const handleStartEdit = (p: Project) => {
    setActiveEditingProj(p);
    setNewProgress(p.progressPercent);
    setNewStatus(p.status);
    setNewStage(p.currentWorkStage || "Slip-form PQC Paving");
    setNewObstacle(p.processStartObstacles || "");
    setOfficerRemarksEn("");
    setOfficerRemarksMr("");
  };

  const handleSaveProjectUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEditingProj) return;

    updateProjectProgress(
      activeEditingProj.id,
      newProgress,
      newStatus,
      currentRoleMeta.officerName,
      currentRoleMeta.title,
      officerRemarksEn || `Milestone progress updated to ${newProgress}%. Stage: ${newStage}`,
      officerRemarksMr || `कामाची प्रगती ${newProgress}% अद्ययावत केली. टप्पा: ${newStage}`
    );

    try {
      confetti({ particleCount: 60, spread: 60 });
    } catch {}

    setUpdateSavedToast(true);
    setTimeout(() => {
      setUpdateSavedToast(false);
      setActiveEditingProj(null);
    }, 2000);
  };

  const handleSaveReportResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReportId || !officerReplyRemark) return;

    updateReportStatus(
      selectedReportId,
      reportReplyStatus,
      `${officerReplyRemark} | Work Done: ${workDoneText || "Civil repair completed"} | Quality Audit: ${auditAgency} Passed`,
      `${officerReplyRemark} | प्रत्यक्ष काम: ${workDoneText || "दुरुस्ती पूर्ण"} | गुणवत्ता तपासणी: ${auditAgency} उत्तीर्ण`
    );

    try {
      confetti({ particleCount: 40, spread: 50 });
    } catch {}

    setGrievanceSavedToast(true);
    setTimeout(() => {
      setGrievanceSavedToast(false);
      setSelectedReportId(null);
      setOfficerReplyRemark("");
      setWorkDoneText("");
    }, 1800);
  };

  const handleIndustryAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!industryAlertText) return;

    addCitizenReport({
      title: `Industrial Freight Delay Alert: ${industryPlantLocation}`,
      titleMr: `औद्योगिक वाहतूक विलंब सूचना: ${industryPlantLocation}`,
      category: "Traffic",
      categoryMr: "वाहतूक",
      description: `[MIDC INDUSTRY ESCALATION] ${industryAlertText}`,
      descriptionMr: `[एमआयडीसी उद्योग तक्रार] ${industryAlertText}`,
      landmark: industryPlantLocation,
      landmarkMr: industryPlantLocation,
      coordinates: [18.7615, 73.8245],
      reportedBy: "MIDC Industrial Association Desk",
      assignedAuthority: "MIDC",
      status: "Reported",
    });

    setIndustryAlertSubmitted(true);
    setTimeout(() => {
      setIndustryAlertSubmitted(false);
      setIndustryAlertText("");
    }, 2500);
  };

  const handleCollectorDirectiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectorDirectiveTitle || !collectorDirectiveText) return;

    setCollectorDirectivePublished(true);
    try {
      confetti({ particleCount: 80, spread: 70 });
    } catch {}
    setTimeout(() => {
      setCollectorDirectivePublished(false);
      setCollectorDirectiveTitle("");
      setCollectorDirectiveText("");
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Role Executive Banner */}
      <div className="gov-card rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-blue-50/30">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl sm:text-2xl">{currentRoleMeta.icon}</span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {currentRoleMeta.officerName}
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
              {currentRoleMeta.label}
            </span>
            {isMasterAdmin && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-700" /> APEX JURISDICTION
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {currentRoleMeta.title} • Chakan Industrial & Infrastructure Governance Zone
          </p>
        </div>

        {/* Quick Role Stats */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Assigned Projects</span>
            <span className="font-extrabold text-slate-900 text-sm">{assignedProjects.length} Works</span>
          </div>
          <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Budget</span>
            <span className="font-extrabold text-emerald-800 text-sm">₹{totalSanctionedBudget.toFixed(1)} Cr</span>
          </div>
          <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Grievance SLA</span>
            <span className="font-extrabold text-blue-800 text-sm">
              {resolvedCount}/{assignedGrievances.length} Resolved
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: ROLE-SPECIFIC PROCESS & ACTIONS CENTER (कामाची प्रत्यक्ष प्रक्रिया व कृती) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <HardHat className="w-5 h-5 text-blue-800" />
            <span>
              {language === "mr"
                ? "प्रत्यक्ष कृती व प्रक्रिया केंद्र (Live Execution Desk)"
                : "Active Process & Execution Center"}
            </span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Authorized Role Workflow</span>
        </div>

        {/* PROCESS A: FOR GOVERNMENT OFFICERS (PWD, MIDC, NHAI, PMRDA, GP, Collector) */}
        {!isIndustry && !isCitizen && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Action 1: Project Progress & Milestone Updater */}
            <div className="gov-card rounded-2xl p-5 border border-slate-200 space-y-4 shadow-sm bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-blue-700" />
                  <span>Update Ground Project Milestone & Progress %</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Site Engineer Action
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <label className="font-bold text-slate-700 block">Select Project to Update:</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {assignedProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleStartEdit(p)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        activeEditingProj?.id === p.id
                          ? "bg-blue-50 border-blue-400 font-bold"
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                      }`}
                    >
                      <div>
                        <span className="font-mono text-[10px] text-slate-500 font-bold">{p.id}</span>
                        <p className="text-xs font-bold text-slate-900">{language === "mr" ? p.nameMr : p.name}</p>
                        <span className="text-[10px] text-slate-500">Stage: {p.currentWorkStage || "Active"}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-emerald-700">{p.progressPercent}%</span>
                        <span className="block text-[10px] text-slate-500">₹{p.approvedBudgetCr || p.budgetCr} Cr</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Editing Form */}
              {activeEditingProj && (
                <form onSubmit={handleSaveProjectUpdate} className="bg-slate-50 p-4 rounded-xl border border-blue-200 space-y-3 text-xs">
                  {updateSavedToast ? (
                    <div className="p-4 text-center text-emerald-700 space-y-1">
                      <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                      <p className="font-bold">Progress Published & Geotagged on GIS Map!</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex justify-between font-bold text-slate-700 mb-1">
                          <span>Physical Progress:</span>
                          <span className="text-blue-800 text-sm font-extrabold">{newProgress}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={newProgress}
                          onChange={(e) => setNewProgress(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-slate-700 block mb-0.5">Status:</label>
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as ProjectStatus)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold"
                          >
                            <option value="In Progress">In Progress</option>
                            <option value="25% Completed">25% Completed</option>
                            <option value="50% Completed">50% Completed</option>
                            <option value="75% Completed">75% Completed</option>
                            <option value="Completed">Completed</option>
                            <option value="Delayed">Delayed / Pending</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-0.5">Execution Stage:</label>
                          <input
                            type="text"
                            value={newStage}
                            onChange={(e) => setNewStage(e.target.value)}
                            placeholder="e.g. Sub-grade compaction, PQC Paving"
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Startup Obstacles / Site Roadblocks (if any):</label>
                        <input
                          type="text"
                          value={newObstacle}
                          onChange={(e) => setNewObstacle(e.target.value)}
                          placeholder="e.g. 33kV utility shifting, heavy rain"
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Official Engineering Inspection Remark:</label>
                        <input
                          type="text"
                          value={officerRemarksEn}
                          onChange={(e) => setOfficerRemarksEn(e.target.value)}
                          placeholder="Enter site verification notes..."
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-medium"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-[#0f2b48] hover:bg-[#1a3d60] text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Publish Official Milestone Update</span>
                      </button>
                    </>
                  )}
                </form>
              )}
            </div>

            {/* Action 2: Citizen Grievance Redressal & Quality Audit Sign-Off */}
            <div className="gov-card rounded-2xl p-5 border border-slate-200 space-y-4 shadow-sm bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Resolve Assigned Grievance & Sign-off Quality</span>
                </span>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Nodal Authority SLA
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <label className="font-bold text-slate-700 block">Open Grievances for {currentAuthority}:</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {assignedGrievances.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setSelectedReportId(r.id);
                        setReportReplyStatus("Resolved");
                        setWorkDoneText(r.workDoneSummary || "Civil surface restoration & compaction completed.");
                        setOfficerReplyRemark("Action taken on-site by field team.");
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedReportId === r.id
                          ? "bg-emerald-50 border-emerald-400 font-bold"
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                      }`}
                    >
                      <div>
                        <span className="font-mono text-[10px] text-slate-500 font-bold">{r.id}</span>
                        <p className="text-xs font-bold text-slate-900">{r.title}</p>
                        <span className="text-[10px] text-slate-500">{r.landmark}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        r.status === "Resolved" ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-amber-100 text-amber-800 border-amber-300"
                      }`}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grievance Resolution Form */}
              {selectedReportId && (
                <form onSubmit={handleSaveReportResolution} className="bg-slate-50 p-4 rounded-xl border border-emerald-200 space-y-3 text-xs">
                  {grievanceSavedToast ? (
                    <div className="p-4 text-center text-emerald-700 space-y-1">
                      <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                      <p className="font-bold">Grievance Resolved & Certificate Attached!</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-slate-700 block mb-0.5">Resolution Status:</label>
                          <select
                            value={reportReplyStatus}
                            onChange={(e) => setReportReplyStatus(e.target.value as ReportStatus)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold"
                          >
                            <option value="Resolved">Resolved (निवारण झाले)</option>
                            <option value="In Progress">In Progress (काम सुरू)</option>
                            <option value="Assigned">Assigned to Field Squad</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-0.5">Quality Audit Agency:</label>
                          <select
                            value={auditAgency}
                            onChange={(e) => setAuditAgency(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold"
                          >
                            <option value="COEP Technological University">COEP Tech University</option>
                            <option value="MIDC Quality Control Cell">MIDC QA Lab</option>
                            <option value="PWD District Testing Lab">PWD Testing Lab</option>
                            <option value="VJTI Mumbai">VJTI Civil Lab</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Work Done Summary (कामाचा प्रत्यक्ष तपशील):</label>
                        <input
                          type="text"
                          value={workDoneText}
                          onChange={(e) => setWorkDoneText(e.target.value)}
                          placeholder="e.g. Laid 80mm interlocking paver blocks, cleared drain"
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-0.5">Official Nodal Remarks to Citizen:</label>
                        <input
                          type="text"
                          value={officerReplyRemark}
                          onChange={(e) => setOfficerReplyRemark(e.target.value)}
                          placeholder="Enter official remark..."
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-medium"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-[#047857] hover:bg-[#065f46] text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Broadcast Official Resolution & Quality Proof</span>
                      </button>
                    </>
                  )}
                </form>
              )}
            </div>
          </div>
        )}

        {/* PROCESS B: FOR MIDC INDUSTRY REP (उद्योग प्रतिनिधी) */}
        {isIndustry && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="gov-card rounded-2xl p-5 border border-slate-200 space-y-4 shadow-sm bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-orange-700" />
                  <span>Log Industrial Freight Bottleneck / Delay Incident</span>
                </span>
                <span className="text-[11px] font-bold text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  FMPCCI Industry Cell
                </span>
              </div>

              <form onSubmit={handleIndustryAlertSubmit} className="space-y-3 text-xs">
                {industryAlertSubmitted ? (
                  <div className="p-4 text-center text-emerald-700 space-y-1">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                    <p className="font-bold">Freight Alert Broadcasted to MIDC & Traffic Police!</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="font-bold text-slate-700 block mb-0.5">Industrial Zone / Plant Access Road:</label>
                      <select
                        value={industryPlantLocation}
                        onChange={(e) => setIndustryPlantLocation(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
                      >
                        <option value="MIDC Phase 2 Spine Road (Mercedes-Benz & Mahindra Gate)">Phase 2 Spine Road (Mercedes & Mahindra)</option>
                        <option value="MIDC Phase 1 Kharabwadi Feeder (Bajaj Corridor)">Phase 1 Kharabwadi (Bajaj Auto)</option>
                        <option value="Mahalunge-HPCL Petroleum Link">Mahalunge HPCL Petroleum Link</option>
                        <option value="Vasuli Freight Truck Terminal">Vasuli Automated Truck Terminal</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-0.5">Detailed Issue / Delay Impact:</label>
                      <textarea
                        rows={3}
                        value={industryAlertText}
                        onChange={(e) => setIndustryAlertText(e.target.value)}
                        placeholder="e.g. Heavy container trailer jam due to incomplete culvert trench; 45 mins supply chain delay..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit High-Priority Industrial Escalation</span>
                    </button>
                  </>
                )}
              </form>
            </div>

            <div className="gov-card rounded-2xl p-5 border border-slate-200 space-y-3.5 shadow-sm bg-orange-50/20">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Factory className="w-4 h-4 text-orange-700" />
                <span>Automobile Corridor Performance Summary</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Mercedes & Mahindra Ring (Phase 2):</span>
                  <span className="font-bold text-emerald-800">48 km/h • Smooth</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Bajaj Talegaon Toll Feeder (Phase 1):</span>
                  <span className="font-bold text-rose-700">18 km/h • +28 min Delay</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Mahalunge Chemical Corridor:</span>
                  <span className="font-bold text-amber-700">35 km/h • Moderate</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROCESS C: FOR COLLECTOR / ADMIN (जिल्हाधिकारी प्रशासन) */}
        {isMasterAdmin && (
          <div className="gov-card rounded-2xl p-5 border border-amber-300 bg-amber-50/30 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-700" />
                <span>Issue Magisterial Taskforce Directive / Government Resolution (GR)</span>
              </span>
              <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                Collector Action Desk
              </span>
            </div>

            <form onSubmit={handleCollectorDirectiveSubmit} className="space-y-3 text-xs">
              {collectorDirectivePublished ? (
                <div className="p-4 text-center text-emerald-700 space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                  <p className="font-bold text-sm">Collector Directive Published to All Department Desks & Public Circulars!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-0.5">Directive Subject:</label>
                      <input
                        type="text"
                        value={collectorDirectiveTitle}
                        onChange={(e) => setCollectorDirectiveTitle(e.target.value)}
                        placeholder="e.g. Fast-Track Land Direct Purchase for Kuruli Ring Road"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-0.5">Target Department / Agency:</label>
                      <select
                        value={collectorDirectiveDept}
                        onChange={(e) => setCollectorDirectiveDept(e.target.value as Authority)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold"
                      >
                        <option value="PMRDA">PMRDA (Land Acquisition Cell)</option>
                        <option value="PWD">PWD (State Highways)</option>
                        <option value="MIDC">MIDC (Industrial Roads)</option>
                        <option value="NHAI">NHAI (Flyover & National Highways)</option>
                        <option value="GramPanchayat">Gram Panchayat (Rural Wings)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-0.5">Magisterial Directive Text:</label>
                      <textarea
                        rows={3}
                        value={collectorDirectiveText}
                        onChange={(e) => setCollectorDirectiveText(e.target.value)}
                        placeholder="Enter official executive orders and time-bound mandates..."
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span>Issue Official Collector Directive</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* PROCESS D: FOR CITIZEN (नागरिक) */}
        {isCitizen && (
          <div className="gov-card rounded-2xl p-5 border border-slate-200 bg-emerald-50/20 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-emerald-700" />
                <span>Citizen Civic Actions: Submit Geotagged Report or Audit Work</span>
              </span>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#047857] hover:bg-[#065f46] text-white font-bold text-xs rounded-lg shadow flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Log New Road Grievance</span>
              </button>
            </div>
            <p className="text-xs text-slate-600">
              As a citizen auditor, you can report potholes, waterlogging, or signal failures. Every report is geotagged and automatically assigned to the responsible nodal engineer with public SLA tracking.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 2: INDIVIDUAL ASSIGNED REPORTS & CAPITAL PROJECTS DOSSIER */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-800" />
            <span>
              {language === "mr"
                ? `${currentRoleMeta.officerName} यांचे कार्यक्षेत्रातील प्रकल्प व तक्रारी`
                : `Assigned Projects & Grievances Dossier for ${currentRoleMeta.officerName}`}
            </span>
          </h3>
          <span className="text-xs text-slate-500 font-semibold">{assignedProjects.length} Active Capital Projects</span>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignedProjects.map((p) => (
            <div
              key={p.id}
              className="gov-card rounded-2xl p-5 border border-slate-200 hover:border-blue-400 transition-all shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                    {p.id}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    {p.authority}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 leading-snug">
                  {language === "mr" ? p.nameMr : p.name}
                </h4>

                <p className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                  <span className="truncate">{p.locationName}</span>
                </p>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Stage: {p.currentWorkStage || "Paving"}</span>
                    <span className="text-emerald-700 font-bold">{p.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${p.progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Sanctioned Budget:</span>
                    <span className="font-bold text-slate-900">₹{p.approvedBudgetCr || p.budgetCr} Cr</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Target ETA:</span>
                    <span className="font-bold text-slate-800">{p.expectedCompletionDate}</span>
                  </div>
                </div>

                {p.pendingReason && (
                  <div className="bg-rose-50 border border-rose-200 p-2 rounded-lg text-[10px] text-rose-800 font-medium">
                    <b>Bottleneck:</b> {p.pendingReason}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                {!isCitizen && !isIndustry ? (
                  <button
                    onClick={() => handleStartEdit(p)}
                    className="px-3 py-1 bg-[#0f2b48] hover:bg-[#1a3d60] text-white font-bold rounded text-[11px] flex items-center gap-1 shadow-xs"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Update Progress</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setFocusOnMapLocation(p.coordinates);
                      setActiveTab("projects");
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <FileText className="w-3 h-3 text-blue-700" />
                    <span>View Public Dossier</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setFocusOnMapLocation(p.coordinates);
                    setActiveTab("master-gis");
                  }}
                  className="text-blue-700 hover:underline font-bold text-[11px]"
                >
                  View on GIS Map
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
