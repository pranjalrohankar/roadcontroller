"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  History,
  Play,
  Pause,
  Award,
} from "lucide-react";

export const TimeMachineSlider: React.FC = () => {
  const { timeMachineSnapshots, t, language } = useApp();
  const [selectedIdx, setSelectedIdx] = useState<number>(4);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setSelectedIdx((prev) => (prev + 1) % timeMachineSnapshots.length);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeMachineSnapshots.length]);

  const currentSnapshot = timeMachineSnapshots[selectedIdx];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200">
              CHAKAN INFRASTRUCTURE TIMELINE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-purple-800" />
            <span>{t.timeMachine.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {t.timeMachine.subtitle}
          </p>
        </div>

        {/* Play Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs self-start md:self-auto ${
            isPlaying
              ? "bg-rose-700 hover:bg-rose-800 text-white"
              : "bg-[#0f2b48] hover:bg-[#1a3d60] text-white"
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>{t.timeMachine.pauseTimeline}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>{t.timeMachine.playTimeline}</span>
            </>
          )}
        </button>
      </div>

      {/* Stepper Card */}
      <div className="gov-card rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Progress Bar */}
        <div className="relative pt-6 pb-2">
          <div className="absolute top-10 left-4 right-4 h-1.5 bg-slate-200 rounded-full">
            <div
              className="h-full bg-blue-700 rounded-full transition-all duration-500"
              style={{
                width: `${(selectedIdx / (timeMachineSnapshots.length - 1)) * 100}%`,
              }}
            ></div>
          </div>

          <div className="relative flex justify-between">
            {timeMachineSnapshots.map((snap, idx) => (
              <button
                key={snap.periodId}
                onClick={() => {
                  setIsPlaying(false);
                  setSelectedIdx(idx);
                }}
                className="flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow border-2 ${
                    selectedIdx === idx
                      ? "bg-[#0f2b48] text-white border-blue-600 scale-110 shadow-md"
                      : idx < selectedIdx
                      ? "bg-emerald-600 text-white border-emerald-500"
                      : "bg-white text-slate-600 border-slate-300 hover:border-slate-500"
                  }`}
                >
                  {snap.year.toString().slice(2)}
                </div>
                <span
                  className={`text-[11px] font-bold mt-3 max-w-[80px] text-center leading-tight transition-colors ${
                    selectedIdx === idx
                      ? "text-blue-900 font-extrabold"
                      : "text-slate-500 group-hover:text-slate-900"
                  }`}
                >
                  {snap.quarter} {snap.year}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Snapshot Dossier */}
        <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-mono text-slate-500 font-bold">
                {currentSnapshot.periodId}
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {language === "mr" ? currentSnapshot.labelMr : currentSnapshot.label}
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-900 bg-white px-3 py-1 rounded-full border border-slate-300 self-start shadow-xs">
              ₹{currentSnapshot.budgetSpentCr.toFixed(1)} Cr Cumulative Disbursal
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200 font-medium">
            {language === "mr" ? currentSnapshot.summaryMr : currentSnapshot.summary}
          </p>

          {/* Key Milestone */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs space-y-1">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-700" />
              {t.timeMachine.keyMilestoneAchieved}:
            </span>
            <p className="text-slate-800 font-semibold">
              {language === "mr"
                ? currentSnapshot.keyMilestoneAchievedMr
                : currentSnapshot.keyMilestoneAchieved}
            </p>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px] font-semibold">Active Capital Works:</span>
              <span className="font-bold text-slate-900 text-base">
                {currentSnapshot.activeProjectsCount}
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px] font-semibold">Completed Works:</span>
              <span className="font-bold text-emerald-800 text-base">
                {currentSnapshot.completedProjectsCount}
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px] font-semibold">{t.timeMachine.trafficIndex}:</span>
              <span className="font-bold text-amber-800 text-base">
                {currentSnapshot.trafficIndexScore}/100
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px] font-semibold">{t.timeMachine.roadQualityScore}:</span>
              <span className="font-bold text-blue-800 text-base">
                {currentSnapshot.roadQualityScore}/100
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
