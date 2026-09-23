"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { PublicDocument } from "@/types";
import {
  FileText,
  Search,
  Download,
  CheckCircle2,
} from "lucide-react";

export const DocumentCenter: React.FC = () => {
  const { documents, t, language } = useApp();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.titleMr.toLowerCase().includes(search.toLowerCase()) ||
      d.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.summary.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === "ALL" || d.category === typeFilter;
    const matchesDept = deptFilter === "ALL" || d.department === deptFilter;

    return matchesSearch && matchesType && matchesDept;
  });

  const getDocTypeBadge = (cat: string) => {
    switch (cat) {
      case "DPR":
        return "bg-cyan-100 text-cyan-900 border-cyan-300";
      case "Tender":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "RTI Reply":
        return "bg-purple-100 text-purple-900 border-purple-300";
      case "Government Resolution (GR)":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "Audit Report":
        return "bg-amber-100 text-amber-900 border-amber-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  const handleDownload = (doc: PublicDocument) => {
    setDownloadNotice(doc.referenceNumber);
    setTimeout(() => {
      setDownloadNotice(null);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-800" />
            <span>{t.docs.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.docs.subtitle}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white px-3 py-2 rounded-lg flex items-center gap-2 border border-slate-300 text-xs w-full sm:w-64 shadow-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={t.docs.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-slate-900 focus:outline-none w-full placeholder-slate-400 font-medium"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none font-medium shadow-xs"
          >
            <option value="ALL">{language === "mr" ? "सर्व दस्तऐवज प्रकार" : "All Document Types"}</option>
            <option value="DPR">DPR (सविस्तर प्रकल्प अहवाल)</option>
            <option value="Tender">Tender (निविदा वर्क ऑर्डर)</option>
            <option value="RTI Reply">RTI Reply (माहिती अधिकार उत्तर)</option>
            <option value="Government Resolution (GR)">GR (शासन निर्णय)</option>
            <option value="Meeting Minutes">Meeting Minutes (इतिवृत्त)</option>
            <option value="Audit Report">Audit Report (लेखापरीक्षण)</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-white px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none font-medium shadow-xs"
          >
            <option value="ALL">{t.authorities.allAuthorities}</option>
            <option value="PWD">PWD</option>
            <option value="MIDC">MIDC</option>
            <option value="PMRDA">PMRDA</option>
            <option value="NHAI">NHAI</option>
            <option value="GramPanchayat">Gram Panchayat</option>
          </select>
        </div>
      </div>

      {/* Download Alert Toast */}
      {downloadNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3.5 rounded-xl text-xs flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>
            {language === "mr"
              ? `अधिकृत दस्तऐवज (${downloadNotice}) डाउनलोड सुरू झाले आहे.`
              : `Official document copy (${downloadNotice}) downloaded successfully.`}
          </span>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="gov-card rounded-2xl p-5 border border-slate-200 hover:border-blue-400 transition-all shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-100 pb-2.5">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getDocTypeBadge(doc.category)}`}>
                  {doc.category}
                </span>
                <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {doc.department}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {language === "mr" ? doc.titleMr : doc.title}
              </h3>

              {/* Meta details */}
              <div className="text-[11px] text-slate-600 space-y-1">
                <p>
                  <b className="text-slate-800">{t.docs.docRef}:</b>{" "}
                  <span className="font-mono font-bold text-slate-900">{doc.referenceNumber}</span>
                </p>
                <p className="flex items-center justify-between font-medium">
                  <span>📅 Published: {doc.publishDate}</span>
                  <span>📦 {doc.fileSize}</span>
                </p>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                {language === "mr" ? doc.summaryMr : doc.summary}
              </p>
            </div>

            {/* Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              {doc.relatedProjectId && (
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  Linked: {doc.relatedProjectId}
                </span>
              )}

              <button
                onClick={() => handleDownload(doc)}
                className="ml-auto px-4 py-2 rounded-lg bg-[#0f2b48] hover:bg-[#1a3d60] text-white font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
