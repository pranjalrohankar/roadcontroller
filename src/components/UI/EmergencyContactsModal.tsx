"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { X, Phone } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyContactsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { language } = useApp();

  if (!isOpen) return null;

  const contacts = [
    {
      title: "Chakan Traffic Police Division",
      titleMr: "चाकण वाहतूक पोलीस विभाग",
      number: "02135-249100 / 112",
      role: "Accident & Chokepoint Clearance Desk",
      roleMr: "अपघात व वाहतूक कोंडी निवारण कक्ष",
      icon: "🚔",
    },
    {
      title: "MIDC Chakan Fire & Disaster Station",
      titleMr: "एमआयडीसी चाकण अग्निशामक व आपत्ती केंद्र",
      number: "02135-278101 / 101",
      role: "Industrial & Chemical Hazmat Emergency",
      roleMr: "औद्योगिक व रासायनिक आपत्कालीन विभाग",
      icon: "🚒",
    },
    {
      title: "PWD Chakan Road Repair Emergency Line",
      titleMr: "सार्वजनिक बांधकाम रस्ता दुरुस्ती हेल्पलाईन",
      number: "+91 98220 44123",
      role: "Immediate Pothole & Caving Escalation",
      roleMr: "तातडीची खड्डे व रस्ता खचणे तक्रार",
      icon: "🏗️",
    },
    {
      title: "MSEDCL Chakan Substation (Power Outages)",
      titleMr: "महावितरण चाकण सबस्टेशन (वीज पुरवठा)",
      number: "1912 / 1800-233-3435",
      role: "High-Tension Wire & Street Light Desk",
      roleMr: "हाय-टेन्शन वाहिनी व पथदिवे नियंत्रण",
      icon: "⚡",
    },
    {
      title: "Khed / Chakan Rural Hospital Emergency",
      titleMr: "खेड / चाकण ग्रामीण रुग्णालय इमर्जन्सी",
      number: "02135-222033 / 108",
      role: "Trauma Care & 24x7 Ambulance",
      roleMr: "ट्रॉमा केअर व २४ तास रुग्णवाहिका",
      icon: "🏥",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[#0f2b48] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold">
              🚨
            </div>
            <h3 className="font-bold text-base">
              {language === "mr" ? "चाकण आपत्कालीन व महत्त्वाचे संपर्क" : "Chakan Emergency & Helpline Directory"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto text-xs">
          {contacts.map((c, idx) => (
            <div
              key={idx}
              className="gov-card p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
            >
              <div>
                <span className="text-lg mr-2">{c.icon}</span>
                <span className="font-bold text-slate-900 text-sm">
                  {language === "mr" ? c.titleMr : c.title}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                  {language === "mr" ? c.roleMr : c.role}
                </p>
              </div>

              <a
                href={`tel:${c.number.split(" ")[0]}`}
                className="px-3.5 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center gap-1.5 shadow flex-shrink-0 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{c.number}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
