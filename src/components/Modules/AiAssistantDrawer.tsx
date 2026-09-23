"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  Sparkles,
  Send,
  X,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  actionText?: string;
  actionType?: "project" | "map" | "tab";
  actionTarget?: any;
}

export const AiAssistantDrawer: React.FC = () => {
  const {
    isAiDrawerOpen,
    setIsAiDrawerOpen,
    projects,
    t,
    language,
    setSelectedProject,
    setIsProjectDrawerOpen,
    setActiveTab,
  } = useApp();

  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-init",
      sender: "ai",
      text:
        language === "mr"
          ? "नमस्कार! मी चाकण इन्फ्रा एआय (Chakan Infra AI) सहाय्यक आहे. चाकणमधील रस्ते, उड्डाणपूल, पाणीपुरवठा, एमआयडीसी कामे, टेंडर बजेट किंवा प्रलंबित प्रकल्पांबद्दल आपण कोणताही प्रश्न विचारू शकता."
          : "Hello! I am Chakan Infra AI Knowledge Assistant. You can ask me anything regarding Chakan roads, flyovers, MIDC works, contractor details, budget expenditure, or delayed projects.",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isAiDrawerOpen) return null;

  const sampleQuestions = [
    {
      q: language === "mr" ? "कुरुळी रस्त्याचे रुंदीकरण किती झाले आणि कधी पूर्ण होणार?" : "How much is Kuruli road widening completed and target date?",
      label: language === "mr" ? "🛣️ कुरुळी रस्ता प्रगती" : "🛣️ Kuruli Road Progress",
    },
    {
      q: language === "mr" ? "चाकण-तळेगाव रस्ता कोणाच्या अखत्यारीत आहे?" : "Which authority is responsible for Chakan-Talegaon road?",
      label: language === "mr" ? "🏛️ चाकण-तळेगाव विभाग" : "🏛️ Chakan-Talegaon Authority",
    },
    {
      q: language === "mr" ? "सध्या चाकणमधील सर्व Delayed Projects ची यादी दाखवा." : "Show list of all delayed projects in Chakan.",
      label: language === "mr" ? "⚠️ सर्व प्रलंबित कामे" : "⚠️ Delayed Projects List",
    },
    {
      q: language === "mr" ? "चाकण-शिक्रापूर उड्डाणपुलाचे बजेट आणि कंत्राटदार कोण आहे?" : "What is the budget and contractor for Chakan-Shikrapur Flyover?",
      label: language === "mr" ? "🌉 उड्डाणपूल बजेट व टेंडर" : "🌉 Flyover Tender & Budget",
    },
    {
      q: language === "mr" ? "आंबेठाण चौकातील खड्ड्यांची तक्रार कोणाकडे करायची?" : "How to report potholes at Ambethan Chowk?",
      label: language === "mr" ? "🕳️ आंबेठाण खड्डे तक्रार" : "🕳️ Ambethan Pothole Complaint",
    },
  ];

  const handleAsk = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: queryText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsTyping(true);

    setTimeout(() => {
      generateAiResponse(queryText);
      setIsTyping(false);
    }, 800);
  };

  const generateAiResponse = (query: string) => {
    const q = query.toLowerCase();
    let responseText = "";
    let actionText = "";
    let actionType: "project" | "map" | "tab" | undefined = undefined;
    let actionTarget: any = undefined;

    if (q.includes("kuruli") || q.includes("कुरुळी")) {
      const kuruliProj = projects.find((p) => p.id === "CHK-PMRDA-004");
      if (language === "mr") {
        responseText = `कुरुळी - नाणेकरवाडी रिंग कनेक्टर व ग्रेड सेपरेटर (CHK-PMRDA-004) चे काम सध्या ३८% पूर्ण झाले आहे. हा रस्ता PMRDA च्या अखत्यारीत असून ₹८८.० कोटी मंजूर निधी आहे. नाणेकरवाडी हद्दीतील ८०० मीटर जागेचा मोबदला न्यायालयात प्रलंबित असल्याने कामास विलंब झाला आहे. ३.२ कि.मी. वर काम वेगाने सुरू आहे.`;
      } else {
        responseText = `Kuruli - Nanekarwadi Ring Connector (CHK-PMRDA-004) is currently 38% completed under PMRDA with a sanctioned budget of ₹88.0 Cr. It is delayed due to an 800m land dispute in Nanekarwadi, while work on undisputed 3.2 km is actively proceeding.`;
      }
      actionText = language === "mr" ? "कुरुळी प्रकल्प तपशील पाहा" : "View Kuruli Project Dossier";
      actionType = "project";
      actionTarget = kuruliProj;
    } else if (q.includes("talegaon") || q.includes("तळेगाव")) {
      const talegaonProj = projects.find((p) => p.id === "CHK-ROAD-001");
      if (language === "mr") {
        responseText = `चाकण - तळेगाव रस्ता (SH-55) हा **सार्वजनिक बांधकाम विभाग (PWD)** च्या अखत्यारीत आहे. कार्यकारी अभियंता श्री. संजय देशमुख (संपर्क: 9822044123) नोडल अधिकारी आहेत. कंत्राटदार सुप्रीम इन्फ्रास्ट्रक्चर असून सध्या ५८% मुख्य काँक्रिटीकरण पूर्ण झाले आहे.`;
      } else {
        responseText = `Chakan - Talegaon Road (SH-55) falls under the **Public Works Department (PWD)**. Executive Engineer Er. Sanjay Deshmukh (Ph: 9822044123) is the nodal officer. Contractor is Supreme Infra and progress is 58% completed.`;
      }
      actionText = language === "mr" ? "चाकण-तळेगाव प्रकल्प उघडा" : "Open Chakan-Talegaon Details";
      actionType = "project";
      actionTarget = talegaonProj;
    } else if (q.includes("delayed") || q.includes("विलंब") || q.includes("प्रलंबित")) {
      const delayed = projects.filter((p) => p.status === "Delayed");
      if (language === "mr") {
        responseText = `सध्या चाकणमध्ये खालील प्रकल्प प्रलंबित / विलंबाच्या स्थितीत नोंदवले गेले आहेत:\n\n1. **${delayed[0]?.nameMr || "कुरुळी रिंग कनेक्टर"}** (कारण: ८०० मी. भूसंपादन निवाडा प्रलंबित)\n2. **MIDC गेट १ ते २ वासुली कॉरिडॉर** (कारण: ड्रेनेज व युटिलिटी शिफ्टिंग विलंब)\n\nजिल्हाधिकारी टास्कफोर्स बैठकीत या प्रकल्पांचा साप्ताहिक आढावा घेतला जात आहे.`;
      } else {
        responseText = `Currently identified delayed projects in Chakan:\n\n1. **${delayed[0]?.name || "Kuruli Ring Connector"}** (Reason: 800m land dispute)\n2. **MIDC Gate 1 to Gate 2 Corridor** (Reason: Utility shifting)\n\nCollector Taskforce conducts weekly expedited monitoring for these.`;
      }
      actionText = language === "mr" ? "प्रकल्प यादीत पाहा" : "View in Project Directory";
      actionType = "tab";
      actionTarget = "projects";
    } else if (q.includes("shikrapur") || q.includes("flyover") || q.includes("शिक्रापूर") || q.includes("उड्डाणपूल")) {
      const flyover = projects.find((p) => p.id === "CHK-FLY-002");
      if (language === "mr") {
        responseText = `चाकण - शिक्रापूर १२ कि.मी. बहुमजली उड्डाणपूल प्रकल्प (CHK-FLY-002) हा **NHAI (राष्ट्रीय महामार्ग प्राधिकरण)** अंतर्गत असून याचे एकूण बजेट ₹१,२५०.० कोटी आहे. तांत्रिक निविदा मूल्यमापन पूर्ण झाले असून एलअँडटी व दिलीप बिल्डकॉन संयुक्त उपक्रम शॉर्टलिस्ट झाले आहेत.`;
      } else {
        responseText = `Chakan - Shikrapur 12 km Elevated Flyover (CHK-FLY-002) is managed by **NHAI** with a sanctioned budget of ₹1,250.0 Cr. EPC contractor technical evaluation is in final stages with L&T - Dilip Buildcon JV shortlisted.`;
      }
      actionText = language === "mr" ? "उड्डाणपूल ब्ल्यूप्रिंट पाहा" : "View Flyover Dossier";
      actionType = "project";
      actionTarget = flyover;
    } else if (q.includes("ambethan") || q.includes("आंबेठाण") || q.includes("खड्डे") || q.includes("pothole")) {
      if (language === "mr") {
        responseText = `आंबेठाण चौक हा सार्वजनिक बांधकाम विभाग (PWD) आणि MIDC च्या संयुक्त जंक्शन हद्दीत येतो. आपण आपल्या प्लॅटफॉर्मवरील **'+ समस्या नोंदवा'** बटणाद्वारे थेट फोटो व GPS लोकेशनसह तक्रार दाखल करू शकता, जी तात्काळ PWD नोडल अभियंत्यांना पाठवली जाईल.`;
      } else {
        responseText = `Ambethan Chowk is under PWD and MIDC joint feeder jurisdiction. You can register your complaint directly using the **'+ Report Issue'** button with photo and GPS coordinates for immediate engineering dispatch.`;
      }
      actionText = language === "mr" ? "तक्रार फॉर्म उघडा" : "Open Grievance Form";
      actionType = "tab";
      actionTarget = "citizen-reports";
    } else {
      if (language === "mr") {
        responseText = `आपल्या प्रश्नाचे उत्तर चाकण GIS डेटाबेसमध्ये शोधले आहे. चाकण परिसरातील एकूण ₹२,१३९ कोटींचे विकासप्रकल्प PWD, MIDC, PMRDA, NHAI आणि ग्रामपंचायतींमार्फत सुरू आहेत. आपण नकाशावर थेट पाहू शकता किंवा विशिष्ट रस्त्याबद्दल विचारू शकता.`;
      } else {
        responseText = `Query processed across Chakan GIS infrastructure repository. There are currently ₹2,139 Cr worth of projects active across PWD, MIDC, PMRDA, NHAI and Gram Panchayats. Feel free to ask about any specific junction, road, or tender.`;
      }
      actionText = language === "mr" ? "मास्टर नकाशा पाहा" : "View Master GIS Map";
      actionType = "tab";
      actionTarget = "master-gis";
    }

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: "ai",
      text: responseText,
      actionText,
      actionType,
      actionTarget,
    };

    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleActionClick = (msg: ChatMessage) => {
    if (msg.actionType === "project" && msg.actionTarget) {
      setSelectedProject(msg.actionTarget);
      setIsProjectDrawerOpen(true);
      setIsAiDrawerOpen(false);
    } else if (msg.actionType === "tab" && msg.actionTarget) {
      setActiveTab(msg.actionTarget);
      setIsAiDrawerOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full max-w-lg bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-[#0f2b48] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow font-bold">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>{t.ai.title}</span>
              </h3>
              <p className="text-xs text-slate-300">
                {language === "mr" ? "अधिकृत चाकण GIS व DPR डेटा एआय सहाय्यक" : "Official Chakan GIS & DPR Knowledge Assistant"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiDrawerOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Question Chips */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
            {t.ai.suggestedQuestions}
          </p>
          <div className="flex items-center gap-1.5 min-w-max">
            {sampleQuestions.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(sq.q)}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-900 border border-slate-300 font-semibold transition-colors whitespace-nowrap shadow-xs"
              >
                {sq.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl leading-relaxed whitespace-pre-line ${
                  m.sender === "user"
                    ? "bg-[#0f2b48] text-white rounded-br-none shadow"
                    : "bg-slate-50 text-slate-800 rounded-bl-none border border-slate-200 shadow-xs font-medium"
                }`}
              >
                {m.text}

                {/* Deep Action Button */}
                {m.actionText && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200">
                    <button
                      onClick={() => handleActionClick(m)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#047857] hover:bg-[#065f46] text-white font-bold text-[11px] flex items-center gap-1 shadow transition-colors"
                    >
                      <span>{m.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-500 p-2 text-xs font-medium">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>Analyzing Chakan GIS, DPR, and Tender repositories...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(inputQuery);
            }}
            className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl p-1.5 focus-within:border-blue-700 shadow-xs"
          >
            <input
              type="text"
              placeholder={t.ai.chatPlaceholder}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="w-full bg-transparent px-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-2 rounded-lg bg-[#0f2b48] hover:bg-[#1a3d60] disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-500 text-center font-medium">
            {t.ai.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};
