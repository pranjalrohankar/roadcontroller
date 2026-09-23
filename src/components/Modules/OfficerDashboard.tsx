"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Project, ProjectStatus, ReportStatus, Authority } from "@/types";
import {
  UserCog,
  CheckCircle2,
  Edit3,
  ShieldCheck,
  Save,
} from "lucide-react";
import confetti from "canvas-confetti";

export const OfficerDashboard: React.FC = () => {
  const {
    role,
    projects,
    citizenReports,
    updateProjectProgress,
    updateReportStatus,
    t,
    language,
  } = useApp();

  const [activeEditingProj, setActiveEditingProj] = useState<Project | null>(null);
  const [newProgress, setNewProgress] = useState<number>(0);
  const [newStatus, setNewStatus] = useState<ProjectStatus>("In Progress");
  const [officerRemarksEn, setOfficerRemarksEn] = useState("");
  const [officerRemarksMr, setOfficerRemarksMr] = useState("");
  const [updateSavedToast, setUpdateSavedToast] = useState(false);

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [reportReplyStatus, setReportReplyStatus] = useState<ReportStatus>("In Progress");
  const [reportReplyRemark, setReportReplyRemark] = useState("");

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

  const assignedProjects = projects.filter(
    (p) => isMasterAdmin || p.authority === currentAuthority
  );

  const assignedGrievances = citizenReports.filter(
    (r) => isMasterAdmin || r.assignedAuthority === currentAuthority
  );

  const handleStartEdit = (p: Project) => {
    setActiveEditingProj(p);
    setNewProgress(p.progressPercent);
    setNewStatus(p.status);
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
      `Er. Nodal Officer (${activeEditingProj.authority})`,
      "Executive Engineer",
      officerRemarksEn || `Milestone progress updated to ${newProgress}%.`,
      officerRemarksMr || `कामाची प्रगती ${newProgress}% पर्यंत अद्ययावत केली.`
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
    if (!selectedReportId || !reportReplyRemark) return;

    updateReportStatus(
      selectedReportId,
      reportReplyStatus,
      reportReplyRemark,
      reportReplyRemark
    );

    setSelectedReportId(null);
    setReportReplyRemark("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
              GOVERNMENT NODAL MANAGEMENT PORTAL
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCog className="w-6 h-6 text-blue-800" />
            <span>{t.officer.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {t.officer.subtitle}
          </p>
        </div>

        {/* Current Role Banner */}
        <div className="bg-white p-3 rounded-xl border border-slate-300 shadow-xs flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Active Profile:</span>
          <span className="font-bold text-slate-900">{t.roles[role]}</span>
        </div>
      </div>

      {/* Audit Banner */}
      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs text-slate-700 flex items-center gap-2 font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
        <span>{t.officer.auditTrailNotice}</span>
      </div>

      {/* Department Projects */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>🏗️</span>
          <span>{t.officer.activeProjectsToUpdate}</span>
          <span className="text-xs font-semibold text-slate-500">({assignedProjects.length} Projects)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignedProjects.map((proj) => (
            <div
              key={proj.id}
              className="gov-card rounded-2xl p-5 border border-slate-200 space-y-3.5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                  {proj.id}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-emerald-800 border border-slate-300">
                  {proj.status} ({proj.progressPercent}%)
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  {language === "mr" ? proj.nameMr : proj.name}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  <b>Contractor:</b> {proj.contractor}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${proj.progressPercent}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold">
                <span className="text-slate-600">Budget: ₹{proj.budgetCr} Cr</span>
                <button
                  onClick={() => handleStartEdit(proj)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0f2b48] hover:bg-[#1a3d60] text-white font-bold flex items-center gap-1.5 shadow transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t.officer.updateProgressBtn}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Project Modal */}
      {activeEditingProj && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white border border-slate-300 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 font-bold">{activeEditingProj.id}</span>
                <h3 className="font-bold text-base text-slate-900">
                  {language === "mr" ? activeEditingProj.nameMr : activeEditingProj.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveEditingProj(null)}
                className="text-slate-500 hover:text-slate-900 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {updateSavedToast ? (
              <div className="p-6 text-center text-emerald-700 space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <p className="font-bold text-base">Progress Published to Official GIS Ledger!</p>
              </div>
            ) : (
              <form onSubmit={handleSaveProjectUpdate} className="space-y-4 text-xs text-slate-800">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">
                      {t.officer.newProgressPercent}: <span className="text-emerald-700">{newProgress}%</span>
                    </label>
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

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {t.officer.newStatusLabel}
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ProjectStatus)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none font-medium"
                  >
                    <option value="Work Started">Work Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="25% Completed">25% Completed</option>
                    <option value="50% Completed">50% Completed</option>
                    <option value="75% Completed">75% Completed</option>
                    <option value="Completed">Completed</option>
                    <option value="Delayed">Delayed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {t.officer.engineeringRemarks} (English)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter official site inspection report / milestone update..."
                    value={officerRemarksEn}
                    onChange={(e) => setOfficerRemarksEn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {t.officer.engineeringRemarks} (मराठी)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="प्रत्यक्ष जागेवरील पाहणी अहवाल व कामाची सद्यस्थिती नोंदवा..."
                    value={officerRemarksMr}
                    onChange={(e) => setOfficerRemarksMr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveEditingProj(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#047857] hover:bg-[#065f46] text-white font-bold flex items-center gap-1.5 shadow"
                  >
                    <Save className="w-4 h-4" />
                    <span>{t.officer.saveUpdateBtn}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Citizen Grievance Redressal Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>⚠️</span>
          <span>{t.officer.respondGrievance}</span>
          <span className="text-xs font-semibold text-slate-500">({assignedGrievances.length} Active Tickets)</span>
        </h3>

        <div className="space-y-3">
          {assignedGrievances.map((rep) => (
            <div
              key={rep.id}
              className="gov-card rounded-2xl p-4.5 border border-slate-200 space-y-3 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700">{rep.id}</span>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {rep.category}
                    </span>
                    <span className="text-xs text-slate-600 font-medium">📍 {rep.landmark}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">
                    {language === "mr" ? rep.titleMr : rep.title}
                  </h4>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 self-start border border-slate-300">
                  Status: {rep.status}
                </span>
              </div>

              {selectedReportId === rep.id ? (
                <form onSubmit={handleSaveReportResolution} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800">Update Action & Work Order:</label>
                    <select
                      value={reportReplyStatus}
                      onChange={(e) => setReportReplyStatus(e.target.value as ReportStatus)}
                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-900 font-semibold"
                    >
                      <option value="In Progress">In Progress (काम सुरू)</option>
                      <option value="Resolved">Resolved (निवारण पूर्ण)</option>
                      <option value="Assigned">Assigned (अभियंत्याकडे सोपवले)</option>
                    </select>
                  </div>

                  <textarea
                    required
                    rows={2}
                    placeholder="Enter official action taken / work order reference issued..."
                    value={reportReplyRemark}
                    onChange={(e) => setReportReplyRemark(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none font-medium"
                  />

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedReportId(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#047857] text-white font-bold"
                    >
                      Publish Resolution
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-slate-600 truncate max-w-md font-medium">
                    {rep.officialRemarks || "Pending official departmental inspection."}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedReportId(rep.id);
                      setReportReplyStatus(rep.status);
                      setReportReplyRemark(rep.officialRemarks || "");
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0f2b48] hover:bg-[#1a3d60] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    Respond / Resolve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
