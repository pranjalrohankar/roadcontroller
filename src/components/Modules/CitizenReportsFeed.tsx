"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { CitizenReport, ReportStatus } from "@/types";
import {
  AlertTriangle,
  ThumbsUp,
  Search,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  PlusCircle,
  Award,
  MessageSquare,
  Star,
  HardHat,
  Send,
  UserCheck,
  Check,
} from "lucide-react";

export const CitizenReportsFeed: React.FC = () => {
  const {
    citizenReports,
    upvoteReport,
    setIsReportModalOpen,
    t,
    language,
    setFocusOnMapLocation,
    setActiveTab,
  } = useApp();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Local state for adding citizen comments/reviews dynamically
  const [activeCommentReportId, setActiveCommentReportId] = useState<string | null>(null);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentRating, setNewCommentRating] = useState<number>(5);
  const [localFeedbackStore, setLocalFeedbackStore] = useState<
    Record<
      string,
      Array<{
        citizenName: string;
        comment: string;
        commentMr?: string;
        rating: number;
        date: string;
        verifiedResident: boolean;
      }>
    >
  >({});

  const handleAddComment = (reportId: string) => {
    if (!newCommentText.trim() || !newCommentName.trim()) return;

    const newFeedbackItem = {
      citizenName: newCommentName.trim(),
      comment: newCommentText.trim(),
      rating: newCommentRating,
      date: "Just now",
      verifiedResident: true,
    };

    setLocalFeedbackStore((prev) => ({
      ...prev,
      [reportId]: [newFeedbackItem, ...(prev[reportId] || [])],
    }));

    setNewCommentName("");
    setNewCommentText("");
    setActiveCommentReportId(null);
  };

  const filteredReports = citizenReports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.titleMr.toLowerCase().includes(search.toLowerCase()) ||
      r.landmark.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      (r.workDoneSummary && r.workDoneSummary.toLowerCase().includes(search.toLowerCase())) ||
      (r.assignedAuthority && r.assignedAuthority.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = selectedCategory === "ALL" || r.category === selectedCategory;
    const matchesStatus = selectedStatus === "ALL" || r.status === selectedStatus;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const getStatusBadge = (st: ReportStatus) => {
    switch (st) {
      case "Resolved":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "In Progress":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Assigned":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Community Verified":
        return "bg-purple-100 text-purple-800 border-purple-300";
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
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <span>
              {language === "mr"
                ? "स्थानिक नागरिक तक्रारी, कामाचा अहवाल व गुणवत्ता तपासणी"
                : "Local Citizen Grievances, Work Done & Quality Audits"}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {language === "mr"
              ? "प्रत्यक्ष कामाची माहिती, तृतीय-पक्ष तांत्रिक तपासणी प्रमाणपत्रे आणि नागरिकांच्या अस्सल प्रतिक्रिया"
              : "Track genuine field interventions, third-party quality lab certifications, and authentic resident reviews"}
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#047857] hover:bg-[#065f46] text-white font-bold text-xs shadow flex items-center gap-2 self-start md:self-auto transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.citizen.reportNewBtn}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="bg-white px-3 py-2 rounded-lg flex items-center gap-2 border border-slate-300 text-xs w-full sm:w-72 shadow-xs">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={language === "mr" ? "तक्रार, ठिकाण किंवा काम शोधा..." : "Search issue, landmark, work..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-slate-900 focus:outline-none w-full placeholder-slate-400 font-medium"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none font-medium shadow-xs"
        >
          <option value="ALL">{language === "mr" ? "सर्व प्रवर्ग (All Categories)" : "All Categories"}</option>
          <option value="Potholes">Potholes (खड्डे)</option>
          <option value="Traffic">Traffic (वाहतूक कोंडी)</option>
          <option value="Waterlogging">Waterlogging (पाणी साचणे)</option>
          <option value="Street Light Failure">Street Lights (पथदिवे)</option>
          <option value="Illegal Parking">Illegal Parking (अनधिकृत पार्किंग)</option>
          <option value="Signal Issue">Signal Issue (सिग्नल बिघाड)</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-white px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none font-medium shadow-xs"
        >
          <option value="ALL">{language === "mr" ? "सर्व स्थिती (All Status)" : "All Status"}</option>
          <option value="Reported">Reported (नोंदवलेली)</option>
          <option value="Community Verified">Community Verified (नागरिक पडताळणी)</option>
          <option value="Assigned">Assigned to Authority (अधिकारी वर्ग)</option>
          <option value="In Progress">In Progress (काम सुरू)</option>
          <option value="Resolved">Resolved (निवारण व प्रमाणित)</option>
        </select>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map((report) => {
          const dynamicComments = [
            ...(localFeedbackStore[report.id] || []),
            ...(report.communityFeedback || []),
          ];

          return (
            <div
              key={report.id}
              className="gov-card rounded-2xl p-5 border border-slate-200 hover:border-blue-400 transition-all shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* Header */}
                <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                      {report.id}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                      {report.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                      {report.assignedAuthority}
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(report.status)}`}>
                    {report.status}
                  </span>
                </div>

                {/* Title & Landmark */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {language === "mr" ? report.titleMr : report.title}
                  </h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                    <span>{language === "mr" ? report.landmarkMr : report.landmark}</span>
                  </p>
                </div>

                {/* Original Grievance Description */}
                <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  <span className="font-bold text-slate-900 block text-[11px] mb-0.5">
                    {language === "mr" ? "तक्रार वर्णन:" : "Issue Description:"}
                  </span>
                  {language === "mr" ? report.descriptionMr : report.description}
                </div>

                {/* Photo Previews (Before vs Resolved) */}
                {report.photoUrl && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="rounded-xl overflow-hidden border border-slate-200 relative">
                      <img
                        src={report.photoUrl}
                        alt="Issue Reported"
                        className="w-full h-32 object-cover"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        BEFORE / ISSUE
                      </span>
                    </div>
                    {report.resolvedPhotoUrl ? (
                      <div className="rounded-xl overflow-hidden border border-emerald-300 relative">
                        <img
                          src={report.resolvedPhotoUrl}
                          alt="Work Done Proof"
                          className="w-full h-32 object-cover"
                        />
                        <span className="absolute bottom-1.5 right-1.5 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          WORK DONE PROOF ✓
                        </span>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-[11px] text-slate-500 font-medium h-32">
                        {report.status === "In Progress" ? "Work In Progress On-Site" : "Awaiting Work Completion"}
                      </div>
                    )}
                  </div>
                )}

                {/* SECTION 1: WORK DONE SUMMARY (प्रत्यक्ष कामाचा अहवाल) */}
                {report.workDoneSummary && (
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <HardHat className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{language === "mr" ? "झालेल्या कामाचा प्रत्यक्ष अहवाल:" : "Work Done on Ground:"}</span>
                    </div>
                    <p className="text-emerald-950 text-[11px] font-medium leading-relaxed">
                      {language === "mr" ? report.workDoneSummaryMr || report.workDoneSummary : report.workDoneSummary}
                    </p>
                  </div>
                )}

                {/* SECTION 2: QUALITY AUDIT & INSPECTOR CHECKS (गुणवत्ता तपासणी) */}
                {report.qualityAuditDetails && (
                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-900 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-blue-700" />
                        <span>{language === "mr" ? "गुणवत्ता तपासणी व प्रमाणपत्र:" : "Quality Check & Audit:"}</span>
                      </span>
                      <span className="px-2 py-0.5 bg-blue-700 text-white font-bold text-[10px] rounded">
                        {report.qualityAuditDetails.qualityGrade}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-800 space-y-0.5">
                      <div>
                        <span className="font-semibold text-blue-950">Agency: </span>
                        <span>{report.qualityAuditDetails.auditAgency}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-blue-950">Test: </span>
                        <span>
                          {language === "mr"
                            ? report.qualityAuditDetails.testPerformedMr || report.qualityAuditDetails.testPerformed
                            : report.qualityAuditDetails.testPerformed}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1 border-t border-blue-200">
                        <span>Cert: {report.qualityAuditDetails.certificateNo}</span>
                        <span>Date: {report.qualityAuditDetails.auditDate}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 3: GENUINE LOCAL COMMUNITY FEEDBACK & REVIEWS */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-700" />
                      <span>{language === "mr" ? "स्थानिक नागरिकांच्या प्रतिक्रिया:" : "Local Citizen Reviews:"}</span>
                    </span>
                    <button
                      onClick={() => setActiveCommentReportId(activeCommentReportId === report.id ? null : report.id)}
                      className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 hover:underline"
                    >
                      {activeCommentReportId === report.id ? "Cancel" : "+ Add Feedback"}
                    </button>
                  </div>

                  {/* Add Feedback Input Box */}
                  {activeCommentReportId === report.id && (
                    <div className="bg-white p-2.5 rounded-lg border border-indigo-200 space-y-2 mt-2 shadow-xs">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          placeholder={language === "mr" ? "आपले नाव / हुद्दा..." : "Your Name / Designation..."}
                          value={newCommentName}
                          onChange={(e) => setNewCommentName(e.target.value)}
                          className="bg-slate-50 border border-slate-200 px-2 py-1 rounded text-xs text-slate-800 w-full focus:outline-none"
                        />
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewCommentRating(star)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${
                                  star <= newCommentRating ? "text-amber-400 fill-amber-400" : "text-slate-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        rows={2}
                        placeholder={
                          language === "mr"
                            ? "कामाच्या दर्जाबद्दल आपले खरे मत नोंदवा..."
                            : "Share genuine feedback about work done on ground..."
                        }
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-xs text-slate-800 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(report.id)}
                        className="px-3 py-1 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded flex items-center gap-1 shadow-xs ml-auto"
                      >
                        <Send className="w-3 h-3" />
                        <span>Post Review</span>
                      </button>
                    </div>
                  )}

                  {/* Comments List */}
                  {dynamicComments.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {dynamicComments.map((fb, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 flex items-center gap-1">
                              <UserCheck className="w-3 h-3 text-emerald-600" />
                              {fb.citizenName}
                            </span>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: fb.rating }).map((_, rIdx) => (
                                <Star key={rIdx} className="w-3 h-3 text-amber-400 fill-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-700 font-medium leading-relaxed">
                            {language === "mr" ? fb.commentMr || fb.comment : fb.comment}
                          </p>
                          <span className="text-[9px] text-slate-400 block">{fb.date} • Verified Ground Review</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">
                      No citizen reviews posted yet. Be the first local resident to review this work.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => upvoteReport(report.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border font-bold transition-all active:scale-95 ${
                    report.userHasUpvoted
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs"
                      : "bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${report.userHasUpvoted ? "fill-emerald-700 text-emerald-700" : ""}`} />
                  <span>
                    {report.upvotes} {report.userHasUpvoted ? t.citizen.upvotedBtn : t.citizen.upvoteBtn}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setFocusOnMapLocation(report.coordinates);
                    setActiveTab("master-gis");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-700" />
                  <span>{t.actions.viewOnMap}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
