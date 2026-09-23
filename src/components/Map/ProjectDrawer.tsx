"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  X,
  Building,
  User,
  Phone,
  Mail,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Camera,
  MapPin,
  Edit3,
} from "lucide-react";

export const ProjectDrawer: React.FC = () => {
  const {
    selectedProject,
    setSelectedProject,
    isProjectDrawerOpen,
    setIsProjectDrawerOpen,
    setIsOfficerUpdateModalOpen,
    role,
    t,
    language,
    setFocusOnMapLocation,
    setActiveTab,
  } = useApp();

  if (!isProjectDrawerOpen || !selectedProject) return null;

  const getAuthorityBadge = (auth: string) => {
    switch (auth) {
      case "PWD":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "PMRDA":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "MIDC":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "NHAI":
        return "bg-red-100 text-red-800 border-red-300";
      case "GramPanchayat":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Delayed":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "In Progress":
      case "50% Completed":
      case "75% Completed":
      case "25% Completed":
      case "Work Started":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Tender Released":
      case "Approved":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const canEdit =
    role === "Collector_Admin" ||
    (role === "Officer_PWD" && selectedProject.authority === "PWD") ||
    (role === "Officer_MIDC" && selectedProject.authority === "MIDC") ||
    (role === "Officer_NHAI" && selectedProject.authority === "NHAI") ||
    (role === "Officer_PMRDA" && selectedProject.authority === "PMRDA") ||
    (role === "Officer_GP" && selectedProject.authority === "GramPanchayat");

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full max-w-2xl bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl overflow-y-auto">
        {/* Drawer Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 p-5 flex items-start justify-between gap-3 shadow-xs">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                {selectedProject.id}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getAuthorityBadge(
                  selectedProject.authority
                )}`}
              >
                {t.authorities[selectedProject.authority]}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                  selectedProject.status
                )}`}
              >
                {selectedProject.status}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {language === "mr" ? selectedProject.nameMr : selectedProject.name}
            </h2>
            <p className="text-xs text-slate-600 flex items-center gap-1 mt-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
              <span>{language === "mr" ? selectedProject.locationNameMr : selectedProject.locationName}</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {canEdit && (
              <button
                onClick={() => setIsOfficerUpdateModalOpen(true)}
                className="p-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1 shadow transition-colors"
                title="Update Progress"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Update</span>
              </button>
            )}
            <button
              onClick={() => {
                setIsProjectDrawerOpen(false);
                setSelectedProject(null);
              }}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-5 sm:p-6 space-y-6 text-slate-800">
          {/* Progress & Budget Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="gov-card rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <span>{t.project.progress}</span>
                <span className="text-emerald-700 font-bold text-sm">
                  {selectedProject.progressPercent}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${selectedProject.progressPercent}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>Start: {selectedProject.startDate}</span>
                <span className="font-semibold text-slate-700">Target ETA: {selectedProject.expectedCompletionDate}</span>
              </p>
            </div>

            <div className="gov-card rounded-xl p-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <span>{t.project.budgetAllocated}</span>
                <span className="text-slate-900 font-bold text-sm">
                  ₹{selectedProject.budgetCr.toFixed(1)} {language === "mr" ? "कोटी" : "Cr"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{t.project.budgetSpent}</span>
                <span className="text-blue-700 font-bold">
                  ₹{selectedProject.spentCr.toFixed(1)} Cr (
                  {Math.round((selectedProject.spentCr / selectedProject.budgetCr) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (selectedProject.spentCr / selectedProject.budgetCr) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === "mr" ? "प्रकल्पाचे स्वरूप व उद्दिष्ट" : "Project Overview & Engineering Scope"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {language === "mr" ? selectedProject.descriptionMr : selectedProject.description}
            </p>
          </div>

          {/* Delay Alert */}
          {selectedProject.delayReason && (
            <div className="rounded-xl p-4 bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-rose-800">{t.project.delayNotice}</h4>
                <p className="text-slate-700 text-xs mt-0.5">
                  {language === "mr" ? selectedProject.delayReasonMr : selectedProject.delayReason}
                </p>
              </div>
            </div>
          )}

          {/* Tender & Contractor Details */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-700" />
              <span>{t.project.tenderDetails}</span>
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block font-medium">{t.project.contractor}:</span>
                <span className="font-bold text-slate-900">
                  {language === "mr" ? selectedProject.contractorMr : selectedProject.contractor}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Tender Ref ID:</span>
                <span className="font-mono text-slate-800 font-semibold">{selectedProject.tender.tenderId}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Work Order Number:</span>
                <span className="font-mono text-slate-800 font-semibold">{selectedProject.tender.workOrderNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">DPR Reference:</span>
                <span className="font-mono text-slate-800 font-semibold">{selectedProject.tender.dprNumber}</span>
              </div>
            </div>
          </div>

          {/* Nodal Officer Contact Card */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.project.officerInCharge}</span>
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {language === "mr" ? selectedProject.officer.nameMr : selectedProject.officer.name}
                  </h4>
                  <p className="text-xs text-emerald-700 font-semibold">
                    {language === "mr"
                      ? selectedProject.officer.designationMr
                      : selectedProject.officer.designation}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {language === "mr"
                      ? selectedProject.officer.officeLocationMr
                      : selectedProject.officer.officeLocation}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-bold">
                  {selectedProject.officer.name[0]}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 text-xs">
                <a
                  href={`tel:${selectedProject.officer.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition-colors font-semibold"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{selectedProject.officer.phone}</span>
                </a>
                <a
                  href={`mailto:${selectedProject.officer.email}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition-colors font-semibold"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-700" />
                  <span>{selectedProject.officer.email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Milestone Timeline */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.project.timeline}</span>
            </h3>
            <div className="space-y-2">
              {selectedProject.milestones.map((ms, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="mt-0.5">
                    {ms.status === "Completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : ms.status === "In Progress" ? (
                      <Clock className="w-4 h-4 text-amber-600" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-400"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {language === "mr" ? ms.titleMr : ms.title}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          ms.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : ms.status === "In Progress"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {ms.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Target: {ms.targetDate}{" "}
                      {ms.completedDate && (
                        <span className="text-emerald-700 font-semibold">
                          (Completed: {ms.completedDate})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Media & Drone Gallery */}
          {selectedProject.media && selectedProject.media.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-700" />
                <span>{t.project.siteGallery}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedProject.media.map((med) => (
                  <div
                    key={med.id}
                    className="rounded-xl overflow-hidden bg-slate-50 border border-slate-200"
                  >
                    <div className="h-36 overflow-hidden relative">
                      <img
                        src={med.url}
                        alt={med.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
                        {med.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="p-3 text-xs">
                      <p className="font-bold text-slate-900 truncate">
                        {language === "mr" ? med.titleMr : med.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {language === "mr" ? med.captionMr : med.caption}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">📅 {med.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 z-20 bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setFocusOnMapLocation(selectedProject.coordinates);
              setActiveTab("master-gis");
              setIsProjectDrawerOpen(false);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0f2b48] hover:bg-[#1a3d60] text-white text-xs font-semibold transition-colors"
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>{t.actions.viewOnMap}</span>
          </button>

          <button
            onClick={() => {
              setIsProjectDrawerOpen(false);
              setSelectedProject(null);
            }}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold"
          >
            {t.actions.close}
          </button>
        </div>
      </div>
    </div>
  );
};
