"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { initialDailyFieldUpdates, initialOfficialNewsReleases } from "@/data/updatesData";
import { DailyFieldUpdate, OfficialNewsRelease, Authority } from "@/types";
import {
  Newspaper,
  HardHat,
  FileText,
  Calendar,
  Clock,
  MapPin,
  Search,
  Building2,
  CheckCircle2,
  Truck,
  Users,
  AlertCircle,
  ExternalLink,
  Download,
  ShieldAlert,
  FileCheck,
} from "lucide-react";

export const DailyUpdatesView: React.FC = () => {
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState<"FIELD_LOGS" | "OFFICIAL_RELEASES">("FIELD_LOGS");
  const [search, setSearch] = useState("");
  const [selectedAuthority, setSelectedAuthority] = useState<string>("ALL");

  const [fieldUpdates] = useState<DailyFieldUpdate[]>(initialDailyFieldUpdates);
  const [officialReleases] = useState<OfficialNewsRelease[]>(initialOfficialNewsReleases);

  const filteredFieldUpdates = fieldUpdates.filter((u) => {
    const matchesSearch =
      u.title.toLowerCase().includes(search.toLowerCase()) ||
      u.titleMr.toLowerCase().includes(search.toLowerCase()) ||
      u.location.toLowerCase().includes(search.toLowerCase()) ||
      u.workCompletedToday.toLowerCase().includes(search.toLowerCase()) ||
      u.engineerInCharge.toLowerCase().includes(search.toLowerCase());

    const matchesAuth = selectedAuthority === "ALL" || u.authority === selectedAuthority;
    return matchesSearch && matchesAuth;
  });

  const filteredReleases = officialReleases.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.titleMr.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase()) ||
      r.referenceOrderNo.toLowerCase().includes(search.toLowerCase()) ||
      r.summary.toLowerCase().includes(search.toLowerCase()) ||
      r.signatory.toLowerCase().includes(search.toLowerCase());

    const matchesAuth = selectedAuthority === "ALL" || r.department === selectedAuthority;
    return matchesSearch && matchesAuth;
  });

  const getAuthorityBadge = (auth: Authority | string) => {
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
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-[#0f2b48]" />
            <span>
              {language === "mr"
                ? "दैनिक प्रत्यक्ष कामाचे अपडेट्स व शासकीय प्रसिद्धीपत्रके"
                : "Daily Field Updates & Official Government Press Releases"}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {language === "mr"
              ? "प्रत्येक रस्त्यावरील रोजचे काम, तैनात यंत्रसामग्री आणि जिल्हा प्रशासन व प्राधिकरणांचे अधिकृत आदेश"
              : "Live ground engineering logs from supervising engineers and verified Government Resolutions (GRs)"}
          </p>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab("FIELD_LOGS")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "FIELD_LOGS"
                ? "bg-[#0f2b48] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white"
            }`}
          >
            <HardHat className="w-4 h-4" />
            <span>{language === "mr" ? "दैनिक कामाचे लॉग" : "Daily Field Logs"}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-700/50 text-slate-200">
              {fieldUpdates.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("OFFICIAL_RELEASES")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "OFFICIAL_RELEASES"
                ? "bg-[#0f2b48] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{language === "mr" ? "शासकीय आदेश व GR" : "Official Circulars & GRs"}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-700/50 text-slate-200">
              {officialReleases.length}
            </span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="bg-white px-3 py-2 rounded-lg flex items-center gap-2 border border-slate-300 text-xs w-full sm:w-80 shadow-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={
                activeTab === "FIELD_LOGS"
                  ? language === "mr"
                    ? "ठिकाण, काम, इंजिनिअर शोधा..."
                    : "Search location, equipment, engineer..."
                  : language === "mr"
                  ? "आदेश क्र, विषय, अधिकारी शोधा..."
                  : "Search order number, signatory, topic..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-slate-900 focus:outline-none w-full placeholder-slate-400 font-medium"
            />
          </div>

          <select
            value={selectedAuthority}
            onChange={(e) => setSelectedAuthority(e.target.value)}
            className="bg-white px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none font-medium shadow-xs"
          >
            <option value="ALL">{language === "mr" ? "सर्व प्राधिकरणे (All Authorities)" : "All Authorities"}</option>
            <option value="PWD">PWD (सार्वजनिक बांधकाम)</option>
            <option value="PMRDA">PMRDA (पीएमआरडीए)</option>
            <option value="MIDC">MIDC (एमआयडीसी)</option>
            <option value="NHAI">NHAI (राष्ट्रीय महामार्ग)</option>
            <option value="GramPanchayat">Gram Panchayat (ग्रामपंचायत)</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Showing {activeTab === "FIELD_LOGS" ? filteredFieldUpdates.length : filteredReleases.length} Verified Entries
        </div>
      </div>

      {/* TAB 1: DAILY FIELD LOGS */}
      {activeTab === "FIELD_LOGS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFieldUpdates.map((update) => (
            <div
              key={update.id}
              className="gov-card rounded-2xl p-5 border border-slate-200 hover:border-blue-400 transition-all shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* Top ID Bar */}
                <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                      {update.id}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getAuthorityBadge(update.authority)}`}>
                      {update.authority}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {update.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{update.date}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{update.time}</span>
                  </div>
                </div>

                {/* Title & Location */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {language === "mr" ? update.titleMr : update.title}
                  </h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                    <span>{language === "mr" ? update.locationMr : update.location}</span>
                  </p>
                </div>

                {/* On-Site Photo */}
                {update.photoUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 relative max-h-48">
                    <img
                      src={update.photoUrl}
                      alt={update.title}
                      className="w-full h-40 object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-black/75 text-white text-[10px] font-bold px-2.5 py-1 rounded backdrop-blur-xs flex items-center gap-1">
                      <HardHat className="w-3 h-3 text-amber-400" />
                      GROUND WORK VERIFICATION
                    </span>
                  </div>
                )}

                {/* Work Completed Today */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs space-y-1">
                  <span className="font-bold text-emerald-950 block text-[11px]">
                    {language === "mr" ? "आज पूर्ण झालेले प्रत्यक्ष काम:" : "Work Completed Today:"}
                  </span>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {language === "mr" ? update.workCompletedTodayMr : update.workCompletedToday}
                  </p>
                </div>

                {/* Equipment & Labor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {update.equipmentDeployed && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-600 font-bold text-[10px] flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-blue-700" />
                        {language === "mr" ? "तैनात अवजड यंत्रसामग्री:" : "Equipment Deployed:"}
                      </span>
                      <ul className="text-[11px] text-slate-800 space-y-0.5 list-disc list-inside">
                        {(language === "mr" && update.equipmentDeployedMr ? update.equipmentDeployedMr : update.equipmentDeployed).map((eq, i) => (
                          <li key={i} className="truncate">{eq}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-slate-600 font-bold text-[10px] flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-emerald-700" />
                        {language === "mr" ? "प्रत्यक्ष मजूर संख्या:" : "Site Labor Force:"}
                      </span>
                      <span className="font-bold text-slate-900 text-sm block mt-0.5">
                        {update.laborCount} Personnel On Site
                      </span>
                    </div>

                    <div className="border-t border-slate-200 pt-1 text-[10px] text-slate-600">
                      <span className="font-bold text-slate-800">In-Charge: </span>
                      <span>{update.engineerInCharge}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300">
                  Status: {update.status}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Site Supervising Engineer Log
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: OFFICIAL GOVERNMENT RELEASES & CIRCULARS */}
      {activeTab === "OFFICIAL_RELEASES" && (
        <div className="space-y-4">
          {filteredReleases.map((rel) => (
            <div
              key={rel.id}
              className="gov-card rounded-2xl p-6 border border-slate-200 hover:border-blue-400 transition-all shadow-sm space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                    {rel.id}
                  </span>
                  <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${getAuthorityBadge(rel.department)}`}>
                    {language === "mr" ? rel.departmentMr || rel.department : rel.department}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    {rel.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Published: {rel.publishDate}</span>
                </div>
              </div>

              {/* Title & Ref Order No */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {language === "mr" ? rel.titleMr : rel.title}
                </h3>
                <div className="text-xs text-slate-500 font-mono mt-1 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-blue-700" />
                  <span>Official Ref Order: {rel.referenceOrderNo}</span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed space-y-1">
                <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                  {language === "mr" ? "आदेशाचा सारांश (Executive Summary):" : "Executive Summary:"}
                </span>
                <p className="font-medium">
                  {language === "mr" ? rel.summaryMr : rel.summary}
                </p>
              </div>

              {/* Full Text / Directive */}
              <div className="text-xs text-slate-700 bg-white p-4 rounded-xl border border-slate-200 leading-relaxed">
                <span className="font-bold text-slate-900 block text-[11px] mb-1">
                  {language === "mr" ? "अधिकृत दस्तऐवज मजकूर:" : "Verified Directive Content:"}
                </span>
                <p>
                  {language === "mr" ? rel.fullTextMr || rel.fullText : rel.fullText}
                </p>
              </div>

              {/* Signatory Footer */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">Authorized Signatory</span>
                  <span className="font-bold text-slate-900 text-xs">{rel.signatory}</span>
                  <span className="text-slate-600 block text-[11px]">{rel.signatoryDesignation}</span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300">
                    Official Certified Record ✓
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
