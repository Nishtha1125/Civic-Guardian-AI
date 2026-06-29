/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Tag, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  ShieldAlert, 
  Wrench, 
  ArrowRight, 
  ChevronRight, 
  User, 
  FileText, 
  RefreshCw 
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '../types';

interface ComplaintTrackingProps {
  complaints: Complaint[];
  selectedComplaintId: string | null;
  setSelectedComplaintId: (id: string | null) => void;
  onRefresh: () => void;
  setCurrentView: (view: string) => void;
}

export default function ComplaintTracking({
  complaints,
  selectedComplaintId,
  setSelectedComplaintId,
  onRefresh,
  setCurrentView
}: ComplaintTrackingProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Trigger data reload
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Find currently selected complaint, or default to the most recent one if nothing is selected yet
  const activeComplaint = complaints.find(c => c.id === selectedComplaintId) || complaints[0];

  // Filter complaints list based on search bar
  const filteredComplaints = complaints.filter(c => {
    const query = searchQuery.toLowerCase();
    return (
      c.id.toLowerCase().includes(query) ||
      c.title.toLowerCase().includes(query) ||
      c.location.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query)
    );
  });

  // Timeline step definitions
  const steps: { status: ComplaintStatus; label: string; desc: string }[] = [
    { 
      status: 'Pending', 
      label: 'Submitted', 
      desc: 'Queued for AI check' 
    },
    { 
      status: 'Verified', 
      label: 'Verified', 
      desc: 'AI priority approved' 
    },
    { 
      status: 'Under Work', 
      label: 'In Progress', 
      desc: 'Dispatch team deployed' 
    },
    { 
      status: 'Resolved', 
      label: 'Resolved', 
      desc: 'Site patched & closed' 
    }
  ];

  // Helper to determine step states
  const getStepState = (currentStatus: ComplaintStatus, stepStatus: ComplaintStatus) => {
    const statusPriority: Record<ComplaintStatus, number> = {
      'Pending': 1,
      'Verified': 2,
      'Under Work': 3,
      'Resolved': 4
    };

    const activeIndex = statusPriority[currentStatus];
    const stepIndex = statusPriority[stepStatus];

    if (stepIndex < activeIndex) return 'completed';
    if (stepIndex === activeIndex) return 'active';
    return 'upcoming';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="complaint_tracking_root">
      
      {/* Search Header Area */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Live Ticket Tracking
          </h2>
          <p className="text-sm text-slate-500">
            Monitor real-time repair work, Gemini triage assessments, and field updates.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition active:scale-95 disabled:opacity-50"
            title="Refresh logs"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setCurrentView('report')}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 text-xs font-semibold text-white shadow-sm transition"
          >
            Report New Problem
          </button>
        </div>
      </div>

      {/* Main Grid: Left is search/list, Right is detailed visualizer card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMN 1: TICKET SELECTOR (4 COLS) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="relative mb-3">
              <Search className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search ticket code, title, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Active Ward Incidents ({filteredComplaints.length})
            </p>

            <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1" id="tracking_sidebar_list">
              {filteredComplaints.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No matching tickets found
                </div>
              ) : (
                filteredComplaints.map((c) => {
                  const isActive = activeComplaint && activeComplaint.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedComplaintId(c.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer flex flex-col ${
                        isActive 
                          ? 'border-emerald-500 bg-emerald-50/20 shadow-sm' 
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                      id={`sidebar_ticket_${c.id}`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-md">
                          {c.id}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          c.status === 'Resolved' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : c.status === 'Under Work'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mb-1">
                        {c.title}
                      </h4>
                      <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{c.location}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* COLUMN 2: VERDICT & ACTION VISUALIZER (8 COLS) */}
        <div className="lg:col-span-8">
          {!activeComplaint ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm text-center">
              <Clock className="h-12 w-12 text-slate-300 mb-3 animate-pulse" />
              <h3 className="font-display font-bold text-lg text-slate-700">No active reports registered</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Get started by filing a hyperlocal report with Gemini AI risk prediction.
              </p>
            </div>
          ) : (
            <div className="space-y-6" id="tracking_detail_card">
              
              {/* Core Info Top Bar */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className="font-mono text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        TICKET: {activeComplaint.id}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400 flex items-center">
                        <Calendar className="mr-1 h-3.5 w-3.5 text-slate-400" />
                        {new Date(activeComplaint.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-900 leading-tight">
                      {activeComplaint.title}
                    </h3>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Current Work Status
                    </span>
                    <span className={`inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-extrabold ${
                      activeComplaint.status === 'Resolved' 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/50' 
                        : activeComplaint.status === 'Under Work'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200/50'
                          : 'bg-amber-100 text-amber-800 border border-amber-200/50'
                    }`}>
                      {activeComplaint.status}
                    </span>
                  </div>
                </div>

                {/* VISUAL PIPELINE TIMELINE */}
                <div className="mb-8" id="visual_progress_timeline">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                    MUNICIPAL WORKFLOW PROGRESSION
                  </p>
                  
                  <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-2">
                    {/* Horizontal Connector Line for Desktop */}
                    <div className="hidden md:block absolute top-[15px] left-10 right-10 h-0.5 bg-slate-100 z-0"></div>

                    {steps.map((st, i) => {
                      const state = getStepState(activeComplaint.status, st.status);
                      return (
                        <div key={st.status} className="relative z-10 flex md:flex-col items-center md:text-center flex-1 w-full md:w-auto">
                          {/* Dot Circle */}
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                            state === 'completed' 
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100' 
                              : state === 'active'
                                ? 'bg-white border-blue-600 text-blue-600 ring-4 ring-blue-50 font-extrabold'
                                : 'bg-white border-slate-200 text-slate-300'
                          }`}>
                            {state === 'completed' ? (
                              <CheckCircle className="h-4 w-4 text-white" />
                            ) : (
                              <span className="text-xs">{i + 1}</span>
                            )}
                          </div>

                          {/* Labels */}
                          <div className="ml-4 md:ml-0 md:mt-3 text-left md:text-center">
                            <h4 className={`text-xs font-bold ${
                              state === 'upcoming' ? 'text-slate-400' : 'text-slate-800'
                            }`}>
                              {st.label}
                            </h4>
                            <p className="text-[10px] text-slate-400 leading-none mt-0.5">
                              {st.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sub-card with citizen attachment description and optional image */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  {activeComplaint.imageUrl && (
                    <div className="md:col-span-4">
                      <img 
                        src={activeComplaint.imageUrl} 
                        alt="Citizen proof attachment" 
                        className="rounded-xl w-full h-32 md:h-full object-cover border border-slate-200 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div className={activeComplaint.imageUrl ? "md:col-span-8" : "md:col-span-12"}>
                    <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 mb-1.5">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>Reported by {activeComplaint.citizenName}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-3 rounded-xl border border-slate-100">
                      "{activeComplaint.description}"
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 border border-slate-100">
                        <Tag className="mr-1 h-3 w-3 text-slate-400" />
                        Category: {activeComplaint.category}
                      </span>
                      <span className="inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 border border-slate-100">
                        <MapPin className="mr-1 h-3 w-3 text-slate-400" />
                        {activeComplaint.location}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Gemini AI Predictive Analysis Sub-Card */}
              {activeComplaint.aiAnalysis && (
                <div className="rounded-3xl border border-emerald-100 bg-emerald-950 text-white p-6 shadow-md" id="tracking_ai_triage_box">
                  <div className="flex items-center space-x-2.5 mb-4">
                    <div className="h-9 w-9 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-white">Gemini AI Smart Triage Results</h4>
                      <p className="text-[10px] text-emerald-400">Automated structural predictive risk evaluation</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-emerald-900/30 border border-emerald-800/40 rounded-xl p-3">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400">Assessed Severity</span>
                      <p className="font-bold text-sm mt-0.5 text-white">{activeComplaint.aiAnalysis.severity}</p>
                    </div>
                    <div className="bg-emerald-900/30 border border-emerald-800/40 rounded-xl p-3">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400">Hazard Priority Rating</span>
                      <p className="font-bold text-sm mt-0.5 text-white font-mono">{activeComplaint.aiAnalysis.priorityScore}/10</p>
                    </div>
                    <div className="bg-emerald-900/30 border border-emerald-800/40 rounded-xl p-3">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400">Suggested Dept.</span>
                      <p className="font-bold text-xs mt-0.5 text-white truncate">{activeComplaint.aiAnalysis.suggestedDepartment}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 border-t border-emerald-800/60 pt-4">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 block">AI Recommended Reparation Dispatch:</span>
                      <p className="text-xs text-white font-medium mt-0.5">{activeComplaint.aiAnalysis.recommendedAction}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 block">AI Progressive Risk Assessment:</span>
                      <p className="text-xs text-emerald-100 italic mt-0.5 bg-emerald-900/15 p-2 rounded-lg border border-emerald-800/20">
                        "{activeComplaint.aiAnalysis.riskAssessment.explanation}"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TIMELINE PROGRESS UPDATES HISTORY LOG */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center">
                  <FileText className="mr-1.5 h-4 w-4 text-slate-400" />
                  MUNICIPALITY ACTION LOG & UPDATES HISTORY
                </h4>

                <div className="space-y-6 relative before:absolute before:top-2 before:bottom-2 before:left-3 before:w-[1px] before:bg-slate-100">
                  {activeComplaint.updates.slice().reverse().map((up) => (
                    <div key={up.id} className="relative pl-8" id={`update_log_item_${up.id}`}>
                      {/* Left Dot Indicator */}
                      <div className={`absolute left-1.5 top-1.5 h-3 w-3 rounded-full border-2 bg-white ${
                        up.status === 'Resolved' 
                          ? 'border-emerald-500' 
                          : up.status === 'Under Work'
                            ? 'border-blue-500'
                            : 'border-amber-500'
                      }`}></div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                            up.status === 'Resolved' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : up.status === 'Under Work'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-amber-50 text-amber-700'
                          }`}>
                            {up.status}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Updated by <span className="font-bold text-slate-600">{up.updatedBy}</span>
                          </span>
                        </div>

                        <span className="text-[10px] text-slate-400">
                          {new Date(up.timestamp).toLocaleString(undefined, { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/60">
                        {up.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
