"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { CitizenReportCategory, Authority } from "@/types";
import {
  X,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Send,
  Building2,
} from "lucide-react";
import confetti from "canvas-confetti";

export const CitizenReportingModal: React.FC = () => {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    addCitizenReport,
    t,
    language,
  } = useApp();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CitizenReportCategory>("Potholes");
  const [landmark, setLandmark] = useState("");
  const [description, setDescription] = useState("");
  const [assignedAuthority, setAssignedAuthority] = useState<Authority>("PWD");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [coordinates, setCoordinates] = useState<[number, number]>([18.7595, 73.8385]);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !landmark || !description) return;

    addCitizenReport({
      title,
      titleMr: title,
      category,
      categoryMr: categories.find((c) => c.key === category)?.labelMr || category,
      description,
      descriptionMr: description,
      landmark,
      landmarkMr: landmark,
      coordinates,
      photoUrl: photoUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80",
      reportedBy: "Citizen Volunteer",
      status: "Reported",
      assignedAuthority,
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
      setLandmark("");
      setDescription("");
      setPhotoUrl("");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#0f2b48] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {t.citizen.modalTitle}
              </h3>
              <p className="text-xs text-slate-300">
                {language === "mr" ? "संबंधित शासकीय अभियांत्रिकी विभागाकडे थेट नोंदणी" : "Direct dispatch to nodal engineering cell"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsReportModalOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-800">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              {language === "mr" ? "तक्रार यशस्वीरित्या नोंदवली गेली!" : "Grievance Successfully Registered!"}
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              {t.citizen.successMsg}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs text-slate-800">
            {/* Category Selector Chips */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">
                {t.citizen.categoryLabel} *
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

            {/* Title Input */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                {language === "mr" ? "समस्येचे शीर्षक / थोडक्यात नाव *" : "Brief Issue Title *"}
              </label>
              <input
                type="text"
                required
                placeholder={language === "mr" ? "उदा. आंबेठाण चौकात पेट्रोल पंपाजवळ मोठे खड्डे" : "e.g. Deep potholes near Ambethan Chowk"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 font-medium"
              />
            </div>

            {/* Landmark & Authority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  {t.citizen.landmarkLabel} *
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-2.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-700 mr-1.5 flex-shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="Chowk / Landmark / Village"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full bg-transparent py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  {language === "mr" ? "संबंधित विभाग (Authority) *" : "Target Authority *"}
                </label>
                <select
                  value={assignedAuthority}
                  onChange={(e) => setAssignedAuthority(e.target.value as Authority)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-700 font-medium"
                >
                  <option value="PWD">PWD (सार्वजनिक बांधकाम विभाग)</option>
                  <option value="MIDC">MIDC (एमआयडीसी रस्ते व पाणी)</option>
                  <option value="PMRDA">PMRDA (पुणे मेट्रो विकास)</option>
                  <option value="NHAI">NHAI (राष्ट्रीय महामार्ग ६०)</option>
                  <option value="GramPanchayat">Gram Panchayat (ग्रामपंचायत)</option>
                </select>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                {t.citizen.descLabel} *
              </label>
              <textarea
                required
                rows={3}
                placeholder={
                  language === "mr"
                    ? "समस्येचे सविस्तर वर्णन करा (कधीपासून त्रास आहे, वाहनांचे होणारे नुकसान इ.)..."
                    : "Provide detailed description of the problem, hazards, and duration..."
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 font-medium"
              />
            </div>

            {/* Photo Upload Simulator */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                {t.citizen.photoUploadLabel}
              </label>
              <div className="border border-slate-300 rounded-xl p-3 bg-slate-50">
                <input
                  type="text"
                  placeholder="Paste Image URL (Optional)"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 text-xs focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#047857] hover:bg-[#065f46] text-white font-bold text-sm flex items-center justify-center gap-2 shadow transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>{t.citizen.submitBtn}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
